# totalBarca PRD

Last updated: 2026-05-02
Status: active product requirements after the weekly-dispatch-only scope pivot.

## 1. Summary

totalBarca is now a weekly FC Barcelona dispatch product.

The active product is:
- one weekly dispatch issue
- exactly five topics/items per issue
- minimal last-match capsule
- minimal next-match capsule
- minimal archive of past issues if needed

The old standalone Brief is retired.
The old article-first / archive-first / broad publication framing is superseded for active scope.

## 2. Problem

Barça coverage is loud, repetitive, and too often built around daily churn.
totalBarca should reduce that sprawl into one edited weekly line:
- five worthwhile takes
- enough match context to orient the reader
- no false urgency

## 3. Product thesis

Readers do not need more surfaces.
They need a cleaner weekly read.

totalBarca wins if one issue can quickly answer:
- what mattered this week around Barça?
- what is the clearest read on each item?
- what just happened in the last match?
- what should I watch in the next one?

## 4. Goals

1. Publish exactly one strong weekly issue instead of pretending to be a daily outlet.
2. Fold the best part of the old Brief into the weekly Dispatch.
3. Keep match context useful without becoming a live-service product.
4. Preserve the brand voice: calm, intelligent, Barça-specific, adult.
5. Make docs and implementation stop implying broader active scope than the product actually has.

## 5. Non-goals

Not part of active scope:
- a daily Brief
- a live score or match center
- a fixture/table engine
- broad article publishing as the main product loop
- archive/vault resurfacing as a front-door promise
- topic/person/season browsing as active public IA
- reaction or community products
- noisy feed mechanics

## 6. Users

Primary user:
- a Barça supporter who wants sharp weekly judgment without living inside churn

Secondary users:
- readers who want occasional context on Femení, La Masia, tactics, governance, or culture when those angles genuinely matter that week

## 7. Functional requirements

### FR1. Weekly dispatch issue
The system must support one weekly issue with exactly five ordered topics.

Each topic must include:
- topic/headline
- editorial take
- concise commentary/opinion
- why it matters

Optional internal-only support:
- evidence notes
- source links
- related newsroom references

Disallowed interpretations:
- generic bullet roundup
- automated link dump
- thin summary without a point of view
- longform article disguised as one dispatch item

### FR2. Match context capsules
The issue/home surface must support:
- one last-match capsule
- one next-match capsule

Last-match capsule fields:
- opponent
- competition
- date
- score/result when known
- one short editorial read

Next-match capsule fields:
- opponent
- competition
- kickoff/date
- venue if useful
- one thing to watch

### FR3. Information architecture
Active public IA is limited to:
- `/`
- dispatch issue reading surface
- dispatch archive/listing if needed
- minimal About/positioning surface

Match context is a module/capsule, not a standalone product surface.

### FR4. Public copy
Public copy must:
- use `totalBarca`
- keep the locked tagline/supporting line
- refer to the weekly dispatch and minimal match context
- avoid AI/process language
- avoid blog language

Public copy must not:
- describe a newsroom workflow
- promise articles, briefs, reactions, or match-center behavior as active scope
- imply daily cadence

### FR5. Legacy handling
The repo may still contain:
- article pages
- brief routes
- archive shelves
- taxonomy browse layers
- reaction widgets
- broader newsroom machinery

Requirement:
- these may remain in code/history, but docs and current product framing must mark them dormant/legacy/backlog unless explicitly reintroduced later

### FR6. Newsroom support
The repo-local newsroom backend remains acceptable only insofar as it supports:
- weekly issue planning
- evidence gathering
- approvals
- dispatch record assembly
- match capsule assembly
- compiled publish payload generation

## 8. UX requirements

- ultra-minimal
- text-first
- phone-friendly first, desktop clean second
- one clear editorial hierarchy
- calm issue feeling, not card soup

Desired top-to-bottom order on home/latest issue surfaces:
1. masthead / positioning
2. this week's dispatch with 5 items
3. last-match capsule
4. next-match capsule
5. small archive of past issues if needed

## 9. Content requirements

- exactly five topics every time
- each topic must earn its slot with current evidence
- topics may span men's first team, Femení, La Masia, tactics, governance, culture, etc.
- do not force variety for its own sake; force evidence and clarity
- if a week only supports five good items after disciplined curation, that is enough

## 10. Technical/data implications

Active data contracts should center on:
- dispatch issue
- dispatch topic item
- last-match capsule
- next-match capsule
- minimal issue archive entry

Older article-first models can remain temporarily, but they no longer define active requirements.

## 11. Risks

### Risk: legacy scope keeps leaking back in
Mitigation:
- mark article/brief/archive-first language as dormant or superseded
- keep a canonical scope doc

### Risk: dispatch becomes a link roundup
Mitigation:
- enforce take + commentary + why-it-matters per item

### Risk: match context expands into a match center
Mitigation:
- keep capsule fields deliberately minimal
- reject table/fixture/ticker creep

### Risk: design drifts into magazine/dashboard sprawl
Mitigation:
- preserve single-column/text-first hierarchy
- minimize competing modules

## 12. Success metrics

Qualitative success:
- a future agent can explain the product in one sentence without mentioning articles, a daily Brief, or a live score product
- home/latest issue surface feels edited rather than busy
- the weekly issue reads like one deliberate editorial package

Delivery success:
- docs consistently reflect the weekly-dispatch-only scope
- runtime work can now simplify around that scope without ambiguity

## 13. Supersession note

Older docs in this repo may still mention:
- article-first publication framing
- The Brief as a separate daily product
- broad archive/section/taxonomy ambitions
- analysis/culture/reactive surfaces

Those references are historical/background unless Aditya explicitly reopens them.
