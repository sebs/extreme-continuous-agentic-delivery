---
description: Run the full suite and the repo's checks, review the diff, and commit only on real green.
argument-hint: [optional commit message or scope]
---

Use the `keep-it-green` skill. Integrate the current work.

$ARGUMENTS

Work through this in order and show me real output at each step. **Stop at the first red** — do not continue to the next step, and do not commit.

1. **Show me the state**: `git status` and `git diff --stat`. Say what changed and why, in one or two lines.
2. **Run the full test suite** — the whole thing, not the file you touched, not a filtered selection. Paste the summary line. If the count is lower than you'd expect, say so.
3. **Run whatever else this repo gates on** — linter, type check, formatter, `make check`, the commands in the CI config. Match what CI actually runs; a green local run against a different command is not evidence.
4. **Review the staged diff yourself** for: debug prints, commented-out code, `.only` / skipped tests, secrets, stray files, and any change outside the task.
5. **Commit** only if everything above is genuinely green — one logical change, message saying what and why. If structure and behavior both changed, split them into two commits, structure first.
6. **Report** what you ran and what it said. Not "all good".

Forbidden, whatever the pressure:

- Committing on the strength of an expected result rather than one you read
- Skipping, deleting, weakening, or `.only`-ing a test to get green
- Narrowing the test run so the failure is out of scope, then calling it green
- `|| true`, `--no-verify`, `--force`, or editing CI config to stop a failing job
- Any destructive git operation without asking me first

If a test is failing and you think the test itself is wrong, say so with evidence and let me decide. Don't disable it.
