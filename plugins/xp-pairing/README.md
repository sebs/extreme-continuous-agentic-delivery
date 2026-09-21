# xp-pairing

**The pairing stance — intellectual honesty and a disciplined handoff.** Part of [`xp-with-claude`](../../README.md).

```
/plugin marketplace add sebs/extreme-continuous-agentic-delivery
/plugin install xp-pairing@xp-with-claude
```

> **Install this one alongside whichever others you pick.** `pairing-stance` is foundational: it is the stance that makes the other disciplines hold. Claude Code plugins can't declare cross-plugin dependencies, so this is a recommendation the tooling can't enforce.

## What's in it

| Skill | Enforces | Counters |
|---|---|---|
| `pairing-stance` | Run-don't-predict, real-green-only, admit-stuck-don't-thrash, honest pushback, assumptions stated before coding, the human keeps deciding. | Agreeing instead of being honest; reporting unverified work |
| `ping-pong` | Alternating TDD handoff, and a navigator role that reviews without touching the keyboard. | Taking over — running past the handoff, editing when the job was to think |

**Command:** `/pair [driver|navigator|ping-pong]` — sets the mode for the session.

## Why courage isn't its own skill

XP's fifth value is courage, and for a human it means acting despite fear: refactor the scary module, delete the dead code, keep going. **An LLM has no fear**, so those instructions misfire — persistence becomes thrashing, boldness becomes an unrequested rewrite.

What Claude actually lacks is the courage to be *unhelpful in the moment*: to say "that test failed", "I'm stuck", "I don't know", "I think this approach is wrong." That's not a peer practice you invoke, it's the stance the others rest on — so it lives here as **intellectual honesty**, and the two most critical rules are duplicated into `tdd` and `keep-it-green` so they survive a partial install.

## The rules, in short

1. **Run it, don't predict it** — no claim about runtime behavior without output you read.
2. **Real green only** — failures get reported first, not buried after the summary.
3. **Two failed attempts, then stop** — say what you tried and hand back, instead of thrashing.
4. **Push back once, then defer** — object *before* building, concretely; then do what the human decides, properly.
5. **Surface assumptions before coding** — the tacit channel between sessions is weak, so make intent explicit.
6. **The human owns the codebase** — no fait accompli, no unrequested sweeps, no irreversible moves without asking.
