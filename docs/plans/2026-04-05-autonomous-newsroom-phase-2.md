# Autonomous Newsroom Phase 2 Plan

> For Hermes: use Codex to implement this plan end-to-end. Distribution remains deferred.

Goal: finish the six remaining core workstreams for twotalBarca’s autonomous newsroom, excluding outbound distribution execution.

Scope:
1. ingestion + triggers
2. draft-generation pipeline
3. scheduled publish orchestration
4. approval/review ergonomics
5. internal ops dashboard
6. hardening/observability

Architecture:
- Keep the system local-first and file-based.
- Extend `newsroom/` rather than replacing it.
- Use deterministic generated state under `newsroom/generated/`.
- Add lightweight UI surfaces under the Next app for operator visibility.
- Keep distribution deferred, but ensure every upstream step can hand off cleanly later.

Key deliverables:
- source/watcher ingestion records and trigger outputs
- draft artifacts and revision/change request artifacts
- scheduled publish runner and publish queue semantics
- reviewer-friendly diagnostics and approval summaries
- internal newsroom ops dashboard pages
- locks, logs, retries, backups, and failure reporting

Implementation slices:

## Task 1: Ingestion and trigger pipeline
Files:
- `newsroom/sources/*.json`
- `newsroom/generated/signals/*.json`
- `lib/newsroom-types.ts`
- `lib/newsroom.ts`
- `lib/newsroom-io.ts`
- `scripts/newsroom/ingest.mjs`
- `scripts/newsroom/trigger-cycle.mjs`
- `package.json`

Deliver:
- file-based source registry
- signal/event model for match, news, archive anniversary, editorial follow-up
- deterministic trigger output
- assignment suggestions or auto-created assignment records from signals

## Task 2: Draft generation pipeline
Files:
- `newsroom/drafts/*.json`
- `newsroom/reviews/*.json`
- `lib/newsroom-types.ts`
- `lib/newsroom.ts`
- `scripts/newsroom/generate-draft.mjs`
- `scripts/newsroom/revise-draft.mjs`

Deliver:
- canonical draft artifact format
- story draft generation from assignment + source context
- revision artifact/change-request model
- clear binding between article record and latest draft artifact

## Task 3: Scheduled publish orchestration
Files:
- `newsroom/generated/publish-queue.json`
- `scripts/newsroom/publish-cycle.mjs`
- `scripts/newsroom/publish-now.mjs`
- `lib/newsroom.ts`
- `lib/newsroom-io.ts`

Deliver:
- queue model for scheduled publishable records
- publish cycle that promotes scheduled -> published safely
- explicit rollback/unpublish guardrails
- stronger pre-publish checks

## Task 4: Approval and review ergonomics
Files:
- `scripts/newsroom/review-summary.mjs`
- `scripts/newsroom/request-approval.mjs`
- `newsroom/generated/review-summary.json`
- relevant docs/tests

Deliver:
- reviewer-facing summary of pending approvals
- diff/change-request visibility for drafts
- approval diagnostics that explain why a record is blocked

## Task 5: Internal ops dashboard UI
Files:
- `app/newsroom/page.tsx`
- `app/newsroom/assignments/page.tsx`
- `app/newsroom/review/page.tsx`
- `app/newsroom/publishing/page.tsx`
- `app/newsroom/signals/page.tsx`
- maybe shared dashboard component(s)

Deliver:
- internal UI for queues, assignments, approvals, publishing, and signals
- uses newsroom files/generated summaries
- read-only/operator-light is fine; do not build a giant admin app

## Task 6: Hardening and observability
Files:
- `newsroom/generated/logs/*.jsonl` or `.json`
- `newsroom/generated/backups/`
- `scripts/newsroom/backup.mjs`
- `scripts/newsroom/healthcheck.mjs`
- `lib/newsroom.ts`
- `lib/newsroom-io.ts`
- tests

Deliver:
- simple lock/concurrency protection for state-changing scripts
- append-only run logs
- bounded retry metadata for safe cycles
- backup snapshot command
- healthcheck command summarizing broken/missing state

## Task 7: Verification
Commands:
- `npm test`
- `npm run build:local`
- `npm run newsroom:validate`
- `npm run newsroom:build`
- `npm run newsroom:dashboard`
- `npm run newsroom:ingest`
- `npm run newsroom:trigger-cycle`
- `npm run newsroom:publish-cycle`
- `npm run newsroom:healthcheck`

Definition of done:
- all six workstreams implemented in repo
- public site still works
- internal newsroom UI exists
- state-changing scripts are guarded and logged
- autonomous pipeline can ingest, suggest/create work, generate drafts, summarize review state, and publish scheduled content locally
- distribution still deferred but not blocking upstream autonomy
