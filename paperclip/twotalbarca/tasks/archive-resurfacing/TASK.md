---
name: Archive Resurfacing
slug: archive-resurfacing
assignee: archive-researcher
project: archive-lab
recurring: true
---

Review the archive for one piece worth resurfacing this week.

Rules:
- pick only items with obvious present relevance
- explain the current hook in one sentence
- hand off packaging notes to the Distribution Lead
- if nothing is strong enough, explicitly recommend no resurfacing instead of forcing one

Required local workflow:
- review `newsroom/content/articles/*.json` for published archive-safe candidates
- if the homepage should change, update `newsroom/state/frontpage.json`
- rebuild with `npm run newsroom:build`
- leave outbound distribution deferred and point any follow-up to `docs/distribution-spec.md`
