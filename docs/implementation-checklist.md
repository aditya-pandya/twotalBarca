# twotalBarça — Technical Implementation Checklist

Last updated: 2026-04-04

Use this as the execution checklist for the next agent.
It is intentionally practical and split by system, pages, and components.

Legend:
- [ ] not done
- [~] partially done / needs revisit
- [x] done enough for now

---

## 1. Project-wide guardrails

Before touching code:
- [ ] Read `docs/agent-handoff.md`
- [ ] Read `docs/design-direction.md`
- [ ] Open the relevant Stitch reference in `design-references/stitch/`
- [ ] Confirm whether this task is fidelity work or product cleanup
- [ ] Run `npm test`
- [ ] Run `npm run build:local`

When making changes:
- [ ] Preserve Barça specificity
- [ ] Preserve article-page quality bar
- [ ] Avoid fashion-magazine / museum drift
- [ ] Avoid generic sports-dashboard drift
- [ ] Keep taxonomy changes intentional and global, not accidental

Before finishing:
- [ ] Re-run `npm test`
- [ ] Re-run `npm run build:local`
- [ ] Smoke-check impacted routes
- [ ] Confirm header/footer/nav consistency

---

## 2. System / architecture checklist

### 2.1 Repo and runtime
- [x] Next.js App Router repo exists
- [x] Shared layout shell exists
- [x] Local seed data exists
- [x] Tests exist
- [x] Build passes
- [~] Architecture docs need periodic updates as implementation changes

### 2.2 Data architecture
- [x] `lib/site-data.ts` provides typed article/about/navigation data
- [~] Homepage still contains page-local content arrays that should be normalized
- [ ] Create a coherent homepage content contract in shared data
- [ ] Remove stale/duplicated homepage content definitions after normalization
- [ ] Define future dispatch/archive/topic structures cleanly
- [ ] Prepare for CMS migration only after contracts stabilize

### 2.3 Styling architecture
- [x] Global styles centralized in `app/globals.css`
- [x] Fonts now routed through `next/font/google`
- [~] Homepage fidelity styles coexist with older global/editorial styles
- [ ] Audit CSS for duplication and dead styles after fidelity work stabilizes
- [ ] Separate page-specific styles from generic editorial primitives more cleanly if needed
- [ ] Keep refactors low-risk and regression-tested

### 2.4 Testing
- [x] Seed data helper tests exist
- [x] UI smoke tests exist
- [ ] Add nav-anchor regression tests
- [ ] Add article route rendering assertions
- [ ] Add About page smoke assertions
- [ ] Add metadata-level checks where useful

---

## 3. Shared layout / shell checklist

### 3.1 Layout
Files:
- `app/layout.tsx`
- `app/globals.css`

Checklist:
- [x] Global shell wraps all pages
- [x] Shared header/footer mounted globally
- [x] Shared font loading configured
- [x] Main content offset accounts for fixed header
- [ ] Audit route-level metadata completeness beyond the seeded basics

### 3.2 Header
Files:
- `components/site-header.tsx`
- `app/globals.css`

Checklist:
- [x] Fixed/translucent editorial header exists
- [x] Wordmark present
- [x] Primary nav present
- [x] CTA present
- [x] Search affordance present
- [~] Current labels mirror Stitch-ish wording in places
- [ ] Reconcile long-term taxonomy if product naming changes
- [ ] Confirm active-state behavior remains correct for all non-hash routes
- [ ] Add tests for header link destinations if nav changes again

### 3.3 Footer
Files:
- `components/site-footer.tsx`
- `app/globals.css`

Checklist:
- [x] Editorial footer structure exists
- [x] Multi-column link layout exists
- [x] Brand statement exists
- [~] Footer content still partly placeholder/editorial demo copy
- [ ] Reconcile footer taxonomy if top-level nav changes
- [ ] Ensure footer links map to real routes/anchors

---

## 4. Homepage checklist

Files:
- `app/page.tsx`
- `app/globals.css`
- `design-references/stitch/homepage-reference.html`
- `design-references/stitch/homepage-reference.png`

Current status:
- materially closer to the Stitch export than before
- still eligible for cleanup and minor fidelity tightening

### 4.1 Structure and fidelity
- [x] Dominant hero exists
- [x] Right-side hero image exists
- [x] Ticker strip exists
- [x] Bento analysis/culture/brief section exists
- [x] Vault/archive section exists
- [x] Reflections/newsletter section exists
- [x] Editorial footer exists
- [ ] Compare current implementation against the reference screenshots for any remaining high-visibility mismatches
- [ ] Tighten small interaction/details only after structural fidelity is preserved

### 4.2 Content/anchors
- [x] Section anchors exist for major surfaces
- [~] Some naming is fidelity-driven rather than ideal long-term taxonomy
- [ ] Normalize homepage section naming if a final taxonomy decision is made
- [ ] Keep links and anchor ids consistent across header, footer, and page sections
- [ ] Move homepage content arrays into shared typed data structures

### 4.3 UX / editorial quality
- [x] Homepage feels curated rather than feed-dense
- [x] Lead story is visually weighted
- [~] Content is still mostly seeded/demo editorial material
- [ ] Replace/upgrade demo content with more realistic editorial seeds if needed
- [ ] Ensure archive material feels integral, not decorative

### 4.4 Technical follow-up
- [ ] Add regression tests for homepage section links/anchors
- [ ] Add smoke assertions for key modules
- [ ] Review for any avoidable hardcoded duplication after content normalization

---

## 5. Article page checklist

Files:
- `app/article/[slug]/page.tsx`
- `components/article-body.tsx`
- `components/primitives.tsx`
- `design-references/stitch/article-reference.html`
- `design-references/stitch/article-reference.png`

Current status:
- strongest page
- quality bar for the project

### 5.1 Structure
- [x] Strong article hero exists
- [x] Metadata rail exists
- [x] Longform body exists
- [x] Pull quote / editorial rhythm exists
- [x] Related stories continuation exists
- [x] Static generation exists

### 5.2 Quality bar
- [x] Reading flow is strong
- [x] Typography rhythm is credible
- [~] Could use richer structured metadata
- [~] Could use more direct football/factual modules where relevant
- [ ] Audit hero/media treatment against the article reference again before major visual changes elsewhere

### 5.3 Future improvements
- [ ] Add richer metadata rendering rules
- [ ] Add stronger hero/caption/credit discipline
- [ ] Add optional factual modules (timeline, stats, notes) where appropriate
- [ ] Consider structured author/archive references later

### 5.4 Testing
- [ ] Add route-level assertions for article rendering
- [ ] Add tests for `generateStaticParams()` / metadata behavior if useful

---

## 6. About page checklist

Files:
- `app/about/page.tsx`
- `design-references/stitch/manifesto-reference.html`
- `design-references/stitch/manifesto-reference.png`

Current status:
- functional
- still behind homepage/article in direction and polish

### 6.1 Product/content goals
- [ ] Make About clearly explain the publication
- [ ] Reduce institutional/gallery drift
- [ ] Strengthen mission + standards + coverage explanation
- [ ] Add more convincing trust surfaces
- [ ] Make it feel publication-like rather than abstract-manifesto-like

### 6.2 Recommended content blocks
- [x] Intro header exists
- [x] Mission-ish content exists
- [x] Contributors block exists
- [ ] Add stronger editorial standards block
- [ ] Add clearer coverage map / what we cover
- [ ] Add better archive / evidence / credibility block
- [ ] Add stronger dispatch/membership invitation

### 6.3 Implementation follow-up
- [ ] Rework About page with direct reference to both manifesto reference and current product rules
- [ ] Avoid copying weak conceptual language from Stitch blindly
- [ ] Add smoke tests after the About pass

---

## 7. Content model checklist

Files:
- `docs/content-model.md`
- `lib/site-data.ts`

### 7.1 MVP model
- [x] Unified Article model direction is documented
- [x] Dispatch/Match/Person/Season/Topic ideas are documented
- [~] Runtime code only partially reflects the intended normalized model
- [ ] Normalize runtime seed data structure to better match documented model
- [ ] Decide what must exist before a CMS migration

### 7.2 Taxonomy
- [x] Controlled taxonomy direction documented
- [~] Runtime labels still reflect a blend of older strategy and Stitch fidelity
- [ ] Lock final section names
- [ ] Apply naming changes consistently across docs, code, navigation, and content

---

## 8. Reference asset checklist

Files:
- `design-references/stitch/*`

Checklist:
- [x] Homepage reference copied into repo
- [x] Article reference copied into repo
- [x] Manifesto reference copied into repo
- [x] Files renamed sanely
- [x] README added
- [ ] If future references are added, keep naming consistent and documented
- [ ] If remote images are later localized, document the source mapping

---

## 9. Local workflow / build checklist

### 9.1 Standard workflow
- [x] `npm test`
- [x] `npm run build:local`
- [x] local dev server works

### 9.2 iCloud workaround
- [x] `build:local` exists for iCloud-backed worktrees
- [x] Known recovery path: remove `.next-local` if build cleanup gets wedged
- [ ] Document any new iCloud failure modes if they appear

### 9.3 LAN dev
- [x] `next.config.ts` includes `allowedDevOrigins` for current LAN IP
- [~] This may need updating if LAN IP changes
- [ ] If the IP changes, update config and restart dev

---

## 10. Suggested execution order for the next agent

### Option A — continue page-by-page fidelity
1. [ ] About page fidelity/clarity pass
2. [ ] Homepage detail cleanup
3. [ ] Article page refinement if needed
4. [ ] Regression tests for nav/anchors/pages

### Option B — stabilize architecture first
1. [ ] Normalize homepage content into shared typed data
2. [ ] Reconcile taxonomy/nav labels
3. [ ] Add regression tests
4. [ ] Then do About page cleanup

Recommended default:
- About page next, unless the user explicitly asks for data/model cleanup first.

---

## 11. Definition of done for the current MVP

The MVP is in strong-enough shape when:
- [ ] homepage feels like a real publication front page
- [ ] article page remains the strongest reading surface
- [ ] about page is clear, credible, and non-institutional
- [ ] navigation/taxonomy are coherent
- [ ] archive visibly matters
- [ ] test/build baseline stays green
- [ ] another agent can extend the project without re-deriving the strategy
