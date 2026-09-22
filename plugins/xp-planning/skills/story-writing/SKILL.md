---
name: story-writing
description: Turn a request into one well-formed story — "As a ⟨role⟩, I want ⟨capability⟩, so that ⟨benefit⟩" — by asking for whatever isn't stated instead of inventing it, then confirm it's actually one story before handing it off. Use when given a raw feature request, a one-line ask, a bug report, or "write me a story/ticket for X", before slicing, estimating or coding it. Counters silently inventing the role, the benefit, or the scope instead of asking, and writing a story that's really an implementation instruction ("add a caching layer") instead of an outcome.
---

# Story writing: ask for the parts you don't know

**Counters:** inventing the role, the benefit, or the boundaries of a request instead of asking — and writing implementation instructions dressed up as a story.

Given "add CSV export," you can write *"As a user, I want CSV export, so that I have the data."* Every clause is a guess: which user, why CSV specifically, what they actually do with it afterward. It parses as a story and tells nobody anything they didn't already know.

## The template

> **As a** ⟨role⟩, **I want** ⟨capability⟩, **so that** ⟨benefit⟩.

Three slots, and the rule is: **fill in only what you were told or what you asked for and got.** A slot you'd otherwise guess is a question, not a placeholder.

## Ask for what's missing

Walk the three slots in order; stop and ask the moment one isn't grounded in something the person actually said:

- **Role** — *"Who is this for?"* Not "the user" by default — a finance approver, an anonymous visitor, and an on-call engineer want different things from what sounds like the same feature. If the request already names a role, use it; don't relitigate it, but don't broaden it either ("users" when they said "admins").
- **Capability** — usually the easiest slot; it's most of what was asked. State it as an action, not a mechanism: "export the report" not "add a `/export` endpoint that streams CSV."
- **Benefit** — the one most often missing, and the one you cannot back into by rephrasing the capability. *"So that they have the data"* restates the capability; it isn't a benefit. Ask *"What do they do with it once they have it?"* or *"What happens today without this?"* until you get an answer that would survive the capability changing — if a different mechanism could deliver the same benefit, you've found the real one.

If the person answers with more scope than one story ("export, and also schedule it, and also email it") — that's several stories. Say so and take them one at a time; don't fold them into one sentence with three "and"s.

## Write it back, don't just accept it

State the filled-in template and get a yes before moving on:

```
As a finance approver, I want to export the filtered report as CSV,
so that I can reconcile it in the spreadsheet my auditor requires.

Right? Or did I put words in your mouth anywhere?
```

This is the checkpoint that catches a guessed benefit before it drives an estimate or a slice list built on the wrong reason.

## Big enough to be several stories

If capability plus benefit describes more than one walking skeleton — more than one thing someone could do that they couldn't before — don't force it into one sentence. Say which of `story-slicing`'s splitting patterns it wants (happy-path-first, workflow-steps, CRUD-split, ...) and slice it there. A story-writing session ends with one story per sentence, however many sentences that takes.

## What this is not

- Not acceptance criteria — that's `story-slicing`'s Given/When/Then, written once the story is right-sized.
- Not a size or a priority — that's `estimation`, and it needs the benefit slot filled in honestly, because a guessed benefit produces a guessed score.
- Not a request to fill in unstated *technical* detail — if the capability implies an API shape or a data format nobody specified, that's a question for the person or a `spike`, not a slot to invent.

**Next:** right-sized → `estimation` to score it. Too big → `story-slicing` to cut it first.

## Self-check

- [ ] Role is who was told or asked, not a default
- [ ] Capability is an outcome, not a mechanism
- [ ] Benefit would survive the capability changing — it isn't the capability restated
- [ ] I read the filled template back and got a confirmation, not a guess
- [ ] If it was really several stories, I said so instead of folding them together
