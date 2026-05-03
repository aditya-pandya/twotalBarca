---
name: assignment-triage
description: Convert weekly-dispatch goals into specific assignments with owners, deadlines, dependencies, and approval paths.
---

# Assignment Triage

Last updated: 2026-05-02

Use this skill when a manager needs to turn a broad totalBarca need into a concrete assignment.

Active workflow:
1. Start with `newsroom/generated/barca-scout-report.json` when the desk is looking for current Barça angles.
2. Identify the weekly publishing need in one sentence.
3. Decide the format: weekly dispatch, match-context refresh, supporting research, or platform ops.
4. Name the owner and approving editor.
5. State the deadline and what "done" means.
6. List the dependencies or blockers.
7. Create the real assignment file with `npm run newsroom:assignment -- --title "<title>" --owner <owner> --approver <approver> --kind <kind> --deadline <date>`.

Do:
- keep one clear primary owner
- keep the assignment narrow enough to finish this week
- specify the exact match, governance angle, tactical question, or club theme being served
- point the operator at the exact file that should be updated under `newsroom/`
- remember that draft generation may need the assignment id instead of the record slug

Do not:
- assume a daily Brief is still an active format
- default to standalone article production unless the scope has been explicitly reopened
- assign the same lead to multiple agents
- create vague tasks like "write something on Barca"
- skip the approval path
