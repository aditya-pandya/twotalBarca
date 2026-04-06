# twotalBarca Paperclip Package

This directory is a portable Paperclip company package for running twotalBarca as an AI-operated newsroom.

Contents:
- `COMPANY.md`: company mission, operating model, and import root
- `agents/`: agent roles and instructions
- `projects/`: seeded operating lanes for the newsroom
- `tasks/`: recurring newsroom routines as starter Paperclip tasks
- `skills/`: shared newsroom workflows
- `.paperclip.yaml`: Paperclip-specific adapter, runtime, env-input, and routine fidelity

This package is designed to be imported into a local Paperclip instance with:

```bash
npm run paperclip:bootstrap
```

Or manually:

```bash
npm run paperclip:run
npm run paperclip:import
```
