# UECA-React Documentation Viewer

UECA-React Documentation Viewer is a focused application for reading UECA-React markdown documentation inside a navigable app shell.

## What This Project Is

This project is a docs-first viewer with:

- Home greeting screen
- Sidebar as the documentation index
- Route-per-article navigation
- Markdown rendering with in-app link handling

Primary docs source used by the app:

- node_modules/ueca-react/docs/raw/index.md (the guide index)
- node_modules/ueca-react/docs/raw/original/*.md (the articles themselves)

## Current App Shape

- Home screen:
  - src/screens/home/homeScreen.tsx
- Documentation screen:
  - src/screens/docs/docsScreen.tsx
- Sidebar menu (docs index):
  - src/core/appLayout/appMenu.tsx
- App routes (Home + docs articles):
  - src/core/infrastructure/appRoutes.tsx

The app currently maps the 21 documentation articles from the UECA docs index into /docs/* routes.

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

Deploy (builds and stages dist into ../ueca-react-doc-deploy for the gh-pages branch):

```bash
npm run deploy
```

## How Navigation Works

1. The sidebar menu is the docs index.
2. Each menu entry points to a dedicated route under /docs/*.
3. src/screens/docs/docsScreen.tsx maps each route to one markdown source file.
4. src/components/misc/markdownPreview/markdownPreview.tsx intercepts internal links and routes them through App.Router.GoToRoute.
5. The packaged articles link to each other by relative file name, so those links are matched on the file name alone and mapped to app routes.

## Static Assets for Markdown

Images in the packaged markdown are relative, and index.html sets <base href="/ueca-react-doc/">,
so they resolve against the base rather than the current route. They live at the root of public/:

- public/logo.png
- public/component-integration.png
- public/component-mental-model.svg

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

1. Read node_modules/ueca-react/docs/raw/index.md.
2. Keep route/menu order aligned with index headings.
3. Add route in src/core/infrastructure/appRoutes.tsx.
4. Add menu item in src/core/appLayout/appMenu.tsx.
5. Add markdown source mapping in src/screens/docs/docsScreen.tsx.
6. Add the article file name to resolveDocPath in src/components/misc/markdownPreview/markdownPreview.tsx.

## Related Workspace Instructions

Project-specific assistant guidance is in CLAUDE.md. It defers to the agent skills that ship with
the library, which npm install copies from node_modules/ueca-react/skills into .claude/skills/.

## License

ISC
