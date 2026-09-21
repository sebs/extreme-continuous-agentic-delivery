# xp-with-claude

**A Claude Code plugin marketplace that makes Claude practice Extreme Programming.**

Four plugins, eight skills, five commands — each one aimed at a specific way a language model fails at XP, not at reciting the practice.

📦 **Catalog:** <https://sebs.github.io/extreme-continuous-agentic-delivery/>

```
/plugin marketplace add sebs/extreme-continuous-agentic-delivery
/plugin install xp-tdd@xp-with-claude
```

The repo is the distribution channel — Claude Code installs straight from it. The Pages site is the shop window, generated from `marketplace.json`, and isn't needed to install anything.

---

## The plugins

| Plugin | Skills | Command |
|---|---|---|
| **[`xp-tdd`](plugins/xp-tdd/)** *(flagship)* | `tdd`, `refactor-on-green`, `simple-design` | `/tdd <behavior>` |
| **[`xp-pairing`](plugins/xp-pairing/)** *(foundational)* | `pairing-stance`, `ping-pong` | `/pair [driver\|navigator\|ping-pong]` |
| **[`xp-planning`](plugins/xp-planning/)** | `story-slicing`, `spike` | `/story <feature>`, `/spike <question>` |
| **[`xp-integration`](plugins/xp-integration/)** | `keep-it-green` | `/integrate` |

Install only what you want. If you install one thing, make it `xp-tdd`; if you install two, add `xp-pairing`, because `pairing-stance` is the stance the rest rest on.

## Why this exists

Claude already knows what TDD, refactoring and YAGNI are. Reciting them at it changes nothing.

Where a language model fails is **patience and honesty**. It skips the failing-test step because it can already see the answer. It builds past what was asked. It "refactors" by rewriting. It reports green without running anything. And it agrees instead of pushing back.

So these skills don't teach XP. Each targets a concrete failure mode and names it on its first line:

1. **Predicts instead of runs** — trusts its own forecast over the actual test output.
2. **Scope creep** — touches adjacent files, adds error handling, flags and abstractions nobody asked for.
3. **Rewrites instead of refactors** — replaces whole modules instead of making small, reversible moves.
4. **Agreeable instead of honest** — won't say "wrong approach", "I'm stuck", or "that test actually failed".

## The values invert for an LLM

Kent Beck wrote XP's values to push *humans* against *human* nature. Several point the opposite direction for a model. Writing the skills as if Claude shares human failure modes would aim them wrong.

| XP value | Written to fix, in humans | What it must enforce for an LLM |
|---|---|---|
| **Communication** | talk more, document less — humans carry a tacit shared model | the tacit channel is *weak* across sessions. Make intent explicit in artifacts; state assumptions and plan out loud **before** coding. Silent assumption is the #1 comms failure. |
| **Simplicity** | stop gold-plating the design | same — plus **blast radius**: the smallest diff that satisfies the current test, and don't "improve" code you weren't asked to touch. |
| **Feedback** | shorten slow feedback loops | feedback is already instant; Claude just *reasons about* results instead of **running** them. **Run it, don't predict it.** |
| **Courage** | act despite fear — refactor, delete, persist | two invert. *Courage to delete* → **restraint** (no attachment, so don't casually rewrite). *Persistence* → **stop and say "I'm stuck"** instead of thrashing. And the missing one: **honest pushback**, the hardest thing for an agreeable model. |
| **Respect** | don't break your teammates' build | same — plus respect the **human's authority** over the codebase. No unrequested sweeps, no fait accompli. |

Courage isn't a peer practice here, it's the *stance* that lets the others work — which is why there's no `courage` skill. It's baked into `pairing-stance` as intellectual honesty, and the two rules that matter most (**run-don't-predict** and **never fake green**) are written directly into `tdd` and `keep-it-green` as well, so they hold even if you never install `xp-pairing`.

## Deliberately excluded

These are choices, not omissions:

- **Sustainable pace / the 40-hour week** — meaningless for a model. There is no fatigue to protect against.
- **On-site customer** — that role is *you*. It's a property of how you use the tool, not something a skill can enforce.
- **Coding-standards conformance** — too project-specific to generalise. It belongs in your repo's `CLAUDE.md` or linter config, where it can name your actual conventions.
- **Collective ownership** — survives only as "leave any code you touch better than you found it", folded into `simple-design` and deliberately bounded: one named refactoring, on green, in a file you already had to open. Not a repo-wide sweep.

## Repository layout

```
.claude-plugin/marketplace.json   the marketplace manifest (repo root only)
plugins/<name>/
  .claude-plugin/plugin.json      ONLY plugin.json lives in .claude-plugin/
  skills/<skill>/SKILL.md         components sit at the PLUGIN ROOT
  commands/<command>.md
  hooks/hooks.json.example        xp-integration only, opt-in (see its README)
  README.md
site/build.mjs                    reads marketplace.json -> index.html
.github/workflows/                validate manifests; build + deploy Pages
```

The most common reason a plugin silently fails to load is putting `skills/`, `commands/` or `hooks/` *inside* `.claude-plugin/`. Only `plugin.json` goes there.

## Developing

```bash
node site/build.mjs                 # build the catalog into site/dist
claude plugin validate .            # validate the marketplace manifest
claude plugin validate plugins/xp-tdd
```

Try it locally before pushing:

```bash
claude plugin marketplace add .
claude plugin install xp-tdd@xp-with-claude
```

Both are checked in CI ([`validate.yml`](.github/workflows/validate.yml)), and the Pages build additionally fails if a plugin in `marketplace.json` is missing from the generated catalog.

### Adding a plugin

Create `plugins/<name>/` with a `plugin.json` and your skills, then add one entry to `marketplace.json`. The catalog picks it up on the next build — there is no second list to update.

### Deployment

[`pages.yml`](.github/workflows/pages.yml) builds and deploys via the official Pages Actions on push to `main`. Enable it once under **Settings → Pages → Source → GitHub Actions**.

To publish from a `gh-pages` branch instead, replace the `upload-pages-artifact`/`deploy-pages` steps with a branch-publishing action pointed at `site/dist`, and set **Settings → Pages → Source** to *Deploy from a branch*.

### A note on `$schema`

The manifests deliberately carry no `$schema` key. The published JSON Schemas exist and are useful in an editor, but `claude plugin validate` in currently shipping versions rejects `$schema` as an unrecognised key — and validating clean matters more than editor autocomplete. For the same reason the marketplace's `version` and `description` sit under `metadata`, which both old and new Claude Code accept.

## License

[MIT](LICENSE) © Sebastian Schürmann
