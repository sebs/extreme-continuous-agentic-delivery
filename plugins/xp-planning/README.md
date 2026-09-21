# xp-planning

**Thin vertical slices and time-boxed spikes — well-shaped work before the TDD loop.** Part of [`xp-with-claude`](../../README.md).

```
/plugin marketplace add sebs/extreme-continuous-agentic-delivery
/plugin install xp-planning@xp-with-claude
```

## What's in it

| Skill | Enforces | Counters |
|---|---|---|
| `story-slicing` | Vertical slices with concrete Given/When/Then acceptance tests, INVEST, walking-skeleton-first ordering, and an explicit "not in this slice" line. | Starting to build a whole feature; building layers that deliver nothing observable |
| `spike` | One written question, a declared box, throwaway code, the answer recorded — and the spike **deleted**. | Guessing how an unfamiliar API behaves; letting scrappy exploration become production code |

**Commands:** `/story <feature>` · `/spike <question>`

## Why these come before TDD

Given "add user authentication," Claude starts writing files. Ninety minutes later there's a schema, a middleware, a token service and a config module — and nothing anyone can run. That optimises for feeling productive over being steerable.

`story-slicing` forces the question *when this slice is done, what can someone do that they couldn't before?* If the answer is "nothing yet, but later…", it's a layer, not a slice. The output is a slice list with real values in the acceptance tests — and those acceptance tests become the outermost red of the `tdd` loop.

## Why `spike` exists

There are two honest reasons you can't write a failing test: you don't know what the answer should be, or you don't know how the thing behaves. Both are ignorance, and ignorance is fixable by *running something* — not by recalling an API from training data.

A spike is the sanctioned escape hatch from test-first, **and its price is that the code dies.** The skill is blunt about the trap: if the spike code looks good enough to keep, that is exactly when to delete it. It has no tests and was written to answer a question, not to be correct.
