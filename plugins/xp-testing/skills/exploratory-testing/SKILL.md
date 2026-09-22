---
name: exploratory-testing
description: Hunt for the bugs the test suite cannot see — write a charter, time-box it, drive the real software through deliberately hostile inputs, and log every finding with reproduction steps. Use after a feature is green, before shipping or merging, when asked to "test this properly", "try to break it", "poke at it", or "does this actually work", and when a bug report has no reproduction yet. Counters confirming the happy path you already imagined, reasoning about what might break instead of running it, and reporting "works fine" with no evidence of what was actually exercised.
---

# Exploratory testing: try to break it, on purpose

**Counters:** confirming the happy path you already imagined, instead of running the real thing and actively trying to break it.

TDD asks *does the code do what I said it should?* Exploratory testing asks a different and less comfortable question: **what does it actually do?** Your test suite can only fail in ways you thought of while writing it. This skill is for the rest.

You are unusually bad at this, for two reasons:

1. **You test your own mental model.** You just built the thing, so you exercise the paths you designed, with the inputs you had in mind, and they work — which tells you nothing you didn't already believe.
2. **You explore by reasoning.** Listing what *could* go wrong is not testing. A bug you predicted and did not reproduce is a guess. **Run it, don't predict it** — the same rule as `tdd`, and it is broken more often here than anywhere else, because there is no red bar to keep you honest.

## Step 0 — write a charter

One charter, written before you touch anything. Use the shape:

> **Explore** `<target>` **with** `<resources / inputs>` **to discover** `<information>`

- *Explore the CSV import endpoint with malformed and oversized files to discover how it fails and whether it fails safely.*
- *Explore session expiry with a clock skewed forwards and backwards to discover whether tokens are ever accepted past their expiry.*

A charter is a mission, not a test case: it says where to look, not what to assert. "Test the app" is not a charter. If you have two targets, that's two sessions — run the one where a bug would hurt most.

**Declare the box** in the same breath: *"Exploratory session, ~20 minutes / 15 tool calls, charter as above."* When the box runs out, stop and report, findings or not. "Nothing found in 20 minutes on this charter, here's what I covered" is a legitimate result — an unbounded hunt is not.

## Step 1 — get the real thing running

Exploratory testing happens against **running software**, not source code. Reading the implementation to work out what would happen is the failure mode this skill exists to stop.

- Start the actual CLI, server, script, or function — whatever the user would touch.
- If you cannot run it, say so and stop. Do not substitute a code read and call it a test session.
- Keep the real output in front of you: logs, exit codes, stack traces, response bodies, what got written to disk.

## Step 2 — attack along the heuristics

Vary things deliberately. Pick from these and note which ones you used — they are the difference between exploring and clicking around:

- **Nothing** — empty string, empty file, empty list, null, missing field, zero rows, no arguments.
- **Too much** — a huge input, a long string, deep nesting, many items, a file bigger than memory.
- **Boundaries** — 0, 1, n−1, n, n+1, −1, max int, the exact size of the buffer or page.
- **Wrong type or shape** — a string where a number goes, an array where an object goes, the right JSON with the wrong schema.
- **Nasty text** — unicode, emoji, RTL, newlines, quotes, `../`, NUL bytes, leading and trailing whitespace, a name like `O'Brien`.
- **Time** — expiry exactly now, clock skew, DST, leap day, timezones, ordering of events that arrive out of order.
- **Repetition and concurrency** — do it twice, do it twice at once, retry after a failure, replay the same request.
- **Interruption** — kill it mid-write, disconnect, time out, cancel, send SIGINT, pull the network.
- **State** — run it against stale data, a partially migrated store, a config that's missing a key.

After each surprise, **follow it.** A weird result is a thread to pull, not a box to tick — that's what makes this exploratory rather than a checklist. Widen only within the charter; if you find yourself somewhere else entirely, write it down as a new charter instead of drifting.

## Step 3 — do not fix while exploring

When you find a bug, **log it and keep going.** Do not stop to fix it.

Fixing mid-session ends the session: you lose the thread, you mix production changes into what was supposed to be an investigation, and you deliver one fix instead of the five bugs that were sitting next to each other. Note it, restore the state you need, and carry on until the box runs out.

The one exception is a bug that blocks further exploration — say so explicitly, make the smallest change that unblocks you, and note that the session was interrupted.

## Step 4 — report findings that someone can act on

Every finding needs all four, or it isn't a finding:

1. **Exact reproduction** — the command, input, or steps, copy-pasteable.
2. **What happened** — real output, quoted. Not a description of the output.
3. **What you expected instead**, and why — the rule you believe it breaks.
4. **How bad** — data loss, wrong answer silently, crash, ugly error message. Say which.

```
Finding: import silently drops rows whose first column is empty
Repro:   printf 'a,1\n,2\nc,3\n' > /tmp/t.csv && ./cli import /tmp/t.csv
Actual:  "imported 3 rows", but `select count(*)` returns 2. Exit code 0.
Expect:  either import 3 rows, or reject the file. Reporting 3 and storing 2 is the bug.
Severity: silent data loss — worse than a crash, because nobody finds out.
```

If something merely looks wrong and you can't reproduce it, report it as **unconfirmed** and say what you tried. Never present a predicted bug as an observed one.

## Step 5 — close the session honestly

Report **coverage, not a verdict.** Two lists, always:

- **Covered:** what you actually ran, with which heuristics.
- **Not covered:** what the charter implies but you didn't reach, and anything the box cut short.

"No issues found" on its own is not a result — it hides whether you tested hard or barely looked. And never claim a case you didn't run.

Then hand the confirmed findings back to `tdd`: each one becomes a failing test that reproduces it, *before* the fix. A bug found by exploration and fixed without a test will come back, and you'll have learned nothing from having found it.

## When NOT to explore

- **Nothing is green yet** → finish the `tdd` cycle first. Exploring a half-built feature finds bugs you already know about.
- **You know the exact case that's broken** → that's a failing test, not a session.
- **The unknown is "how does this library behave"** → that's a `spike`.
- **You were asked to implement something** → implement it. Do not go hunting in code the task never asked you to touch; the blast-radius rule from `simple-design` applies to testing too.

## Self-check

- [ ] I wrote a charter and a box before touching anything
- [ ] I ran the real software; nothing here came from reading the source
- [ ] I can name the heuristics I actually used
- [ ] I followed the surprises instead of finishing a checklist
- [ ] I logged findings instead of fixing them mid-session
- [ ] Every finding has repro steps and quoted real output
- [ ] Anything unreproduced is labelled unconfirmed
- [ ] I reported what I did *not* cover, not just a verdict
