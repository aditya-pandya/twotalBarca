# START HERE — totalBarca

Last updated: 2026-05-02

If you are a new agent touching this repo, do this in order.

## 1. Read these files first

1. `docs/current-product-scope.md`
   - canonical active scope after the 2026-05-02 pivot
2. `docs/agent-handoff.md`
   - working constraints, repo reality, and how not to regress the pivot
3. `docs/prd.md`
   - active product requirements and non-goals
4. `docs/implementation-checklist.md`
   - execution checklist for alignment work still left in runtime/code
5. `docs/editorial-positioning-decisions.md`
   - locked brand/tagline/public-copy rules

## 2. Understand the project in one minute

This is now:
- a weekly Barça dispatch product
- exactly five sharp commentary topics per issue
- minimal last-match and next-match context
- ultra-minimal and phone-friendly
- public brand `totalBarca`

This is not currently:
- a standalone Brief product
- an article-first publication
- a live score product
- a match center
- a broad archive-first browse experience
- a generic sports dashboard

## 3. Current implementation reality

- The repo still contains legacy article/analysis/archive routes and older editorial models.
- Those legacy surfaces are dormant unless Aditya explicitly reintroduces them.
- The docs in this folder now define weekly-dispatch-only scope as canonical.
- The newsroom backend is still useful, but only as support infrastructure for the weekly dispatch and minimal match-context capsules.

## 4. Before you change anything

- Confirm whether your task is docs-only or runtime/code.
- If you touch only Markdown/spec files, markdown sanity is enough.
- If you touch code or data contracts, run the smallest relevant tests and build checks.
- Do not treat legacy routes as active requirements just because they exist in the tree.

## 5. Product-copy rules that stay locked

- keep `Less noise. More Barça.`
- keep `Match context, club memory, cleaner judgment.`
- public copy should point to the weekly dispatch and minimal match context
- do not say "read the Brief and the Dispatch"
- no AI/process/status language in public positioning
- never call the product a blog

## 6. If you are doing design or IA work

Optimize for:
- one calm weekly issue
- text-first hierarchy
- small-screen readability
- dispatch-first ordering
- minimal match capsules

Avoid:
- card soup
- digital-magazine sprawl
- luxury/museum concepting
- sports-dashboard chrome
- route sprawl justified only by old code

## 7. If you are doing newsroom or content-model work

Focus on:
- dispatch issue contract
- exactly five topic items
- last-match capsule
- next-match capsule
- minimal archive of past issues
- dormant/legacy handling for article-first machinery

## 8. Definition of success

You are done when:
- the weekly-dispatch-only scope is clearer than before
- no future agent could mistake the Brief/article/archive stack for active scope
- public-copy rules stay intact
- legacy ideas are either marked dormant or explicitly left as background only
