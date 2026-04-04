# twotalBarça — Product Requirements Document (PRD)

Last updated: 2026-04-04
Status: active working draft

---

## 1. Product overview

twotalBarça is a premium FC Barcelona editorial publication.

It is not a news wire, not a rumor mill, and not a generic sports blog.
The product exists to deliver a serious, beautifully presented, Barça-specific reading experience that combines present-tense football analysis with club memory, cultural context, and archival depth.

Core proposition:
- an article-first publication
- a living archive of club identity
- a curated editorial front page rather than a feed
- a product for readers who want durable football writing, not churn

---

## 2. Problem statement

Most football coverage aimed at supporters is optimized for speed, volume, and churn:
- transfer noise
- match-cycle overreaction
- generic templates
- weak design systems
- shallow archive treatment

That leaves a gap for readers who want:
- serious football writing
- cultural and historical context
- Barça specificity
- design quality that feels like a publication rather than a dashboard
- content worth revisiting after the match cycle moves on

---

## 3. Vision

Build the digital equivalent of a premium Barça editorial review:
- elegant but not precious
- literary but not pretentious
- football-native rather than design-tourist
- archival without becoming a museum brochure
- current without becoming frantic

The site should feel like a publication with memory.

---

## 4. Goals

### 4.1 Product goals

- Deliver a best-in-class longform reading experience for Barça-focused editorial content.
- Establish a clear editorial front page that feels curated and alive.
- Make the archive a primary surface, not a buried appendix.
- Build a coherent MVP that can later expand into archive, topic, season, and dispatch surfaces.

### 4.2 User goals

Users should be able to:
- immediately understand what twotalBarça is
- discover the most important current and evergreen stories quickly
- read longform comfortably on desktop and mobile
- understand editorial context through metadata, sectioning, and curation
- move between current analysis and archive material naturally

### 4.3 Business / strategic goals

- Establish a distinctive editorial identity
- Create a credible foundation for future dispatch/membership/archive depth
- Build an extensible content system that can later support richer publishing workflows

---

## 5. Non-goals

The MVP is not trying to be:
- a live score app
- a transfer tracker
- a social feed
- a general football aggregator
- a commerce-heavy media brand
- a fully dynamic CMS-backed newsroom on day one
- a broad multi-club football site

---

## 6. Target audience

### 6.1 Primary audience

- FC Barcelona supporters who want something more literate and durable than mainstream fan coverage
- readers who care about tactics, club identity, history, memory, stadium culture, and place

### 6.2 Secondary audience

- design-conscious football readers
- readers interested in Catalan identity and club history
- readers who like longform sports/culture writing even if they are not daily Barça obsessives

### 6.3 What they value

- clarity over hype
- editorial taste
- meaningful hierarchy
- durable insight
- archive depth
- strong writing
- a product that respects their attention

---

## 7. User needs

Users need:
- a homepage that signals curation rather than noise
- pages that are unmistakably Barça-specific
- article pages that feel premium and easy to read
- metadata that clarifies what a piece is and why it matters
- a trustworthy About page that explains editorial mission and standards
- a sense that archive content matters as much as current coverage

---

## 8. Core product principles

- Article-first
- Manual curation first
- Archive-aware
- Barça-specific
- Readability over novelty
- Editorial discipline over card spam
- Precision over posture

---

## 9. Experience principles

The product should feel:
- serious
- intimate
- tactile
- restrained
- warm
- contemporary
- rooted in football, not just aesthetics

The product should not feel:
- glossy-luxury for its own sake
- institutional and distant
- generic sports-dashboard loud
- overloaded with labels, cards, or fake urgency

---

## 10. MVP scope

### 10.1 In scope

MVP pages:
1. Homepage
2. Article page
3. About page

MVP editorial pillars:
- The Brief
- Match Notes
- Analysis
- Tactics
- Culture
- Archive
- Essays / Reflections
- Weekly Dispatch

MVP capabilities:
- static rendering
- deterministic article routing
- shared header/footer/layout
- typed in-repo content
- coherent typography and metadata system
- curated homepage modules
- article detail pages
- basic about/editorial trust surface

### 10.2 Out of scope for MVP

- advanced archive filtering
- author profile system
- membership gating
- multilingual support
- live match data integrations
- editorial backend/CMS
- personalized feeds
- comments/community layer

---

## 11. Functional requirements

### 11.1 Homepage

The homepage must:
- present one dominant lead feature
- surface concise current/editorial signals
- include a brief/dispatch layer
- include an analysis/culture layer
- include one archive/vault surface
- include a dispatch/signup surface
- feel curated rather than dense

The homepage should communicate:
- this is Barça
- this is a publication
- this values both current football and history

### 11.2 Article page

The article page must:
- support longform reading cleanly
- display editorial metadata clearly
- support hero framing
- support quote/pull-quote rhythm
- support related-story continuation
- feel like the product’s highest-quality reading surface

### 11.3 About page

The about page must:
- explain what twotalBarça is
- explain editorial standards and intent
- establish trust
- avoid institutional/gallery drift
- feel like a publication page, not a manifesto deck

### 11.4 Navigation

Navigation must:
- clearly orient readers
- avoid vague, abstract labels long-term
- connect homepage modules to deeper surfaces
- remain coherent across header/footer/home sections

### 11.5 Metadata discipline

Articles must support:
- byline
- publication date
- reading time
- section or article-type context
- image caption/credit discipline where media exists

---

## 12. Content requirements

### 12.1 Unified article model

The editorial system should prefer one unified Article model for the MVP rather than many fragmented content types.
Presentation differences should come from:
- section
- article type
- feature flags
- references and structured metadata

### 12.2 Taxonomy

Taxonomy must be controlled.
No freeform tag soup.

Preferred primary sections:
- Home
- The Brief
- Match Notes
- Analysis
- Culture
- Archive
- About

Potential later expansion:
- Dispatch
- La Masia
- Femení
- Opinion

### 12.3 Archive requirement

Archive content must not feel secondary.
It should be visibly present in the core product and discoverable from the homepage.

---

## 13. Design requirements

### 13.1 Visual direction

The visual system should use:
- warm paper/cream backgrounds
- deep navy structure
- restrained garnet and gold accents
- serif-led typography
- editorial spacing and rhythm

### 13.2 Design quality bar

A page is successful when it:
- clearly reads as Barça-specific
- clearly reads as a publication page
- does not feel like a generic sports blog
- does not feel like a fashion spread
- does not feel like a museum brochure

### 13.3 Fidelity rule

Where approved design references exist:
- match them first
- clean up implementation second
- do not redesign away from the reference before the user recognizes it

---

## 14. Technical requirements

- Next.js App Router implementation
- static-first architecture
- typed in-repo seed content initially
- shared layout/components/tokens
- test coverage for data helpers and key UI smoke paths
- successful production build
- safe local workflow for iCloud-backed repo constraints

---

## 15. Success metrics

### 15.1 Qualitative success

A user should immediately feel:
- this is about FC Barcelona
- this is a publication
- this is worth reading
- this is not generic

### 15.2 Product success indicators

- homepage feels curated, not crowded
- article page feels premium and readable
- about page feels clear and credible
- archive visibly matters in the product
- design direction is coherent across pages

### 15.3 Delivery success indicators

- agents can extend the project without re-deriving the entire direction
- docs are sufficient for handoff
- tests and build remain green during changes

---

## 16. Known constraints

- Repo lives in iCloud Drive, which can interfere with Next build artifact cleanup.
- Some local builds may require `npm run build:local` and occasional `.next-local` cleanup.
- Current content is still static seed data.
- Homepage fidelity has recently improved, but About still trails in polish.
- There is still some tension between strict design fidelity and ideal long-term taxonomy.

---

## 17. Risks

### 17.1 Product risks

- drifting into vague luxury-editorial language
- losing football specificity
- overloading the homepage
- treating the archive as decoration instead of product

### 17.2 Design risks

- overuse of garnet/gold leading to cheapness
- abstract conceptual imagery overwhelming football signal
- weak mobile adaptation

### 17.3 Technical risks

- accumulating page-specific hacks instead of normalizing content/components
- CSS sprawl in `app/globals.css`
- introducing CMS complexity before content contracts are stable

---

## 18. Future roadmap

### Phase 1 — stabilize MVP
- finish homepage fidelity and consistency cleanup
- improve About page
- protect article page quality
- expand regression coverage

### Phase 2 — normalize architecture
- centralize homepage content contracts
- reconcile taxonomy and navigation labels
- tighten metadata rules

### Phase 3 — expand product surface
- archive landing
- section/topic pages
- dispatch archive
- season/person surfaces

### Phase 4 — hardening
- accessibility pass
- mobile polish
- image asset strategy
- future CMS evaluation

---

## 19. Open decisions

These are not fully settled yet:
- final long-term top-level taxonomy
- how strictly to preserve Stitch labels vs stronger editorial naming
- when to migrate from local seed data to a CMS/content source
- final archive/browse information architecture

---

## 20. Summary

twotalBarça should become a premium Barça editorial publication with:
- longform quality
- archive depth
- curated discovery
- strong publication identity
- zero generic sports-site energy

The MVP is small on purpose.
The standard is not.
