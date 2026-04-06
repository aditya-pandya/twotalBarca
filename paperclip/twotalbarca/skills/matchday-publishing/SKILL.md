---
name: matchday-publishing
description: Run a disciplined Barcelona matchday workflow from assignment to post-whistle publish order.
---

# Matchday Publishing

This skill governs how the newsroom behaves around a Barcelona match.

Sequence:
1. Stabilize the match frame: opponent, competition, venue, and kickoff or final status.
2. Confirm the Match Notes Lead is capturing the durable record.
3. Decide whether a tactics follow-up is justified by the evidence.
4. Route the draft to Copy Chief review.
5. Publish in order: match notes first, tactics second if warranted, archive or dispatch packaging after.
6. Update newsroom records and state files instead of leaving the workflow implicit.

Timing rules:
- fast is good, false is unacceptable
- if the basic record is incomplete, publish a hold note internally rather than guessing
- do not launch side features before the notes piece lands unless the Editor in Chief explicitly changes the order

Quality rules:
- the reader should know what happened quickly
- keep the piece rooted in observable match developments
- mark uncertainty clearly instead of hiding it

Local file expectations:
- assignments in `newsroom/assignments/`
- story records in `newsroom/content/articles/`
- approvals in `newsroom/approvals/`
- workflow transitions through `npm run newsroom:workflow`
- compiled site payload refreshed by `npm run newsroom:build`
