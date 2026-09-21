---
name: spike
description: Answer one technical unknown with a time-boxed throwaway experiment — write the question down, explore without tests or polish, record the answer, then delete the spike code. Use when you don't know enough to write a test, when evaluating whether a library or approach works, when investigating "is this even possible", or when an estimate is blocked by an unknown. Counters guessing at how an unfamiliar API behaves instead of finding out, and counters letting scrappy exploration code quietly become production code.
---

# Spike: buy one answer, throw away the code

**Counters:** predicting how something works instead of running it — and then keeping the throwaway code.

There are two honest reasons you can't write a failing test: you don't know what the answer should be, or you don't know how the thing behaves. Both are ignorance, and ignorance is fixable by *running something*. Guessing from training-data memory of an API is not.

A spike is the sanctioned escape hatch from test-first — **and its price is that the code dies.**

## Write the question down first

One question. Written before any code. Answerable with a fact, not an opinion.

Good: *"Does `httpx.AsyncClient` reuse the connection pool across `await` calls in different tasks?"* · *"Can DuckDB read this 4 GB parquet in under 2 s on this machine?"* · *"Does this library's webhook signature verification accept our header format?"*

Bad: *"Look into caching."* · *"Explore the auth options."* — those are projects, not questions. Narrow them until one experiment settles it.

If it turns out you need two answers, that's two spikes. Run the one that would change the plan most.

## Declare the box

State the limit up front and mean it: *"Spike, max ~20 minutes / 5 tool calls: does X do Y?"*

When the box runs out, **stop and report** — even with no answer. "Boxed out, here's what I learned and what I'd try next" is a legitimate result. Running over is how a spike turns into an unplanned project.

## Rules while spiking

- **Somewhere disposable.** A scratch directory outside the project tree, or a clearly named `spike/` you'll delete. Not in `src/`. Never in a file the project imports.
- **No tests, no error handling, no naming care, no types, no docs.** Polishing a spike is wasted work — it's going in the bin.
- **Don't touch production code.** If the spike needs a change to real code to run, you're doing an experiment on the system, not a spike; stop and discuss.
- **Don't install into the project.** Use a throwaway venv / temp node_modules / `uv run --with`, so the manifest isn't quietly mutated.
- **Actually run it.** A spike that ends in reasoning rather than output has failed at its only job. Read real output — a print, an exception, a timing number.

## End the spike properly

Three steps, in order. The third is the one you'll want to skip.

**1. Write the answer.** Short, concrete, quoting what you observed:

```
Q: Does httpx.AsyncClient share a connection pool across tasks?
A: Yes — one AsyncClient instance, 100 concurrent gets to localhost showed
   5 sockets open (ss -tn). A new client per call showed 100.
   So: build one client at startup, inject it. Closing it per-request kills reuse.
Cost: ~15 min.
```

**2. Decide what changes.** Which slice or design choice this settles, and what the next step is.

**3. Delete the spike code.** All of it. Even the bit you like.

**If it looks good enough to keep, that is precisely the trap.** Spike code has no tests, no error handling, and was written to answer a question, not to be correct. Keeping it means shipping untested code and losing the TDD cycle that would have designed it properly. **Reimplement it test-first** — it's fast now, because you know the answer. Say explicitly that you deleted it.

## After the spike

Go back to `tdd`. The spike removed the excuse: you now know enough to write the failing test.

If the answer was "no, this approach doesn't work," that is a *successful* spike. Report it plainly. A day saved is the whole point.

## When NOT to spike

- You know how to write the test but it's tedious → write the test.
- The unknown is a product question, not a technical one → ask the human.
- You want to "try an implementation and see if it works" → that's not a spike, that's skipping TDD.
- You've already spiked this and forgot the answer → reread the note.

## Self-check

- [ ] One written question, answerable with a fact
- [ ] A declared box, and I stopped at it
- [ ] Code lived somewhere disposable and touched no production file
- [ ] I ran something and read real output
- [ ] I wrote the answer down with the evidence
- [ ] **I deleted the spike code** and said so
- [ ] I returned to a failing test
