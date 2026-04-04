# twotalBarça — Content Model & IA

Last updated: 2026-04-03

## Product framing

twotalBarça is a digital publication with a living archive.
It is not a news wire, not a fan forum, not a lifestyle brand, and not a shop.
The product has to support both:
- current Barça coverage with editorial urgency
- durable archive/culture pieces with long shelf life

Canonical design/world anchor:
- Homepage: “The Last of the Catalan Romantics”
- Article reference: “The Weave of the Blau: A Textile History”
- About/manifesto reference: “The Living Archive.”

Core rules:
1. One publication system across homepage, article, and about.
2. Manual curation first; automation later.
3. Controlled taxonomy only; no tag soup.
4. Archive depth is a product, not a side tab.
5. No commerce or fashion-editorial contamination.

---

## Primary content types

### 1) Article

Use one unified Article model for most editorial publishing.
Different rendering comes from `section`, `article_type`, and flags — not separate CMS types.

Required fields:
- `id` — UUID
- `slug` — permanent unique URL slug
- `headline`
- `dek`
- `excerpt`
- `section` — enum
- `article_type` — enum
- `hero_image` — media asset ref
- `hero_caption`
- `hero_credit`
- `author` — person ref
- `publish_date`
- `body` — rich text
- `status` — `draft | review | scheduled | published`

Recommended fields:
- `updated_date`
- `secondary_authors`
- `pull_quote`
- `reading_time`
- `seo_title`
- `meta_description`
- `social_image`
- `topics` — topic refs, max 5
- `season` — season ref
- `competition` — enum
- `match_ref` — match ref
- `player_refs`
- `manager_refs`
- `historical_era`
- `featured`
- `related_articles`
- `source_notes`

Article types:
- `Brief`
- `Analysis`
- `Tactics`
- `Reflection`
- `Feature`
- `Interview`
- `Column`
- `Historical`
- `Match Notebook`
- `Opinion`
- `Explainer`

Notes:
- “The Weave of the Blau” should be `section: The Vault`, `article_type: Historical`.
- Historical/material-culture pieces can use inline figures and source notes.
- No product modules, retail rails, or shopping language on article pages.

### 2) Weekly Dispatch

Recurring issue-like digest.
Separate from standard Article because structure is package-based.

Required fields:
- `id`
- `slug`
- `issue_title`
- `issue_number`
- `publish_date`
- `editors_note`
- `lead_story` — article ref
- `items` — ordered list
- `status`

Dispatch item fields:
- `headline`
- `summary`
- `link`
- `item_type` — `must-read | note | quote | stat | archive-pick | watchlist`
- `image` optional

### 3) Match

Structured anchor object for coverage.
Not a live-score product in MVP.

Required fields:
- `id`
- `slug`
- `home_team`
- `away_team`
- `competition`
- `season`
- `kickoff`
- `venue`
- `result_status` — `scheduled | complete`

Recommended fields:
- `matchday`
- `score`
- `match_image`
- `associated_articles`
- `manager`

### 4) Person

For players, managers, executives, authors, historical figures.

Required fields:
- `id`
- `slug`
- `name`
- `person_type`
- `short_bio`
- `portrait`

Recommended fields:
- `full_bio`
- `nationality`
- `role_position`
- `years_at_club`
- `related_seasons`
- `notable_quotes`
- `related_articles`

Person types:
- `Player`
- `Manager`
- `Executive`
- `Author`
- `Historical Figure`

### 5) Season

Required fields:
- `id`
- `label`
- `start_date`
- `end_date`

Recommended fields:
- `managers`
- `competitions`
- `summary`
- `hero_image`

### 6) Topic

Controlled editorial taxonomy object.

Required fields:
- `id`
- `name`
- `slug`
- `description`

Recommended fields:
- `parent_topic`
- `hero_image`
- `featured_article`

### 7) Collection

Curated package for dossiers, series, starter packs, timeline shelves.

Required fields:
- `id`
- `title`
- `slug`
- `description`
- `collection_type`
- `items`

Collection types:
- `Series`
- `Dossier`
- `Starter Pack`
- `Timeline`
- `Vault Shelf`

Recommended fields:
- `curator_note`
- `hero_image`
- `featured`

Use collections to make “The Living Archive” real through content, not manifesto fog.

### 8) Media Asset

Required fields:
- `id`
- `file`
- `alt_text`
- `credit`
- `rights_status`

Recommended fields:
- `caption`
- `focal_point`
- `source_archive`
- `usage_restrictions`

Rule:
- missing image credit is a publish blocker

---

## Taxonomy

### Primary sections

These drive nav, page grouping, and URL prefixes.

- `The Brief` → `/brief/`
- `Analysis & Tactics` → `/analysis/`
- `Reflections` → `/reflections/`
- `The Vault` → `/vault/`
- `Weekly Dispatch` → `/dispatch/`
- `Club` → `/club/`

### Topics

Suggested controlled topics:
- First Team
- Femení
- La Masia
- Tactics
- Transfers & Squad Planning
- Governance
- Finance
- History
- Identity
- Culture & Catalonia
- Stadium / City
- Europe
- Rivalries
- Youth Development
- Legends

### Historical eras

- Pre-1950
- 1950s–60s
- Michels / Cruyff era (1971–78)
- Ventura / Maradona era (1979–87)
- Dream Team (1988–96)
- Post-Robson to van Gaal (1996–2003)
- Rijkaard era (2003–08)
- Guardiola era (2008–12)
- Post-Guardiola decline (2012–17)
- Valverde–Setién era (2017–21)
- Xavi era (2021–24)
- Present

### Competitions

- La Liga
- Copa del Rey
- Champions League
- Europa League
- Supercopa de España
- UEFA Super Cup
- Club World Cup
- Friendly / Pre-season

---

## Navigation & IA

### Primary navigation

- Home
- The Brief
- Analysis & Tactics
- Reflections
- The Vault
- Weekly Dispatch
- Club
- About

### Secondary navigation

The Vault:
- Eras
- Icons
- Matches
- Seasons
- Collections

Club:
- First Team
- Femení
- La Masia
- Governance
- Finance
- Camp Nou / City

About:
- What We Cover
- Why We Publish
- Editorial Standard
- Contributors
- Contact

### Browse logic

- Homepage is curated, not chronological.
- Section pages can default to newest, with optional pinned lead slots.
- The Vault needs browse by era, person, season, competition, and collection.
- Search should hit headline, dek, excerpt, person names, topics, season, and competition.
- No trending feed in MVP.

---

## Homepage module contracts

Homepage canon = “The Last of the Catalan Romantics.”
The lead slot must be able to hold that level of emotional/editorial weight.

Recommended stack:
1. Hero Lead
2. Secondary Feature Rail
3. The Brief
4. Analysis & Tactics
5. Reflections
6. Match / Club Pulse
7. The Vault
8. Weekly Dispatch
9. Editors’ Picks
10. Mission / About panel

### Hero Lead
- 1 article
- manual only
- fields surfaced: section label, headline, dek, author, date, hero image
- should usually be Reflection, Analysis, Feature, or Vault — not a Brief

### Secondary Feature Rail
- 2–4 articles
- at least 2 distinct sections represented

### The Brief
- 4–6 most recent Brief items
- text-first, freshness-oriented

### Analysis & Tactics
- 1 featured lead + 2 supporting stories
- featured item should have tactical specificity

### Reflections
- 1 lead + 2 supporting pieces
- voice and identity module; text-led

### Match / Club Pulse
- next or latest match + 2–3 linked stories
- editorial grounding, not a scoreboard app

### The Vault
- 1 featured archive piece + 3 supporting links
- at least one supporting item should be older evergreen material

### Weekly Dispatch
- latest issue + optional previous issue links

### Editors’ Picks
- 3–6 manually selected items
- can pull from older work, not traffic-ranked

### Mission / About panel
- 2–3 sentence publication statement
- About / Contributors / Contact / Dispatch links

---

## Editorial naming and voice

Four-word voice test:
- serious
- intimate
- literate
- football-native

### Prefer
- clear, essayistic, precise headlines
- Barça-rooted language
- emotional control over melodrama
- football terms when they clarify meaning

### Avoid
- clickbait
- startup or growth copy
- architecture-school perfume
- fashion-editorial preciousness
- commerce wording
- generic “content” speak

### Vocabulary bias

Use more:
- rhythm
- shape
- pressure
- ritual
- inheritance
- movement
- voice
- supporters
- atmosphere
- conviction
- matchday
- club identity

Use less:
- geometry
- modernism
- silence
- monograph
- post-modern
- “curation” as self-congratulation

### CTA / label guidance

Use:
- Read
- Read next
- From the archive
- This week’s dispatch
- Related essays

Avoid:
- Explore more
- Discover
- Shop the story
- You may also like
- The collection

---

## MVP vs later

### MVP
- Article
- Weekly Dispatch
- Match
- Person
- Season
- Topic
- Collection
- Media Asset
- Homepage
- Section fronts
- Article pages
- About page
- Topic browse
- lightweight person/season/collection pages
- manual curation controls
- controlled taxonomy

### Explicitly out of MVP
- live blog / live match center
- comments
- recommendation engine
- ecommerce / merch
- paywall / membership gating
- podcast/video models
- multilingual workflow
- advanced tactical widgets

### Later
- footnotes / citations rendering
- richer match center
- author pages
- membership layer
- newsletter preference center
- audio essays
- video essays
- interactive timelines
- multilingual support

---

## Immediate implementation consequence

If a module or schema choice makes twotalBarça feel like:
- a generic football website
- an architecture journal with football references
- a fashion/luxury editorial
then it is wrong and should be cut.
