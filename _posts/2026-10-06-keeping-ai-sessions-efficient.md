---
layout: post
title: "Keeping AI Sessions Efficient Without Starving Them"
date: 2026-10-06 00:00:00 -0000
categories: [ai, software, productivity]
tags: [token-usage, headroom, skills, automation, codex]
---

I used to think an AI session was efficient if it produced an answer quickly.
That definition did not survive much real work. A fast answer is not especially
useful if it leaves no room to test the change, review the diff, or recover when
the first approach is wrong.

Now I treat the available context as a working budget. The goal is not to use
every token. The goal is to spend enough of the budget on the right information
and keep enough headroom for the work that usually appears at the end.

## Headroom is part of the plan

Headroom is the unused capacity I deliberately preserve during a session. It is
not a magic percentage and it is not the same thing as leaving the agent idle.
It is room for a failing test, an unexpected dependency, a security check, or a
final explanation that is clearer than the first draft.

I create that room before the session starts by writing down a narrow outcome:
what should change, what must not change, and how I will know the work is done.
That keeps exploration from becoming the task.

I also split work into phases:

1. Orient around the relevant files and constraints.
2. Make the smallest change that can answer the question.
3. Run focused checks and inspect the result.
4. Summarize the decision, remaining risk, and next action.

If the session is already consuming a lot of context during orientation, that is
useful feedback. I narrow the search, move a repeated operation into a script,
or start a fresh session with a concise handoff. Continuing to add messages to a
crowded context is rarely the best use of the remaining budget.

## Skills keep good instructions reusable

I use skills as reusable instruction bundles for recurring kinds of work. A skill
can define when it applies, which project knowledge to load, what safety rules
matter, and how to verify the result. That is more reliable than rewriting the
same long preamble every time I work on a deployment, a repository, or a review.

The important word is reusable. A skill should contain the durable parts of a
workflow, not a transcript of one particular session. I prefer a skill that says
"run a guarded check, preserve the management path, and verify the active policy"
over one that embeds a one-off hostname, address, or command output.

Skills can save tokens in two ways. They prevent repeated explanations, and they
make the first tool call more targeted. They can also waste tokens if I load
every available skill for every task. I select the smallest set that covers the
work and read only the project knowledge that is actually affected.

## Reusable scripts turn chatter into interfaces

Repeated shell commands are another source of waste. If I have to remember a
long sequence of checks, explain it to an agent, and interpret several screens
of output each time, the session is paying for the same reasoning repeatedly.

Small scripts help by giving that workflow an interface. A useful script should
have a narrow purpose, predictable inputs, a useful exit status, and concise
output. It should be safe to run twice when possible. For example, a project
check can report only the files that changed, the checks that passed, and the
first actionable failure instead of dumping every command's full environment.

The script is not a black box. Its source belongs in the project or shared
workspace where it can be reviewed, tested, and updated. I document the
assumptions that matter, especially whether a command is read-only, whether it
changes remote state, and which credentials it expects without putting those
credentials in the script.

This approach also improves human collaboration. A short command such as
"run the repository verification" is easier to hand to another person than a
paragraph of shell history.

## Spend context on decisions, not noise

I get better results when I ask the agent to inspect a map of the repository,
search for the relevant symbol, and open the surrounding lines. Reading an
entire tree up front feels thorough, but it often buries the invariant that
actually matters.

The same applies to command output. I want the failing test, the relevant diff,
and the status of the operation. I do not need several copies of an unchanged
log. Filtering output is not hiding evidence when the filter is explicit and
the full source remains available for follow-up.

I keep durable decisions in a short log: the objective, the choice made, the
alternative rejected, and the validation still needed. That is more useful than
replaying a long conversation. A handoff should let a new session continue
without pretending that a summary contains every detail from the old one.

## The trade-offs I watch

There are a few ways to optimize token usage that look good until they cause a
different problem:

- A very short prompt can omit a safety constraint. Brevity is not a substitute
  for stating what is out of scope.
- A giant skill can save repetition while making every session expensive. Keep
  reusable guidance modular and load it selectively.
- A script can reduce output while hiding an important failure. Preserve exit
  codes, show actionable errors, and make detailed diagnostics available.
- A summary can save context while losing a subtle assumption. Record decisions
  and evidence, not just the final conclusion.
- Headroom can become an excuse to stop too early. The work still needs tests,
  review, and a clear handoff.

That last point is the adversarial check I try to apply to my own workflow: am I
reducing waste, or am I simply reducing the amount of information available to
make a safe decision?

## A practical session checklist

Before starting, I ask:

- What is the smallest useful outcome?
- Which files, skill, and project notes are actually relevant?
- What must remain unchanged?
- Which checks will prove the result?
- What capacity should remain for review and recovery?

During the work, I look for repeated commands, noisy output, and questions that
would be better answered by a reusable script or a durable project note. At the
end, I inspect the diff, run the focused checks, record the decision, and leave a
short handoff.

The result is not an attempt to make AI sessions artificially terse. It is an
attempt to make them deliberate. Headroom, skills, reusable scripts, and focused
context all serve the same purpose: keeping the agent oriented toward a result
that can be checked, explained, and maintained by a human.
