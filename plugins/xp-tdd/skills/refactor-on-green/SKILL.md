---
name: refactor-on-green
description: Refactor in small named safe moves while the tests are green — extract, rename, move, inline — running the suite after each one, never mixing a refactoring with a behavior change. Use when asked to refactor, clean up, tidy, restructure, simplify, extract, rename, or improve existing code, and after the green step of a TDD cycle. Counters the habit of "refactoring" by rewriting a module wholesale and changing behavior along the way.
---

# Refactor on green, one named move at a time

**Counters:** rewriting instead of refactoring — replacing whole files in one shot, and smuggling behavior changes into a "cleanup."

You have no attachment to existing code, which makes deletion and rewriting feel cheap to you. It isn't. A rewrite throws away every undocumented decision baked into that code, and it makes review impossible: nobody can tell a formatting change from a logic change in a 300-line replacement diff.

**Refactoring is changing structure while behavior stays provably identical.** If behavior changed, it wasn't a refactoring — it was an edit, and it needed a test.

## Entry conditions — check all three before touching anything

1. **The suite is green, and you ran it just now.** Not "it was green earlier." Run it, read it, then start. Refactoring on red means you cannot tell your breakage from the existing breakage.
2. **There is a test covering what you're about to move.** If there isn't, you are refactoring blind. Say so and offer: write a characterisation test first, or leave it alone. Don't silently proceed.
3. **You know which named refactoring you're doing.** "Clean this up" is not a plan.

## Name the move before you make it

Pick one from the vocabulary and say it out loud. One per step.

| Move | What it does |
|---|---|
| Rename | variable / function / class / file to a name that reveals intent |
| Extract Function | pull a block out, unchanged, behind a name |
| Inline Function / Variable | remove an indirection that isn't earning its keep |
| Extract Variable | name a subexpression |
| Move Function / Field | relocate to the class or module it belongs with |
| Change Function Declaration | add, remove, or reorder a parameter |
| Introduce Parameter Object | collect an argument clump |
| Slide Statements | move related lines next to each other |
| Split Loop / Split Variable | one loop, one job; one variable, one meaning |
| Replace Conditional with Polymorphism | a switch on type becomes dispatch |
| Decompose Conditional | name the condition and the branches |
| Remove Dead Code | delete what nothing reaches |

If the change you want isn't on this list and can't be decomposed into things that are, it's a redesign. Redesigns need agreement before you start — say what you'd change and why, and wait.

## The micro-cycle

For each named move:

1. Say the move: *"Extract Function: pull the retry loop out of `send()` into `send_with_retry()`."*
2. Make **only** that move. Automated-refactoring-sized. No renames while extracting, no reordering while moving.
3. **Run the full suite.** Read the output.
4. Green → keep it, commit if you're committing. Red → **revert immediately** and think again. Do not debug forward out of a failed refactoring; the whole point is that it was supposed to be safe.
5. Next move, or stop.

Stop when the code reveals intent. Not when it reaches some ideal architecture.

## Never mix structure and behavior

One diff does one kind of thing.

- Structural change: no test's expectations change.
- Behavioral change: goes through the `tdd` loop — a failing test first.

If mid-refactor you find a bug: **note it, finish or revert the refactoring, then fix the bug in its own cycle with its own failing test.** Do not fix it inline. Commit structure and behavior separately, structure first, so reviewers can skim one and read the other.

**If you had to edit a test to keep things green, you changed behavior.** Revert. The only exception is a test that references a renamed symbol — and that rename should have been mechanical across the whole repo in one step.

## The rewrite tripwire

You are rewriting, not refactoring, if any of these is true:

- Your edit deletes a large block and re-adds a similar-but-different one
- You are writing a new file to replace an existing file's job
- You can't state the change as a sequence of named moves
- You'd struggle to explain the diff line by line to the person who wrote the original
- You started "while I'm here" and the file you're in wasn't part of the request

When you hit a tripwire: stop, say what you'd rewrite and why the incremental path is blocked, and let the human choose. A rewrite may well be right — it just isn't yours to start unasked.

## Blast radius

Refactor what the task made you touch. Not the neighbours. "Leave it better than you found it" means the file you were already in, one named move, on green — not a repo-wide sweep. Unrequested tidying across a codebase is noise in someone else's review queue.

## Self-check

- [ ] Suite was green and I ran it before starting
- [ ] Each step was one named refactoring, stated first
- [ ] I ran the suite after every step and read the output
- [ ] No test's expectations changed
- [ ] No bug got fixed inside the refactoring
- [ ] I stayed inside the files the task required
