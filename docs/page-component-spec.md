# totalBarca Page and Component Spec

Last updated: 2026-05-02
Status: active surface spec only.

## 1. Home / latest issue page

Required order:
1. masthead / positioning block
2. weekly dispatch issue block
3. last-match capsule
4. next-match capsule
5. small archive block if needed

### Masthead / positioning block
Must include:
- `totalBarca`
- locked tagline
- locked supporting line
- short supporting copy that points to the weekly dispatch and match context

Must not include:
- references to a standalone Brief
- article-first promises
- newsroom/process copy

### Weekly dispatch issue block
Must include:
- issue label/title/date
- optional short note
- exactly 5 topic items

Each topic item must render:
- topic/headline
- take
- commentary
- why-it-matters line

Layout rules:
- read as one sequence
- avoid promo-card fragmentation
- keep text hierarchy obvious

### Last-match capsule
Must render:
- label
- opponent
- competition
- date
- result when known
- one short editorial read

### Next-match capsule
Must render:
- label
- opponent
- competition
- kickoff/date
- venue if useful
- one thing to watch

### Archive block
Keep minimal:
- list of past issue links or issue summaries
- no broad browse taxonomy

## 2. Dispatch issue page

Required order:
1. issue header
2. optional short note
3. 5 topic items
4. last-match capsule
5. next-match capsule
6. prior issue links if useful

The issue page should feel like a clean read, not a magazine spread.

## 3. Dispatch archive page

Purpose:
- help readers access previous weekly issues

Rules:
- issue list only
- lightweight summaries are fine
- do not turn this into a full archive/vault/browser experience

## 4. About page

Purpose:
- explain the product in plain language

Must say, in substance:
- totalBarca is a weekly Barça dispatch
- it publishes five sharp weekly topics
- it adds minimal match context
- it aims for calm, adult judgment

Must not read like:
- a manifesto deck
- a newsroom org chart
- a broad editorial network pitch

## 5. Responsive rules

On mobile:
- all active content should work in one vertical flow
- topic items should remain skimmable without collapsing their take
- match capsules should not exceed their informational role

On desktop:
- whitespace may increase
- hierarchy may breathe more
- but the product should still feel narrow and disciplined

## 6. Dormant legacy components

These are not active component requirements right now:
- standalone Brief module
- article hero / longform body as primary homepage center of gravity
- analysis/culture shelves
- archive/vault modules as homepage anchors
- reaction widgets
- match-center style blocks

If legacy components still exist in code, treat them as dormant implementation residue rather than targets to preserve.

## 7. Component quality bar

Good:
- clear text hierarchy
- fast comprehension on phone
- obvious issue structure
- one calm editorial center of gravity

Bad:
- card soup
- decorative rails with weak purpose
- five topics that look like unrelated promos
- match context that tries to become a product of its own
