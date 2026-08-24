---
layout: post
title: "Building an Agentic AI Workspace with Codex"
date: 2026-08-24 12:00:00 -0000
categories: [agentic-ai, codex, software]
tags: [codex, automation, containers, privacy]
---

My interest in Codex started with the obvious question: how can I use it to write
and change software more effectively? It did not take long to realize that the
interesting part was not just the model or the chat window. The interesting part
was the workspace around it.

I have been building an agentic AI environment that lets Codex work with a real
repository, a terminal, tools, browser automation, and persistent state. The goal
is not to give an agent unlimited access and hope for the best. The goal is to make
useful agency possible while keeping the system understandable, private, and easy
to rebuild.

## From chat to an agentic workspace

A chat can answer a question. An agentic workspace can take a task, inspect the
surrounding project, make a change, run checks, examine the result, and continue
until it has something that can be reviewed. That difference is where the value
starts to appear.

The agent needs more than a prompt. It needs context, tools, a place to work, and a
way to preserve state. It also needs boundaries. If I cannot tell what the agent
can access, what it changed, or what it is about to do next, then the system is
hard to trust no matter how impressive the output looks.

That led me to treat the project as infrastructure rather than as a collection of
scripts. The container, network, volumes, browser connection, terminal, and model
proxy all have a job to do. They need to work together, but they should not all
have unrestricted access to one another.

## Putting Codex in a browser

One of the most useful parts of the project is a browser-based way to reach Codex.
The current approach uses GoTTY to expose a terminal session through a web
interface. It is deliberately simple: the browser is a window into a persistent
terminal environment rather than a separate application that tries to reproduce
everything a terminal can do.

That choice has been helpful. I can use a familiar shell, see the same files that
the agent sees, and keep the interaction close to the tools that actually perform
the work. It also leaves room for a richer interface later. A future front end can
show the current task, active tools, changed files, command output, approvals, and
pull requests without throwing away the working terminal underneath.

The web interface is therefore not just a convenience layer. It is part of the
control surface for the agent. It should make the current state visible and make
important transitions deliberate.

## A proxy between the agent and the model

The environment also uses a local Headroom proxy around Codex. This gives the
workspace a place to manage model traffic and local behavior without changing the
way I use the Codex command itself.

The proxy is colocated with Codex and stays on the local loopback interface. That
keeps the path narrow and makes the boundary easier to reason about. The project
also keeps telemetry and update behavior constrained so that the workspace does
not quietly grow extra external dependencies.

This has changed how I think about agent tooling. A proxy is not only a performance
or convenience feature. It is also a policy boundary. It is a place to decide what
should remain local, what should be observable, and which integrations are allowed
to communicate outside the workspace.

## Tools need boundaries too

The agentic part of the system comes from the tools. Codex can inspect files, work
with Git, use the GitHub CLI, and interact with browser automation through a
Playwright MCP connection. Those tools turn a conversation into a development
loop.

They also create responsibility. Browser automation is approval-gated and kept on
the local connection. The private network uses Tailscale rather than exposing a
set of development services to the public internet. The file browser is read-only
and private. SSH is limited to local management with key-based access.

These restrictions are not there because the tools are unhelpful. They are there
because helpful tools can do more than I intended if their scope is vague. An
agent should be able to do its job without being able to reach every service,
modify every file, or publish every result automatically.

## Persistence is part of the design

An agentic environment is frustrating if it forgets everything whenever a
container is recreated. The project uses persistent named volumes for the
workspace and Codex home so that authentication, configuration, Headroom state,
and other working data survive the lifecycle of the container.

That persistence has to be handled carefully. It is useful to preserve state, but
it is equally important to know what state exists and where it lives. The rebuild
workflow keeps the configuration and startup logic in the repository while
leaving credentials outside Git. Secrets are supplied through a sanitized
environment contract and decoded only at runtime.

This gives me a better balance than either extreme. The environment is not
disposable, but it is still reproducible. I can preserve the parts that make the
workspace useful and rebuild the parts that should remain managed by configuration.

## What I have learned

The first lesson is that agentic AI is mostly a systems problem. The model matters,
but so do the filesystem, the network, the browser connection, the tool
permissions, the logs, the volumes, and the recovery path.

The second is that visibility is a feature. I want to know which repository and
branch are active, which files changed, which commands ran, and whether the agent
is waiting for approval. A good interface should make that information easy to
find rather than hiding it behind a stream of conversational text.

The third is that guardrails make the system faster to use. When the boundaries are
explicit, I spend less time worrying about accidental changes and more time
working on the task. Private networking, read-only services, approval gates, and
Git review are practical tools for maintaining that confidence.

Finally, I have learned to think of Git as part of the agent's memory. A branch
captures an experiment. A diff captures the exact change. A pull request captures
the review. That makes it possible to let Codex move quickly while keeping the
final decision with a person.

The project is still evolving. I expect the browser interface, tool integrations,
and workflow around Codex to keep getting better. But the direction is clear: an
agentic workspace should feel capable without feeling mysterious. It should make
software work easier while making its own behavior easier to inspect.
