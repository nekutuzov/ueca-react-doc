# UECA-React Documentation Viewer - AI Instructions

## Purpose

This project is a documentation viewer for UECA-React, built **on** UECA-React 3.0.

Goals:
- Keep Home screen as a greeting/landing page.
- Use UECA markdown docs as primary content source.
- Main sidebar menu acts as the documentation index.
- Routes map to documentation articles, not UI demos.

Primary source:
- `node_modules/ueca-react/docs/raw/index.md` (the guide index; articles live in `docs/raw/original/`)

## Start here: the library skills

The library ships its own agent skills, copied into `.claude/skills/` by the `postinstall` script.
**They are the authority on the framework itself** — this file only covers what is specific to *this*
application.

- Invoke **`ueca-app-development`** before creating or changing any component, screen or service. It
  carries the component pattern (struct → hook → `getFC`), state and bindings, lifecycle, model
  caching, the message bus, the complete public API, and a symptom-indexed list of the mistakes that
  fail *silently*.
- Invoke **`ueca-app-architecture`** for anything bigger than one component: the app shell, routing,
  services, "where does this go", or converting React code to UECA.

Where this file and a skill disagree about the **framework**, the skill wins. Where they disagree
about **this app's conventions** (base components, docs routing, markdown viewer), this file wins.

`.claude/skills/` is generated — it is gitignored and re-copied on every `npm install`. Never edit it
in place; after upgrading `ueca-react`, run `npm install` to refresh it.

### Library reference docs

Shipped inside the package (paths are real — verify before citing):

- Guide index: `node_modules/ueca-react/docs/raw/index.md`
- Articles: `node_modules/ueca-react/docs/raw/original/*.md` — the 21 entries this app serves
- Changelog (read this before assuming any v2 behaviour still holds):
  `node_modules/ueca-react/CHANGELOG.md`

## v3 rules that bite

v3 turned a set of previously-silent mistakes into **throws**, so they now reach
`globalSettings.errorHandler` instead of scrolling past in a console. The full list is in the
changelog and in the skill's pitfalls reference; these are the ones this codebase touches:

- **A message with no `in` payload takes no argument.** `unicast("App.GetInfo")` — the v2 placeholder
  `unicast("Msg", undefined)` is now a compile error.
- **`unicast` and `castTo` expect exactly one subscriber** and throw *before dispatching* if more than
  one matches. Zero subscribers is not an error — `unicast` returns `undefined`, which is why an
  ordering bug looks like a missing value rather than a crash (see *Startup ordering* below).
- **A message with more than one legitimate subscriber must be a `broadcast`.** The router's
  `App.Router.BeforeRouteChange` / `AfterRouteChange` are the case in this app: the active
  `CRUDScreen` vetoes on unsaved changes and `AppTooltipManager` closes its bubble, so a `unicast`
  throws the moment both are mounted. `broadcast(null, …)` returns **an array of every answer**;
  the guard allows navigation unless one of them is explicitly `false`
  (`answers.every(a => a !== false)`). Do not test for truthiness — a handler that just reacts and
  returns nothing would then freeze routing app-wide, with no error to trace it by.
- **`draw` and `erase` must be synchronous.** Move async work to `mount` / `unmount`.
- **Two JSX siblings may not share an `id`.** An `id` is identity, cache key, bus address and DOM id at
  once. Derive a list child's id from its item.
- **`id` and `cacheable` are system props** — no binding, no getter, no synthesized `onChange…`.
- **A param may not switch between a binding and a value between renders.** Put the condition inside
  the getter, never a conditional `UECA.bind(...)` in JSX.
- **`children`-section constants are initial values only** — they are no longer re-asserted when a
  cached model remounts. JSX props are standing declarations and *are* re-applied every render.
- **`React.StrictMode` is supported** as of v3. This app still does not enable it (see
  `appStart.tsx`) — it buys a UECA app nothing.

## Startup ordering

**`init` hooks are not ordered between models, and an `async init` yields.** A model that another
model's `init` depends on may not have finished its own.

`AppBrowsingHistory` establishes the active path in **`constr`**, not `init`, precisely because
`AppRouter.init` reads it over the bus to resolve the startup route. When that work lived in an
`async init` (which awaited `App.GetInfo` first), the router asked for a path that had not been
computed yet, got `undefined` back from a zero-subscriber `unicast`, and dropped **every deep link
onto the Home screen**.

The rule: **if another model's `init` reads it, produce it in `constr`** — and derive it from
something synchronously available (here, `window.location`) rather than from an awaited message.

> **This is a deliberate divergence from MLWebApp**, whose `AppBrowsingHistory` calls
> `syncWithBrowser()` from `init`, *after* awaiting `App.GetInfo`. Porting that here reintroduces
> the deep-link bug above. Keep `constr`. Everything else in that module tracks MLWebApp.

## Non-Negotiable Rules

- Use UECA component model patterns (props, children, methods, events, message bus).
- Do not introduce React hooks or class components (`useState`, `useEffect`, etc.).
- Do not add UI libraries. Use existing project components and plain HTML/CSS/SVG.
- Keep TypeScript compatibility with project tsconfig (`strictNullChecks: false`, `noImplicitAny: false`).
- Preserve aliases:
  - `@components` -> `src/components`
  - `@core` -> `src/core`
  - `@api` -> `src/api`
  - `@screens` -> `src/screens`

## App Shape

- `src/core/infrastructure/appRoutes.tsx`
  - Contains docs-first `screenRoutes`.
  - Should include Home plus article routes.
- `src/core/appLayout/appMenu.tsx`
  - Sidebar menu is the docs index.
  - Active route highlighting must remain reactive via `_activeRoute`.
- `src/screens/home/homeScreen.tsx`
  - Greeting content only. The page itself is `homeHero/homeHero.tsx`, whose signature element is
    the annotated struct spine (`props → children → methods → events → messages → View`). Its copy
    tracks `src/screens/home/welcome.md`, which is kept as the source of that wording.
- `src/screens/docs/docsScreen.tsx`
  - Dedicated markdown article viewer screen. Composes the article with `DocsToc`
    ("On this page", parsed from the markdown source) and `DocsPager` (prev/next, ordered by
    `DOC_ORDER`).

## Current Implementation Snapshot (September 2026, ueca-react 3.0.1)

- `src/screens/index.ts` exports only:
  - `home/homeScreen`
  - `docs/docsScreen`
- `src/core/infrastructure/appRoutes.tsx` is docs-only for app screens:
  - Home routes: `/`, `/home`
  - Article routes: `/docs/*` (21 entries mapped from `docs/raw/index.md`)
- `src/core/appLayout/appSideBar.tsx` currently uses:
  - `useAppMenu` imported from `./appMenu`
  - Width behavior: collapsed `var(--sidebar-w-collapsed)` (60), expanded `var(--sidebar-w)` (300)
  - Header: logo link, `UECA-React` wordmark, `3.0` version chip
  - Collapses itself below `NARROW_VIEWPORT` (860px) via a `mount` resize listener, and only on
    the crossing — so a deliberate toggle survives a resize on one side of the breakpoint
- `src/core/infrastructure/appUI.tsx` mounts `<UECA.TraceViewerButton />`. It is a lazily-loaded
  chunk, so a closed viewer costs the bundle nothing. **Keep it** — it is there on purpose.
- Menu items carry a chapter `number` (`01`–`21`) rendered in the NavItem icon slot, so the
  numbering survives the collapse to an icon rail.
- Screens compose their own content region: `useCRUDScreen({ contentPaddings: "none" })` forwards
  to `ScreenLayout`, which is how the docs article and the home hero own their padding.
- An article page is a **band of fixed design width, centred** — `--band-w` (`--article-w` 900 +
  `--toc-w` 220) with `margin-inline: auto` on `.docs-layout`. Prose is capped at `--measure`
  and the widest shipped code block fits `--article-w`, so past ~1400px there is nothing extra
  width can be spent on; left-aligned, the whole surplus piled up in one void on the right.
  The home hero centres the same way (`max-width: 940px`). The top bar stays full-bleed, so on a
  wide window the breadcrumb trail no longer starts at the article's left edge — that is the
  accepted trade, not an oversight.

## Theming

Two themes, `ueca-light` and `ueca-dark`, switched by `<html data-theme>`. Three CSS layers load
from `main.tsx` in order:

| File | Holds |
| --- | --- |
| `src/tokens.css` | everything that is **not** colour — type scale, spacing, radii, motion, z-ladder, and the `.ueca-*` type roles |
| `src/themes.css` | the two palettes plus the derived tokens (`--hover`, `--focus-ring`, status ramps) |
| `src/theme.css` | body surface and the whole `.wmde-markdown` article retheme, including the Prism syntax colours |

The palette is derived from the four-piece logo: **blue is the accent (action), amber is
`--marker` (structure only — spine markers, chapter numbers; never interactive)**, green and coral
are success and error.

`resolvePaletteColor` in `appTheme.ts` returns `var(--…)` rather than a literal, so all ~17 palette
consumers follow a theme switch with no re-render. **Change colours in `themes.css`, not there.**

`AppThemeManager` (a `useBase` service, owned by `Application`) resolves the theme in **`constr`**,
stamps `<html data-theme>` / `data-color-mode`, persists to `localStorage`, and answers the
`App.Theme.*` messages. `index.html` carries a matching no-flash script — keep its key and default
in sync with `THEME_STORAGE_KEY` / `preferredThemeId()`.

## Layout gotcha: inline styles beat your stylesheet

`Block` / `Row` / `Col` in `src/components/layout/layout.tsx` write `display`, `overflow`, `width`
and `padding` as **inline styles**, and `overflow` defaults to `visible` when the prop is omitted.
A CSS class can never override those. So:

- to make a `Col` scroll, pass `overflow={"auto"}` — a stylesheet rule will not take;
- an element that must hide at a breakpoint (`display: none`) cannot be a `Col` — the docs TOC is a
  plain `<aside>` for exactly this reason.

Flex children also need `min-width: 0` / `min-height: 0` to shrink; without them a wide code block
widens the whole page instead of scrolling inside its own `pre` — and the sidebar menu grows past
the rail instead of showing a scrollbar.

## Tooltips

**Never use the native `title` attribute.** There is one tooltip in the app, `AppTooltipManager`,
owned by `AppUI` and driven over the bus (`App.Tooltip.Show` / `Hide`). A per-trigger tooltip would
strand a bubble on screen whenever its trigger disappears mid-hover; the singleton has nothing to
orphan.

To give any element a tooltip, spread the base-hook helper:

```tsx
<button {...model.tooltipProps("Switch to dark theme")}>…</button>
```

- It wires `mouseenter`/`mouseleave` **and** `focus`/`blur`, so keyboard users get it too — but only
  on `:focus-visible`, or returning from another tab would pop a tooltip under no pointer.
- `token` is the trigger's `htmlId()`. A `Hide` naming anyone but the trigger currently showing is
  ignored, which is what stops a fast sweep across the top bar from closing the bubble the element
  now under the pointer just opened.
- Placement is automatic: `positionOverlay` in `core/misc/overlayPosition.ts` (a pure function of
  rectangles — no DOM) flips to whichever side has room and slides the bubble back inside the
  viewport, and the arrow offset is recomputed so it still points at the trigger.
- An icon-only control still needs an **`aria-label`** — the tooltip is a visual affordance, not an
  accessible name. `IconButton` sets it from `title`; pass `tooltipView` when the bubble needs more
  than a string.
- A second, dimmed mono line comes from wrapping content in `<span className="ueca-tooltip-detail">`
  — use it for a destination or a shortcut, not for a second sentence.
- Colour is the one place the two themes deliberately diverge (`--tooltip-*` in `themes.css`): light
  gets an inverted ink chip, dark a raised bordered plane. A `--surface` bubble is invisible on a
  `--surface` sidebar; an inverted near-white one glares on a dark page.

## External links

**Every link to another site opens in a new tab.** Three routes, all already wired:

- UECA components — `model.openNewTab({ path })`, or `newTab: true` on a `NavLink`.
- Markdown articles — `markdownPreview`'s `draw` stamps `target="_blank"` + `rel="noopener
  noreferrer"` onto any anchor whose resolved `a.protocol` is http(s) and whose `a.hostname` differs
  from ours. Reading the resolved properties rather than parsing the href is what leaves relative
  article links, in-page fragments and `mailto:` alone.
- `AppBrowsingHistory.open(route, true)` passes `noopener,noreferrer` to `window.open` — unlike
  `<a target="_blank">`, `window.open` does not imply it, and without it the opened page can
  navigate this one.

When updating docs navigation, preserve this docs-first shape unless explicitly asked to redesign
layout behavior.

## Documentation Routing

When adding or changing docs entries:
1. Read `node_modules/ueca-react/docs/raw/index.md`.
2. Keep menu labels and route ordering aligned with index headings.
3. Add matching route in `appRoutes.tsx`.
4. Add matching menu item in `appMenu.tsx`.
5. Add corresponding markdown source mapping in `docsScreen.tsx` — the `DocArticle` union, the
   `DocRoutePath` union, all three `switch` statements, and the `DOC_ORDER` array that drives
   prev/next. (`_articleTitle` and `_articleRoutePath` take an optional article argument so the
   pager can ask about a neighbour; leave that signature alone.)
6. Add the article's file name to `resolveDocPath` in `markdownPreview.tsx`, so cross-links from
   other articles reach it.

Articles are imported from `node_modules/ueca-react/docs/raw/original/` with Vite's `?raw` suffix, so
an upgrade that moves or renames a shipped file breaks the **build**, not the runtime.

## Markdown Viewer Notes

- Use existing `useMarkdownPreview` for rendering markdown.
- The shipped articles link to each other **relatively** (`Message%20Bus%20in%20UECA-React.md`), so
  `resolveDocPath` matches on the file name alone and ignores any leading path. It returns
  `undefined` for anything that is not a known article, which leaves external links to the browser.
- Images in the markdown are relative too (`component-integration.png`). `index.html` sets
  `<base href="/ueca-react-doc/">`, so they resolve against the base rather than the current route —
  which is why the assets live in `public/`, not `public/docs/`.
- Asset references in `index.html` must be **relative** (`href="ueca.ico"`) for the same reason.

## Coding Conventions

- Keep View methods mostly pure JSX.
- Move helper logic to private functions after `return model` when complex.
- Use `reactKey` for mapped UECA child lists where needed.
- Keep comments minimal and useful.

## Development workflows

| Command | Does |
| --- | --- |
| `npm run dev` | Vite on port **5001**, base path `/ueca-react-doc/` |
| `npm run build` | `tsc -b && vite build` |
| `npm run lint` | ESLint — currently clean, keep it that way |
| `npm run deploy` | Builds and stages `dist` into `../ueca-react-doc-deploy` (see below) |
| `npm install` | installs deps **and** refreshes `.claude/skills/` via `postinstall` |

If build/lint errors are unrelated to the changed scope, do not make broad unrelated refactors.

## Deployment

`npm run deploy` runs `deploy.ps1`: it builds, clears `../ueca-react-doc-deploy` (keeping `.git`),
copies `dist` into it, and writes a `404.html` copy of `index.html`. Commit and push from that folder
onto the `gh-pages` branch.

GitHub Pages has no SPA fallback: a direct request for `/docs/message-bus` has no file to serve and
returns GitHub's own 404 page. Pages *does* serve `404.html` for unmatched paths, and this app routes
from `window.location`, so the identical copy is what makes deep links resolve.

## License

ISC
