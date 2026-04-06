# Autonomous Newsroom Core Implementation Plan

> For Hermes: use Codex to implement this plan in the twotalBarca repo. Distribution execution is deferred, but its contract must be specified now.

Goal: turn twotalBarca from a static publication plus Paperclip package into a working local autonomous-newsroom core with a file-based editorial backend, workflow state machine, site sync path, validation, and operator tooling.

Architecture:
- Keep the public site static-first.
- Add a repo-local file-based newsroom backend under `newsroom/` for assignments, approvals, front-page plans, article records, and dispatch records.
- Add build/validation/sync tooling so published newsroom records compile into static site data without requiring a remote CMS.
- Keep distribution implementation deferred; add its spec and queue contracts now so the rest of the pipeline has somewhere to hand off later.

Tech stack:
- Next.js App Router
- TypeScript
- Node stdlib scripts
- Vitest
- Paperclip package docs/config updates

---

## Task 1: Add newsroom data model + directories
Objective: create a concrete file-based editorial backend structure.

Files:
- Create: `newsroom/README.md`
- Create: `newsroom/config/workflow.json`
- Create: `newsroom/content/articles/*.json`
- Create: `newsroom/content/dispatch/*.json`
- Create: `newsroom/state/frontpage.json`
- Create: `newsroom/state/editorial-calendar.json`
- Create: `newsroom/assignments/*.json`
- Create: `newsroom/approvals/*.json`
- Create: `newsroom/generated/site-content.json`

Deliver:
- documented folder contracts
- at least one published article record
- at least one draft/review article record
- one dispatch planning record
- one front-page plan

## Task 2: Add newsroom core library
Objective: encode schemas, workflow rules, compile logic, and summaries in reusable TS helpers.

Files:
- Create: `lib/newsroom.ts`
- Create: `lib/newsroom-types.ts`
- Create: `lib/newsroom-io.ts`

Deliver:
- status enum and transition rules
- validation for article/dispatch/frontpage/assignment/approval records
- compile function from newsroom records -> generated site payload
- dashboard summary function

## Task 3: Add operator scripts
Objective: make the newsroom actually operable locally.

Files:
- Create: `scripts/newsroom/bootstrap.mjs`
- Create: `scripts/newsroom/validate.mjs`
- Create: `scripts/newsroom/build-site-content.mjs`
- Create: `scripts/newsroom/dashboard.mjs`
- Create: `scripts/newsroom/advance-workflow.mjs`
- Create: `scripts/newsroom/create-assignment.mjs`
- Modify: `package.json`

Deliver:
- npm scripts for bootstrap/validate/build/dashboard/workflow/assignment
- build script writes deterministic `newsroom/generated/site-content.json`
- workflow advance script blocks unsafe or invalid transitions

## Task 4: Integrate newsroom content into site
Objective: let the site consume published newsroom output without breaking existing seeded content.

Files:
- Modify: `lib/site-data.ts`
- Modify: any route/tests touched by new content path

Deliver:
- generated newsroom payload imported into site data
- published newsroom articles/dispatch items merged cleanly
- front-page plan can override homepage hero/selected rails if valid
- fallback to seeded content when newsroom output is incomplete

## Task 5: Update Paperclip package to target real repo workflows
Objective: make the Paperclip newsroom point at actual local operating commands and state files.

Files:
- Modify: `paperclip/twotalbarca/.paperclip.yaml`
- Modify: relevant `paperclip/twotalbarca/tasks/*.md`
- Modify: relevant `paperclip/twotalbarca/skills/*.md`
- Modify: `docs/paperclip-newsroom.md`

Deliver:
- tasks reference real commands/files
- editorial queue, approval, and publish gate behavior documented concretely
- distribution left deferred but explicitly handed off to future queue/spec

## Task 6: Spec the deferred distribution layer
Objective: write the full contract now without implementing outbound distribution yet.

Files:
- Create: `docs/distribution-spec.md`

Deliver:
- input contract from approved stories/dispatch issues
- channel model (X, Telegram, LinkedIn, etc.)
- review/approval gates
- retry/logging/analytics expectations
- explicit note that implementation is deferred

## Task 7: Test and verify
Objective: prove the autonomous newsroom core works locally.

Files:
- Create or modify: `tests/newsroom.test.ts`
- Modify: existing tests if site content changed

Deliver:
- validation tests
- workflow transition tests
- generated site payload tests
- public site still passes smoke/build

Verification commands:
- `npm test`
- `npm run build:local`
- `npm run newsroom:validate`
- `npm run newsroom:build`
- `npm run newsroom:dashboard`

Definition of done:
- repo has a real file-based editorial backend
- Paperclip package references real operating artifacts
- published newsroom content can appear on the site
- workflow transitions and approvals are encoded, not implied
- distribution is fully specified for later implementation
