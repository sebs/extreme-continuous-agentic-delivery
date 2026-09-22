# xp-testing

**The testing disciplines: drive the code with tests, then try to break it.** The flagship plugin of [`xp-with-claude`](../../README.md).

```
/plugin marketplace add sebs/extreme-continuous-agentic-delivery
/plugin install xp-testing@xp-with-claude
```

## What's in it

| Skill | Enforces | Counters |
|---|---|---|
| `tdd` | One failing test at a time. Run it and read a real failure before writing production code. Minimum code to pass. Loop. | Writing the implementation first; predicting test results instead of running them |
| `refactor-on-green` | Only refactor when green. One *named* refactoring per step, suite run after each. Never mix a refactoring with a behavior change. | Rewriting a module and calling it a refactor |
| `simple-design` | Beck's four rules, plus blast-radius: the smallest diff that satisfies the current test, in the files the task actually required. | Gold-plating; edits spreading into files nobody asked about |
| `exploratory-testing` | A written charter and a time-box. Drive the *running* software through hostile inputs, log findings with repro steps, report coverage rather than a verdict. | Exercising the happy path it already imagined; "looks fine" with nothing actually run |

**Command:** `/tdd <behavior>` — starts one red-green-refactor cycle for one behavior.

## The two rules that do the work

Written directly into `tdd`, not left to the pairing plugin — they have to hold even if you install nothing else:

- **Run, don't predict.** No claim that a test passes or fails without a command run in this session and output actually read.
- **Never fake green.** Deleting, skipping, or weakening a test, or narrowing the run until the failure is out of scope, is not green.

`exploratory-testing` carries the first rule too, and needs it more: there is no red bar there to keep the model honest, so a bug it predicted but never reproduced is explicitly labelled unconfirmed.

## Why a TDD skill at all — Claude already knows TDD

It does. What it lacks is patience. It can see the answer, so it writes the implementation and backfills a test that was green the moment it existed — which proves nothing. This skill's job is the rhythm, not the theory: state one behavior, write one test, **see it fail for the right reason**, then write the least code that passes.

The most load-bearing line in the skill is the one that says a `ModuleNotFoundError` is not red.

## Why exploratory testing sits in the same plugin

Because the two answer different questions and neither covers the other. TDD asks *does this do what I said it should?* — and a suite can only fail in ways someone thought of while writing it. Exploratory testing asks *what does it actually do?*, which is the question that finds the empty file, the duplicate request, and the timestamp exactly on the expiry boundary.

For a model the split matters more than it does for a human: it built the thing, so left alone it will re-walk the paths it designed, with the inputs it had in mind, and report success. `exploratory-testing` replaces that with a charter, a box, and a heuristics list — then sends every confirmed finding back to `tdd` as a failing test before anyone fixes it.

## Pairs well with

[`xp-pairing`](../xp-pairing/README.md) — `pairing-stance` is foundational and makes the honesty rules here stick across the whole session.
