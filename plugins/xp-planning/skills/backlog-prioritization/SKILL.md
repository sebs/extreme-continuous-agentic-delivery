---
name: backlog-prioritization
description: Rank a backlog by Priority = (Benefit+Penalty)/(Estimate+Risk) instead of by gut feel or recency, show the before/after when new information changes a score, and select a capacity-constrained, dependency-aware sprint from the ranking rather than picking whatever feels urgent. Use when asked to prioritize, rank, or reorder a backlog, plan a sprint or iteration from scored stories, or reprioritize after new information. Counters reordering a backlog by whichever story was mentioned most recently, and silently re-ranking without showing what changed or why.
---

# Backlog prioritization: rank by the numbers, show your work

**Counters:** reordering a backlog by recency or gut feel, and silently re-ranking without showing what moved or why.

A backlog ranked from memory drifts toward whatever was discussed last. `estimation` gives every story a Priority; this skill is about what to *do* with the ranking — build it, defend it when it changes, and turn it into a sprint without breaking dependencies.

Every story needs `estimation`'s four scores before it can be ranked here — score first, then order.

## Rank

```
Priority = (Benefit + Penalty) / (Estimate + Risk)
```

Sort the backlog descending by Priority and show it as a table. That table *is* the prioritization — don't also narrate a separate "gut feel" order next to it.

| Story | Benefit | Penalty | Estimate | Risk | Priority |
|---|---|---|---|---|---|

**Weighted priority**, when one dimension should count for more than the others (a team under deadline pressure might weight Penalty higher than Benefit):

```
Weighted Priority = (w1·Benefit + w2·Penalty) / (w3·Estimate + w4·Risk)
```

Default every weight to 1.5 — equal weights reduce this to plain Priority. Only change them on an explicit request to emphasize one dimension, say which weights changed and why, and don't quietly leave a non-default weighting in place for stories nobody asked to re-weight.

**Quick wins** — a useful lens, not a replacement ranking: filter to low Cost (Estimate+Risk below some threshold) and high Value, and call them out separately from the main ranking.

## Plan a sprint: capacity first, dependencies always

Given a capacity (as Cost — Estimate+Risk points the team can take on):

1. Rank backlog stories by (weighted) Priority, descending. Exclude anything already done or in progress.
2. Walk the ranked list. For each story, check whether every story it depends on is already done or already selected earlier in this walk.
   - Eligible and fits remaining capacity → select it, subtract its Cost from remaining capacity.
   - Blocked by a dependency that's itself a strong candidate → try pulling the dependency in first, if it fits. Note it as "pulled in by `<story>`."
   - Blocked by something outside this backlog, or doesn't fit → skip it and say why.
3. Stop at capacity or when nothing eligible remains.

Report the selection as a table (`# | Story | Priority | Cost | Cumulative | Pulled in by`), the total Value selected, the remaining capacity, and the first story that got cut — that last one is usually the most useful line in the report, because it's the actual trade-off the team is making.

Never silently drop a story for a dependency reason — a "why it's not in this sprint" table is part of the output, not an afterthought.

## Reprioritize: show the diff, don't just reorder

New information (a deadline moved, a dependency landed, an incident changed the cost of skipping something) can change a score. When it does:

1. State which story, which dimension(s), and why — in one sentence per change.
2. Recompute that story's Priority and its new rank.
3. Report before/after: `Story | Old Priority | Old Rank | New Priority | New Rank | Change`. Call out anything that moved more than a couple of positions.
4. Get confirmation before writing the new scores anywhere persistent. Reasoning about a change and applying it are different steps — don't merge them.

## What-if, before committing

To explore "what if we cut this story's estimate" or "what if we dropped this one" without touching real data: hold the backlog in memory, apply the hypothetical, recompute, and show the ranking diff exactly as in reprioritization above. Only write anything back — to a rewelo store, a file, wherever the scores live — on an explicit "apply this for real." Exploring and committing are two different asks; don't let one turn into the other by momentum.

## A backing store is optional, and opt in once

Same rule as `estimation`: work conversationally by default. If a [rewelo](https://github.com/sebs/rewelo) MCP server is connected and `backlog/config.json` hasn't recorded a choice yet, ask once whether to use it as the backlog store, and record the answer there. If it says `rewelo`, pull the ranking from its tools instead of recomputing from a hand-kept table, and back up to `backlog/snapshot.json` when asked. If it says `none`, or nothing is configured, everything above runs on whatever list of scored stories is in front of you.

## Self-check

- [ ] Every ranked story already has all four `estimation` scores
- [ ] The ranking is the table, not a separate gut-feel order next to it
- [ ] A sprint selection respects dependencies — nothing selected before what it depends on
- [ ] Reprioritizing shows old vs. new, not just the new order
- [ ] What-if exploration didn't write anything until told to apply it for real
- [ ] I asked about a backing store once, not every time
