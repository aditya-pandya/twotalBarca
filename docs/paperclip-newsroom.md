# Paperclip Newsroom Setup

This repo now includes a real Paperclip company package for running twotalBarca as an agentic newsroom.

Package location:
- `paperclip/twotalbarca/`

What is inside:
- `COMPANY.md`: newsroom mission, editorial rules, and approval model
- `agents/`: the org chart and role instructions
- `projects/`: operating lanes for editorial, matchday, archive, audience, and platform ops
- `tasks/`: recurring newsroom routines seeded as Paperclip tasks
- `skills/`: reusable newsroom workflows
- `.paperclip.yaml`: adapter types, runtime heartbeats, env input declarations, budgets, and recurring routine triggers
- `../newsroom/`: the real local editorial backend the package is expected to operate against

Included newsroom roles:
- CEO / Publisher
- Editor in Chief / Managing Editor
- Match Notes Lead
- Tactics Analyst
- Archive Researcher
- Copy Chief / Standards Editor
- Distribution / Audience Lead
- Community / Moderation Lead
- Site / Platform Engineer

## Local Runtime

All local runtime state is kept under:

```text
.paperclip-runtime/
```

Nothing in this setup requires storing secrets in the repo.

All editorial operating state is kept under:

```text
newsroom/
```

Optional env vars you may set in your shell before running local adapters:
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `TWOTALBARCA_REPO_ROOT`

The helper scripts automatically fall back to a repo-local Node 20 + Paperclip shim when the host machine is on a newer Node version that Paperclip does not currently like. They also pin the cssstyle/css-color combo that Paperclip currently needs in this environment to boot cleanly.

## Commands

Start a local Paperclip instance:

```bash
npm run paperclip:run
```

Import the twotalBarca company package into the running instance:

```bash
npm run paperclip:import
```

Bootstrap both in one shot:

```bash
npm run paperclip:bootstrap
```

Validate and compile the local newsroom backend:

```bash
npm run newsroom:validate
npm run newsroom:build
npm run newsroom:dashboard
```

List imported companies in the local runtime:

```bash
npm run paperclip:list
```

## Practical Operating Model

The package is designed for real newsroom behavior:
- the CEO sets priorities and requests approvals for structural changes
- the Editor in Chief controls assignment flow and publish order
- the Copy Chief acts as a hard quality gate
- matchday output is sequenced before analysis and distribution
- archive resurfacing is treated as a contextual layer, not filler
- moderation is an explicit operating function, not an afterthought
- platform work is additive and isolated from the publication surface unless specifically requested

Concrete local artifacts:
- assignments live in `newsroom/assignments/*.json`
- article and dispatch records live in `newsroom/content/`
- approvals live in `newsroom/approvals/*.json`
- front-page overrides live in `newsroom/state/frontpage.json`
- compiled site payload lives in `newsroom/generated/site-content.json`
- deferred distribution contract lives in [docs/distribution-spec.md](/Users/aditya/GitHub/twotalbarca/docs/distribution-spec.md)

## Recommended First Run

1. Start Paperclip locally with `npm run paperclip:run`.
2. In another terminal, import the package with `npm run paperclip:import`.
3. Open the local Paperclip URL printed by the server.
4. Run `npm run newsroom:validate` and `npm run newsroom:build`.
5. Review imported agents and re-enable any timer heartbeats you want active.
6. Confirm which local adapters you actually have configured on your machine.
7. Update local adapter details inside Paperclip if your preferred models or commands differ.

## Notes

- Imported agents land with timer heartbeats disabled by Paperclip for safety, so review them before turning on routines.
- The package is markdown-first and versionable in git.
- The existing site reads the compiled newsroom payload when valid and falls back to seeded content otherwise.
- In this environment the repo-local shim path now boots Paperclip cleanly on Node 25 hosts. If startup fails later, check `.paperclip-runtime/logs/server.log` first.
