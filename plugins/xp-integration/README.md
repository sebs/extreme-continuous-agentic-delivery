# xp-integration

**Continuous-integration hygiene: small commits, full suite before every commit, never commit red.** Part of [`xp-with-claude`](../../README.md).

```
/plugin marketplace add sebs/extreme-continuous-agentic-delivery
/plugin install xp-integration@xp-with-claude
```

## What's in it

| Skill | Enforces | Counters |
|---|---|---|
| `keep-it-green` | Full suite run and read before every commit. Small commits, structure and behavior separated. Never commit red — a broken build is the highest-priority work. | Claiming green without running the suite; getting to green by disabling what was red |

**Command:** `/integrate` — runs the suite and the repo's checks, reviews the diff, and commits only on real green.

The two honesty rules are written into `keep-it-green` directly, not borrowed from `xp-pairing`, so they hold on their own: **run, don't predict** and **never fake green**.

---

## The optional hook

The mechanical form of run-don't-predict: a `PostToolUse` hook that runs your test suite after every `Write` or `Edit` and pushes the real failure output back at Claude, so red can't go unnoticed.

**It ships opt-in and is not enabled by installing this plugin.** The file sits at `hooks/hooks.json.example` — a path Claude Code does not auto-discover — because your test command isn't something this plugin can know, and a hook that runs the wrong command after every edit is worse than no hook at all.

### Enabling it

**1. Tell it your test command.** The hook is inert without this, by design:

```bash
export XP_TEST_COMMAND="pytest -q"        # or: npm test --silent, cargo test, go test ./..., make test
```

Put it in your shell profile, or in `.claude/settings.json` under `env`.

**2. Turn the hook on**, either way round:

*Plugin-local* — rename the example inside the installed plugin:

```bash
cd ~/.claude/plugins/cache/xp-with-claude/xp-integration/*/
cp hooks/hooks.json.example hooks/hooks.json
```

Simple, but a plugin update overwrites it.

*Project-local (recommended)* — copy the `hooks` block into your project's `.claude/settings.json`, pointing at the script with an absolute path. It survives plugin updates and stays scoped to the one repo where you want it.

Restart Claude Code either way.

### What it does

| Situation | Behavior |
|---|---|
| `XP_TEST_COMMAND` unset | Exits 0 silently. Nothing happens. |
| Tests pass | Exits 0 silently. No noise on green. |
| Tests fail | Exits 2 — the last 60 lines of real output go back to Claude, with the instruction to stop and fix rather than to reach green by weakening a test. |

### Before you turn it on

It runs your whole suite after **every** edit. On a suite that takes more than a few seconds that's painful, and the 120-second timeout will start biting. Use it where the suite is fast; use `/integrate` where it isn't.

### Turning it off

Unset `XP_TEST_COMMAND`, or remove the `hooks.json` / settings block you added.
