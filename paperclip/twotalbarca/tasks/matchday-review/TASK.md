---
name: Matchday Review
slug: matchday-review
assignee: editor-in-chief
project: matchday-ops
recurring: true
---

Run the matchday operating cycle for any Barcelona fixture inside the next 24 hours or just completed.

Checklist:
- confirm the exact match frame: opponent, competition, venue, kickoff or final time, and squad status if known
- assign or reaffirm match notes ownership
- decide whether the tactics desk is on immediate follow-up or deferred analysis
- request archive context only if it sharpens the package
- set publication order and deadline expectations
- make sure the Copy Chief is queued for the publish gate

Output:
- a clear assignment comment for the desk
- explicit publish order
- a hold decision if facts are still unstable

Required local workflow:
- write or update the assignment in `newsroom/assignments/`
- move article records with `npm run newsroom:workflow -- --kind article --slug <slug> --to <status>`
- do not move anything to `approved`, `scheduled`, or `published` without the required approval files in `newsroom/approvals/`
- rebuild the compiled payload only after the publish gate is actually cleared
