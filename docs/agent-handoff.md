# totalBarca Agent Handoff

Last updated: 2026-05-02
Status: primary handoff doc for future agents.

## 1. Read these first

1. `docs/current-product-scope.md`
2. `docs/prd.md`
3. `docs/editorial-positioning-decisions.md`
4. `docs/implementation-checklist.md`
5. `newsroom/README.md` if touching the repo-local newsroom pipeline

## 2. The scope pivot you must not miss

Aditya narrowed the product on 2026-05-02.

Active product now:
- one weekly Barça dispatch
- exactly 5 topics/items per issue
- minimal last-match capsule
- minimal next-match capsule
- minimal home/latest issue, dispatch reading/archive, and About surfaces only

Retired or dormant for active scope:
- standalone/daily Brief
- article-first product framing
- archive-first framing
- match notes as a separate public product surface
- analysis/culture/vault/topic/person/season/reaction surfaces as active requirements

## 3. Public brand and copy rules

- public brand is `totalBarca`
- internal codename/repo can remain `twotalBarça` / `twotalbarca`
- locked tagline: `Less noise. More Barça.`
- locked supporting line: `Match context, club memory, cleaner judgment.`
- no public AI/process/status language
- never call the product a blog
- do not present internal newsroom mechanics as public positioning
- public hero/supporting copy should point to the weekly dispatch and minimal match context, not "the Brief and the Dispatch"

## 4. Product contract in plain language

totalBarca is not trying to be a broad football publication right now.
It is trying to publish one calm weekly read.

That weekly read must contain:
- exactly five sharp topics
- a take on each topic
- concise commentary on each topic
- why it matters on each topic
- a short last-match read
- a short next-match watchpoint

## 5. Repo reality

Important:
- the worktree is dirty from prior work
- legacy article/analysis/archive routes and data still exist in the tree
- those legacy surfaces should not be treated as active product requirements just because code exists for them
- docs were updated to make this explicit

When changing runtime code later:
- simplify toward the weekly issue
- do not expand back toward the old broader publication by accident

## 6. Newsroom reality

The repo-local `newsroom/` backend still matters, but only as support infrastructure.

Active newsroom purpose:
- scout and sort current Barça angles
- assemble the weekly issue
- record approvals
- generate drafts
- compile the publish payload
- provide minimal match context

Practical note:
- draft generation may require the assignment id rather than the record slug
- example: `npm run newsroom:generate-draft -- --assignment assignment-weekly-dispatch-14`

## 7. What future agents should optimize for

- home/latest issue should feel calm and obvious
- dispatch issue should read as one package, not five promos
- match capsules should stay minimal
- archive should stay tiny
- legacy routes should stay dormant unless explicitly reintroduced

## 8. What future agents should not optimize for

- a daily publishing cadence
- article-volume growth
- archive/vault breadth
- taxonomy depth
- live match data density
- reaction/community product expansion
- magazine/dashboard theatrics

## 9. Validation expectations

For docs-only work:
- check internal consistency
- check stale scope language did not survive in active docs

For code work:
- run the smallest relevant tests
- run the relevant build check
- verify legacy surfaces are not accidentally promoted

## 10. Historical note

Older docs and runtime traces may still describe:
- article-first ambitions
- the separate Brief
- archive/vault ideas
- wider section/taxonomy plans

Those are background only now.
They are useful for history and migration, not as active product requirements.
