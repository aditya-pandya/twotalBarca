# Paperclip weekly-dispatch package

Last updated: 2026-05-02

This repo includes a Paperclip company package for running the internal weekly-dispatch workflow behind totalBarca.

Important scope note:
- the package supports one weekly dispatch plus minimal match-context assembly
- it should not be treated as authority for a broader daily article newsroom unless Aditya explicitly reopens that scope

What is inside:
- `paperclip/twotalbarca/COMPANY.md`: company/package mission and constraints
- `paperclip/twotalbarca/agents/`: role instructions
- `paperclip/twotalbarca/tasks/weekly-dispatch/TASK.md`: recurring weekly issue task
- `paperclip/twotalbarca/skills/assignment-triage/SKILL.md`: assignment narrowing rules
- `newsroom/`: repo-local editorial backend used by the package

Operational rule:
- if any Paperclip file still sounds broader than the weekly-dispatch-only product, treat that broader language as historical or dormant unless it has been explicitly updated after 2026-05-02
