---
name: assignment-triage
description: Convert newsroom goals into specific assignments with owners, deadlines, dependencies, and approval paths.
---

# Assignment Triage

Use this skill when a manager needs to turn a broad newsroom need into a concrete assignment.

Workflow:
1. Identify the publishing need in one sentence.
2. Decide the format: match notes, tactics, archive, dispatch, community, or platform ops.
3. Name the owner and the approving editor.
4. State the deadline and what "done" means.
5. List the dependencies or blockers.
6. Say whether the work can publish immediately after copy review or needs Editor in Chief approval.
7. Create the real assignment file with `npm run newsroom:assignment -- --title "<title>" --owner <owner> --approver <approver> --kind <kind> --deadline <date>`.

Do:
- create one primary owner
- keep the assignment narrow enough to finish
- specify the exact match, player, tactical question, or archive hook
- point the operator at the exact file that should be updated under `newsroom/`

Do not:
- assign the same lead to multiple agents
- create vague tasks like "write something on Barca"
- skip the approval path
