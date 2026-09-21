---
name: tdd
description: Drive code with a real red-green-refactor loop — one failing test at a time, run it and read the actual failure, then write the minimum code to pass. Use whenever implementing, adding, building, fixing, or changing behavior in code, and whenever asked to "write a test for" something or to do TDD/test-first. Counters the habits of writing the implementation first, batching up several tests, and claiming tests pass without running them.
---

# TDD: red, green, refactor — one behavior at a time

**Counters:** writing the implementation first, and predicting test results instead of running them.

You already know what TDD is. You are bad at the *patience* part: you can see the answer, so you write it, then backfill a test that was green the moment you wrote it. That is not TDD and it buys none of TDD's benefits — an unfailed test proves nothing.

This skill is the rhythm. Do not skip steps because the code is "obvious." Obvious code is where unfailed tests hide.

## Two rules that outrank everything else here

1. **Run, don't predict.** You may not describe a test as passing, failing, red, or green unless you ran a command in this session and read its output. Your forecast of the result is not the result.
2. **Never fake green.** Green means the full command exited zero with the test actually executing. Deleting the test, weakening the assertion, marking it skipped, adding `|| true`, or narrowing the run until the failure is out of scope is not green. See "Fake green" below.

If you catch yourself about to write "this should pass now" — stop and run it instead.

## Step 0 — one behavior, stated out loud

Before any code, write one sentence: *the behavior this cycle adds.*

- One sentence, one behavior. "Parses ISO dates" is one. "Parses dates and validates the range and returns errors" is three cycles.
- If the ask is bigger than one sentence, list the cycles and confirm the first one. Do not start all of them. (See `story-slicing` for splitting a whole feature.)
- Name the test command you will use, and where the test file goes. If you can't find the project's test command, ask — do not guess and do not invent a new test framework.
- If you genuinely can't see how to test this yet, that is a `spike`, not a licence to skip the test.

## Step 1 — RED

Write **exactly one** failing test.

- One test. Not a file of them. If you wrote three, keep the first and delete the other two — they'll come back as later cycles.
- Assert on the behavior, not on the implementation you're planning.
- Give the test a name that states the rule: `rejects_expired_token`, not `test_token_2`.
- Then **run it.** Not the whole suite yet if it's slow — but run at least this test.

Show the actual failure output. Then confirm two things in words:

- **It failed.** You read a failure, not an error in your head.
- **It failed for the right reason.** A `ModuleNotFoundError`, a typo, or a syntax error is not red — it is a broken test. Red means the assertion was reached and the behavior was wrong or absent. Fix the plumbing (stub the function so it exists and returns the wrong thing, if you must) and run again until the failure is the *assertion*.

**Do not write a line of production code until you have pasted a real failure.** If the test passes the first time, you have not learned anything: either the behavior already exists (say so, and delete your test or move on), or the test is not testing what you think (fix the test).

## Step 2 — GREEN

Write the **minimum** code that makes that one test pass.

- Minimum is literal. Returning a constant is allowed and often correct for the first test — the next test is what forces the generalisation. This feels wrong; do it anyway.
- No error handling, no configuration, no extra parameters, no abstraction, no logging, no second code path — unless a currently failing test demands it.
- Touch the fewest files possible. The diff should be explainable in one line.
- Do not fix unrelated things you noticed. Note them; keep going.

Then **run the test.** Then run the **whole suite** — green on your test but red elsewhere is red.

Report what you ran and what came back. If it's still failing, say so plainly and show the output; do not narrate a fix you haven't verified.

## Step 3 — REFACTOR

Only when green, and only with a named refactoring. Delegate to `refactor-on-green`; if that skill isn't available, the short version is: tests green before you start, one named move at a time, run the suite after each, never change behavior, revert rather than push through.

Refactoring is optional in any given cycle. Skipping it is fine. "Refactoring" by rewriting the module is not.

## Step 4 — loop or stop

State where you are: behavior N done, here is behavior N+1. Then go back to Step 0.

Stop and hand back when: the stated behavior is done, you're unsure what's next, or you have failed the same step twice (see below).

## Fake green — the specific moves that are forbidden

Never do any of these to get to green. If one seems necessary, that is a finding to report, not an action to take.

- Deleting, renaming away, or commenting out a failing test
- Weakening an assertion to match the wrong answer (`assertEqual` → `assertTrue`, tightening a tolerance, asserting on a substring)
- `skip` / `xfail` / `.only` / `.skip` / `#[ignore]` / `@Disabled` to route around red
- Running a narrower selection so the failure isn't in scope, then calling the suite green
- `|| true`, `-x` used to hide later failures, `--no-verify`, catching and swallowing the failure
- Editing a test to match buggy output because "the test was wrong" — it might be, but say that out loud and get agreement first

A test you had to weaken to pass is a test that no longer protects anything.

## When you're stuck

Two failed attempts at the same red is the limit. On the third, stop and say:

> I've tried X and Y to get this test passing and both failed with `<actual output>`. I think the blocker is Z. Options: A or B. Which do you want?

Thrashing — retrying variations while the output stays the same — burns the user's time and hides the real problem. Stopping is the correct move, not a failure.

## Self-check before you claim a cycle is done

- [ ] I stated the one behavior before writing code
- [ ] I wrote exactly one test, ran it, and read a real failure
- [ ] The failure was the assertion, not a missing import
- [ ] The production code I wrote is the minimum for that test
- [ ] I ran the full suite and read the output
- [ ] Every "passes" / "green" in my message is backed by output I actually saw
- [ ] I did not touch files this behavior didn't require
