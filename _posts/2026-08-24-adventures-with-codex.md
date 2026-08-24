---
layout: post
title: "Building an Agentic AI Workspace with Codex"
date: 2026-08-24 12:00:00 -0000
categories: [agentic-ai, codex, software]
tags: [codex, automation, containers, privacy]
---

My interest in Codex started with a simple question: how can I use it to write and
iterate on software more effectively? It did not take long to realize that the
interesting part was not just the local desktop version of Codex. The interesting
part was the workspace around it: how to move it off my laptop, lock down what it
can access, and still provide an expandable set of tools as needed.

I have been building an agentic AI environment that lets Codex work with a real
repository, a terminal, tools, browser automation, and persistent state. The goal
is not to give an agent unlimited access and hope for the best. The goal is to make
a useful AI-agent loop possible while keeping the system understandable, private,
and easy to rebuild.

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
The current approach uses GoTTY to expose a tmux session to a running Codex process
through a secure web interface. It is deliberately simple: the browser is a window
into a persistent terminal environment running in my home lab. I can reconnect to
it at any time, and Codex sessions run in recoverable tmux sessions.

That choice has been helpful. I can use a familiar shell, see the same files that
the agent sees, and keep the interaction close to the tools that actually perform
the work. It also leaves room for a richer interface later. A future front end can
show the current task, active tools, changed files, command output, approvals, and
pull requests without throwing away the working terminal underneath.

Bringing in Tailscale lets me connect to Codex from anywhere, even outside my home
lab. I have centralized Codex, moved it away from my sensitive personal files, and
given it a structured, reproducible environment managed with Docker Compose.

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

## What I have learned

The first lesson is that agentic AI is mostly a systems problem. The model matters,
but so do the filesystem, the network, the browser connection, the tool
permissions, the logs, the volumes, and the recovery path.

The second is that visibility is a feature. I want to know which repository and
branch are active, which files changed, which commands ran, and whether the agent
is waiting for approval. For me, that means elevating Codex into a browser session
that is available over a secure connection from anywhere.

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

At some point, I may make my agentic-AI setup public. It is defined in a Docker
Compose file with custom Docker images. I will write a separate post with more
detail once I am ready to share it.
