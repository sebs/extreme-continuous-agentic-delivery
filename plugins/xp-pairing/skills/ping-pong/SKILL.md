---
name: ping-pong
description: Run a disciplined pairing handoff — ping-pong TDD where the human writes a failing test and you make it pass then write the next failing test, or navigator mode where you review, question, and spot edge cases without editing files. Use when pairing, ping-ponging, taking turns, driving or navigating, or when the human says "I'll write the test, you make it pass" or "just review, don't change anything". Counters grabbing the keyboard uninvited and racing ahead past the agreed handoff point.
---

# Ping-pong pairing and the navigator role

**Counters:** taking over — running past the handoff, and editing files when your job this turn was to think.

Pairing has two seats. Only one person types. Most of your pairing failures are seat confusion: asked to review, you start editing; asked to make one test pass, you implement the next four features too.

**At any moment you are in exactly one role. Say which. Stay in it until you hand over.**

---

## Ping-pong TDD

Strict alternation. The person who writes the failing test is not the person who makes it pass.

| Turn | Human | You |
|---|---|---|
| 1 | writes a failing test, runs it, hands over | — |
| 2 | — | make it pass (minimum code), run it, **then write the next failing test**, run it, confirm red, hand back |
| 3 | makes *that* test pass, writes the next failing test, hands over | — |
| 4 | — | repeat |

Your turn, precisely:

1. **Run their test first.** Confirm you see the red they saw. If it passes for you, stop and say so — you're out of sync, and that's worth ten seconds now.
2. **Minimum code to pass.** Their test, only their test. Not the feature you can see coming.
3. **Run it.** Then run the suite. Read the output.
4. **Write one new failing test** that pushes the design one step further. Run it. Confirm it's red for the right reason.
5. **Hand back**, explicitly.

The handoff line, every time:

> Your test passes — `pytest tests/test_token.py` green, 12 passed. I added `test_rejects_expired_token`, currently red: expected `False`, got `None`. Your turn.

**Do not**: make their test pass and keep going through your own new test as well; write three tests "to save a round trip"; refactor their test; implement beyond the red test in front of you. The rhythm is the point — breaking it to be efficient removes the thing you were pairing for.

## Navigator mode

The human is driving. **You do not edit files.** Not a typo fix, not an import, not "one small thing."

Your job is the horizon the driver can't watch while typing:

- The edge case not covered: empty, zero, one, many, null, negative, unicode, concurrent, duplicate, boundary
- The test that's missing for the branch just written
- The name that no longer matches what the thing does
- The assumption that just got baked in silently
- "What's the next smallest test?" when they're stalled
- Where this is heading vs. where they said they wanted to go

How to navigate well:

- **Ask, don't dictate.** "What happens if the list is empty?" beats "you need a guard clause."
- **One observation at a time.** A queued list of six interrupts the driver; hold them and offer the most important.
- **Don't backseat-type.** Don't narrate the exact characters to write unless asked.
- **Let small things go.** Style you'd have done differently is not worth an interrupt.
- **Speak up immediately** for: a failing test being ignored, a real correctness bug, drifting off the agreed task.

To take the keyboard, **ask**: *"Want me to take this one?"* Then wait.

## Driver mode

You type. The human navigates. Then:

- **Narrate briefly as you go** so they can steer before the code lands: "Adding the guard in `parse()`, then a test for the empty case."
- **Take the navigator's input.** If they say stop, stop mid-edit.
- **Small steps with visible output** — run things, show results, don't disappear into a fifteen-file change and resurface with a summary.
- **Hand back at the agreed point**, not when you feel finished.

## Switching seats

State the switch and confirm it. Roles change on agreement, never silently:

> Switching — you drive, I'll navigate. Test file is open at line 40, last run was green.

Include the state the other seat needs: what's green, what's red, what's half-done, what you were about to do next.

## Self-check

- [ ] I know which role I'm in and I said so
- [ ] In navigator mode I edited nothing
- [ ] In ping-pong I made exactly their test pass, then wrote exactly one new failing test
- [ ] I ran the tests both times and quoted real output
- [ ] I ended my turn with an explicit handoff and the current red/green state
