# totalBarca Current Product Scope

Last updated: 2026-05-02
Status: active and canonical. If any older doc conflicts with this file, this file wins.

## One-line product

totalBarca is a weekly FC Barcelona dispatch with exactly five sharp, evidence-backed commentary topics plus minimal last-match and next-match capsules.

## Active scope

### 1. Weekly Dispatch is the product
- publish once per week
- exactly 5 topics/items per issue
- every topic must include:
  - a clear editorial take
  - concise commentary/opinion
  - why it matters now
- the five topics can draw from the men's first team, Femení, La Masia, tactics, club governance, culture, or other Barça-adjacent angles only when current evidence supports them
- the issue is not a link roundup, not a feed, not a daily brief, and not longform article packaging

### 2. Match context is a minimal module, not a product line
Each issue or homepage context layer may include:
- one last-match capsule
  - opponent
  - competition
  - date
  - score/result when known
  - one short editorial read
- one next-match capsule
  - opponent
  - competition
  - kickoff/date
  - venue if useful
  - one thing to watch

Explicit non-goals for match context:
- no live score product
- no match center
- no fixture/table engine
- no noisy ticker

### 3. Active public information architecture
- Home / latest issue surface
- Dispatch issue page and minimal archive as needed to read weekly issues
- small About / positioning blurb if needed
- match context lives inside the home/issue experience as a module or capsule

### 4. Design direction
- ultra-minimal
- text-first
- phone-friendly
- calm, edited, opinionated
- layout hierarchy:
  1. masthead / positioning
  2. this week's 5-topic dispatch
  3. last-match capsule
  4. next-match capsule
  5. small archive of past issues if needed

### 5. Public-copy guardrails
- public brand is `totalBarca`
- keep the locked tagline unless Aditya changes it explicitly
- no AI/process/status language in public positioning
- never call it a blog
- do not fake newsroom/process language in the public product

## Dormant scope

The following are not active product requirements right now:
- the standalone/daily Brief
- article-first publishing
- longform article packaging as the product center of gravity
- archive-first positioning
- match notes as a separate public surface
- analysis, culture, reactions, vault/archive shelves, topic pages, person pages, season pages, and broad browse taxonomies as active public surfaces

Treat those as one of:
- dormant
- legacy
- background/historical context
- future only if explicitly reintroduced

## Technical consequences

- docs must stop describing the active product as article-first, longform-first, archive-first, broad-newsroom, or daily-brief-led
- if older docs mention those ideas, mark them as superseded/dormant/background rather than active requirements
- local newsroom mechanics stay only insofar as they support the weekly dispatch pipeline and minimal match-context assembly
- active data contracts should center on weekly dispatch issues and compact match capsules
- legacy article or taxonomy models may remain in code for now, but they should not define active product scope

## Reintroduction rule

Nothing outside the active scope becomes live again by drift.
Any return of articles, separate Brief pages, archive shelves, match notes, reaction widgets, or browse/taxonomy surfaces requires an explicit scope decision from Aditya.
