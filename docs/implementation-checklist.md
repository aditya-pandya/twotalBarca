# totalBarca Implementation Checklist

Last updated: 2026-05-02
Status: use this to align runtime/code with the weekly-dispatch-only docs pivot.

## 1. Docs and scope lock

- [x] `docs/current-product-scope.md` exists and is canonical
- [x] `README.md`, `docs/START-HERE.md`, `docs/product-brief.md`, and `docs/prd.md` reflect the weekly-dispatch-only scope
- [x] design/content-model/IA docs no longer describe the active product as article-first or daily-Brief-led
- [x] historical/recovery docs explicitly mark older broader scope as superseded/dormant/background

## 2. Public product requirements

- [ ] Home/latest issue surface clearly centers the weekly dispatch
- [ ] Dispatch rendering uses exactly 5 topic items
- [ ] Each topic visibly includes a take, commentary, and why-it-matters line
- [ ] Last-match capsule is minimal and text-first
- [ ] Next-match capsule is minimal and text-first
- [ ] Archive of past issues stays small and secondary
- [ ] About copy describes the weekly dispatch and minimal match context only

## 3. Navigation and IA

- [ ] Active nav is reduced to Home, Dispatch, and About (or equally minimal)
- [ ] The old Brief is not presented as a live product surface
- [ ] Match context is not exposed as its own public product route family
- [ ] Legacy article/archive/analysis/culture/taxonomy routes are hidden, clearly dormant, or otherwise prevented from reading as active scope

## 4. Newsroom/data contracts

- [ ] Weekly dispatch records are the primary active editorial objects
- [ ] Compiled site payload exposes latest issue + two match capsules cleanly
- [x] newsroom docs mention the assignment-id draft generation example for weekly dispatch work
- [ ] Legacy article-first newsroom flows are treated as dormant/backlog unless explicitly needed for migration work

## 5. Public-copy guardrails

- [ ] Public brand uses `totalBarca`
- [x] Locked tagline remains `Less noise. More Barça.`
- [x] Locked supporting line remains `Match context, club memory, cleaner judgment.`
- [ ] No public copy says "read the Brief and the Dispatch"
- [ ] No public copy uses AI/process/status/newsroom language
- [ ] No public copy calls the product a blog

## 6. Legacy risk control

- [ ] Dormant surfaces are not linked from active homepage/footer/nav
- [ ] Old broader docs are not being used as active implementation requirements without a supersession note
- [ ] Any reintroduction of articles, reactions, or browse layers is treated as a new scope decision

## 7. Validation

- [x] Markdown/docs pivot reviewed for internal consistency
- [ ] After runtime/code changes, run the smallest relevant tests
- [ ] After runtime/code changes, run the relevant build check
