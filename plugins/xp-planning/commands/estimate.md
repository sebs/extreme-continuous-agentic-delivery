---
description: Score a story on Benefit/Penalty/Estimate/Risk and compute its Priority, instead of giving one gut-feel size.
argument-hint: [story or backlog item to estimate]
---

Use the `estimation` skill on:

$ARGUMENTS

1. Ask the four questions one at a time — value if built, cost of not building it, effort, uncertainty — and score each on the Fibonacci scale (1, 2, 3, 5, 8, 13, 21). Don't fill any of them from your own read of the request.
2. Compute `Value = Benefit+Penalty`, `Cost = Estimate+Risk`, `Priority = Value/Cost` (2 decimals). Don't ask for or guess a priority directly.
3. If Estimate ≥ 8, Risk ≥ 5, or Estimate+Risk ≥ 10, say so and suggest `story-slicing` before finishing the estimate.
4. If a rewelo MCP backlog store is connected and no choice is recorded in `backlog/config.json`, ask once whether to use it, then record the answer — don't ask again this project.

Report the four scores and the derived Priority. Don't move on to prioritizing or building until this is confirmed.
