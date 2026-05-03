---
name: Weekly Dispatch
slug: weekly-dispatch
assignee: distribution-audience-lead
project: audience-ops
recurring: true
---

Last updated: 2026-05-02

Build the weekly dispatch issue for totalBarca.

The issue must:
- publish once per week
- contain exactly 5 topics
- give each topic a clear take, concise commentary, and why-it-matters line
- include one minimal last-match capsule
- include one minimal next-match capsule
- avoid becoming a link roundup, a feed, or a disguised longform package

Required local workflow:
- run `npm run newsroom:scout-barca` before packaging so the desk has current supporter and fixture context
- review `newsroom/generated/barca-scout-report.json` for the strongest supported issue angles
- touch `newsroom/content/dispatch/*.json`, not just homepage promo copy
- only point to supporting stories or notes that actually exist and are verified
- confirm `copy-chief` and `editor-in-chief` approvals exist in `newsroom/approvals/*.json`
- keep `distributionStatus` as `deferred`
- refresh the compiled payload with `npm run newsroom:build`

Practical note:
- if draft generation lookup is ambiguous, use the assignment id form, for example `assignment-weekly-dispatch-14`
