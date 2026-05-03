# totalBarca Content Model

Last updated: 2026-05-02
Status: active contracts only. Older article-first structures are legacy unless explicitly reintroduced.

## 1. Active entities

1. `dispatchIssue`
2. `dispatchTopic`
3. `matchCapsule:last`
4. `matchCapsule:next`
5. `dispatchArchiveEntry`
6. `aboutBlurb` (optional tiny positioning block)

## 2. Dispatch issue

Purpose:
- one weekly package
- exactly 5 topics
- optional internal editorial note
- includes minimal match context

Required fields:
- `id`
- `slug`
- `issueNumber` or stable issue label
- `issueTitle`
- `publishDate`
- `status`
- `topics` (must be length 5)
- `lastMatch`
- `nextMatch`
- `approvalIds`
- `distributionStatus`

Optional fields:
- `editorsNote`
- `summary`
- `heroLabel`

Example shape:

```json
{
  "id": "dispatch-weekly-issue-18",
  "slug": "weekly-dispatch-issue-18",
  "issueNumber": 18,
  "issueTitle": "Weekly Dispatch No. 18",
  "publishDate": "2026-05-08",
  "status": "published",
  "editorsNote": "Five reads on the week Barça actually had.",
  "topics": [],
  "lastMatch": {},
  "nextMatch": {},
  "approvalIds": ["approval-dispatch-18-copy", "approval-dispatch-18-editor"],
  "distributionStatus": "deferred"
}
```

## 3. Dispatch topic

Required fields:
- `order`
- `headline`
- `take`
- `commentary`
- `whyItMatters`

Optional internal/support fields:
- `supportingEvidence`
- `sourceRefs`
- `relatedSlug`
- `sectionBias` (for internal planning only)

Rules:
- exactly five topics per issue
- every topic needs a point of view
- every topic needs enough evidence to justify inclusion
- topics are not required to link to standalone articles

Example shape:

```json
{
  "order": 1,
  "headline": "Barça's control is arriving before its fluency",
  "take": "Control is the real progress marker right now, not spectacle.",
  "commentary": "The side is still uneven in the final third, but it has stopped playing in emotional sprints.",
  "whyItMatters": "If the structure is becoming dependable, the rest of the season stops looking like improvisation."
}
```

## 4. Last-match capsule

Required fields:
- `opponent`
- `competition`
- `date`
- `result`
- `editorialRead`

Optional fields:
- `venue`
- `status` (`known`, `pending`, etc.)

## 5. Next-match capsule

Required fields:
- `opponent`
- `competition`
- `kickoff`
- `thingToWatch`

Optional fields:
- `venue`
- `timezoneNote`

## 6. Dispatch archive entry

Minimal fields:
- `slug`
- `issueTitle`
- `publishDate`
- `summary`

The archive exists only to let readers find past weekly issues.
It is not an excuse to rebuild a broad publication browse system.

## 7. Dormant legacy entities

These may still exist in code or files, but they are not active scope:
- standalone `article`
- standalone `brief`
- `match-notes` as a public product surface
- `analysis`, `culture`, `archive`, `topic`, `person`, `season`, `reaction` browse entities as active UI requirements

If these remain in schemas or fixtures, mark them legacy/dormant in surrounding docs and runtime behavior.

## 8. Public route bias

Active route labels should map to:
- `home`
- `dispatch`
- `about`

Match context should render as modules within home/dispatch, not as its own route family.

## 9. Modeling rule

The model should favor:
- one strong issue
- five strong items
- two small match capsules

Do not let older article-first abstractions become the default mental model for new work.
