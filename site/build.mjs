#!/usr/bin/env node
// Generates the GitHub Pages catalog from the marketplace manifest.
//
// marketplace.json is the single source of truth: this script reads it, follows
// each plugin's source directory, and reports what is actually on disk. Adding a
// plugin to the manifest is the only step needed to make it appear in the shop
// window — there is no second list to keep in sync.
//
//   node site/build.mjs [outDir]        (default: site/dist)

import { readFileSync, readdirSync, writeFileSync, mkdirSync, copyFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const siteDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(siteDir, "..");
const outDir = resolve(process.argv[2] ?? join(siteDir, "dist"));

// --- tiny helpers -----------------------------------------------------------

const readJSON = (p) => JSON.parse(readFileSync(p, "utf8"));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const dirs = (p) => (existsSync(p) ? readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory()) : []);
const files = (p, ext) => (existsSync(p) ? readdirSync(p).filter((f) => f.endsWith(ext)) : []);

// Minimal YAML-frontmatter reader: enough for `key: value` scalars, which is all
// SKILL.md and command frontmatter uses here. No YAML dependency, by design.
function frontmatter(path) {
  const text = readFileSync(path, "utf8");
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(text);
  if (!m) return { data: {}, body: text };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (kv) data[kv[1]] = kv[2].replace(/^["'](.*)["']$/, "$1").trim();
  }
  return { data, body: m[2] };
}

// Each SKILL.md states the LLM failure mode it counters on a `**Counters:** ...`
// line. That line is the skill's purpose in the catalog.
const countersOf = (body) => (/^\*\*Counters:\*\*\s*(.+)$/m.exec(body)?.[1] ?? "").trim();

// --- read the manifests -----------------------------------------------------

const marketplace = readJSON(join(repoRoot, ".claude-plugin", "marketplace.json"));
const meta = marketplace.metadata ?? {};
const marketplaceName = marketplace.name;
const tagline = marketplace.description ?? meta.description ?? "";

const plugins = marketplace.plugins.map((entry) => {
  if (typeof entry.source !== "string") {
    // Remote sources have nothing on disk to inspect; list what the manifest says.
    return { entry, manifest: {}, skills: [], commands: [], hook: false, remote: true };
  }
  const root = resolve(repoRoot, entry.source);
  const manifestPath = join(root, ".claude-plugin", "plugin.json");
  const manifest = existsSync(manifestPath) ? readJSON(manifestPath) : {};

  const skills = dirs(join(root, "skills")).sort().map((name) => {
    const { data, body } = frontmatter(join(root, "skills", name, "SKILL.md"));
    return { name: data.name ?? name, description: data.description ?? "", counters: countersOf(body) };
  });

  const commands = files(join(root, "commands"), ".md").sort().map((file) => {
    const { data } = frontmatter(join(root, "commands", file));
    return { name: "/" + basename(file, ".md"), description: data.description ?? "", hint: data["argument-hint"] ?? "" };
  });

  // The hook ships as an .example so installing the plugin never enables it.
  const hook = existsSync(join(root, "hooks", "hooks.json.example"));
  return { entry, manifest, skills, commands, hook, remote: false };
});

// Derive the GitHub slug from the plugins' own repository field, so the install
// commands on the site cannot drift from the manifests either.
const repoUrl = process.env.SITE_REPO_URL ?? plugins.map((p) => p.manifest.repository).find(Boolean) ?? "";
const slug = /github\.com\/([^/]+\/[^/#?]+)/.exec(repoUrl)?.[1]?.replace(/\.git$/, "") ?? "<owner>/<repo>";

// --- render -----------------------------------------------------------------

const pluginCard = (p) => {
  const { entry, manifest, skills, commands, hook } = p;
  const name = entry.name;
  const version = entry.version ?? manifest.version ?? "";
  const category = entry.category ?? "";
  return `
      <article class="plugin" id="${esc(name)}">
        <header class="plugin-head">
          <h3><code>${esc(name)}</code></h3>
          <div class="badges">
            ${category ? `<span class="badge">${esc(category)}</span>` : ""}
            ${version ? `<span class="badge badge-quiet">v${esc(version)}</span>` : ""}
          </div>
        </header>
        <p class="plugin-desc">${esc(entry.description ?? manifest.description ?? "")}</p>

        ${skills.length ? `<h4>Skills</h4>
        <ul class="skills">
          ${skills.map((s) => `<li>
            <code class="skill-name">${esc(s.name)}</code>
            ${s.counters ? `<span class="counters">counters ${esc(s.counters)}</span>` : ""}
            <p class="skill-desc">${esc(s.description)}</p>
          </li>`).join("\n          ")}
        </ul>` : ""}

        ${commands.length ? `<h4>Commands</h4>
        <ul class="commands">
          ${commands.map((c) => `<li><code>${esc(c.name)}${c.hint ? " " + esc(c.hint) : ""}</code> <span>${esc(c.description)}</span></li>`).join("\n          ")}
        </ul>` : ""}

        ${hook ? `<h4>Hook</h4>
        <p class="hook-note">Ships an <strong>opt-in</strong> <code>PostToolUse</code> hook that runs your test suite after every edit. Not enabled by installing — see the plugin README.</p>` : ""}

        <h4>Install</h4>
        <pre class="install"><code>/plugin install ${esc(name)}@${esc(marketplaceName)}</code></pre>
      </article>`;
};

const totals = {
  plugins: plugins.length,
  skills: plugins.reduce((n, p) => n + p.skills.length, 0),
  commands: plugins.reduce((n, p) => n + p.commands.length, 0),
};

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(marketplaceName)}</title>
<meta name="description" content="${esc(tagline)}">
<link rel="stylesheet" href="./styles.css">
</head>
<body>
<main>
  <header class="hero">
    <p class="eyebrow">Claude Code plugin marketplace</p>
    <h1>${esc(marketplaceName)}</h1>
    <p class="tagline">${esc(tagline)}</p>
    <p class="stats">${totals.plugins} plugins · ${totals.skills} skills · ${totals.commands} commands</p>
  </header>

  <section class="install-block">
    <h2>Install</h2>
    <p>Add the marketplace once, then install whichever plugins you want. Installation reads this
       repository directly — this page is the shop window, not the install channel.</p>
    <pre><code>/plugin marketplace add ${esc(slug)}
/plugin install xp-tdd@${esc(marketplaceName)}</code></pre>
  </section>

  <section class="why">
    <h2>Why these exist</h2>
    <p>Claude already knows what TDD, refactoring and YAGNI are. Where a language model fails is
       <strong>patience and honesty</strong>: it skips the failing test because it can see the answer, it builds past
       what was asked, it &ldquo;refactors&rdquo; by rewriting, it reports green without running anything, and it agrees
       instead of pushing back.</p>
    <p>So these skills do not teach XP. Each one is aimed at a specific failure mode, and says which
       one on its first line.</p>
    <ul class="modes">
      <li><strong>Predicts instead of runs</strong> — trusts its own forecast over the actual output.</li>
      <li><strong>Scope creep</strong> — touches adjacent files, adds what nobody asked for.</li>
      <li><strong>Rewrites instead of refactors</strong> — replaces modules instead of making small, reversible moves.</li>
      <li><strong>Agreeable instead of honest</strong> — won&rsquo;t say &ldquo;wrong approach&rdquo;, &ldquo;I&rsquo;m stuck&rdquo;, or &ldquo;that test failed&rdquo;.</li>
    </ul>
  </section>

  <section class="catalog">
    <h2>Plugins</h2>
    ${plugins.map(pluginCard).join("\n")}
  </section>

  <footer>
    <p>Maintained by ${esc(marketplace.owner?.name ?? "")}${marketplace.owner?.url ? ` · <a href="${esc(marketplace.owner.url)}">GitHub</a>` : ""}
       · <a href="https://github.com/${esc(slug)}">source</a></p>
    <p class="generated">Generated from <code>.claude-plugin/marketplace.json</code>.</p>
  </footer>
</main>
</body>
</html>
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "index.html"), html);
for (const f of files(join(siteDir, "template"), "")) copyFileSync(join(siteDir, "template", f), join(outDir, f));
writeFileSync(join(outDir, ".nojekyll"), "");

console.log(`built ${join(outDir, "index.html")}`);
console.log(`  ${totals.plugins} plugins, ${totals.skills} skills, ${totals.commands} commands  (install slug: ${slug})`);
