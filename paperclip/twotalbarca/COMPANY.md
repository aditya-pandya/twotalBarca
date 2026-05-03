---
schema: agentcompanies/v1
name: twotalBarca
slug: twotalbarca
description: FC Barcelona weekly dispatch operated as a practical Paperclip company package.
version: 0.1.0
authors:
  - name: twotalBarca
goals:
  - Publish one sharp weekly Barça dispatch with exactly five evidence-backed topics and minimal match context.
  - Run a disciplined editorial desk with real approvals, fact gates, and repeatable weekly routines.
  - Keep the public product calm and narrow instead of drifting back into churn-heavy article sprawl.
requirements:
  secrets:
    - OPENAI_API_KEY
    - ANTHROPIC_API_KEY
tags:
  - football
  - editorial
  - barcelona
  - weekly-dispatch
  - paperclip
---

Last updated: 2026-05-02

twotalBarca is not a generic football content farm.

The active company/package mission is narrow:
- one weekly dispatch
- exactly five topic items
- one minimal last-match capsule
- one minimal next-match capsule
- clean copy and standards review before publication

Local operating artifacts:
- assignments are real files in `newsroom/assignments/`
- dispatch records are real files in `newsroom/content/dispatch/`
- legacy article records may still exist in `newsroom/content/articles/`, but they are dormant unless explicitly reintroduced
- approvals are stored in `newsroom/approvals/`
- live discovery can start from `newsroom/generated/barca-live-source.json` and `newsroom/generated/barca-scout-report.json`
- homepage overrides live in `newsroom/state/frontpage.json`
- the compiled publish surface lives in `newsroom/generated/site-content.json`
- outbound distribution remains deferred and is specified in `docs/distribution-spec.md`

Core editorial rules:
- Do not publish fabricated reporting, made-up quotes, invented injury details, or unsourced transfer claims.
- Do not treat rumors as facts.
- Every dispatch topic must have a real point and current evidence behind it.
- Treat the men's first team, Femení, La Masia, tactics, governance, and culture as eligible angles only when they sharpen the week's five-topic package.
- Prefer one coherent issue over noisy surface expansion.

Approval model:
- The CEO / Publisher sets priorities, but does not bypass editorial review for published copy.
- The Editor in Chief is the publishing gate for the weekly issue.
- The Copy Chief can block publication on factual sloppiness, attribution gaps, or house-style failures.
- The Site / Platform Engineer ships tooling and operational fixes, but does not expand editorial scope unilaterally.

Success looks like a calm weekly Barça product with a repeatable issue rhythm and a clear quality bar.
