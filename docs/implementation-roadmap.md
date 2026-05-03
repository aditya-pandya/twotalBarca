# totalBarca Implementation Roadmap

Last updated: 2026-05-02

> Scope first. The active product is now the weekly dispatch plus minimal match context. Build and cleanup work should simplify toward that, not preserve older article-first ambitions by inertia.

## 1. Build order

### Phase 0 — scope lock
Done in docs:
- lock canonical product scope
- mark Brief/article/archive-first ideas as dormant or superseded
- align handoff/product/design/content docs

### Phase 1 — align active public IA
Runtime priorities:
- make home/latest issue the center of gravity
- keep public nav minimal: Home, Dispatch, About
- stop active copy from promising Brief/article/archive surfaces
- ensure match context is rendered as a module, not a route family

### Phase 2 — harden dispatch issue rendering
Build or confirm:
- dispatch issue header
- exactly 5 topic items
- explicit take/commentary/why-it-matters rendering
- minimal last-match capsule
- minimal next-match capsule

### Phase 3 — keep archive tiny
Build or confirm:
- dispatch archive/listing only as needed
- small issue summaries
- no broad browse or vault resurrection by drift

### Phase 4 — align newsroom/data contracts
Priorities:
- treat dispatch records as the primary active editorial object
- support the two match capsules in compiled payloads
- keep approvals/build pipeline working for weekly issues
- leave legacy article machinery dormant unless explicitly revived

### Phase 5 — legacy cleanup and hardening
- remove dormant routes from active navigation and homepage logic
- add concise dormant notices or hide routes if they still resolve publicly
- consider `noindex` for dormant surfaces if crawl noise becomes a real problem
- run focused tests/build checks after code changes

## 2. Current active surface targets

1. Home / latest issue
2. Dispatch issue page
3. Dispatch archive
4. About

## 3. Out of scope for now

- daily Brief product
- article-first publishing loop
- broad archive browse
- match center / live score features
- analysis/culture/topic/person/season route expansion
- reaction/community product work

## 4. Definition of ready to ship

The implementation is aligned when:
- the weekly dispatch is obviously the product center of gravity
- exactly five issue items are enforced or plainly modeled
- match capsules are useful but small
- public copy no longer promises the old Brief/article stack
- dormant surfaces are not accidentally treated as active scope
