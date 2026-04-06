---
name: Front Page Check
slug: front-page-check
assignee: editor-in-chief
project: editorial-desk
recurring: true
---

Review whether the homepage and section fronts still reflect the current editorial priorities.

Check:
- top story freshness
- duplicate cards or duplicated framing
- whether match coverage is crowding out analysis or archive context
- whether the current front still matches the publication's tone

Required local workflow:
- inspect `newsroom/state/frontpage.json`
- confirm referenced article slugs are published in `newsroom/generated/site-content.json`
- if the plan changes, rebuild with `npm run newsroom:build`
- if the plan is incomplete, fall back to seeded homepage content rather than forcing placeholders
