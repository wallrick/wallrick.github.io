---
layout: post
title: "Building a Small Inline Network Filter with AI"
date: 2026-10-04 00:00:00 -0000
categories: [networking, homelab, automation]
tags: [raspberry-pi, nftables, ansible, monitoring, ai]
---

I have been building a small inline network filter around a Raspberry Pi 4. The
project started as a practical networking exercise, but it has become an equally
useful exercise in automation, observability, and careful use of AI.

The filter sits between two network segments and makes decisions about traffic
without becoming the router for either side. That distinction matters. I wanted
the device to remain a transparent bridge, while keeping management and
monitoring on separate paths.

All addresses in the diagram below are documentation-only examples. They are not
addresses from my network.

```text
                         separate management path
                    198.51.100.0/24 (example range)
                              |
                       [management host]
                              |
                   +----------+----------+
                   |  Raspberry Pi 4     |
                   |  management plane   |
                   |                     |
  example LAN A    |  br0: unnumbered    |    example LAN B
  192.0.2.0/24 ----+-- eth0 [bridge] eth1 +---- 203.0.113.0/24
                   |  nftables forward   |
                   +---------------------+
                              |
                    managed traffic events
                              v
                    [separate monitoring host]
                    Logstash -> Elasticsearch -> Kibana
```

## Why use a transparent bridge?

A routed firewall is often the right answer, but it also changes the network
design. A transparent bridge can be inserted into an existing path while
leaving addressing and routing to the existing network equipment.

The bridge has no address, default route, or DHCP role. Its two physical ports
are Layer-2 members of `br0`. The management connection is independent of those
ports, which gives me a safer way to administer the device and recover from a
bad forwarding rule.

That separation is one of the most important design decisions in the project.
It also creates a constraint: rules must be written for the bridge forwarding
path, not copied from a routed firewall example and assumed to work.

## nftables on the Pi

The filtering policy is an Ansible-managed nftables table in the `bridge`
family. Its forward hook checks static policy and two dynamic sets: one for IPv4
destinations and one for IPv6 destinations.

The deny path is deliberately simple:

1. Match a destination in a managed set.
2. Emit a rate-limited kernel log message with a dedicated prefix.
3. Drop the frame.

The log and drop are separate actions. Logging being rate-limited must never
turn a denied packet into an allowed packet. Traffic that does not match a deny
set is accepted and can be logged for monitoring, with the monitoring service's
own web traffic excluded to avoid creating a feedback loop.

I keep the policy in templates and variables rather than editing nftables by
hand. Before an apply, the configuration is syntax-checked. The guarded apply
also verifies the management path, bridge membership, and the loaded forwarding
hook afterward. This makes the firewall reproducible and gives a failed change a
clear stopping point.

## Turning monitoring into a controlled feedback loop

The monitoring platform runs on a separate Docker host. The Pi does not run the
full monitoring stack. Its job is to send only the events that the monitoring
pipeline needs: managed nftables traffic prefixes forwarded by rsyslog over the
independent management path.

The pipeline parses the syslog envelope and the nftables fields into structured
source, destination, protocol, port, interface, and action fields. Elasticsearch
stores the events in separate traffic and blocked-event streams. Kibana provides
dashboards and maps for the enriched source and destination data.

This arrangement keeps the inline device small and makes the monitoring system
replaceable. It also limits what leaves the Pi. General system logs are not part
of the forwarding rule, and the pipeline keeps the original event alongside its
structured fields so parsing errors can be investigated.

## The hourly IP scrape

The most interesting automation is an hourly cron job. It queries the monitoring
index for an aggregation of destination IPs and their available country
classification over a recent time window. It requests buckets rather than raw
events, which keeps the job's input smaller and avoids copying packet history
into the policy worker.

The worker then:

- filters out private or internal ranges covered by the local policy;
- keeps IPv4 and IPv6 addresses in separate nftables sets;
- records a first-added timestamp in a root-owned JSON inventory;
- writes a deterministic nftables include file; and
- adds only addresses that are not already active.

The inventory gives the policy persistence across service reloads and reboots.
The job is also idempotent: running it twice should not create duplicates or
reset the original first-seen metadata. A lock prevents overlapping runs, and
the cron wrapper reports aggregate results without printing the address list.

This is useful, but it is not a substitute for a threat-intelligence program.
GeoIP is approximate, destination identity can be misleading, and a learned
deny list can block something important. I treat the result as a lab policy and
keep the static configuration as the source of truth. A production deployment
would need a review queue, expiration rules, explicit exceptions, and a tested
rollback path before allowing an automated feed to enforce policy.

## Where AI helps—and where it does not

I use AI as a development partner, not as an unattended network administrator.
It has been useful for turning a rough requirement into a set of inspectable
artifacts: an architecture outline, Ansible tasks, nftables templates, parser
tests, monitoring documentation, and review checklists.

The most valuable conversations are concrete. I can ask AI to trace a packet
through the bridge hook, explain what a rule does for IPv4 versus IPv6, look for
non-idempotent tasks, or challenge whether a monitoring query is safe to run
hourly. It is also good at finding inconsistencies between a README, a template,
and a test.

The important work still requires verification. I check the generated policy
with nftables, run Ansible syntax and check-mode validation, inspect the active
bridge and management path, and test the monitoring pipeline separately. AI can
confidently suggest a routed-firewall rule for a bridge, overlook a remote Docker
daemon boundary, or invent a module option that does not exist. Those are exactly
the kinds of errors that a small test and a guarded apply are meant to catch.

I also keep secrets, private addresses, raw discovery reports, and credentials
outside the repository and outside external prompts. The public documentation
uses example ranges and describes the shape of the system rather than exposing
the environment it runs in.

## Lessons so far

The project has reinforced a few simple principles:

- A bridge is not a router; choose the nftables family and hook accordingly.
- Management access is part of firewall safety, not an afterthought.
- Ansible should own the desired state, including generated policy inputs.
- Monitoring should be narrow, structured, and separate from the inline path.
- Automated blocking needs persistence, idempotence, review, and rollback.
- AI is most useful when every suggestion can be checked against a real system,
  a test, or a documented invariant.

The result is more than a Raspberry Pi with a firewall rule. It is a small,
repeatable system where the network path, policy, monitoring, and automation can
be reasoned about independently. That makes it safer to experiment with—and
much easier to explain when something goes wrong.
