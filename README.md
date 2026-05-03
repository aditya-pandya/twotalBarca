# totalBarca

Less noise. More Barça.
Match context, club memory, cleaner judgment.

Status: active product scope is now weekly-dispatch-only. Public totalBarca is one weekly Barça dispatch with exactly five sharp commentary topics plus minimal last-match and next-match capsules. The old standalone Brief, article-first publication framing, and broad archive/section sprawl are dormant unless Aditya explicitly reintroduces them.

Read first
- `docs/current-product-scope.md` ← canonical scope as of 2026-05-02
- `docs/START-HERE.md` ← shortest path for a new agent
- `docs/agent-handoff.md` ← working constraints + repo reality
- `docs/prd.md` ← active requirements
- `docs/implementation-checklist.md` ← next execution checklist

Local commands
- `npm run dev`
- `npm test`
- `npm run build`
- `npm run build:local` if iCloud-backed `.next` cleanup gets in the way
- `npm run newsroom:validate`
- `npm run newsroom:build`
- `npm run newsroom:dashboard`
- `npm run newsroom:scout-barca`
- `npm run newsroom:generate-draft -- --assignment assignment-weekly-dispatch-14`

Product rules
- Public brand is `totalBarca`; repo/internal codename can remain `twotalBarça` / `twotalbarca`
- Not a rumor wire
- Not a blog
- Not a live score or match center product
- Not a standalone daily Brief anymore
- Not an article-first or archive-first publication anymore
- One weekly dispatch, exactly five topics, each with a take
- Match context stays minimal and text-first
- Manual curation over feed logic
- No public AI/process/status language

Repo reality
- legacy article/analysis/archive routes and content models still exist in code and data
- docs now treat those surfaces as dormant/legacy/backlog unless explicitly reintroduced
- the repo-local newsroom backend lives in `newsroom/`
- published newsroom records compile into `newsroom/generated/site-content.json`
- the site consumes that payload when valid and falls back to seeded content otherwise
