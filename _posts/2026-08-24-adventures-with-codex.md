---
layout: post
title: "My Adventures with Codex"
date: 2026-08-24 12:00:00 -0000
categories: [codex, software, personal]
tags: [codex, github, automation]
---

I did not start using Codex with a grand plan. I had a nearly empty repository and
a simple idea: turn it into a personal blog. I wanted to write posts in Markdown,
keep everything in Git, and publish the result without taking on a large web
application project.

That small project became a useful introduction to a much bigger idea. Codex is
most interesting to me when it is connected to the tools around the code: the
repository, the terminal, GitHub, tests, branches, and pull requests. The chat is
only one part of the experience. The real value comes from shortening the distance
between an idea and a reviewed change.

## Starting with an empty repository

My first useful decision was to ask Codex to inspect the repository before making
recommendations. That sounds obvious, but it changes the quality of the work. A
generic answer about blogging platforms is easy to produce. An answer based on the
actual files, branch, and configuration is much more useful.

The repository had almost nothing in it, so Jekyll was a natural fit. GitHub Pages
already understands Jekyll, and Jekyll has a straightforward convention for blog
posts: put Markdown files in `_posts/`, give them a date-based filename, and add a
small YAML header describing the title, date, and layout.

The first version needed only a configuration file, a home page, an About page, and
a post. That was enough to create a working site without spending a week choosing
frameworks, designing a component system, or building an administration panel.

That was my first lesson: the smallest useful system is often the best place to
learn. Once the site worked, I had something concrete to improve.

## Learning the development loop

I have found that Codex works best when I give it a clear outcome and enough
context to make a sensible decision. I do not need to prescribe every command, but
I do need to describe what success looks like.

For this blog, that meant asking for Markdown authoring, a dated post structure, a
GitHub Pages workflow, and a real deployment. Codex could then inspect the files,
make the related changes, and validate the result. I could review the diff instead
of trying to reconstruct a long sequence of instructions from memory.

The important part is that I still review the work. Codex can move quickly, but
speed is not the same as correctness. I look at the files it changes, the commands
it runs, and the result that GitHub produces. The repository gives me a durable
record of that review: the diff shows what changed, the commit identifies the
unit of work, and the pull request gives me a place to discuss whether the change
is ready.

Git became more than a backup. It became the memory of the collaboration.

## The details behind a simple blog

The blog itself taught me a few details that are easy to miss when reading a quick
tutorial.

There is a difference between a project site and a user site. A project site is
usually served below a repository path, while a user site uses a repository named
`<username>.github.io` and is served from the domain root. That distinction affects
the Jekyll `baseurl` setting, links, feeds, and asset paths. Getting that decision
right early prevents a surprising number of broken links later.

I also chose a GitHub Actions workflow instead of relying only on an implicit
branch build. The workflow checks out the repository, prepares Pages, builds the
Jekyll site, uploads the generated artifact, and deploys it. Each step is visible in
the Actions history. When something goes wrong, I can see whether the problem is
in the source, the build, the artifact, or the deployment.

The first deployment exposed another useful lesson. The repository was initially
private, and the account plan did not support Pages for a private repository. The
workflow failed before it ever reached the Jekyll build. That was not a problem in
the Markdown or the workflow; it was a hosting restriction. After I made the
repository public, I enabled Pages and reran the workflow. The site built and the
hello-world page appeared as expected.

It is a good reminder that a web project has at least two systems: the code that
creates the site and the service that hosts it. Both need to be checked.

## Building a web interface around Codex

The next step I am working toward is a web interface for using Codex. I do not want
to build another chat box with a send button and call it a development tool. The
interesting problem is making the surrounding work visible and manageable.

The interface should show the repository, branch, current task, files in scope,
recent actions, and the resulting diff. It should make the state of a job obvious:
waiting for input, inspecting a repository, editing files, running validation,
waiting for approval, or ready for review. A streamed response is useful, but a
clear activity history is just as important.

I also want the interface to treat review as part of the normal workflow. A useful
session should end with more than a paragraph of advice. It should be possible to
see the branch, commit, checks, and pull request without leaving the context of the
task. The goal is not to hide GitHub; it is to make the path from a request to a
reviewable change easier to follow.

External actions deserve an explicit pause. Reading a repository is one thing.
Pushing a branch, changing repository settings, publishing a site, or sending a
message somewhere else is another. A good interface should show those boundaries
and ask for approval at the right moment. That is not unnecessary friction. It is
how a fast tool remains predictable.

## What I have learned so far

The first lesson is that context is a feature. Codex becomes more useful when it
can see the repository and its constraints, rather than receiving an isolated
question with no connection to the files that need to change.

The second is that small, verifiable steps beat impressive one-shot prompts. Set up
the site. Inspect the result. Configure deployment. Check the URL. Then move on to
the next improvement. Each step creates evidence and makes mistakes easier to
undo.

The third is that guardrails improve the experience. Privacy checks, explicit
external actions, clean branches, and pull requests do not get in the way of
productive work. They let me move faster because I know where the boundaries are.

Finally, I have learned that the best use of Codex is not to avoid understanding
the system. It is to spend more of my time understanding the important parts. The
agent can handle routine navigation and repetitive setup, while I focus on the
decisions, the trade-offs, and whether the result is something I actually want to
keep.

This blog is a small project, but it has become a useful laboratory. I can try an
idea, put the work in a branch, review the change, and publish only when it is
ready. That is a good foundation for the next adventure.
