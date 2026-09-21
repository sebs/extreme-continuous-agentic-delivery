---
description: Slice a feature into thin vertical stories with concrete acceptance tests, walking skeleton first.
argument-hint: [feature or story to slice]
---

Use the `story-slicing` skill. Slice this into thin vertical stories:

$ARGUMENTS

**Do not write any implementation code in this turn.** Output the slice list, then stop.

For each slice, give exactly:

```
Slice N: <one line of observable behavior>
  Acceptance: Given <state>, when <action>, then <observable result>
  Not in this slice: <what you are deliberately leaving out>
```

Rules:

- Every slice must be **vertical** — it goes through every layer it needs and actually runs. Reject your own slices that are layers ("set up the schema", "build the API", "project scaffolding", "add tests"). The test: when this slice is done, what can someone do that they couldn't before?
- **Slice 1 is a walking skeleton**: the thinnest end-to-end path that runs. It's allowed to be embarrassing — one hardcoded case, no persistence, no styling.
- Acceptance tests use **real values**, not "a user" and "it works". If you can't write one concretely, you don't understand the slice yet — ask me instead of writing vaguer wording.
- If a slice is blocked by a technical unknown, don't guess: call it out as a `spike` and say what question it would answer.
- Order the slices, and say which ones I could drop without losing the core.

Finish by asking whether to start slice 1. Then wait.
