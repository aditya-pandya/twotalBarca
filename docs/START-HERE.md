# START HERE — twotalBarça

If you are a new agent touching this repo, do this in order.

## 1. Read these files first

1. `docs/agent-handoff.md`
   - full project context, constraints, current state, future direction
2. `docs/prd.md`
   - product-manager view of goals, scope, requirements, risks
3. `docs/implementation-checklist.md`
   - practical execution checklist split by system/pages/components
4. `docs/design-direction.md`
   - visual/editorial guardrails
5. `design-references/stitch/README.md`
6. the relevant Stitch reference files in `design-references/stitch/`

## 2. Understand the project in one minute

This is:
- a premium FC Barcelona editorial publication
- article-first
- archive-aware
- manually curated

This is not:
- a rumor site
- a generic sports dashboard
- a fashion-magazine concept board
- a museum brochure

The reading experience is the product.

## 3. Current implementation reality

- Homepage exists and was recently ported much closer to the Stitch reference.
- Article page is still the strongest product-quality surface.
- About page works but still needs the most cleanup.
- Content is still local seed data, not a CMS.

## 4. Before you change code

Run:
- `npm test`
- `npm run build:local`

If local build breaks because of iCloud/Next artifact cleanup:
- `rm -rf .next-local && npm run build:local`

## 5. If you are doing design work

Rules:
- fidelity before reinterpretation
- match approved references first
- do not drift into generic luxury/editorial nonsense
- keep football at the center of gravity
- preserve article-page quality

## 6. If you are doing architecture/content work

Focus on:
- normalizing homepage content into shared typed data
- reconciling taxonomy/nav labels carefully
- improving tests
- not introducing CMS complexity too early

## 7. Recommended next tasks

Best next page task:
- improve the About page

Best next maintainability task:
- normalize homepage content/data contracts

Best next hardening task:
- add regression tests for nav/anchors/page rendering

## 8. Files you will probably touch

- `app/page.tsx`
- `app/about/page.tsx`
- `app/article/[slug]/page.tsx`
- `components/site-header.tsx`
- `components/site-footer.tsx`
- `components/primitives.tsx`
- `lib/site-data.ts`
- `app/globals.css`
- `next.config.ts`

## 9. Reference assets

In-repo reference exports:
- `design-references/stitch/homepage-reference.html`
- `design-references/stitch/homepage-reference.png`
- `design-references/stitch/article-reference.html`
- `design-references/stitch/article-reference.png`
- `design-references/stitch/manifesto-reference.html`
- `design-references/stitch/manifesto-reference.png`

## 10. Definition of success

You are done when:
- the page/system is more faithful, clearer, or more maintainable
- tests pass
- `npm run build:local` passes
- you did not accidentally make the site less Barça, less editorial, or more generic
