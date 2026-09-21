# Concept & Build Brief: `xp-with-claude`

**A Claude Code plugin marketplace that makes Claude practice Extreme Programming — packaged as plugins, distributed from a GitHub repo, and browsable via a GitHub Pages catalog.**

> This document is a brief for an implementing agent (Claude Code). Read it end to end before writing anything. It specifies *what* to build and *why the skills must be written the way they are* — the "why" matters more than the boilerplate, because a generic "do TDD" skill will be worthless. Section 7 and 8 are prescriptive about structure; sections 3–4 are prescriptive about intent. Where you must choose, preserve intent over convenience.

---

## 1. Deliverable

A single public GitHub repository that is simultaneously:

1. **A Claude Code plugin marketplace** — a `.claude-plugin/marketplace.json` at the repo root plus a `plugins/` directory containing several installable plugins, each bundling XP-discipline **skills** (and a few commands/hooks).
2. **A GitHub Pages storefront** — a static catalog site, *generated from `marketplace.json`* so it never drifts from the actual plugins, deployed to Pages via GitHub Actions.

The repo *is* the distribution channel (Claude Code installs directly from it). Pages is the human-facing shop window, not the install mechanism. Keep that distinction crisp — see §8.

---

## 2. The core idea (do not skip)

Extreme Programming is a set of **disciplines**, not code-generation tricks. Claude already *knows* what TDD, refactoring, and YAGNI are. Where an LLM fails is **patience and honesty**: it skips the failing-test step because it can "see" the answer, it builds past what was asked, it "refactors" by rewriting, it reports green without running anything, and it agrees instead of pushing back.

**So the job of these skills is not to teach XP. It is to hold the line on the slow, verifiable rhythm — against the LLM's specific failure modes.** Every SKILL.md you write must be aimed at a concrete failure mode, not at reciting the practice.

### 2.1 The values invert for an LLM — design around this

Kent Beck's XP values were written to push *humans* against *human* nature. Several of them point the **opposite** direction for an LLM. If you write the skills as if Claude shares human failure modes, you will aim them wrong.

| XP value | Written to fix (in humans) | For an LLM it must instead enforce |
|---|---|---|
| **Communication** | talk more, document less (humans carry a tacit shared model between sessions) | the tacit channel is *weak* across sessions → make intent **explicit in artifacts**; state assumptions & plan **out loud before coding** and get agreement. Silent assumption is the #1 LLM comms failure. |
| **Simplicity** | stop gold-plating the design | same, plus **blast-radius discipline**: smallest diff that satisfies the current test; don't "improve" code you weren't asked to touch. |
| **Feedback** | shorten slow feedback loops | Claude gets feedback instantly but **reasons about** results instead of **running** them. Hard rule: **run it, don't predict it.** Real execution over simulated execution, always. |
| **Courage** | act despite fear — refactor, delete, persist | two invert: *courage to delete* → **restraint** (no attachment, so don't casually rewrite); *persistence* → **stop and say "I'm stuck"** instead of thrashing. And the missing one: **honest pushback** — disagree with a bad design, admit a test failed, say "I don't know." This is the courage hardest for an agreeable model. |
| **Respect** | don't break your teammates' build | same, plus respect the **human's authority** over the codebase: no unrequested sweeping changes; keep the human in control, no fait accompli. |

**Consequence for design:** courage is not a peer practice, it's the *stance* that lets the others work. Do **not** make "courage" its own skill. Instead bake it — as **intellectual honesty** (run-don't-predict, real-green-only, admit-stuck, honest-pushback) — into a foundational *pairing-stance* skill, and thread the two most critical honesty rules (**run-don't-predict**, **never fake green**) directly into the TDD and integration skills so they hold even if the stance skill isn't installed.

### 2.2 The four LLM failure modes every skill targets

1. **Predicts instead of runs** — trusts its own forecast over the actual test/build output.
2. **Scope creep / gold-plating** — touches adjacent files, adds unrequested error handling, config flags, abstractions.
3. **Rewrites instead of refactors** — replaces whole modules rather than making small, safe, reversible moves.
4. **Agreeable instead of honest** — won't say "wrong approach," "I'm stuck," or "that test actually failed."

---

## 3. Skill inventory

Write each as a `SKILL.md` with YAML frontmatter (`name`, `description`) and a tight body. Descriptions must be **trigger-rich** (they are what makes Claude auto-invoke the skill) and each body must name the failure mode it counters. Keep bodies lean — a page or two, imperative, checklist-shaped. Prose that lists steps beats paragraphs of theory.

| Skill | Enforces | Counters |
|---|---|---|
| `tdd` | red → green → refactor, **one** failing test at a time, run-and-confirm-it-fails, minimum code to pass, loop. Embeds run-don't-predict + never-fake-green. | 1, 2 |
| `refactor-on-green` | only refactor when green; one *named* refactoring at a time; run tests after each micro-step; never mix a refactor with a behavior change. | 3 |
| `simple-design` | Beck's four rules (passes tests / reveals intent / no duplication / fewest elements) **plus blast-radius**: smallest diff, don't touch what you weren't asked to. YAGNI critique over a diff. | 2 |
| `pairing-stance` *(foundational)* | intellectual honesty: run-don't-predict, real-green-only, admit-stuck-don't-thrash, honest pushback, surface assumptions before coding, keep the human deciding. | 1, 4 |
| `ping-pong` | pairing handoff: alternating (human writes failing test → Claude passes + writes next failing test) or navigator role (review/edge-cases, don't grab the keyboard unasked). | 4 |
| `story-slicing` | turn a feature into thin **vertical** slices, each with a concrete acceptance test; INVEST; walking-skeleton-first ordering. Feeds well-shaped work into the TDD loop. | 2 |
| `spike` | time-boxed throwaway exploration to answer one technical question; explicitly disposable; held to no production standard; ends by capturing the learning and **deleting** the spike. The escape hatch for "I don't know enough to test yet." | 1 |
| `keep-it-green` | CI hygiene: small commits, full suite before every commit, never commit red, integrate to main frequently, "if the build breaks, stop and fix that first." Embeds never-fake-green. | 1, 4 |

**Deliberately excluded** (state this in the repo README so it reads as a choice, not an omission): sustainable pace / 40-hour week (meaningless for an LLM), on-site customer (that role is the human user), coding-standards conformance (too project-specific — belongs in a per-repo config, not a general skill). Collective ownership survives only as "leave any code you touch better than you found it," which folds into `simple-design`.

---

## 4. Plugin packaging

Group the skills into **four independently useful plugins** in one marketplace, so a user can install just the parts they want. Add a slash command per plugin as an explicit on-ramp, and one optional hook.

- **`xp-tdd`** *(flagship)* — skills: `tdd`, `refactor-on-green`, `simple-design`. Command: `/tdd <behavior>` starts a red-green-refactor loop for one behavior.
- **`xp-pairing`** — skills: `pairing-stance`, `ping-pong`. Command: `/pair [driver|navigator]` sets the pairing mode. Recommend (in its README) installing this alongside any other XP plugin, since `pairing-stance` is foundational.
- **`xp-planning`** — skills: `story-slicing`, `spike`. Commands: `/story <feature>`, `/spike <question>`.
- **`xp-integration`** — skill: `keep-it-green`. Command: `/integrate`. **Optional hook** (see §7.4): a `PostToolUse` hook that runs the project's test command after edits and surfaces red immediately — the mechanical embodiment of run-don't-predict. Ship it **disabled or opt-in**; a noisy hook is worse than none, and you can't know the user's test command. Do not invent hook JSON from memory — verify the hooks schema against the live docs first (§9).

Because Claude Code plugins can't declare cross-plugin dependencies, the two most critical honesty rules (**run-don't-predict**, **never fake green**) must be written *into* `tdd` and `keep-it-green` directly, not left solely in `pairing-stance`.

---

## 5. Verify before you generate

The plugin and marketplace formats evolve (recent Claude Code versions changed frontmatter and added marketplace fields). **Before writing any manifest, fetch and confirm the current schema** against:

- Plugins reference: `https://code.claude.com/docs/en/plugins-reference`
- Plugin marketplaces guide (linked from the Claude Code docs map): `https://docs.anthropic.com/en/docs/claude-code/claude_code_docs_map.md`
- A real, working example to pattern-match: `anthropics/claude-code` → `.claude-plugin/marketplace.json` and `plugins/*/`.

The shapes in §7 are correct as of this brief but treat the live docs as authoritative if they differ.

---

## 6. Repository structure

```
xp-with-claude/                     # repo root
├── .claude-plugin/
│   └── marketplace.json            # THE marketplace manifest (repo root only)
├── plugins/
│   ├── xp-tdd/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json          # ONLY plugin.json goes in .claude-plugin/
│   │   ├── commands/
│   │   │   └── tdd.md
│   │   ├── skills/                  # components live at PLUGIN ROOT, not under .claude-plugin/
│   │   │   ├── tdd/SKILL.md
│   │   │   ├── refactor-on-green/SKILL.md
│   │   │   └── simple-design/SKILL.md
│   │   └── README.md
│   ├── xp-pairing/
│   │   ├── .claude-plugin/plugin.json
│   │   ├── commands/pair.md
│   │   ├── skills/pairing-stance/SKILL.md
│   │   ├── skills/ping-pong/SKILL.md
│   │   └── README.md
│   ├── xp-planning/
│   │   ├── .claude-plugin/plugin.json
│   │   ├── commands/{story.md,spike.md}
│   │   ├── skills/story-slicing/SKILL.md
│   │   ├── skills/spike/SKILL.md
│   │   └── README.md
│   └── xp-integration/
│       ├── .claude-plugin/plugin.json
│       ├── commands/integrate.md
│       ├── hooks/hooks.json          # optional, opt-in
│       ├── skills/keep-it-green/SKILL.md
│       └── README.md
├── site/                            # GitHub Pages source (generated + template)
│   ├── build.mjs                    # reads ../.claude-plugin/marketplace.json → index.html
│   └── template/                    # static assets/styles the build copies through
├── .github/workflows/pages.yml      # build the catalog + deploy to Pages
├── README.md                        # what this is, install instructions, excluded-practices note
└── LICENSE
```

**Hard rule** (the most common reason plugins silently fail to load): only `plugin.json` goes inside `.claude-plugin/`. Every component directory (`skills/`, `commands/`, `agents/`, `hooks/`) must sit at the **plugin root**. Use `${CLAUDE_PLUGIN_ROOT}` for any path references inside commands/hooks so they stay portable.

---

## 7. Manifests

### 7.1 `marketplace.json` (repo root `.claude-plugin/marketplace.json`)

Required: `name` (kebab-case), `owner`, `plugins`. Each plugin entry needs `name`, `source`, `description`; `category` and `version` recommended.

```json
{
  "$schema": "https://json.schemastore.org/claude-code-marketplace.json",
  "name": "xp-with-claude",
  "version": "1.0.0",
  "description": "Extreme Programming disciplines for Claude Code — TDD, pairing, simple design, planning, and continuous integration, written to hold the line against an LLM's specific failure modes.",
  "owner": { "name": "<YOUR NAME>", "email": "<YOUR EMAIL>" },
  "plugins": [
    { "name": "xp-tdd",         "source": "./plugins/xp-tdd",         "description": "Red-green-refactor as an enforced loop: one failing test at a time, minimum code to pass, run-don't-predict.", "category": "workflow", "version": "1.0.0" },
    { "name": "xp-pairing",     "source": "./plugins/xp-pairing",     "description": "The pairing stance — intellectual honesty and ping-pong handoff. Foundational; pairs well with every other plugin.", "category": "workflow", "version": "1.0.0" },
    { "name": "xp-planning",    "source": "./plugins/xp-planning",    "description": "Thin vertical story slicing and time-boxed spikes — well-shaped work before the TDD loop.", "category": "workflow", "version": "1.0.0" },
    { "name": "xp-integration", "source": "./plugins/xp-integration", "description": "Continuous-integration hygiene: small commits, full suite before every commit, never commit red.", "category": "workflow", "version": "1.0.0" }
  ]
}
```

### 7.2 `plugin.json` (each plugin's `.claude-plugin/plugin.json`)

Only `name` is strictly required; include the rest for a real listing. Semantic version.

```json
{
  "name": "xp-tdd",
  "version": "1.0.0",
  "description": "Red-green-refactor as an enforced loop.",
  "author": { "name": "<YOUR NAME>", "email": "<YOUR EMAIL>" },
  "homepage": "https://<user>.github.io/xp-with-claude/",
  "repository": "https://github.com/<user>/xp-with-claude",
  "license": "MIT",
  "keywords": ["xp", "tdd", "testing", "refactoring", "workflow"]
}
```

### 7.3 Skills & commands

Skill frontmatter: `name` (matches directory), `description` (trigger-rich — this is the auto-invocation signal). Body: lean, imperative, checklist-shaped, names its target failure mode. Command frontmatter: `description` and (optionally) `argument-hint`; body is the prompt template.

### 7.4 Hook (optional, `xp-integration` only)

A `PostToolUse` hook that runs the project's test command after `Edit`/`Write` and reports failures. Ship it **opt-in** (documented in the README, not on by default) because the test command is project-specific. **Do not hand-write the hook JSON from memory — confirm the current hooks schema against the live docs first.**

---

## 8. GitHub Pages catalog

Two channels, do not conflate them:

- **Install channel = the git repo.** Users run `/plugin marketplace add <user>/xp-with-claude`, then `/plugin install xp-tdd@xp-with-claude`. Claude Code reads `.claude-plugin/marketplace.json` from the repo. **Pages is not required for installation.**
- **Storefront = GitHub Pages.** A static site at `https://<user>.github.io/xp-with-claude/` that lists plugins, categories, per-plugin skill/command detail, and copy-paste install commands.

**Single source of truth:** the site is *generated from `marketplace.json`* (and each `plugin.json`), so adding a plugin to the manifest automatically updates the shop window. `site/build.mjs` reads the manifests and emits `index.html` (+ per-plugin sections/pages) into the Pages output; keep it dependency-light (plain Node, no framework needed). Show, per plugin: name, description, category, the skills it bundles (with their one-line "counters failure mode X" purpose), commands, and the exact install command.

**Deployment:** `.github/workflows/pages.yml` runs the build and deploys via the official Pages Actions (`actions/upload-pages-artifact` + `actions/deploy-pages`) on push to the default branch. If the user specifically wants a `gh-pages` **branch**, target that branch instead — support either, but default to Actions-to-Pages and document how to switch. Enable Pages in repo settings as part of the setup notes.

---

## 9. Build order

1. Repo skeleton, `LICENSE` (MIT unless told otherwise), root `README.md` stub.
2. **`xp-tdd` first, complete** — its three skills, `/tdd` command, `plugin.json`, `README.md`. This is the reference plugin; get its quality high before cloning the pattern.
3. `xp-pairing`, `xp-planning`, `xp-integration` (hook opt-in).
4. Root `marketplace.json` wiring all four.
5. **Validate**: run `claude plugin validate .claude-plugin/marketplace.json` (and per-plugin validation if available); fix until zero errors.
6. **Smoke test loading**: `/plugin marketplace add ./` locally, `/plugin install xp-tdd@xp-with-claude`, confirm the skills and `/tdd` appear.
7. `site/build.mjs` + template; run it; confirm generated `index.html` matches the manifest.
8. `pages.yml`; push; confirm the site deploys and the install commands on it are correct.
9. Fill in root `README.md`: what this is, the values-inversion rationale (short), install instructions, the excluded-practices note, and a link to the storefront.

---

## 10. Acceptance criteria

- Every manifest validates with zero errors against the current schema.
- `/plugin marketplace add <repo>` + `/plugin install xp-tdd@xp-with-claude` succeeds; the `tdd`, `refactor-on-green`, `simple-design` skills and `/tdd` command are present and invocable.
- Each skill's `description` is specific enough to auto-trigger on the right situation and names the failure mode it counters; no skill is generic XP recitation.
- `run-don't-predict` and `never fake green` appear as explicit rules inside `tdd` **and** `keep-it-green`, not only in `pairing-stance`.
- The Pages site is generated from `marketplace.json` (verify by adding a dummy plugin entry → rebuild → it appears → remove it), deploys green, and shows correct install commands.
- Root README states the excluded practices as deliberate choices.

---

## 11. Notes to the implementer

- **Intent over boilerplate.** The manifests are trivial; the skills are the product. Spend your effort on prose that changes behavior. A `tdd` skill that doesn't stop Claude from writing the implementation first has failed, however clean its frontmatter.
- **Don't over-engineer.** No framework for the site, no elaborate hook system, no speculative config. `simple-design` applies to *this repo too* — smallest thing that works.
- **Write the skills as if Claude has never been patient.** Assume the reader (a future Claude) will want to skip the failing test, widen the scope, rewrite instead of refactor, and report green without running. Every rule should make that harder.
- **Verify schemas live** (§5) before generating manifests or hook JSON; prefer the current official docs to this brief where they conflict.
