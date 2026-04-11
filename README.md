# UECA-React Documentation Viewer

UECA-React Documentation Viewer is a focused application for reading UECA-React markdown documentation inside a navigable app shell.

## What This Project Is

This project is a docs-first viewer with:

- Home greeting screen
- Sidebar as the documentation index
- Route-per-article navigation
- Markdown rendering with in-app link handling

Primary docs source used by the app:

- node_modules/ueca-react/docs/index.md

## Current App Shape

- Home screen:
  - src/screens/home/homeScreen.tsx
- Documentation screen:
  - src/screens/docs/docsScreen.tsx
- Sidebar menu (docs index):
  - src/core/appLayout/appMenu.tsx
- App routes (Home + docs articles):
  - src/core/infrastructure/appRoutes.tsx

The app currently maps 19 documentation articles from the UECA docs index into /docs/* routes.

## Run

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Expected local URL:

- http://localhost:5001/ueca-react-doc/

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Known non-blocking lint warning:

- public/mockServiceWorker.js has an unused eslint-disable directive

## How Navigation Works

1. The sidebar menu is the docs index.
2. Each menu entry points to a dedicated route under /docs/*.
3. src/screens/docs/docsScreen.tsx maps each route to one markdown source file.
4. src/components/misc/markdownPreview/markdownPreview.tsx intercepts internal links and routes them through App.Router.GoToRoute.
5. Packaged markdown links like /docs/*.md are mapped to app routes.

## Static Assets for Markdown

Markdown images used by the docs should exist in public/docs/.
Current assets include:

- public/docs/logo.png
- public/docs/component-integration.png
- public/docs/component-mental-model.svg

## Path Aliases

Configured in tsconfig.app.json:

- @components -> src/components
- @core -> src/core
- @api -> src/api
- @screens -> src/screens

## Development Rules

- Use UECA component model patterns (props, children, methods, events, message bus).
- Do not introduce React hooks or class components.
- Do not add UI libraries.
- Keep TypeScript compatibility with project config (strictNullChecks: false, noImplicitAny: false).

## Updating Documentation Routes

When adding or changing docs entries:

1. Read node_modules/ueca-react/docs/index.md.
2. Keep route/menu order aligned with index headings.
3. Add route in src/core/infrastructure/appRoutes.tsx.
4. Add menu item in src/core/appLayout/appMenu.tsx.
5. Add markdown source mapping in src/screens/docs/docsScreen.tsx.

## Related Workspace Instructions

Project-specific assistant guidance is in:

- .github/copilot-instructions.md

## License

ISC
