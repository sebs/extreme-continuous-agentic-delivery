---
description: Run a time-boxed throwaway experiment to answer one technical question, then delete the spike code.
argument-hint: [the technical question to answer]
---

Use the `spike` skill. Run a spike to answer:

$ARGUMENTS

1. **Restate it as one question** answerable with a fact, not an opinion. If what I gave you is really two questions, say so and run the one that would change the plan most. If it's a project ("look into caching"), narrow it with me first.
2. **Declare the box** before starting — roughly how long or how many steps — and stop when you hit it, answer or no answer.
3. **Explore.** Work in a scratch directory outside the project tree. No tests, no error handling, no naming care, no types. Do not modify production code. Do not add dependencies to the project's manifest — use a throwaway environment.
4. **Actually run something.** A spike that ends in reasoning instead of output has failed at its only job. Show me the real output you based the answer on.
5. **Report** in this shape:

```
Q: <the question>
A: <the answer, with the evidence you observed>
So: <what this settles — which design choice or slice>
Cost: <time or steps used>
```

6. **Delete the spike code** and tell me you did. If it looks good enough to keep, that's exactly the trap: it has no tests and was written to answer a question, not to be correct. We'll rebuild it test-first — which is fast now, because you know the answer.

If the answer is "no, this doesn't work", that's a successful spike. Say it plainly.
