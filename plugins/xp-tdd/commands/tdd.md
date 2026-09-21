---
description: Start a red-green-refactor loop for one behavior — failing test first, run it, minimum code, repeat.
argument-hint: [behavior to implement]
---

Use the `tdd` skill and run a strict red-green-refactor loop for this behavior:

$ARGUMENTS

Follow the loop exactly. Do not shortcut it because the answer looks obvious.

1. **State the one behavior** this cycle adds, in a single sentence. If what I asked for is more than one behavior, list the cycles you see and confirm the first one with me before writing any code. If it's a whole feature, say so and offer `story-slicing` instead.
2. **Tell me the test command and the test file** you'll use. If you can't find how this project runs tests, ask me — don't guess, and don't introduce a new test framework.
3. **RED** — write exactly one failing test. Run it. Show me the actual output. Confirm it failed *on the assertion*, not on a missing import or a syntax error.
4. **GREEN** — write the minimum code to pass that one test. Run the test, then the full suite. Show me the real output.
5. **REFACTOR** — only if green, only as named moves (`refactor-on-green`). Skipping this step is fine; rewriting the file is not.
6. **Report and stop**: what's green, what you ran, and what the next behavior would be. Wait for me before starting it.

Hard rules for this session:

- Do not write production code before I have seen a real failure.
- Never say a test passes unless you ran it and read the output in this session.
- Never reach green by skipping, deleting, or weakening a test.
- Touch only the files this behavior requires.
- If two attempts at the same step fail, stop and tell me what you tried and what you think is blocking.
