# totalBarca Editorial Image Generation Playbook

Last updated: 2026-05-03

## Purpose

Use this when generating post-ready images for totalBarca dispatches or article surfaces.

The winning direction is **not** website UI, not abstract SVG filler, not generic sports photography, and not AI-agency art. It is:

- warm paper-collage editorial illustration
- restrained blaugrana navy / garnet / red-blue palette
- muted cream / aged newsprint texture
- tactical pitch geometry
- football-native atmosphere
- serious independent publication taste
- stronger Barcelona identity than the first batch

The first genuinely successful images were:

- `public/editorial/post/weekly-dispatch-may-4-2026/00-cover-madrid-week-without-noise.png`
- `public/editorial/post/weekly-dispatch-may-4-2026/01-osasuna-useful-win.png`
- `public/editorial/post/weekly-dispatch-may-4-2026/02-madrid-test-of-calm.png`

The later Barcelona-identity sample that best pushes the direction forward is:

- `public/editorial/post/weekly-dispatch-may-4-2026/bcn-identity-samples/sample-d-scarf-ticket-tile.png`

## Tool / model

Use **GPT Image 2** via the Hermes `openai-codex` image backend.

Working setup in this repo/session:

- provider: `openai-codex`
- model tier: `gpt-image-2-medium`
- output size: `1536x1024`
- aspect ratio: `landscape`
- auth: Codex / ChatGPT OAuth, no separate `OPENAI_API_KEY` required

For final hero/cover candidates, `gpt-image-2-high` may be worth trying after the direction is locked. For exploration, `gpt-image-2-medium` is good enough.

## Non-negotiables

Every prompt should explicitly ban:

- official FC Barcelona crest
- fake crests / fake badges
- sponsor marks
- current player likenesses or recognizable faces
- exact kit replicas
- Real Madrid / Osasuna / UEFA / LaLiga marks
- readable text
- numbers
- scoreboards
- dashboards
- UI / website comps
- posters with typography
- neon
- purple AI glow
- glassmorphism
- sci-fi
- generic stock athletes

If a ball appears, ask for a **correct association football / soccer ball**. GPT Image can drift into basketball/handball geometry if this is not explicit.

If people appear, they should be **tiny, anonymous, faceless, and non-identifiable**.

## Keeper global prompt

Use this as the base prompt for normal dispatch/article images:

```text
Create a post-ready editorial illustration for totalBarca Weekly Dispatch No. 1, Madrid Week Without the Noise.

Stay in the keeper direction: warm paper-collage editorial art, subtle newspaper grain, restrained blaugrana navy/garnet/red-blue palette, muted cream, tactical pitch geometry, soft Barcelona matchweek floodlight atmosphere, serious independent football publication taste. This is for use inside a post/article.

Hard constraints: not a website comp, not UI, not a poster with typography, no readable text, no numbers, no scoreboards, no dashboard, no neon, no purple AI glow, no glassmorphism, no sci-fi, no generic stock athletes. Avoid official FC Barcelona crest, fake crest, sponsor marks, player likenesses, exact kit replicas, Real Madrid crest, Osasuna crest, UEFA/LaLiga marks. Make it clearly association football/soccer when a ball appears, with correct soccer-ball geometry. If people appear, keep them tiny, anonymous, faceless, and non-identifiable.
```

Then append one concept paragraph.

## Concepts that worked

### Cover / Madrid week

```text
Alternate cover image. Empty stadium from low pitch level, one clearly correct soccer ball near the center circle, floodlight haze, collage-paper border fragments, faint tactical chalk marks, deep navy/garnet tension. Quiet before the Clásico, no drama, no logos.
```

### Madrid calm

```text
Madrid calm concept. Top-down pitch abstraction with a composed midfield triangle in blaugrana dots resisting a pale pressure wave. Cream paper field, navy tactical lines, one small ball, no players close-up. Make the biggest fixture feel smaller and clearer.
```

### Osasuna useful win

```text
Osasuna useful win concept. Practical away-match floor: wet touchline, scuffed correct soccer ball, narrow passing lane escaping an abstract red pressure block, paper-grain field texture. Grounded, useful, controlled, not celebratory.
```

### Territory into punch

```text
Territory into punch concept. Tactical final-third illustration: many calm possession lines converge into one sharp incision toward the penalty area. The ball is small but clear. Editorial pitch geometry, navy and garnet on warm paper, tense and precise.
```

### Femení front page

```text
Femení front page concept. Equal-weight women's-football editorial image without faces or likenesses: a clean pitch under European-final floodlights, two anonymous boot shadows at distance, correct soccer ball, navy/garnet paper collage. Dignified and central, not sidebar material.
```

### Title arithmetic / noise

```text
Title arithmetic noise concept. Abstract table/scoreboard superstition dissolves into unreadable marks in the background while the foreground stays on a clean pitch lane and a correct soccer ball. No readable numbers or text. Focus on the next ninety minutes, not permutations.
```

## Stronger Barcelona identity prompt

Use this base when the image needs to feel more specifically Barcelona, not just football + blaugrana:

```text
Create a post-ready editorial illustration for totalBarca.

Stay in the keeper direction: warm paper-collage editorial art, subtle newspaper grain, restrained blaugrana navy/garnet/red-blue palette, muted cream, tactical pitch geometry, serious independent football publication taste. This is for use inside a post/article.

Increase Barcelona identity clearly but tastefully. Use Barcelona-specific atmosphere and architecture cues without official football trademarks. No official FC Barcelona crest, no fake crest, no sponsor marks, no player likenesses, no exact kit replicas, no Real Madrid crest, no LaLiga/UEFA marks. No readable text, no numbers, no scoreboards, no dashboard, no neon, no purple AI glow, no glassmorphism, no sci-fi, no generic stock athletes. If a ball appears, it must be a correct association football/soccer ball. If people appear, keep them tiny, anonymous, faceless, non-identifiable.
```

Then append one of these concept paragraphs.

### Best Barcelona identity lane: scarf / ticket / tile / street collage

This is the strongest identity direction so far.

```text
Barcelona identity sample D: scarf, ticket/program fragments, Catalan tile texture, balcony shadows, and blaugrana cloth stripes arranged as an editorial collage around a clean pitch lane and correct soccer ball. No readable text on the ticket or scarf. Stronger club-supporter atmosphere without crest.
```

### Sagrada + pitch

```text
Barcelona identity sample A: Sagrada Família silhouette and Barcelona rooftop rhythm as a distant paper-cut skyline above a quiet pitch. One correct soccer ball near the center circle, soft floodlight haze, restrained blaugrana stripe fragments, tactical chalk marks. Editorial, not tourist postcard.
```

### Eixample tactical grid

```text
Barcelona identity sample B: Eixample street grid fused with a football tactical board. Octagonal city blocks subtly become passing lanes and pitch geometry. Cream paper, navy/garnet routes, one small correct soccer ball, no readable street names. Smart, Barcelona-native, analytical.
```

### Montjuïc match-night paper

```text
Barcelona identity sample C: Montjuïc match-night atmosphere, stadium-adjacent floodlight towers, hillside shadows, torn match-program paper, muted Barcelona tile pattern. No official stadium branding. Correct soccer ball and pitch touchline in foreground. Calm but charged.
```

## Barcelona identity ingredients

Use these more often in future batches:

- Sagrada Família silhouette, distant and paper-cut, not postcard literal
- Eixample octagonal street grid fused with passing lanes
- Montjuïc hill / floodlight atmosphere
- Barcelona tile textures
- balcony shadows / street architecture / kiosks
- scarf cloth texture
- ticket or match-program fragments with no readable text
- stronger but restrained blaugrana stripe logic
- club-supporter atmosphere without crest or badges

Avoid making the image generic by relying only on:

- an empty stadium
- a random pitch
- a ball on grass
- abstract red/blue rectangles

Those can work, but they need Barcelona-specific context layered in.

## Repeatable generation script

This script shape worked. Adjust `OUT`, `GLOBAL`, and `items` as needed.

```python
import os, sys, json, shutil, time
from pathlib import Path
from importlib.machinery import SourceFileLoader

sys.path.insert(0, '/Users/aditya/.hermes/hermes-agent')
mod = SourceFileLoader(
    'openai_codex_img',
    '/Users/aditya/.hermes/hermes-agent/plugins/image_gen/openai-codex/__init__.py',
).load_module()
os.environ['OPENAI_IMAGE_MODEL'] = 'gpt-image-2-medium'

OUT = Path('/Users/aditya/GitHub/twotalbarca/public/editorial/post/<slug>')
OUT.mkdir(parents=True, exist_ok=True)

GLOBAL = '''<base prompt from above>'''

items = [
    ('cover', '<concept paragraph>'),
]

provider = mod.OpenAICodexImageGenProvider()
results = []
for slug, concept in items:
    prompt = GLOBAL + '\n\n' + concept
    print(f'GENERATING {slug}...', flush=True)
    start = time.time()
    res = provider.generate(prompt, aspect_ratio='landscape')
    res['slug'] = slug
    res['elapsed_s'] = round(time.time() - start, 1)
    if res.get('success') and res.get('image'):
        src = Path(res['image'])
        dest = OUT / f'{slug}.png'
        shutil.copy2(src, dest)
        res['dest'] = str(dest)
        print(f'OK {slug} -> {dest} ({res["elapsed_s"]}s)', flush=True)
    else:
        print(f'FAIL {slug}: {res.get("error")}', flush=True)
    results.append(res)

(OUT / 'generation-results.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
```

## Contact sheet command

Use this for quick review:

```bash
OUT=/Users/aditya/GitHub/twotalbarca/public/editorial/post/<slug>
magick montage "$OUT"/*.png \
  -tile 2x3 \
  -geometry 768x512+18+18 \
  -background '#efe5d2' \
  "$OUT/contact-sheet.png"
```

If `magick` complains about fonts but still writes the contact sheet, that warning can be ignored.

## QA checklist

Before using an image publicly, visually inspect for:

- no official FC Barcelona crest
- no fake badge / fake crest
- no sponsor marks
- no recognizable player face or likeness
- no readable text artifacts
- no readable numbers unless intentionally approved
- no scoreboard / table UI
- no wrong sport ball geometry
- no neon / AI-agency / dashboard feel
- no generic stock-athlete look
- enough Barcelona identity, not just generic football

Good final images should feel like totalBarca: edited, calm, football-native, publication-grade, and Barcelona-specific without protected marks.
