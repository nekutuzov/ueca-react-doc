# UECA-React Documentation Viewer - AI Instructions

## Purpose

This project is a documentation viewer for UECA-React.

Goals:
- Keep Home screen as a greeting/landing page.
- Use UECA markdown docs as primary content source.
- Main sidebar menu acts as the documentation index.
- Routes map to documentation articles, not UI demos.

Primary source:
- `node_modules/ueca-react/docs/index.md`

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
  - Greeting content only.
- `src/screens/docs/docsScreen.tsx`
  - Dedicated markdown article viewer screen.

## Current Implementation Snapshot (April 2026)

- `src/screens/index.ts` exports only:
  - `home/homeScreen`
  - `docs/docsScreen`
- `src/core/infrastructure/appRoutes.tsx` is docs-only for app screens:
  - Home routes: `/`, `/home`
  - Article routes: `/docs/*` (19 entries mapped from docs index)
- `src/core/appLayout/appSideBar.tsx` currently uses:
  - `useAppMenu` imported from `./appMenu`
  - Width behavior: collapsed `60`, expanded `400`
  - Header title: `UECA React Documentation`

When updating docs navigation, preserve this docs-first shape unless explicitly asked to redesign layout behavior.

## Documentation Routing

When adding or changing docs entries:
1. Read `node_modules/ueca-react/docs/index.md`.
2. Keep menu labels and route ordering aligned with index headings.
3. Add matching route in `appRoutes.tsx`.
4. Add matching menu item in `appMenu.tsx`.
5. Add corresponding markdown source mapping in `docsScreen.tsx`.

## Markdown Viewer Notes

- Use existing `useMarkdownPreview` for rendering markdown.
- Internal markdown links that start with `/` should navigate via `App.Router.GoToRoute`.
- If markdown links target packaged doc filenames (`/docs/*.md`), map them to app routes.
- Ensure doc image assets used by markdown are available from `public/docs/`.

## Coding Conventions

- Keep View methods mostly pure JSX.
- Move helper logic to private functions after `return model` when complex.
- Use `reactKey` for mapped UECA child lists where needed.
- Keep comments minimal and useful.

## Validation

After relevant changes, run:
- `npm run build`
- `npm run lint` (when touching broad TS/TSX code)

If build/lint errors are unrelated to the changed scope, do not make broad unrelated refactors.

Known non-blocking lint warning:
- `public/mockServiceWorker.js` has an unused eslint-disable directive.
