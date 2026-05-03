# totalBarca Content Model and IA

Last updated: 2026-05-02
Status: active IA and route contracts after the weekly-dispatch pivot.

## 1. Canonical product structure

totalBarca is now a narrow product:
- one weekly dispatch issue
- minimal last-match context
- minimal next-match context
- optional tiny archive of past issues
- optional tiny About/positioning blurb

## 2. Active public routes

### `/`
Role:
- latest issue surface
- main explanation of the product

Required modules in priority order:
1. masthead / positioning
2. latest weekly dispatch with exactly 5 topics
3. last-match capsule
4. next-match capsule
5. small archive teaser if needed

### `/dispatch`
Role:
- archive/list of weekly issues
- should stay lightweight

### `/dispatch/[slug]`
Role:
- read one weekly issue
- issue-first, not article-first

Required sections:
1. issue label/title/date
2. optional short note
3. exactly 5 dispatch topics
4. last-match capsule
5. next-match capsule
6. past-issue links if useful

### `/about`
Role:
- small positioning explanation only
- should explain the weekly dispatch and the restrained match-context promise

## 3. Dormant public routes

These may still exist in the codebase, but they are not active product IA:
- `/brief`
- `/article/*`
- `/analysis`
- `/culture`
- `/archive`
- `/match-notes`
- `/topic/*`
- `/person/*`
- `/season/*`
- reactions/community surfaces

If these stay live in the repo during transition:
- treat them as dormant/legacy/backlog
- keep them out of active nav and current product framing
- do not cite them as active requirements in docs

## 4. Navigation bias

Recommended top-level nav:
- Home
- Dispatch
- About

Anything broader requires explicit reintroduction.

## 5. Content relationships

`dispatchIssue`
- owns 5 `dispatchTopic` items
- owns one `lastMatch` capsule
- owns one `nextMatch` capsule

`dispatchArchiveEntry`
- points to a prior `dispatchIssue`

Optional internal relation:
- a dispatch topic may reference supporting newsroom material
- that reference is internal/editorial support, not proof that a public standalone article surface must exist

## 6. Homepage hierarchy rules

- do not split the weekly issue into too many decorative modules
- do not put equal-weight article rails above or alongside the issue
- match capsules should read as context, not as a separate product lane
- archive links should stay secondary

## 7. IA language rules

Prefer:
- Dispatch
- This week
- Last match
- Next match
- About

Avoid as active IA labels:
- The Brief
- Match Notes
- Analysis
- Culture
- The Vault
- Archive-first browse labels

## 8. What remains useful from older IA thinking

Older docs got some things right and those parts still matter:
- the product should feel curated, not noisy
- match context should be editorially framed, not data-dumped
- typography and readability matter more than novelty

But the surface count is now much smaller.
