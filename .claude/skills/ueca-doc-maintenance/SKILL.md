---
name: ueca-doc-maintenance
description: >
  Maintain the UECA-React documentation site itself — the repository, not the UECA code inside it. Use
  this skill whenever the task is to upgrade `ueca-react` to a new version, refresh the agent skills,
  react to a release's changelog, add or reorder documentation articles, deploy to GitHub Pages, or
  verify the live site. Use it too before editing `README.md`, `CLAUDE.md`, `package.json`,
  `.gitignore` or the deploy scripts, and whenever a release note says something about packaging,
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
(cd node_modules/ueca-react && find docs skills -type f -exec md5sum {} + | sort -k2) > "$SP/hashes-before.txt"
```

The file list catches a moved or added article; only the hashes catch one **rewritten in place**.
3.2.2 rewrote four articles with no change to the list.

### 2. Install, then read the changelog properly

```bash
npm install ueca-react@<version>
sed -n '1,90p' node_modules/ueca-react/CHANGELOG.md
```

Read the **whole** entry, not the breaking-changes heading. 3.0.2 and 3.0.3 both declared "no API
changed" and both still required project work — a packaging change in one, a documentation
restructure in the other. Treat every bullet as a question: *does this project do that?*

**Check the version exists before planning around it** — and check it *online*. A request can name
one that was never published (3.3 was), but `npm view` reads a local metadata cache and will deny a
version published minutes ago. Plain `npm view ueca-react versions` reported 3.2.1 missing when it
was already latest. Use one that cannot be stale:

```bash
npm view ueca-react versions --prefer-online
curl -s https://registry.npmjs.org/ueca-react | node -e "let d='';process.stdin.on('data',c=>d+=c)\
  .on('end',()=>console.log(JSON.parse(d)['dist-tags'].latest))"
```

Cross-check `../ueca-react-npm/package.json`, which is the source the package is published from. A
false "that version does not exist" is worse than asking, so confirm before reporting one.

**When a release turns silent mistakes into throws, grep for each one.** 3.2.0 added four, and a
clean `tsc` proves nothing about them because they fire at render. The one worth a script is "a JSX
child whose `id` is already a member of its owner": collect each struct's member names, collect the
literal `id=` values given to child components in the same file, and intersect. Then exercise every
screen in a browser — they reach `globalSettings.errorHandler`, not the compiler.

### 3. Diff the shipped docs

```bash
diff "$SP/docs-before.txt" <(find node_modules/ueca-react/docs -type f | sed 's|node_modules/ueca-react/||' | sort)
diff "$SP/index-before.md" node_modules/ueca-react/docs/raw/index.md
grep -cE '^[0-9]+\. \[' node_modules/ueca-react/docs/raw/index.md   # article count
diff "$SP/hashes-before.txt" <(cd node_modules/ueca-react && find docs skills -type f -exec md5sum {} + | sort -k2)
```

A rewritten article reaches the site with no work, but read what changed: the project's own
`CLAUDE.md` may repeat what the old text said, and the text is bundled, so it moves the chunk size.

If articles changed, follow **Documentation Routing** in `CLAUDE.md` — six places, and missing the
sixth (`resolveDocPath`) leaves cross-links from other articles dead without any error.

**Then compare the titles with the index on every upgrade, whether or not the index changed.** The
diffs above only compare one release with the last, so drift that is already there never shows:
2.0.7 renamed chapters 10 and 11 to `onChange<Prop>` / `onChanging<Prop>`, and the menu and the
breadcrumb titles kept the old names through six upgrades, until someone asked. Run it from the
project root:

```bash
node -e '
const fs = require("fs");
const bs = String.fromCharCode(92); // the index escapes "<" as "\<"; a literal backslash here gets mangled on Windows
const guide = [...fs.readFileSync("node_modules/ueca-react/docs/raw/index.md", "utf8").matchAll(/^\d+\. \[(.+?)\]\(/gm)].map(m => m[1].split(bs).join(""));
const menu = [...fs.readFileSync("src/core/appLayout/appMenu.tsx", "utf8").matchAll(/text: "([^"]+)",\s*number:/g)].map(m => m[1]);
const ds = fs.readFileSync("src/screens/docs/docsScreen.tsx", "utf8");
const titles = [...ds.slice(ds.indexOf("function _articleTitle"), ds.indexOf("function _articleSource")).matchAll(/return "([^"]+)";/g)].map(m => m[1]);
console.log("guide", guide.length, "menu", menu.length, "titles", titles.length);
guide.forEach((t, i) => {
  if (t !== menu[i]) console.log(String(i + 1).padStart(2), "menu: ", JSON.stringify(menu[i]), " guide:", JSON.stringify(t));
  if (t !== titles[i]) console.log(String(i + 1).padStart(2), "title:", JSON.stringify(titles[i]), " guide:", JSON.stringify(t));
});'
```

One line is expected: chapter 12's **menu** label is `Automatic onPropChange / onPropChanging`, shortened
on purpose because the full title is too wide for the rail (the comment in `appMenu.tsx` says why).
Its breadcrumb title is the full one. Anything else is drift.

History: 3.0.1 moved the guide from `docs/` to `docs/raw/original/` and added two articles (19 → 21).
3.0.2 through 3.2.2 changed nothing structural — 3.1.0 touched only the index's version line and the
Tracing guide's two (remote) screenshots; 3.2.0 and 3.2.1 only the version line; 3.2.2 the version
line plus the text of Lifecycle Hooks, Model Caching, Property Bindings and Utility Functions
(`draw`/`erase` run around every render, identity comparison on assignment).

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
for f in $(cd node_modules/ueca-react/skills && find . -type f -path '*ueca-app-*'); do
  cmp -s "node_modules/ueca-react/skills/$f" ".claude/skills/$f" || echo "DIFFERS: $f"; done
```

The list diff alone proves nothing about contents — 3.2.2 corrected the skills and the scaffold
without adding or removing a file. Nor does the command's own output: it prints `updated` for every
directory even when run twice in a row on an identical tree. Silence from `cmp` is the proof.

The command **replaces** each library skill directory. Our `postinstall` is
`npx ueca-react-skills --auto`; `ueca-react` itself ships no install hook. Verify rather than assume:
in 3.0.3 the old merging copy left the tree stale and missing two new files, and nothing reported it.

### 6. Sweep the project's own claims

Beyond the two-files rule above, check the things that quietly go stale:

- `CLAUDE.md` — the *Current Implementation Snapshot* heading names a version; the article count; any
  behaviour the release changed
- `README.md` — article count, setup commands, anything about skills
- **the version appears in three places, not one** — and `homeHero` was missed on both the 3.1 and
  3.2 upgrades, so the Home page still advertised 3.0 two releases later:
  - `src/core/appLayout/appSideBar.tsx` — the chip in the sidebar header
  - `src/screens/home/homeHero/homeHero.tsx` — **twice**: the `version` prop, and the
    "Built on UECA-React X.Y" note in the reference-apps list
  - `CLAUDE.md` — the *Purpose* line and the snapshot heading

  Only a minor moves the user-visible `X.Y`; a patch moves just the snapshot heading. Sweep with
  `grep -rn "3\.1" src/ CLAUDE.md README.md` using the *old* number before you change anything.
- `package.json` — scripts, if the release changed how anything is invoked

### 7. Verify

```bash
npm run build && npm run lint
```

**Read the chunk sizes, do not just let them scroll past.** 3.2.0 shipped a tree-shaking regression
that nothing else could see: no error, no failing test, only the main chunk going 1,574 → 1,603 kB.
3.2.1 fixed it. Compare against the previous release's numbers, and treat an unexplained jump as a
finding rather than noise.

Main chunk by release: 3.1.0 1,574 kB · 3.2.0 1,603 · 3.2.1 1,588 · 3.2.2 1,593. The 3.2.2 step is
explained — 4.5 kB of rewritten guide text (the articles are `?raw` strings in this chunk) and ~30
lines of library source. To account for a jump, measure both from the library repo:
`git ls-tree -r -l <old-cut> -- docs/raw/original` against the new cut, and
`git diff --shortstat <old-cut> <new-cut> -- src ':!src/__tests__' ':!src/traceViewerHtml.ts'`.

Then in a browser, against the **production build** (see *Dev port* below):

deep link to an article · all 21 sidebar entries · a cross-link between two articles · images ·
theme toggle · a tooltip (real hover, not a synthetic event) · a section link · Back/Forward ·
375px viewport.

**Check the markdown subtree does not remount.** `@uiw/react-markdown-preview` is the only plain
React component in the app, and 3.1.0 fixed the `View`-identity bug that had been remounting it on
every render. Hold a node, force a re-render around it, and see whether it survives:

```js
const node = document.querySelector(".markdown-host h1");
[...document.querySelectorAll("button")].find(b => /theme/i.test(b.getAttribute("aria-label") || "")).click();
await new Promise(r => setTimeout(r, 800));
document.querySelector(".markdown-host h1") === node   // true = not remounted
```

Then navigate to another article and confirm the heading *does* change — persistence must not stop
updates.

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

**Stopping it means stopping `node`, not `npx`.** Run in the background and stopped by its task, only
the `npx`/`cmd` wrapper dies; `vite.js preview` keeps the port and goes on serving `dist/` from
disk, so a rebuild still shows up and nothing looks wrong — until the next `--strictPort` start
fails with exit 1. Find it by the port and stop that process:

```powershell
$c = Get-NetTCPConnection -LocalPort 4180 -State Listen; Get-CimInstance Win32_Process -Filter "ProcessId = $($c.OwningProcess)"
```

### The live deep-link 404 is correct

GitHub Pages has no SPA fallback. `predeploy` writes `404.html` as a copy of `index.html`; Pages
serves it for unmatched paths and the app routes from `window.location`. So a deep link returns
**HTTP 404 carrying the app** — the status stays 404 while the page works, and every asset it then
loads is 200. Do not "fix" it. Confirm a real failure by checking the asset requests, not the
document status.

### The overflow sweep has one known entry

`CLAUDE.md` says the horizontal-overflow sweep should come back empty. At 375px it does not, and that
is the baseline rather than a fault: the sidebar `nav` measures ~230px against ~234px of content — one
long chapter label — with `overflow-x: visible`, while the rail **above** it is `overflow-x: hidden`
and clips it. `document.body.scrollWidth` stays at the viewport width, so nothing actually overflows
the page.

Treat that single `NAV` entry as expected; anything *else* in the list is new. Confirm containment
with `document.body.scrollWidth > innerWidth` rather than by the element list alone.

### A stale console 404 from an earlier navigation

The browser tool's console buffer survives navigation within a tab. A 404 reported there may be from
a page you visited earlier. Confirm against `read_network_requests`, or open a fresh tab.

### Bound plain arrays: build a fresh one

As of 3.1.0 a binding hands a plain array over only when the getter returns a *different* array from
the one the property's copy was made from. Every array-returning getter here builds a fresh array
(`return [...]`, `.map(...)`), so all of them still assign — and every `push`/`splice` in the project
is on a model property (observable) or on a local, so nothing depended on the old behaviour.

Keep it that way. A getter that hands back a **stored** plain array and expects a later `push` into
that array to reach the model would now silently do nothing — no assignment, no event, and no trace
record to find it by.

### Struct section order is presentation

The runtime reads struct sections by name. The documented order
(`props → children → methods → events → messages →` hooks in run order `→ View`) is what an agent
copies, not a constraint. A struct that departs from it is untidy, never broken.

---

## Deploying

```bash
npm run deploy
```

One command, and it is finished — the **`gh-pages` package** commits and pushes the branch itself.
`predeploy` runs first: `npm run build`, then copy `dist/index.html` to `dist/404.html`.

`--no-history` keeps the branch at **exactly one parentless commit**, force-pushed each time. The
branch is build output, so nothing is lost: any published state is reproducible from the `master`
commit that built it. It is not an ancestor of `master` and never will be — never merge or rebase
between them, and `git log origin/gh-pages` will only ever show one entry.

The history was flattened on 2026-09-28. It had reached 20 commits and ~7.6 MB of superseded
bundles, and still carried `master`'s early history from when the branch was first cut off it.

**Never drop the 404.html step.** It is the only reason deep links resolve on Pages, and losing it
breaks every URL except the site root — which the home page will not show you. The copy is written
with `node -e` rather than a shell command so the script is not Windows-only.

Pages takes a minute or two. Wait on the new bundle name rather than guessing:

```bash
until curl -s -H 'Cache-Control: no-cache' \
  "https://nekutuzov.github.io/ueca-react-doc/index.html?cb=$(date +%s)" \
  | grep -q '<new bundle hash>'; do sleep 10; done
```

Then check a **deep link**, not just the root, since that is what exercises `404.html`.

**If the build output hashes are unchanged, there is nothing to deploy** — say so instead of running
a pointless publish.

**`Published` does not mean a commit was made.** When the tree is byte-identical to the branch,
`gh-pages` stages it, finds nothing changed, commits nothing, and still prints `Published` and exits
0. Confirm by the SHA, never by the word:

```bash
git ls-remote --heads origin gh-pages      # before and after
```

### First publish on this machine needs a safe.directory entry

`gh-pages` clones the branch into `node_modules/.cache/gh-pages/<mangled remote url>/` and runs git
there. On this E: drive that path "does not record ownership", so git refuses it and `gh-pages`
reports the misleading:

```
Error: Failed to get remote.origin.url (task must either be run in a git repository
with a configured origin remote or ...)
```

The project's own remote is fine — the failure is inside the cache clone. `git config --get` there
exits 1 *silently*, which hides it; `git -C <cache> remote -v` prints the real "dubious ownership"
error and the exact command to fix it:

```bash
git config --global --add safe.directory \
  'E:/CraneSoft/ueca/ueca-react-doc/node_modules/.cache/gh-pages/https!github.com!nekutuzov!ueca-react-doc.git'
```

One entry, once per machine. The cache directory name is derived from the remote URL, so it is stable
across `npm install`; it only changes if the repository moves.

### It used to be a sibling clone

Until 2026-09-28 `npm run deploy` ran a `deploy.ps1` that staged the build into a
`../ueca-react-doc-deploy` clone for a human to commit and push. If you find a reference to that
folder, or to `deploy.ps1`, it is stale — the folder is gone and the script is deleted.

`gh-pages` keeps its own working copy under `node_modules/.cache/gh-pages`. If a publish ever fails
with a confusing git error, delete that cache and re-run. It is safe to delete whenever its tree is
clean and its HEAD matches `origin/gh-pages`, and worth doing occasionally: it had reached 11 MB,
nearly all of it dangling objects from the history that was flattened out from under it.

**Deleting the cache does not mean deleting its `safe.directory` entry.** The path is derived from
the remote URL, so the fresh clone lands in exactly the same place and needs the same exception.
Removing both while tidying up brings back the misleading `Failed to get remote.origin.url`.

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
