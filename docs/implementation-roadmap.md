# twotalBarça Implementation Roadmap

Last updated: 2026-04-03

> Docs first. No product code changes should start until the team agrees this direction is locked enough.

## 1. Build order

### Phase 0 — Foundation docs and repo setup
- Create repository
- Consolidate product/docs direction
- Lock page inventory
- Lock navigation and section naming
- Choose stack/CMS direction
- Define MVP data contracts

### Phase 1 — Shared system
Build the shared, non-page-specific foundation first.

Needed:
- app shell / layout
- header / nav / footer
- typography tokens
- color tokens
- spacing scale
- shared link/button primitives
- image/figure component
- metadata cluster
- story card variants
- prose renderer

Rule:
Do not build page one-offs before shared editorial primitives exist.

### Phase 2 — Article page first
The article page is the MVP center of gravity.

Build first:
- article template
- hero block
- metadata rail
- prose renderer
- figure/caption handling
- pull quote treatment
- related stories module

Why first:
- strongest current design direction
- reading experience is the product
- easiest page to use as quality bar for typography and spacing

### Phase 3 — Homepage
Build once article primitives exist.

Needed:
- lead feature module
- The Brief module
- current football module / Match Notes
- analysis/culture rails
- archive shelf module
- dispatch/signup module

Rule:
Homepage should feel curated, not feed-heavy.

### Phase 4 — About page
Build after the shared system and article/home patterns are stable.

Needed:
- mission block
- standards/principles block
- coverage map
- contributors/editors block
- dispatch/membership invite

Rule:
No gallery/institution cosplay.

### Phase 5 — Archive and browse surfaces
After the core 3 pages are stable.

Potential next pages:
- archive landing
- section landing pages
- topic pages
- issue/dispatch page
- person page
- season page

## 2. Immediate decisions to lock before coding

### A. Naming / IA
Lock these first:
- final top nav labels
- homepage section labels
- article type names
- section taxonomy

### B. Stack
Need explicit decision on:
- framework
- CMS or content source
- image strategy
- deployment target

### C. Editorial metadata rules
Need exact rendering decisions for:
- byline
- date format
- read time
- image credits
- archive/source notes

## 3. Current recommended page system

### Homepage
- Lead Feature
- The Brief
- Match Notes
- Analysis
- Culture / Essays
- From the Archive
- Dispatch signup

### Article
- Hero / header
- Metadata rail
- Prose body
- Pull quote / figure blocks
- Related stories

### About
- Mission
- Editorial standards
- Coverage areas
- Editorial team / contributors
- Subscribe / dispatch

## 4. Content/design guardrails during implementation

### Always preserve
- clear Barça specificity
- publication hierarchy
- premium editorial restraint
- readability over novelty
- manual curation bias

### Never drift into
- fashion-magazine product language
- abstract gallery brochure structure
- generic sports-site card spam
- noisy tickers and fake urgency

## 5. Definition of “ready to code”

We can start code changes once:
- repo exists
- docs are in place
- nav labels are agreed
- MVP pages are agreed
- content model is agreed
- stack choice is agreed
- article page is accepted as the visual/product north star

## 6. First implementation targets once coding starts

1. Repo/app scaffold
2. Global shell
3. Typography + token system
4. Story card primitives
5. Article template
6. Homepage sections
7. About page
8. Archive surfaces

## 7. Nice-to-have later, not MVP

- advanced archive filters
- member-only gating
- audio versions
- issue-style dispatch archives
- multilingual support
- richer match data views
- contributor profiles with full author pages
