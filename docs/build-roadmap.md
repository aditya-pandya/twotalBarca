# twotalBarça — Build Roadmap

Last updated: 2026-04-03

## Status

Visual direction is still being tuned in Stitch, but enough is stable to execute non-visual work now.
Homepage canon: “The Last of the Catalan Romantics.”

## What can proceed immediately

1. Content model
2. Navigation and taxonomy
3. Page/module contracts
4. Token categories and semantic roles
5. Article-first implementation scaffold
6. Real placeholder/editorial seed copy

## What should not be treated as final yet

1. exact wordmark design
2. final image treatment
3. final color hexes
4. final motion details
5. any Stitch-generated frontend code until reviewed

---

## Revised execution order

### Phase 0 — lock the spine
- choose display/body/UI typography roles
- define semantic color tokens
- define spacing + layout scale
- define content model
- define nav and module order

Deliverables:
- `content-model-and-ia.md`
- `page-component-spec.md`

### Phase 1 — article-first MVP
Build the article page first because it stress-tests the whole system.

Scope:
- shell/header/footer skeleton
- article header
- body renderer
- figure/caption system
- pull quote
- related stories
- metadata/SEO base

Exit criteria:
- long essay reads well on desktop + mobile
- hero/no-hero variants work
- no off-brand drift

### Phase 2 — homepage foundation
Scope:
- lead feature
- secondary rail
- The Brief
- Match / Club Pulse
- basic mission panel

Exit criteria:
- homepage feels curated, not crowded
- lead story feels editorially weighted

### Phase 3 — homepage depth
Scope:
- Analysis & Tactics
- Reflections
- The Vault
- Weekly Dispatch
- Editors’ Picks

Exit criteria:
- archive depth is visible
- homepage supports both timely and evergreen content

### Phase 4 — about page
Scope:
- mission
- what we cover
- principles
- contributors
- in the club’s long memory
- contact / dispatch invitation

Exit criteria:
- page feels human, Barça-rooted, and credible
- no conceptual-luxury drift

### Phase 5 — hardening
Scope:
- responsive pass
- mobile nav
- accessibility audit
- content fallback states
- image/credit hygiene
- polish

---

## MVP priorities

Must-have:
- article page
- homepage core modules
- about page
- structured article schema
- archive-aware taxonomy
- dispatch module

Nice-to-have later:
- rich author pages
- advanced archive browse
- footnotes/citations
- interactive tactical boards
- membership layer
- multilingual support

---

## Risks to watch

### Typography drift
If type isn’t locked early, everything will feel unstable.

### Blue/red/gold misuse
Too much saturation will look cheap fast.
Blue should lead. Red supports. Gold is minimal.

### Weak placeholder content
Premium editorial layouts collapse when fed generic lorem ipsum or weak headlines.
Use Barça-specific seed content early.

### Mobile neglect
A beautiful desktop magazine that dies on a phone is not shippable.

### Stitch code temptation
Stitch may generate useful reference code, but do not trust it blindly.
Review structure, responsiveness, and token discipline before adopting any of it.

---

## Subagent note

Tried to use built-in `delegate_task` for this work.
It failed immediately in this environment with:
- `name '_saved_tool_names' is not defined`

Workaround used:
- Claude CLI
- Gemini CLI

Their outputs were used as parallel planning input and then merged into the docs in this folder.

---

## Next recommended execution step

If we keep moving before Stitch settles:
1. finalize typography roles
2. decide implementation stack/repo target
3. scaffold article page + shared primitives
4. draft real seed content for:
   - one homepage lead
   - one Brief rail
   - one Analysis lead
   - one Vault piece
   - one About page statement
