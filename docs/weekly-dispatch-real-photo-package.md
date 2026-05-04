# Weekly Dispatch real-photo package

Last updated: 2026-05-04

## Scope

This document covers the May 4 public dispatch package on `experiment/real-photo-layout`:

- the licensed real-photo manifest under `public/editorial/real/`
- the local reader mapping in `components/weekly-dispatch-reader.tsx`
- the generated editorial post PNGs already stored under `public/editorial/post/weekly-dispatch-may-4-2026/`
- the newsroom records and generated state that make `weekly-dispatch-may-4-2026` the active public issue

Use `docs/editorial-image-generation.md` for prompt direction and image-generation workflow. Use this file for maintenance of the shipped package.

## Asset split

### 1. Real dispatch-reader photography

Source of truth:

- `public/editorial/real/commons-fcbarcelona-images.json`

Local files:

- `public/editorial/real/*.jpg`

Each manifest row keeps the full provenance needed for honest reuse:

- `title`
- `slug`
- `description`
- `artist`
- `license`
- `source`
- `url`
- `thumburl`
- `width`
- `height`
- `src`

The reader does not print the full Commons URL in-card. It renders a compact credit from manifest metadata:

- `Photo: {artist} / {license}`

That short credit is only acceptable because the exact source URL stays in the manifest beside the local asset.

### 2. Generated editorial post art

Generated post-ready PNGs live under:

- `public/editorial/post/weekly-dispatch-may-4-2026/`

Those files are for editorial/social post surfaces and prompt iteration history. They are not the dispatch reader's main photography source. The reader now prefers local real photos plus one in-house illustration override for the fourth take.

### 3. In-house illustration exception

One mobile backdrop uses a local illustration instead of a blurred real photo:

- `public/editorial/illustrations/territory-punch-backdrop.svg`

That backdrop must keep the explicit override credit:

- `Illustration: totalBarça studio`

Do not label that asset as a photo.

## How the reader picks and credits photos

Primary implementation file:

- `components/weekly-dispatch-reader.tsx`

Flow:

1. Import `commons-fcbarcelona-images.json`.
2. Build a slug lookup with `commonsRealPhotosBySlug`.
3. Call `getRealDispatchPhoto(slug, overrides)` to:
   - fail fast if the manifest row is missing
   - preserve exact manifest metadata locally
   - add dispatch-specific `alt`, `objectPosition`, and overlay treatment
   - derive the compact rendered credit from `artist` + `license`
4. Map the cover and five takes explicitly:
   - `coverRealPhoto`
   - `takeRealPhotos[1..5]`
5. Render credits in three places:
   - cover image overlay via `DispatchCoverPhoto`
   - desktop figure caption via `TakePhotoFigure`
   - mobile backdrop pill via `comm-take-photo-credit`
6. If a take uses custom art for the backdrop, override only the displayed mobile credit with `topicBackdropCredit`.

Current special case:

- Take 04 uses `topicBackdropArt[4] = "/editorial/illustrations/territory-punch-backdrop.svg"`
- desktop still keeps a real photo figure and photo credit for the take
- mobile backdrop credit swaps to `Illustration: totalBarça studio`

## Dispatch-native copy

The package adds three optional dispatch item fields:

- `take`
- `commentary`
- `whyItMatters`

Files:

- `lib/newsroom-types.ts`
- `lib/site-data.ts`
- `components/weekly-dispatch-reader.tsx`

The reader now prefers dispatch-native copy in this order:

- take: `item.take ?? item.summary`
- body: `item.commentary ?? story?.body?.[0] ?? item.summary`
- why: `item.whyItMatters ?? story?.conviction ?? story?.dek ?? item.summary`

That keeps the issue self-contained even when all five item links point back to `/dispatch`.

## Newsroom records that move together

Public issue record:

- `newsroom/content/dispatch/weekly-dispatch-may-4-2026.json`

Supporting workflow records:

- `newsroom/assignments/weekly-dispatch-may-4-2026.json`
- `newsroom/approvals/approval-dispatch-weekly-dispatch-may-4-2026-copy.json`
- `newsroom/approvals/approval-dispatch-weekly-dispatch-may-4-2026-editor.json`

Generated/public state that should stay in sync with the issue:

- `newsroom/generated/site-content.json`
- `newsroom/generated/publish-queue.json`
- `newsroom/state/frontpage.json`
- `newsroom/state/editorial-calendar.json`

Cleanup that belongs with the issue switch:

- `newsroom/content/dispatch/weekly-dispatch-april-10-2026.json` is marked `killed` so only one public dispatch issue stays active.

## Validation commands

Run these before pushing changes to the package:

```bash
npm test
npm run newsroom:validate
npm run newsroom:build
npm run build:local
```

Current expected outcomes:

- tests pass
- newsroom validation reports no issues
- newsroom build rewrites `newsroom/generated/site-content.json`
- local Next build emits `/dispatch/weekly-dispatch-may-4-2026`

## Maintenance checklist

When adding or replacing a real photo:

1. Copy the local file into `public/editorial/real/`.
2. Add a manifest row with exact Commons metadata and license text.
3. Pick the slug in `getRealDispatchPhoto(...)` usage.
4. Write truthful alt text for the surface, not generic filler.
5. Set `objectPosition` and overlay deliberately for mobile/desktop crops.
6. Keep the on-card credit compact, but never drop the full source from the manifest.

When updating the issue package:

1. Keep the dispatch item links on MVP-safe public routes only.
2. Keep planning slugs internal; do not surface them on `/dispatch/*`.
3. If the active public issue changes, update the dispatch record, generated site content, frontpage state, and editorial calendar together.
4. Re-run the validation commands above.

## What not to do

- Do not add unlicensed or untracked images under `public/editorial/real/`.
- Do not replace exact source metadata with vague captions.
- Do not label illustration assets as photography.
- Do not let the public issue fall back to unrelated stale rescue-window dispatch state.
- Do not mention AI generation on the public reader surfaces.
