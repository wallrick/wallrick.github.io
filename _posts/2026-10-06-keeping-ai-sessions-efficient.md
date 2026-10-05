---
layout: post
title: "How I Keep Codex Token Usage Under Control"
date: 2026-10-06 00:00:00 -0000
categories: [ai, software, productivity]
tags: [codex, token-usage, headroom, skills, automation]
---

My most expensive AI sessions are rarely caused by one unusually long prompt.
The cost builds gradually: the agent reads the same project instructions again,
opens more files than it needs, returns a large command result, and carries all
of that context into the next turn.

I do not try to solve that by making every prompt as short as possible. A prompt
that leaves out an important constraint can create more work than it saves. My
approach is to reduce repeated and low-value context while preserving the facts
the agent needs to make a safe decision.

I think about it as a series of controls:

```text
task -> skill -> reusable script -> Headroom -> model
```

Each layer removes a different kind of waste. None of them is enough on its own.

## Compress what the model has to read

The first layer is [Headroom](https://github.com/headroomlabs-ai/headroom), an
open-source context-compression project that I use with Codex. It sits between
the agent and the model and compresses material such as tool output, logs, files,
and conversation history before that material reaches the model.

That matters in an agentic session because tool results can quickly become much
larger than the prompt that started the work. A repository search may return
dozens of matches. A test command may print hundreds of successful lines around
one useful failure. Carrying all of that into later turns consumes context
without necessarily improving the answer.

Headroom gives me a way to shrink that traffic while keeping the original
material available locally for retrieval. I still return to the source when a
result is surprising, ambiguous, or operationally sensitive. Compression is a
cost control, not permission to stop checking the evidence.

I also avoid treating a reported compression percentage as a guaranteed saving.
Repetitive JSON and logs may compress well, while concise source code or prose
may not. The useful number is what happens in my own sessions, including whether
compression creates extra retries or causes the agent to request the original
content repeatedly.

## Use skills instead of repeating the setup

The next source of waste is explaining the same workflow in every session. I use
skills to hold reusable instructions for recurring work: when a workflow
applies, which safety rules matter, where the relevant project knowledge lives,
and what verification must happen before the task is complete.

That changes the conversation. Instead of restating a page of repository rules,
I can invoke the relevant skill and start from an established procedure. It also
improves consistency because the verification steps do not depend on me
remembering to repeat them in a prompt.

There is a limit to this benefit. Loading every available skill would simply
replace one kind of context bloat with another. I keep skills focused and load
only the ones that apply to the task. Durable guidance belongs in a skill;
one-time command output and session history do not.

## Turn repeated commands into small interfaces

I use reusable scripts for operations that otherwise require a long sequence of
commands. The script becomes a compact interface between Codex and the system.
It can validate inputs, perform a known workflow, and return a concise result
with a meaningful exit status.

A good verification script does not need to print every successful command. It
can report which checks ran, whether they passed, and the first actionable
failure. Detailed output should still be available when troubleshooting, but it
does not need to occupy the main conversation by default.

This can save more than output tokens. It avoids asking the model to reconstruct
the same command sequence, and it reduces the chance of a subtle variation each
time the workflow is used. I keep the scripts reviewable, idempotent where
practical, and explicit about whether they change local or remote state.

## Give the agent less irrelevant context

Compression works better when I avoid generating unnecessary context in the
first place. I search for a symbol before opening a file, inspect the surrounding
lines instead of dumping the whole file, and review the changed paths before
reading unrelated parts of a repository.

The same principle applies to session history. I keep a short decision log with
the objective, the decision, the rejected alternative, and the validation that
still matters. When work moves to a new session, the handoff contains those
facts rather than a replay of the entire conversation.

This is where a lot of the practical savings come from:

- selecting the smallest relevant set of files and project notes;
- avoiding duplicate logs and unchanged command output;
- asking for a focused diff instead of a broad rewrite;
- ending a session with a concise, evidence-based handoff; and
- keeping secrets, private configuration, and raw discovery data out of prompts.

These habits reduce token use even when Headroom is not active, and they make
the resulting work easier to review.

## Match the model to the task

Model choice is the final control. A less expensive model is not cheaper if it
misunderstands the task and requires several retries. A more capable model is
also unnecessary when the work is a mechanical edit with clear acceptance
criteria.

At the time of writing, the [official OpenAI model guidance](https://learn.chatgpt.com/docs/models)
recommends GPT-6.1 Sol for complex coding and agentic workflows, and GPT-6 Luna
for focused, repeatable tasks. That maps well to how I work:

- I use GPT-6.1 Sol for architecture decisions, multi-file changes, debugging,
  and adversarial review.
- I use GPT-6 Luna for targeted searches, formatting, summaries, triage, and
  small edits where the expected result is already clear.
- I reserve the most capable model for unusually ambiguous work where stronger
  judgment is worth the additional usage.

I start with the default reasoning effort and increase it only when the task
needs deeper planning or analysis. Higher reasoning effort may improve a hard
result, but applying it to every file read or formatting change spends tokens
without adding much value.

## Measure the whole session

Token count is useful, but it is not the only measure. Billing and usage limits
depend on the model and account, so I do not assume that every compressed token
has a fixed dollar value. I also care about how many times the task had to be
retried, whether the first change passed its checks, and how much human review
was required to find a missed constraint.

For a recurring workflow, I can compare the same representative task with two
models or reasoning levels. I record the model, effort, Headroom's compression
measurement, number of retries, and final validation result. The right
configuration is the lightest one that consistently reaches the quality
bar—not the one with the smallest single request.

## What can go wrong

Every optimization has a failure mode:

- Compression can remove a detail that later becomes important.
- A large skill can consume more context than the repeated instructions it
  replaced.
- A quiet script can hide useful diagnostics.
- A short handoff can lose an assumption that was never written down.
- A smaller model can turn one good run into several cheap but unsuccessful
  attempts.

My safeguard is to keep the original evidence available and make validation part
of the workflow. When a change affects security, networking, deployment, or
other sensitive systems, I retrieve the full output, inspect the final diff, and
run the real checks. Token efficiency should remove noise, not confidence.

The combination is what works for me: Headroom reduces the context sent to the
model, skills remove repeated instructions, scripts reduce repeated tool chatter,
focused sessions avoid irrelevant context, and model selection controls the cost
of the reasoning that remains. Together, those controls make longer Codex
sessions more predictable without asking the agent to work with one hand tied
behind its back.
