# twotalBarça — Agent Handoff / Project Spec

Last updated: 2026-04-04

This document is the practical handoff packet for another coding agent.
It consolidates product intent, design rules, implementation status, architecture, known constraints, and the recommended path forward.

If you only read one file before touching code, read this.

---

## 1. Project summary

`twotalBarça` is a premium FC Barcelona editorial publication.

The product is meant to feel like:
- a serious digital magazine
- a living archive of club memory
- a contemporary football publication with taste
- a Barça-native editorial system, not a generic sports site

It must not feel like:
- a rumor blog
- a transfer-churn news wire
- a luxury fashion magazine wearing football drag
- a museum/institution brochure
- a template sports dashboard

Core product thesis:
- article-first
- archive-aware
- manually curated
- football-specific
- literate but grounded

The reading experience is the product.

---

## 2. Current status at handoff

The repo is a working Next.js App Router site with:
- homepage
- article page
- about page
- shared header/footer/layout
- in-repo typed editorial seed data
- Vitest smoke/data tests
- production build passing

Current implementation state:
- Article page is still the strongest product surface and should remain the quality bar.
- Homepage was recently ported much closer to the Stitch reference export and now captures the intended editorial front-page structure far better than the old scaffold.
- About page is functional but still behind the homepage/article in fidelity and polish.
- Content is still static seed data in code; no CMS exists yet.

Recent important change:
- The Stitch reference exports were copied into the repo under `design-references/stitch/` and renamed for sane reuse.

Reference files now live at:
- `design-references/stitch/homepage-reference.html`
- `design-references/stitch/homepage-reference.png`
- `design-references/stitch/article-reference.html`
- `design-references/stitch/article-reference.png`
- `design-references/stitch/manifesto-reference.html`
- `design-references/stitch/manifesto-reference.png`
- `design-references/stitch/README.md`

These should be treated as source-of-truth visual references during fidelity work.

---

## 3. Source-of-truth docs

Read these before making directional decisions:

1. `docs/START-HERE.md`
   - shortest onboarding path for a new agent
2. `docs/agent-handoff.md`
   - this file
3. `docs/prd.md`
   - product-manager view of goals, scope, and requirements
4. `docs/implementation-checklist.md`
   - practical execution checklist
5. `docs/product-brief.md`
   - product and audience framing
6. `docs/design-direction.md`
   - visual and editorial guardrails
7. `docs/content-model.md`
   - target content model and taxonomy
8. `docs/engineering-architecture.md`
   - current implementation architecture
9. `docs/implementation-roadmap.md`
   - original phased plan
10. `docs/page-component-spec.md`
   - component and page-level system thinking
11. `design-references/stitch/*`
   - the actual reference exports

If a newer design or product decision conflicts with older docs, prefer:
1. direct user instruction
2. the Stitch references in repo
3. this handoff doc
4. older planning docs

---

## 4. Design references and their role

### 4.1 Stitch references in repo

These are not production code.
They are visual and structural references.

Meaning:
- do not paste their script tags into production code
- do not trust their Tailwind CDN usage as implementation guidance
- do use their composition, hierarchy, spacing feel, and module ordering as fidelity anchors

### 4.2 Which page is strongest

Historically:
- strongest reference = article page (`The Weave of the Blau`)
- weaker references = homepage and manifesto/about

Current reality after homepage pass:
- homepage is now materially closer to its Stitch export
- article page remains the best product-quality benchmark for typography, metadata discipline, and reading rhythm
- about page still needs the biggest conceptual cleanup

### 4.3 Practical fidelity rule

For each page:
- first match the reference closely enough that the user recognizes it immediately
- only then clean up implementation details
- do not “improve” the design by drifting away from the approved source before fidelity is reached

---

## 5. Product requirements

### 5.1 Core requirements

The product must:
- feel unmistakably Barça-specific
- feel unmistakably like a publication
- balance present-tense football relevance with memory and culture
- prioritize readability over flashy interaction
- keep manual curation over feed logic
- treat the archive as a first-class product surface

### 5.2 MVP pages

Current MVP page set:
1. Homepage
2. Article page
3. About page

Next surfaces after those are truly stable:
- archive landing
- section landing pages
- topic pages
- dispatch archive / issue pages
- season pages
- person pages

### 5.3 Editorial pillars

Core editorial pillars:
- The Brief
- Match Notes
- Analysis
- Tactics
- Culture
- Archive
- Essays / Reflections
- Weekly Dispatch

### 5.4 Product rules

Always preserve:
- premium editorial restraint
- readability
- football specificity
- credible metadata
- deliberate hierarchy
- controlled taxonomy

Never drift into:
- fashion-magazine luxury language
- institutional gallery voice
- noisy sports-card spam
- fake urgency/ticker overload
- vague section labels that hide function

---

## 6. Design and editorial guardrails

### 6.1 Desired feel

The system should feel like:
- warm paper + ink + deep navy
- restrained garnet and muted gold accents
- serif-led but readable
- cinematic and tactile, but grounded
- Barça-coded without cartoonishly blasting club colors everywhere

### 6.2 Color direction

Base:
- warm cream / paper background
- ink / charcoal text
- deep navy for structure and inverse surfaces

Accent usage:
- garnet is support, not wallpaper
- gold is rare and should read archival / heritage, not tacky
- blaugrana should be implied and disciplined, not literal stripe spam

### 6.3 Typography direction

Use:
- display serif for headlines and key editorial moments
- readable serif body/system pairing where appropriate
- sans for metadata, nav, labels, and utility surfaces

Avoid:
- over-italicizing everything
- app-like metadata styling
- generic startup sans stacks when the reference calls for editorial typography

### 6.4 Naming / taxonomy guardrails

Preferred language:
- The Brief
- Match Notes
- Analysis
- Tactical Board
- Notebook
- Archive
- Dispatch
- Essays

Avoid if possible:
- Cultural Heart
- Journalism
- generic “Review” labels
- over-poetic labels with unclear function

Note: the current homepage Stitch export still uses some labels like `Cultural Heart` and `Journalism`. Those are acceptable for fidelity during a strict port, but the long-term product direction still prefers more explicit publication language.

---

## 7. Current technical architecture

### 7.1 Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Vitest + Testing Library
- static-first rendering
- no CMS
- no database

### 7.2 Main file map

App routes:
- `app/layout.tsx`
- `app/page.tsx`
- `app/about/page.tsx`
- `app/article/[slug]/page.tsx`

Shared UI:
- `components/site-header.tsx`
- `components/site-footer.tsx`
- `components/primitives.tsx`
- `components/article-body.tsx`

Data:
- `lib/site-data.ts`

Styling:
- `app/globals.css`

Tests:
- `tests/smoke.test.tsx`
- `tests/site-data.test.ts`

### 7.3 Data model today

Current state:
- all content is local typed seed data in `lib/site-data.ts`
- article route uses helper lookups and static params
- homepage contains a mix of hardcoded content arrays and seeded/shared data patterns

Important caveat:
- there is some drift between the older shared data model and the newer homepage fidelity implementation
- before introducing a CMS or scaling content, this should be normalized

### 7.4 Styling model today

- styling is centralized in `app/globals.css`
- the site mixes older shared editorial styles with newer homepage-specific fidelity styles
- recent homepage pass also moved fonts into `next/font/google` via `app/layout.tsx`

Important caveat:
- CSS works and builds, but it is now carrying both legacy and newer layers
- cleanup/refactoring is desirable, but only after preserving fidelity

---

## 8. Current implementation notes by page

### 8.1 Homepage

Status:
- now much closer to Stitch reference
- should be recognizable as the approved design direction

Current implemented structure:
- fixed translucent editorial header
- giant lead hero with right-side image
- dark ticker strip
- asymmetric bento middle section
- dark archive/vault block
- reflections + newsletter split
- editorial multi-column footer

What is still imperfect:
- some wording/anchors/taxonomy choices were bent toward fidelity and may later need product cleanup
- some details from the export are still simplified
- content is still mostly seeded placeholder/editorial demo content

### 8.2 Article page

Status:
- strongest execution surface
- quality benchmark for typography, metadata rail, and longform experience

Keep intact:
- hero hierarchy
- metadata rail
- longform reading rhythm
- pull quote cadence
- related stories section

Future improvements:
- richer structured metadata
- more factual football signals where appropriate
- better image/hero/media discipline
- possible issue/archive references

### 8.3 About page

Status:
- functional but still not fully aligned to the strongest direction

Needs:
- clearer publication framing
- stronger editorial mission and standards
- less abstract/institutional feel
- better use of archive proof, contributors, and trust surfaces

This is the next obvious fidelity/content target after homepage if the user wants page-by-page continuation.

---

## 9. Runtime, local workflow, and iCloud constraints

### 9.1 Commands

Primary local commands:
- `npm run dev`
- `npm test`
- `npm run build`
- `npm run build:local`

### 9.2 iCloud / Next.js build caveat

This repo lives in iCloud Drive.
That can break Next artifact cleanup in `.next/` or `.next-local/`.

Known failure shape:
- `ENOTEMPTY: directory not empty, rmdir ...`

Working local recovery pattern:
1. try `npm run build:local`
2. if `.next-local` itself gets wedged, remove it and rerun:
   - `rm -rf .next-local && npm run build:local`

This worked during the current session.

### 9.3 LAN dev note

A LAN dev server is currently run with Next dev on port `3011`.

Current process info at handoff time:
- local URL: `http://127.0.0.1:3011/`
- LAN URL: `http://192.168.1.233:3011/`
- process id handle in this session: `proc_26162fa486d8`

Important Next.js dev constraint:
- `next.config.ts` now includes `allowedDevOrigins: ["192.168.1.233"]`
- this was needed because Next 16 blocks LAN-origin dev asset requests by default

If the LAN IP changes, update `allowedDevOrigins` accordingly and restart dev.

---

## 10. Validation state at handoff

Verified in this session:
- `npm test` passes
- `npm run build:local` passes
- local dev server returns 200 on `http://127.0.0.1:3011/`

Treat this as the current green baseline.

---

## 11. Known issues / debt

### 11.1 Content architecture drift

The homepage fidelity pass introduced page-specific content arrays directly in `app/page.tsx`.
That was acceptable for speed/fidelity, but it means:
- homepage content strategy is no longer fully centralized in `lib/site-data.ts`
- shared data contracts should be cleaned up before a CMS migration

### 11.2 Navigation/taxonomy tension

There is an unresolved tension between:
- faithful use of Stitch-export labels
- better long-term publication taxonomy from the strategy docs

Rule for future work:
- do not change labels casually page-by-page
- if taxonomy is changed, do it intentionally across docs + data + header/footer + anchors

### 11.3 About page lag

Homepage and article now have clearer direction than About.
About needs a dedicated pass.

### 11.4 Test coverage is still light

Current tests are intentionally lightweight.
Next useful additions:
- route metadata tests
- link/anchor coverage for homepage sections
- article rendering assertions
- a minimal regression suite for shared header/footer behavior

### 11.5 CSS cleanup is deferred

The global CSS is now large and serviceable, but not elegantly consolidated.
Do not “refactor for beauty” before protecting current fidelity.

---

## 12. Requirements for any future agent touching this repo

### 12.1 Before changing anything

Read:
- `docs/agent-handoff.md`
- `docs/design-direction.md`
- the relevant Stitch reference in `design-references/stitch/`

Then inspect:
- the current route file you are changing
- `app/globals.css`
- `lib/site-data.ts`
- relevant tests

### 12.2 Working rules

1. Fidelity before reinterpretation
- if the user approved a reference design, match it first

2. Do not accidentally de-Barça the product
- football must remain central
- avoid abstract luxury/editorial drift

3. Preserve the article page quality bar
- homepage improvements must not make article quality worse

4. Keep external-facing content coherent
- if you change taxonomy, update all affected surfaces

5. Always re-run validation
- `npm test`
- `npm run build:local`

6. Be careful with iCloud build artifacts
- if build breaks on `.next-local`, clear and rerun

### 12.3 What not to do

Do not:
- replace the current direction with a startup/news/blog template
- convert the whole site to raw copied Stitch HTML blobs
- introduce a CMS before the content contracts are stable enough
- aggressively rename sections without reconciling docs and nav
- over-engineer data fetching for a seed-content MVP

---

## 13. Recommended future plan

### Phase A — stabilize the current MVP

1. Clean About page
- make it publication-like, clear, and less institutional
- use the Stitch manifesto reference carefully, not blindly

2. Tighten homepage/details
- close any remaining obvious fidelity gaps
- clean up content/anchor consistency
- add a small regression test for homepage navigation/sections

3. Protect article quality
- ensure no homepage-related CSS changes regress article reading experience

### Phase B — normalize content architecture

4. Refactor homepage content model
- move hardcoded homepage arrays into typed shared data structures
- keep route code mostly presentational
- avoid premature CMS complexity

5. Lock taxonomy
- decide final nav/section naming
- reconcile the docs vs current labels
- update all surfaces once, cleanly

6. Improve metadata discipline
- byline
- date format
- read time
- hero caption/credit handling
- topic/era/section rendering rules

### Phase C — expand the product surface

7. Build archive landing
- not just a dump page
- should feel like a live editorial archive

8. Add section/topic pages
- archive
- analysis
- match notes
- culture
- dispatch
- future: Femení / La Masia if desired

9. Consider CMS/content source only after contract stability
- keep one unified article model for MVP
- controlled taxonomy, not freeform tag soup

### Phase D — hardening/polish

10. Accessibility pass
- keyboard flow
- focus states
- semantic landmarks
- color contrast checks

11. Mobile audit
- home/article/about layout behavior
- nav behavior
- spacing rhythm

12. Performance/image strategy
- replace hotlinked reference images with owned assets when direction locks
- add proper asset pipeline and credit model

---

## 14. Concrete next-task suggestions for another agent

Good next tasks:
1. Port the About page more faithfully / more credibly
2. Normalize homepage content into typed shared data
3. Add regression tests for nav anchors and homepage sections
4. Build an Archive landing page with proper editorial hierarchy
5. Introduce real image assets and caption/credit handling

Best next single task if continuing page-by-page fidelity:
- About page

Best next single task if prioritizing maintainability:
- Homepage content/data normalization + nav/taxonomy cleanup

---

## 15. Handoff checklist

Before handing to another agent, they should confirm:
- [ ] read this document
- [ ] read `docs/design-direction.md`
- [ ] opened the relevant Stitch reference files in `design-references/stitch/`
- [ ] ran `npm test`
- [ ] ran `npm run build:local`
- [ ] inspected the page they plan to change
- [ ] understand the difference between fidelity work and product cleanup

---

## 16. Short blunt version

What this is:
- a premium Barça editorial publication

What matters most:
- article-first quality
- publication feel
- Barça specificity
- archive depth
- zero generic sports-blog drift

What is done:
- working Next app
- article page strong
- homepage now much closer to the approved Stitch design
- reference exports copied into repo

What still needs love:
- About page
- content model cleanup
- taxonomy consistency
- archive/section expansion
- stronger regression tests
