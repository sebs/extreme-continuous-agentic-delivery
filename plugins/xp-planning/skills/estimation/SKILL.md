---
name: estimation
description: Score a story on four separate Fibonacci-scale dimensions — Benefit, Penalty, Estimate, Risk — instead of collapsing value and effort into one gut-feel number, then compute Priority = (Benefit+Penalty)/(Estimate+Risk) so stories land on a comparable scale. Use when asked to estimate, size, score, or point a story or backlog item, or before ranking a backlog. Counters giving a single confident-sounding size without exposing what it trades off, and estimating alone instead of running the same four questions you'd ask a human.
---

# Estimation: four numbers, not one guess

**Counters:** collapsing value and effort into a single confident number, and estimating silently instead of running the questions live.

"This is an 8" answers a question nobody asked precisely: an 8 *what*? Big and risky? Big and safe? Small but the team really needs it? One number can't say. Four can.

## Score four dimensions, not one

Every story gets four scores, each on the Fibonacci scale **1, 2, 3, 5, 8, 13, 21** — the gaps widen on purpose, so a bigger number means "materially less certain," not "three more of the same units":

| Dimension | Question | 1 | 5 | 13 | 21 |
|---|---|---|---|---|---|
| **Benefit** | How valuable is this if built? | nice-to-have | clearly useful | critical | existential |
| **Penalty** | What happens if we don't build it? | nothing | inconvenience | significant loss | business failure |
| **Estimate** | How much effort does this take? | hours | days | weeks | months |
| **Risk** | How uncertain or complex is this? | well-understood | some unknowns | major unknowns | research project |

Run it as a short interview, one story at a time, out loud — don't fill the table in from your own judgment of the request:

1. *"How valuable is this if we build it?"* → Benefit
2. *"What happens if we don't?"* → Penalty
3. *"Roughly how much effort — hours, days, weeks, months?"* → Estimate
4. *"How well-understood is this — any unknowns?"* → Risk

If the person shrugs on a dimension, don't fill it from your own read of the request — that's the single-guessed-number failure again, just spread across four fields. Say what you'd default to and get a nod, or leave it open and move to the next story.

## Priority is derived, never scored directly

```
Value    = Benefit + Penalty
Cost     = Estimate + Risk
Priority = Value / Cost          (rounded to 2 decimals)
```

Example: Benefit 8, Penalty 5, Estimate 3, Risk 2 → Value 13, Cost 5, **Priority 2.60**.

Never ask "what's the priority?" as its own question — it falls out of the four honest scores. If a priority feels wrong, that's a signal one of the four inputs was scored wrong, not a reason to override the ratio by hand.

## When the numbers say "split this"

Flag a story as too big to estimate honestly the moment any of these hold:

- Estimate ≥ 8
- Risk ≥ 5
- Estimate + Risk ≥ 10

A high Estimate or Risk isn't a score to accept, it's a signal: hand it to `story-slicing`. Score the slices independently once they exist — a slice's Estimate and Risk should each come out lower than the parent's, and Benefit gets distributed across the slices rather than repeated on each one (value can be created by slicing; it isn't cloned by it).

## Relative weights, across a backlog

To see where a story sits relative to everything else, not just its own ratio:

```
Relative Benefit  = its Benefit  / sum of Benefits  across the set
Relative Penalty  = its Penalty  / sum of Penalties across the set
Relative Estimate = its Estimate / sum of Estimates across the set
Relative Risk     = its Risk     / sum of Risks     across the set
```

Scope "the set" to whatever's being compared — the whole backlog, or one tagged feature. A story that's 30% of the backlog's total Benefit but 5% of its total Estimate is worth saying out loud before it's buried at position 14.

## A backing store is optional, and opt in once

This works entirely in conversation — recompute the scores and the table fresh each session, the way `story-slicing` does. If a [rewelo](https://github.com/sebs/rewelo) MCP server is connected in this project, scores and priority can instead live in its backlog store and survive across sessions.

Don't assume either way. The first time this skill runs in a project:

- If no rewelo tools are available, proceed conversationally — nothing to configure.
- If rewelo tools *are* available and no choice is recorded yet, ask once: *"I can store these scores in the rewelo backlog so they persist across sessions, instead of recomputing them each time. Set that up?"* Record the answer in `backlog/config.json` (`{"store": "rewelo"}` or `{"store": "none"}`) so the question isn't asked again.
- If `backlog/config.json` says `rewelo`, score through its ticket tools (Fibonacci validation and the Priority/relative-weight math are enforced there identically to above) instead of hand-computing. When asked to back the data up, export rewelo's data to `backlog/snapshot.json` and commit it — that's the durable copy if the MCP server isn't available in a later session.

Either way, the four questions and the formulas above don't change — only where the numbers live.

## Self-check

- [ ] Four separate scores, each answered as its own question
- [ ] Every score came from the interview, not from my own read of the request
- [ ] Priority was computed, never asked for or guessed directly
- [ ] Estimate ≥ 8, Risk ≥ 5, or Estimate+Risk ≥ 10 → flagged for `story-slicing`, not scored and left
- [ ] If a backing store applies, I asked once and reused the recorded answer — I didn't ask every session
