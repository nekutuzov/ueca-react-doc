---
name: ueca-doc-maintenance
description: >
  Maintain the UECA-React documentation site itself — the repository, not the UECA code inside it. Use
  this skill whenever the task is to upgrade `ueca-react` to a new version, refresh the agent skills,
  react to a release's changelog, add or reorder documentation articles, deploy to GitHub Pages, or
  verify the live site. Use it too before editing `README.md`, `CLAUDE.md`, `package.json`,
  `.gitignore` or `deploy.ps1`, and whenever a release note says something about packaging,
  installation, the shipped `docs/` folder or the skills. It carries the upgrade checklist, the places
  this project describes the same mechanism twice, and the traps that have actually cost time here —
  CRLF files, a shared dev port, a deploy that looks like a 404. For writing UECA components use
  `ueca-app-development`; for app structure use `ueca-app-architecture`. This skill is about keeping
  the project and its documentation true.
---

# Maintaining ueca-react-doc

This project renders the `ueca-react` package's own guide. That makes it unusually coupled to the
package: an upgrade can change the **content it serves**, the **paths it imports**, and the
**instructions it gives about itself** — three different kinds of breakage, only one of which the
compiler catches.

**Keep this file current.** It exists because the same class of mistake recurred. When a release
teaches you something new, or you get something wrong, add it here in the same turn.

---

## The rule that keeps being broken

> **Every mechanism this project uses is documented in two places: `README.md` for people and
> `CLAUDE.md` for agents. Change a mechanism and you must change both.**

This has gone wrong at least once, and it is the reason this skill exists. In the 3.0.3 upgrade the
skills install changed from a hand-rolled copy to `npx ueca-react-skills`. `CLAUDE.md` was rewritten
carefully; `README.md` was never opened, and went on describing the copy mechanism — the project
advertising a procedure the library had replaced.

The failure mode is specific and worth naming: **you update the file you happen to be reading.**
`CLAUDE.md` is loaded into context automatically, so it is the one in front of you. `README.md` is
not, so it rots silently. After any change to how the project is set up, built, installed or
deployed, grep both:

```bash
grep -rn "<the old mechanism>" README.md CLAUDE.md
```

Other things described twice, so each needs the same treatment: the npm scripts, the dev port and
base path, the path aliases, the docs-routing procedure, the deployment steps, the article count.

---

## Upgrading ueca-react

### 1. Snapshot before you install

The shipped guide is imported **by path** with Vite's `?raw`, so a moved or renamed article is a
build error, and a *new* article is silent — it simply never appears on the site. You cannot diff
what you did not record.

```bash
SP="$(mktemp -d)"
find node_modules/ueca-react/docs -type f | sed 's|node_modules/ueca-react/||' | sort > "$SP/docs-before.txt"
cp node_modules/ueca-react/docs/raw/index.md "$SP/index-before.md"
```

### 2. Install, then read the changelog properly

```bash
npm install ueca-react@<version>
sed -n '1,90p' node_modules/ueca-react/CHANGELOG.md
```

Read the **whole** entry, not the breaking-changes heading. 3.0.2 and 3.0.3 both declared "no API
changed" and both still required project work — a packaging change in one, a documentation
restructure in the other. Treat every bullet as a question: *does this project do that?*

### 3. Diff the shipped docs

```bash
diff "$SP/docs-before.txt" <(find node_modules/ueca-react/docs -type f | sed 's|node_modules/ueca-react/||' | sort)
diff "$SP/index-before.md" node_modules/ueca-react/docs/raw/index.md
grep -cE '^[0-9]+\. \[' node_modules/ueca-react/docs/raw/index.md   # article count
```

If articles changed, follow **Documentation Routing** in `CLAUDE.md` — six places, and missing the
sixth (`resolveDocPath`) leaves cross-links from other articles dead without any error.

History: 3.0.1 moved the guide from `docs/` to `docs/raw/original/` and added two articles (19 → 21).
3.0.2 and 3.0.3 changed nothing structural.

### 4. Check asset references in the markdown

Images in the guide resolve against `<base href="/ueca-react-doc/">`, which is why they live at the
root of `public/`. A release that adds a **relative** image needs that file copied into `public/`; an
absolute URL needs nothing.

```bash
grep -ohE '!\[[^]]*\]\([^)]+\)|<img[^>]+src="[^"]+"' node_modules/ueca-react/docs/raw/original/*.md \
  | sed -E 's/.*\(([^)]+)\).*/\1/; s/.*src="([^"]+)".*/\1/' | sort -u
```

3.0.3's rewritten Tracing guide added two screenshots as `raw.githubusercontent.com` URLs — remote,
so nothing was needed locally. Do not assume that next time.

### 5. Refresh the skills and prove it

```bash
npx ueca-react-skills
diff <(find node_modules/ueca-react/skills -type f -path '*ueca-app-*' | sed 's|node_modules/ueca-react/skills/||' | sort) \
     <(find .claude/skills -type f -path '*ueca-app-*' | sed 's|.claude/skills/||' | sort)
```

The command **replaces** each library skill directory. Our `postinstall` is
`npx ueca-react-skills --auto`; `ueca-react` itself ships no install hook. Verify rather than assume:
in 3.0.3 the old merging copy left the tree stale and missing two new files, and nothing reported it.

### 6. Sweep the project's own claims

Beyond the two-files rule above, check the things that quietly go stale:

- `CLAUDE.md` — the *Current Implementation Snapshot* heading names a version; the article count; any
  behaviour the release changed
- `README.md` — article count, setup commands, anything about skills
- `src/core/appLayout/appSideBar.tsx` — the version chip (`3.0`); only needs touching on a minor
- `package.json` — scripts, if the release changed how anything is invoked

### 7. Verify

```bash
npm run build && npm run lint
```

Then in a browser, against the **production build** (see *Dev port* below):

deep link to an article · all 21 sidebar entries · a cross-link between two articles · images ·
theme toggle · a tooltip (real hover, not a synthetic event) · a section link · Back/Forward ·
375px viewport.

---

## Traps that have actually cost time here

### CRLF — never `sed -i`

Most `src/**` files are **CRLF**; a few are LF. `core.autocrlf` is `false`. `sed -i` rewrites a CRLF
file as LF, so a two-line edit lands as a whole-file diff.

Patch with a Node script that detects the file's own terminator:

```js
const s = fs.readFileSync(f, 'utf8');
const eol = s.includes('\r\n') ? '\r\n' : '\n';
// join replacement lines with `eol`, never a bare '\n'
```

After any bulk edit, `git diff --stat` — a line count far above the size of the change means the
endings flipped. Repair by comparing against `git show HEAD:<file>`.

### Dev port 5001 is shared with demo2

`ueca-react-app-demo2` uses the same port. A server already on 5001 is probably **not this project**
— it will answer with `The server is configured with a public base URL of /ueca-react-app-demo2/`.
Check before trusting a page you loaded, and prefer verifying the production build on a free port:

```bash
npm run build && npx vite preview --port 4180
```

### The live deep-link 404 is correct

GitHub Pages has no SPA fallback. `deploy.ps1` writes `404.html` as a copy of `index.html`; Pages
serves it for unmatched paths and the app routes from `window.location`. So a deep link returns
**HTTP 404 carrying the app** — the status stays 404 while the page works, and every asset it then
loads is 200. Do not "fix" it. Confirm a real failure by checking the asset requests, not the
document status.

### A stale console 404 from an earlier navigation

The browser tool's console buffer survives navigation within a tab. A 404 reported there may be from
a page you visited earlier. Confirm against `read_network_requests`, or open a fresh tab.

### Struct section order is presentation

The runtime reads struct sections by name. The documented order
(`props → children → methods → events → messages →` hooks in run order `→ View`) is what an agent
copies, not a constraint. A struct that departs from it is untidy, never broken.

---

## Deploying

```bash
npm run deploy
```

Builds, clears `../ueca-react-doc-deploy` keeping `.git`, copies `dist`, writes `404.html`. That
folder is a **single-branch clone on `gh-pages`** — it has a `remote.origin.fetch` refspec for that
branch alone, so it has no `master` ref and nothing to go stale. Commit and push from it.

Before committing there, confirm the tree is the built site and nothing else:

```bash
git ls-files | grep -E '^(src|public|node_modules|\.claude)/' || echo "clean"
diff -q index.html 404.html
```

Pages takes a minute or two. Wait on the bundle name rather than guessing:

```bash
until curl -s -H 'Cache-Control: no-cache' \
  "https://nekutuzov.github.io/ueca-react-doc/index.html?cb=$(date +%s)" \
  | grep -q '<new bundle hash>'; do sleep 10; done
```

**If the build output hashes are unchanged, there is nothing to deploy** — say so instead of pushing
an empty commit.

---

## What is committed

`.gitignore` ignores everything in `.claude/skills/` **except this skill**:

```gitignore
.claude/skills/*
!.claude/skills/ueca-doc-maintenance/
```

The library skills come from the package and must never be committed — a fresh clone gets them from
`npm install`. Ignoring the folder wholesale, with one negation, means a skill a *future* release adds
cannot arrive untracked. This skill is ours, so it is tracked.
