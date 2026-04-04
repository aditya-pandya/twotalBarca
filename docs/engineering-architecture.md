# twotalBarça Engineering Architecture

Last updated: 2026-04-03

## Overview

twotalBarça is a static-first Next.js App Router site. The current build is intentionally simple:

- rendering uses the `app/` directory
- editorial content is seeded from typed in-repo data in `lib/site-data.ts`
- shared layout and content primitives live in `components/`
- styling is centralized in `app/globals.css`
- verification currently covers seeded data helpers and a lightweight UI smoke pass with Vitest

This keeps the MVP easy to reason about while product, IA, and editorial conventions are still being refined.

## Runtime shape

### App routes

- `app/layout.tsx`
  - global metadata
  - site chrome (`SiteHeader`, `SiteFooter`)
- `app/page.tsx`
  - homepage modules assembled from shared primitives and seeded data
- `app/about/page.tsx`
  - publication/about page
- `app/article/[slug]/page.tsx`
  - statically generated article route using `generateStaticParams()`

### Shared UI

- `components/primitives.tsx`
  - editorial layout and content building blocks
  - section/container helpers
  - typography helpers
  - story card variants
  - figure, metadata, and link helpers
- `components/site-header.tsx`
  - client component because it reads `usePathname()` for nav active state
- `components/site-footer.tsx`
  - static footer shell
- `components/article-body.tsx`
  - longform prose layout with contextual side note and pull quote

### Data layer

- `lib/site-data.ts`
  - typed seed content for navigation, homepage modules, about content, and articles
  - helper functions for article lookup and href resolution

There is no remote CMS or database yet. All pages depend on this local typed content module.

## Rendering and data flow

1. Route files import typed content from `lib/site-data.ts`.
2. Shared primitives render those records into consistent editorial UI.
3. Article routes resolve content by slug with `getArticleBySlug()`.
4. Static params come from `getArticleSlugs()`, which keeps build output deterministic.

Because all current content is local and synchronous, there are no async data-fetching boundaries outside the App Router route signatures themselves.

## Testing strategy

Vitest is configured with `jsdom` for component-level smoke tests.

Current coverage focuses on:

- `tests/site-data.test.ts`
  - seeded slug lookup
  - article retrieval
  - href fallback behavior
- `tests/smoke.test.tsx`
  - homepage renders the lead story
  - header renders primary navigation and active-state behavior

The suite is intentionally small and fast. As the site grows, the next useful additions are route-level metadata tests and a few focused interaction tests around navigation and article rendering.

## CI

GitHub Actions runs on pushes and pull requests to `main` and executes:

1. `npm ci`
2. `npm test`
3. `npm run build`

That gives the repo one lightweight quality gate covering both correctness and production compilation.

## Repo conventions

- Use the `@/` alias for local imports.
- Prefer shared primitives over page-specific one-off components.
- Keep editorial seed data typed and centralized until a CMS decision is made.
- Treat the article page as the product quality bar for typography, spacing, and metadata discipline.

## Local build note for iCloud-backed worktrees

This repository lives inside iCloud Drive, which can occasionally interfere with Next.js cleanup inside `.next/` and produce errors shaped like:

`ENOTEMPTY: directory not empty, rmdir '.next/server/app 2'`

When that happens locally, the clean workaround is:

```bash
npm run build:local
```

`build:local` routes output to `.next-local`, which avoids the stale iCloud-managed `.next/` cleanup path while leaving the normal CI build command unchanged on clean GitHub runners.
