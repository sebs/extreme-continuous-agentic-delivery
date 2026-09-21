---
name: keep-it-green
description: Keep main releasable — run the full test suite and read its output before every commit, commit small and often, never commit red, and fix a broken build before anything else. Use when committing, pushing, merging, rebasing, opening a PR, integrating a branch, or when CI is failing. Counters committing on the strength of a predicted test result and reaching green by skipping, weakening, or bypassing tests.
---

# Keep the build green

**Counters:** claiming green without running the suite, and getting to green by disabling the thing that was red.

Continuous integration is not a server. It's a habit: everyone's work meets on main, often, and main always works. The habit is cheap only if the build is green — every minute main is red, everybody's next integration is built on sand.

## Two rules that outrank everything else here

1. **Run, don't predict.** You may not commit, push, or report a suite as passing on the strength of expecting it to pass. Run the command, read the output, quote it. Your model of the test run is not the test run.
2. **Never fake green.** Green is: the full suite ran, the tests executed, exit code zero, you read it. Anything else is red wearing a costume.

## Before every commit

1. **Run the full suite** — not the file you touched, not `-k thename`. The whole thing. The point is the tests you didn't think about.
2. **Read the output.** Count. A suite that reports 40 passed when it reported 47 yesterday is a problem, not a pass.
3. **Run whatever the repo gates on**: linter, type check, formatter, `make check`, whatever the CI config runs. Match CI's commands — a green local run against a different command isn't evidence.
4. **Review your own diff** (`git diff --staged`). Look for: debug prints, commented-out code, a `.only`, a skipped test, secrets, stray files, changes outside the task (see `simple-design`).
5. **Then commit** — with a message saying what changed and why.

If any step is red, you do not commit. Fix it or report it.

## Never fake green — the specific moves

- Deleting, renaming away, or commenting out a failing test
- `skip` / `xfail` / `.only` / `.skip` / `#[ignore]` / `@Disabled` to route around red
- Weakening an assertion so the wrong answer passes
- Running a subset so the failure is out of scope, then calling it green
- `|| true`, `continue-on-error`, `-x` to hide later failures, retry-until-green
- `git commit --no-verify` / `--no-gpg-sign` to dodge hooks
- `git push --force` over someone else's work
- Editing CI config to stop running the failing job

If you believe a test is genuinely wrong or genuinely flaky: **say so, with evidence, and let the human decide.** Don't unilaterally disable it. If a skip is agreed, it gets a reason in the code and a note in the commit message — a silent skip is a lie with a long half-life.

## Small commits, often

- **One logical change per commit.** If the message needs "and," it's two commits.
- **Structural and behavioral changes go in separate commits**, structure first (see `refactor-on-green`). Never mixed — a reviewer can skim a pure rename and must read a logic change.
- **Commit at every green point.** Green is a save point; a green commit is always revertable, and reverting is a legitimate first move when something breaks.
- **Integrate to main frequently** — hours, not days. Long-lived branches turn into merge archaeology. Pull/rebase from main before you push so you integrate against what's actually there.
- **Push green work promptly.** Work sitting on your machine isn't integrated.

Destructive git operations — force push, history rewrite, branch deletion, hard reset over uncommitted work — get explicit confirmation first, every time.

## When the build is red, stop

**A red build is the highest-priority work in the repo.** Not after this feature. Now.

1. Stop feature work.
2. Find out *what* failed — read the actual output, don't guess from the job name.
3. Reproduce locally if you can.
4. Prefer **revert** over fix-forward when the cause is a recent commit. Reverting is not failure; it puts everyone back on green in a minute instead of an hour.
5. If the fix isn't quick and obvious, say so and hand back rather than piling commits onto a red build.
6. Never build new work on a red main. You'll be unable to tell your breakage from theirs.

## Reporting an integration

Say what ran and what it said. Not "all good."

> `pytest` — 47 passed, 0 failed, 2.1s. `ruff check .` — clean. `mypy src` — clean.
> Committed as `a3f91c2` "reject expired tokens". Pushed to `main`.

If something didn't run, say which and why. If something failed, that's the first line.

## Self-check

- [ ] I ran the full suite and read the output, just now
- [ ] I ran the same checks CI runs
- [ ] Nothing was skipped, weakened, or deleted to get green
- [ ] I reviewed my own staged diff
- [ ] The commit is one logical change, structure and behavior not mixed
- [ ] Every result I reported is quoted from output I saw
