---
name: Weekly Dispatch
slug: weekly-dispatch
assignee: distribution-audience-lead
project: audience-ops
recurring: true
---

Build the weekly dispatch package for twotalBarca.

The dispatch should:
- summarize the week's strongest work
- identify one lead story, one supporting item, and one archive or context slot
- avoid repeating the homepage verbatim
- package links and blurbs only for already approved stories
- include a brief note on reader questions or themes worth feeding back to the editorial desk

Required local workflow:
- start from `newsroom/content/dispatch/*.json`
- only include article links that already exist in `newsroom/generated/site-content.json`
- confirm `copy-chief` and `editor-in-chief` approvals exist in `newsroom/approvals/*.json`
- keep `distributionStatus` as `deferred`
- refresh the compiled payload with `npm run newsroom:build`
