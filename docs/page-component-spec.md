# twotalBarça — Page & Component Spec

Last updated: 2026-04-03

## Scope

This is the non-visual build spine that can proceed before final Stitch code/design is trusted.
Canonical visual/system anchor: “The Last of the Catalan Romantics.”

Article-first rule:
- the article page is the center of gravity
- homepage is discovery + curation
- about page is trust + editorial identity

Anti-drift rules:
- no architecture-journal coldness
- no fashion-magazine luxury-commerce cues
- no generic sports dashboard behavior

---

## Shared component inventory

### Shell + navigation

1. `SiteShell`
- global page wrapper
- owns max width, global spacing, skip links, footer placement

2. `Header`
- masthead / wordmark
- primary nav
- subscribe or dispatch CTA
- supports desktop and mobile states

3. `PrimaryNav`
- current page state
- keyboard accessible
- mobile drawer/collapse behavior

4. `Footer`
- brand statement
- nav repeat
- contact / legal / dispatch links

### Editorial primitives

5. `SectionContainer`
- consistent section spacing and width rules
- variants: full-width, reading-width, bleed, narrow

6. `Eyebrow`
- section/category label
- reused across homepage, article, about

7. `Headline` family
- `DisplayHeadline`
- `PageHeadline`
- `CardHeadline`
- `Deck`

8. `BodyMeta`
- byline
- date
- updated date
- reading time
- taxonomy label(s)

9. `EditorialRule`
- restrained separator for rhythm, not app chrome

### Media + reading

10. `ResponsiveMedia`
- image handling with aspect ratio, caption, alt, loading strategy

11. `Figure`
- media + caption + credit wrapper

12. `RichTextProse`
- article body renderer
- paragraphs, headings, lists, links, blockquotes, inline figures

13. `PullQuote`
- semantic editorial highlight
- distinct from a normal blockquote

14. `ArticleContinuation`
- end-matter / read next / related links block

15. `TopicLink`
- lightweight taxonomy presentation
- used sparingly

### Discovery modules

16. `FeaturedStoryCard`
- highest-priority homepage story
- image/no-image fallback
- headline, dek, meta, optional kicker

17. `StoryCard`
- standard teaser
- variants: feature, standard, compact, text-only

18. `StoryList`
- ordered set of stories with intentional spacing and hierarchy

19. `RelatedStories`
- 2–4 deliberately chosen items

20. `SectionLink`
- low-emphasis “view all” / archive link

### Publication trust blocks

21. `MissionBlock`
- concise articulation of what twotalBarça is

22. `EditorialPrinciplesList`
- standards and worldview

23. `ContributorBlock`
- simple contributor listing
- MVP can support one editor cleanly

24. `ContactBlock`
- contact / submission / newsletter paths

### System utilities

25. `SeoMeta`
- title, description, canonical, OG, structured data

26. `ThemeTokenProvider`
- central contract for colors, type, spacing, borders, motion

27. `Link` and `Button` primitives
- accessible semantics and focus states

28. `FallbackState`
- no-image, missing author, empty-related-content handling

---

## Page schematics

## Homepage

Purpose:
- establish editorial identity fast
- orient readers
- surface curation, not volume

Recommended section order:
1. Header / masthead band
2. Lead feature
3. Secondary feature rail
4. The Brief
5. Analysis & Tactics
6. Reflections
7. Match / Club Pulse
8. The Vault
9. Weekly Dispatch
10. Editors’ Picks
11. Mission / about panel
12. Footer

Homepage rules:
- lead feature should feel like a defining statement, not latest-post sludge
- use fewer, stronger cards over dense card soup
- avoid dashboard/ticker overload unless it earns its place
- The Vault should feel alive, not like a dead archive shelf

## Article page

Purpose:
- be the best reading environment in the product

Recommended section order:
1. Header / masthead
2. Article header
   - section label
   - headline
   - dek
   - byline/meta
3. Hero media block
4. Article body
5. Optional pull quote / inline figure blocks
6. End matter
   - topics
   - author note / bio stub
   - continuation links
7. Related stories
8. Footer

Article rules:
- must work beautifully with and without hero media
- longform first, shortform second
- no ornamental interactions that break reading flow
- no fashion-commerce side rails

## About / manifesto page

Purpose:
- explain what twotalBarça is
- establish trust and worldview
- make “The Living Archive” feel Barça-rooted and human

Recommended section order:
1. Intro header
2. Mission block
3. What we cover
4. Editorial principles
5. Contributors
6. In the club’s long memory / archive anchor
7. Contact / dispatch invitation
8. Footer

About-page rules:
- no generic conceptual art imagery
- no sci-fi or perfume-brand tone
- copy should sound human and specific, not ceremonial

---

## Token categories and semantic roles

### Color tokens

Use semantic roles, not one-off hex usage.

Core roles:
- `bg.canvas`
- `bg.subtle`
- `bg.inverse`
- `text.primary`
- `text.muted`
- `text.inverse`
- `accent.primary` → Barça blue
- `accent.secondary` → Barça red/garnet
- `accent.highlight` → restrained gold
- `border.subtle`
- `border.strong`
- `link.default`
- `link.hover`
- `focus.ring`

Color guidance:
- blue is the main structural accent
- red supports, not dominates
- gold is rare and must never look tacky
- no pink
- no muddy brown drift
- no giant flat sports-color blocks

### Typography tokens

- `font.display`
- `font.body`
- `font.ui`
- `size.display`
- `size.h1`
- `size.h2`
- `size.h3`
- `size.body`
- `size.caption`
- `line.display`
- `line.body`
- `tracking.kicker`

### Spacing tokens

- `space.1` … `space.12`
- one scale across shell, modules, article body, cards

### Layout tokens

- `container.max`
- `container.reading`
- `container.narrow`
- `grid.gap`
- `section.gap`
- `radius.none-or-minimal`

### Motion tokens

- `motion.fast`
- `motion.normal`
- `easing.standard`

Rule:
- subtle only
- the site is a publication, not a toy

---

## Responsive behavior guidance

### General
- mobile is not a collapsed desktop magazine
- preserve hierarchy, not exact composition
- reading width stays controlled at every breakpoint

### Homepage
- hero can stack text/image on smaller widths
- rails/grid modules reduce card count before they become cluttered
- The Brief should become a clean vertical list on mobile
- The Vault should maintain editorial hierarchy even when stacked

### Article page
- longform reading width must remain disciplined
- captions must stay attached to the correct media
- pull quotes should not become oversized noise on mobile
- inline media should collapse cleanly without awkward half-bleeds

### About page
- section transitions must remain clear when stacked
- contributor blocks should degrade to simple text-first cards

### Navigation
- accessible mobile nav is mandatory before public preview
- all tap targets must meet minimum size

---

## Article-first build order

### Phase 1 — core primitives
1. token scaffold
2. typography decisions
3. shell/header/footer skeleton
4. rich prose renderer
5. article header block
6. figure/caption/media primitives
7. pull quote block
8. article end matter + related stories

Acceptance gate:
- a 2,000+ word essay reads well on desktop and mobile
- semantics are clean
- no major visual placeholders break trust

### Phase 2 — homepage foundation
9. featured story card
10. story card variants
11. lead feature module
12. secondary feature rail
13. The Brief module
14. match / club pulse strip

### Phase 3 — homepage depth
15. Analysis & Tactics module
16. Reflections module
17. The Vault module
18. Weekly Dispatch module
19. Editors’ Picks module
20. mission/about panel

### Phase 4 — about page
21. mission block
22. principles block
23. contributor block
24. archive-memory anchor
25. contact/dispatch block

### Phase 5 — system hardening
26. mobile nav
27. responsive pass
28. metadata/SEO
29. fallback states
30. accessibility audit

---

## Risks

### 1. System drift
Homepage, article, and about become adjacent moods instead of one publication.
Mitigation:
- one shared token system
- one shared component set
- article page becomes truth source

### 2. Typography indecision
Editorial products live or die on type.
Mitigation:
- lock display/body/UI font roles early
- don’t treat font choice as later polish

### 3. Color misuse
Blue/red/gold can turn tacky or sportsy fast.
Mitigation:
- semantic token discipline
- gold only for tiny emphasis
- red secondary to blue

### 4. Empty-pretty-shell syndrome
Beautiful modules with weak content look fake immediately.
Mitigation:
- use real Barça-rooted placeholder copy early
- test with longform, brief, and archive items before over-polishing

### 5. Mobile collapse
Desktop editorial rhythm disappears on phone.
Mitigation:
- article page built mobile-aware from the start
- module hierarchy designed to stack intelligently

---

## Acceptance checks

### Article page
- a long essay is comfortable to read
- hero/no-hero variants both work
- captions and credits are always visible
- related stories are curated, not random sludge
- nothing feels like a fashion spread or product page

### Homepage
- lead story feels like a statement
- modules feel editorial, not dashboard-like
- archive content is visibly alive
- dispatch/signup feels publication-native, not growth-hacky

### About page
- explains purpose clearly
- “The Living Archive” feels club-rooted
- no conceptual-luxury nonsense survives

### System-wide
- no hardcoded style chaos outside token system
- no module introduces a new visual language without reason
- the product still feels unmistakably Barça even without crests everywhere

---

## Immediate next build recommendation

Start implementation with the article page and shared primitives.
Do not wait for perfect visuals to begin:
- content model
- component contracts
- typography roles
- shell/layout structure
can all proceed now.
