# twotalBarça Content Model

Last updated: 2026-04-03

This is the consolidated MVP content model based on the earlier IA/spec work and the current editorial design direction.

## 1. Core principle

Use one unified Article model for the primary editorial surface.
Do not create separate CMS models for every writing format in MVP.

Presentation differences should be driven by:
- section
- article type
- feature flags
- references (match, season, person, topic)

## 2. Core content types

### Article

Primary editorial unit.
Use for:
- essays
- match analysis
- tactical pieces
- historical/archive features
- reflections
- interviews
- opinion
- explainers
- briefs

Required fields:
- id
- slug
- headline
- dek
- section
- article_type
- hero_image
- hero_caption
- hero_credit
- author
- publish_date
- body
- excerpt
- status

Recommended fields:
- updated_date
- secondary_authors
- reading_time
- pull_quote
- topics
- season
- competition
- match_ref
- player_refs
- manager_refs
- historical_era
- featured
- related_articles
- source_notes
- seo_title
- meta_description
- social_image

Recommended article_type values:
- Brief
- Analysis
- Tactics
- Reflection
- Feature
- Interview
- Column
- Historical
- Match Notebook
- Opinion
- Explainer

### Weekly Dispatch

Recurring curated package.

Required fields:
- id
- slug
- issue_title
- issue_number
- editors_note
- publish_date
- lead_story
- items
- status

Dispatch item fields:
- headline
- summary
- link
- item_type
- optional image

item_type values:
- must-read
- note
- quote
- stat
- archive-pick
- watchlist

### Match

Structured object for match-linked editorial context.

Required fields:
- id
- slug
- home_team
- away_team
- competition
- season
- kickoff
- venue
- result_status

Recommended fields:
- matchday
- score
- manager
- associated_articles
- match_image

Note:
Do not build live-score/service complexity in MVP.

### Person

For players, managers, presidents, authors, and historical figures.

Required fields:
- id
- slug
- name
- person_type
- short_bio
- portrait

Recommended fields:
- full_bio
- nationality
- role_position
- years_at_club
- related_seasons
- notable_quotes
- related_articles

### Season

Required fields:
- id
- label
- start_date
- end_date

Recommended fields:
- managers
- competitions
- summary
- hero_image

### Topic

Controlled editorial taxonomy.
Not freeform tags.

Required fields:
- id
- name
- slug
- description

Recommended fields:
- parent_topic
- hero_image
- featured_article

### Collection

Curated editorial package / shelf.
Useful for The Archive.

Required fields:
- id
- title
- slug
- description
- collection_type
- items

collection_type values:
- Series
- Dossier
- Starter Pack
- Timeline
- Vault Shelf

### Media Asset

Required fields:
- id
- asset_url
- alt_text
- credit
- caption

Recommended fields:
- focal_point
- photographer
- copyright_status
- width
- height

## 3. Controlled taxonomy

### Primary sections

Recommended MVP sections:
- home
- brief
- match-notes
- analysis
- culture
- archive
- about

Editorial sub-sections later if needed:
- la-masia
- femeni
- opinion
- dispatch

### Topics

Suggested topic values:
- First Team
- La Masia
- Femení
- Tactics
- Club Politics
- History
- Culture & Catalonia
- Finance & Governance
- Identity
- European Nights
- Rivalries
- Stadium / City

### Competition values

- La Liga
- Champions League
- Copa del Rey
- Supercopa
- Preseason / Friendly
- Women’s Champions League
- Liga F

### Historical era values

- Founding Years
- Les Corts
- Kubala Era
- Cruyff Player Era
- Dream Team
- Gaspart Years
- Rijkaard Era
- Guardiola Era
- Post-Guardiola
- Current Era

## 4. Homepage content contract

The homepage is curated, not dense.

Recommended stack:
1. Lead Feature
2. The Brief
3. Match Notes / current football module
4. Analysis / Tactical Board
5. Culture / Essays
6. From the Archive
7. Weekly Dispatch signup

Each homepage card should support:
- section label
- headline
- dek or summary
- author
- date or read time
- optional image

## 5. Article contract

Every article page should support:
- section
- headline
- dek
- author
- publish date
- optional updated date
- reading time
- hero image + caption + credit
- body
- optional pull quote
- related stories

Where relevant, articles should also support:
- match reference
- season
- competition
- person references
- archive/source notes

## 6. Governance rules

- Controlled vocabulary only
- No freeform tag sprawl in MVP
- Every image gets alt text, caption, and credit
- Every article gets real metadata
- Related stories should be curated where possible
- The Archive should be powered by Articles + Collections, not a totally separate system
