---
description: Rank a scored backlog by Priority, or select a capacity-constrained sprint from it, showing the before/after on any change.
argument-hint: [backlog to rank, or a capacity to plan a sprint against]
---

Use the `backlog-prioritization` skill on:

$ARGUMENTS

- **Ranking:** sort every scored story by `Priority = (Benefit+Penalty)/(Estimate+Risk)` descending and show it as a table. If a non-default weighting applies, say which weights and why.
- **Sprint planning** (a capacity was given): walk the ranking, select stories whose dependencies are already satisfied and that fit remaining capacity, and report the selection, what got cut, and anything skipped for a dependency reason.
- **Reprioritizing** (new information changed a score): recompute and report old vs. new priority and rank for anything that changed — never just reorder silently.
- **What-if:** explore hypothetical changes in memory and show the ranking diff; don't write anything back until told to apply it for real.

If a rewelo MCP backlog store applies, follow the same one-time opt-in as `/estimate` before relying on it.
