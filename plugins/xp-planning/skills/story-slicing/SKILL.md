---
name: story-slicing
description: Cut a feature into thin vertical slices that each deliver observable end-to-end behavior, ordered walking-skeleton first, each with a concrete acceptance test — instead of starting to build the whole thing or building horizontal layers. Use when given a feature, epic, story, or vague "build me a X" request, when work looks too big for one TDD cycle, or when asked to plan, break down, estimate, or slice work. Counters starting to code a large request immediately and building infrastructure layers that deliver nothing a user can see.
---

# Slice features into thin vertical stories

**Counters:** building the whole feature in one go, and building layers instead of behavior.

Given "add user authentication," you will start writing files. Ninety minutes later there's a schema, a middleware, a token service, a config module — and nothing anyone can run. You optimised for feeling productive over being steerable.

**A slice is thin, vertical, and demonstrable.** Vertical means it goes through every layer it needs — UI to storage — even if each layer is trivial at first. Thin means it does one thing for one case. Demonstrable means you can show it working and the human can say "yes, that" or "no, wrong."

## Do this before writing any code

For a request bigger than one behavior, produce a slice list and **confirm slice 1 before building it.** Don't slice and then build all of them.

For each slice:

```
Slice N: <one line, phrased as observable behavior>
  Acceptance: Given <state>, when <action>, then <observable result>
  Not in this slice: <the obvious things you are deliberately leaving out>
```

Then: *"Slice 1 first — shall I start?"* and wait.

The "Not in this slice" line is the most valuable one. It's where scope creep goes to be named instead of built.

## Walking skeleton first

Slice 1 is the thinnest path that touches every part of the system end to end and actually runs. It's allowed to be embarrassing: one hardcoded user, no persistence, no styling, one happy case.

It earns its place by proving the pieces connect and by giving every later slice somewhere to attach. Vertical-thin-and-ugly beats horizontal-thick-and-invisible.

## Splitting patterns

When a slice is still too big, cut along one of these:

- **Happy path first** — the golden case; errors and validation become later slices
- **Workflow steps** — a five-step flow is five slices; ship step one end to end
- **Business rule variations** — basic rule now, the exceptions and edge rules later
- **Zero / one / many** — one item now, collections later
- **CRUD split** — create-and-read first; update and delete are separate
- **Interface variations** — one input channel (CLI) now; HTTP, UI, batch later
- **Data variations** — one format, one locale, one currency first
- **Defer the hard part** — stub or hardcode the expensive bit, keep the path alive, do it properly in its own slice
- **Simple first, optimise later** — the naive implementation is a slice; performance is a slice with a measurement
- **Spike out the unknown** — if a slice can't be estimated because of a technical unknown, pull the unknown out into a `spike`

## Slices that aren't slices

Reject these — they're horizontal layers with story wording:

- "Set up the database schema" / "Create the API layer" / "Build the UI components"
- "Project setup and scaffolding"
- "Add tests for X" (tests belong inside the slice that adds X)
- "Refactor Y so we can later do Z"
- "Research the library" (that's a `spike`, and it's fine — just don't call it a slice)

The test: **when this slice is done, what can someone do that they couldn't before?** If the answer is "nothing yet, but later...", it's a layer.

## INVEST, checked quickly

- **I**ndependent — buildable without waiting on a sibling slice
- **N**egotiable — states the outcome, not the implementation
- **V**aluable — something observable changes
- **E**stimable — no unknown big enough to block a guess (else: spike)
- **S**mall — a handful of TDD cycles, not a day of them
- **T**estable — you can write the acceptance test *now*, concretely

If you can't write the acceptance test as a concrete Given/When/Then with real values, the slice isn't understood yet. Ask — don't paper over it with vaguer wording.

## Acceptance tests are concrete

Not: *"Given a user, when they log in, then it works."*

But: *"Given user `ada@example.com` with password `hunter2` exists, when `POST /login` is called with those credentials, then the response is 200 with a `session` cookie set."*

Concrete values force the questions that vague wording hides — and the acceptance test becomes the first failing test of the `tdd` loop.

## Handing off to TDD

For the confirmed slice: its acceptance test is the outermost red. Inside it, run `tdd` cycles until it's green. Then stop, show it working, and get the next slice confirmed. **Do not roll on into slice 2 unasked** — between slices is exactly where the human's steering is cheapest.

## Self-check

- [ ] Every slice is observable behavior, not a layer
- [ ] Slice 1 is a walking skeleton that runs end to end
- [ ] Each slice has a concrete Given/When/Then with real values
- [ ] Each slice says what it deliberately leaves out
- [ ] I confirmed slice 1 before writing code
- [ ] I stopped after the slice instead of continuing
