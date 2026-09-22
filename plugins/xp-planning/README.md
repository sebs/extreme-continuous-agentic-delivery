# xp-planning

**Thin vertical slices, time-boxed spikes, and a scored, ranked backlog — well-shaped, well-ordered work before the TDD loop.** Part of [`xp-with-claude`](../../README.md).

```
/plugin marketplace add sebs/extreme-continuous-agentic-delivery
/plugin install xp-planning@xp-with-claude
```

## What's in it

| Skill | Enforces | Counters |
|---|---|---|
| `story-writing` | The "As a / I want / so that" template filled in only from what was said or asked for, read back for confirmation. | Inventing the role, the benefit, or the scope instead of asking; writing implementation instructions as a story |
| `story-slicing` | Vertical slices with concrete Given/When/Then acceptance tests, INVEST, walking-skeleton-first ordering, and an explicit "not in this slice" line. | Starting to build a whole feature; building layers that deliver nothing observable |
| `estimation` | Four separate Fibonacci scores — Benefit, Penalty, Estimate, Risk — with Priority derived, never guessed directly. | Collapsing value and effort into one gut-feel number; estimating silently instead of asking |
| `backlog-prioritization` | Ranking by Priority, dependency-aware capacity-constrained sprint selection, and a before/after diff on every reprioritization. | Reordering a backlog by recency or gut feel; re-ranking without showing what changed |
| `spike` | One written question, a declared box, throwaway code, the answer recorded — and the spike **deleted**. | Guessing how an unfamiliar API behaves; letting scrappy exploration become production code |

**Commands:** `/write-story <request>` · `/story <feature>` · `/estimate <story>` · `/prioritize <backlog or capacity>` · `/spike <question>`

## Why these come before TDD

Given "add user authentication," Claude starts writing files. Ninety minutes later there's a schema, a middleware, a token service and a config module — and nothing anyone can run. That optimises for feeling productive over being steerable.

`story-writing` stops the drift one step earlier than that: a request isn't a story until its role, capability and benefit came from the person, not from a plausible guess. `story-slicing` then forces the question *when this slice is done, what can someone do that they couldn't before?* If the answer is "nothing yet, but later…", it's a layer, not a slice. The output is a slice list with real values in the acceptance tests — and those acceptance tests become the outermost red of the `tdd` loop.

## Why estimation and prioritization are separate from slicing

Slicing decides what a story *is*. `estimation` and `backlog-prioritization` decide how big it is and what order it comes in — different questions, and collapsing them tends to produce a single confident-sounding number that hides what it traded off. `estimation` scores Benefit, Penalty, Estimate and Risk independently (the same four questions a stakeholder interview would ask) and derives `Priority = (Benefit+Penalty)/(Estimate+Risk)`. `backlog-prioritization` takes those scores and does the things a ranked backlog is actually for: ordering it, picking a capacity-constrained sprint without breaking dependencies, and showing a before/after diff whenever new information changes a score instead of silently reshuffling.

Both skills work by conversation alone, recomputing the numbers fresh each session — same as `story-slicing`. If a [rewelo](https://github.com/sebs/rewelo) MCP server is connected in the project, they can instead keep scores in its backlog store so they persist across sessions; that's opt-in, asked once, and the answer is recorded in `backlog/config.json` so the question doesn't come back every session. Either way the formulas are identical — only where the numbers live changes.

## Why `spike` exists

There are two honest reasons you can't write a failing test: you don't know what the answer should be, or you don't know how the thing behaves. Both are ignorance, and ignorance is fixable by *running something* — not by recalling an API from training data.

A spike is the sanctioned escape hatch from test-first, **and its price is that the code dies.** The skill is blunt about the trap: if the spike code looks good enough to keep, that is exactly when to delete it. It has no tests and was written to answer a question, not to be correct.
