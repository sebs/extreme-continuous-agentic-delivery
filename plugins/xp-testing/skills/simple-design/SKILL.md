---
name: simple-design
description: Keep the design to the simplest thing that passes the tests and the diff to the smallest change that does the job — Beck's four rules plus blast-radius discipline and YAGNI. Use when designing a solution, choosing an abstraction, reviewing a diff for over-engineering, or when tempted to add configuration, options, hooks, or error handling nobody asked for. Counters gold-plating, speculative generality, and edits that spread into files the task never mentioned.
---

# Simple design and a small blast radius

**Counters:** gold-plating and scope creep — building for imagined futures, and changing code you weren't asked to change.

Two independent disciplines, both about restraint:

- **Simple design** — the code itself is no more elaborate than the tests require.
- **Blast radius** — the *diff* is no wider than the task requires.

You can violate the second while honouring the first. A beautifully simple change to eleven files nobody asked you to open is still a problem.

## Beck's four rules, in priority order

Apply in order; earlier rules win ties.

1. **Passes its tests.** Correct first. Nothing below matters if this fails.
2. **Reveals intent.** Names say what and why. A reader who knows the domain and not this code should follow it.
3. **No duplication.** Of *knowledge*, not of characters. Two rules that happen to look alike today are not duplication — wait for the third occurrence before abstracting.
4. **Fewest elements.** Fewest classes, functions, files, parameters, layers, dependencies. Delete anything not carrying weight.

Rules 3 and 4 tension with each other: a premature abstraction removing "duplication" adds an element and usually loses intent too. When in doubt, prefer the duplication — it's cheaper to merge two similar things later than to untangle a wrong abstraction.

## YAGNI: do not add these unless a test or the human demands it

Each one is a place you'll reach for reflexively:

- Configuration options, feature flags, env-var switches
- Optional parameters, `**kwargs`, options objects "for flexibility"
- An interface / abstract base / protocol with exactly one implementation
- A factory, registry, or plugin point for one case
- Error handling for conditions that cannot occur, or bare catch-alls that swallow real failures
- Retries, caching, connection pooling, batching — unless the task is performance and there's a measurement
- Logging, metrics, tracing not present in the surrounding code
- Input validation beyond what a test asserts
- Generic types or a type parameter used once
- A new file, module, or layer, when the code fits in an existing one
- A `utils` / `helpers` / `common` module — it becomes a junk drawer
- Backwards-compatibility shims for code with a single caller you can just update

The test for all of these: **name the failing test that requires it.** No test, no code. If you believe it's genuinely needed, say so in one line and let the human decide — don't build it and mention it afterwards.

## Blast radius

The change should touch what the task requires and stop.

**In scope:** the file(s) the behavior lives in; their tests; a call site you had to update to keep the build green.

**Out of scope without asking:** reformatting a file you edited one line of; renaming things you didn't need renamed; upgrading dependencies; fixing unrelated bugs, typos, or lint warnings you happened to see; adding types to untyped neighbours; restructuring the directory; touching config, CI, or build files.

When you notice something out of scope, **report it, don't fix it**:

> While changing `parse()` I noticed `validate()` has the same off-by-one. Out of scope — want a separate change for it?

"Leave the code better than you found it" survives here in a bounded form: in a file you already had to open, on green, one named refactoring (see `refactor-on-green`), mentioned in your summary. Not a sweep.

## Reviewing a diff for simplicity

When asked to critique a design or a diff, walk this list and answer concretely — quote the line, name the rule:

1. Which lines aren't required by any test? Can they go?
2. Any abstraction with one implementation or one caller?
3. Any parameter, flag, or branch nothing exercises?
4. Any name that hides intent (`data`, `process`, `handle`, `manager`, `info`, `tmp`)?
5. Real duplicated *knowledge*, or just similar shapes?
6. Which files in this diff does the task not require?
7. What would this look like if it were half the size? Is that version worse — and why exactly?

End with the smallest concrete suggestion, not a list of ideals.

## Self-check

- [ ] Every element in the diff is required by a test or an explicit request
- [ ] No abstraction introduced for a single case
- [ ] No unrequested configuration, error handling, or logging
- [ ] The files touched are the files the task required
- [ ] Out-of-scope observations were reported, not acted on
- [ ] Names reveal intent
