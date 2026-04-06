import type { NewsroomGeneratedSitePayload } from "@/lib/newsroom-types";
import newsroomSiteContent from "@/newsroom/generated/site-content.json";

export type NavItem = {
  label: string;
  href: string;
};

export type FooterLinkGroup = {
  title: string;
  links: NavItem[];
};

export type MediaAsset = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
};

export type Story = {
  slug?: string;
  headline: string;
  excerpt: string;
  section: string;
  href?: string;
  dek?: string;
  author?: string;
  date?: string;
  readingTime?: string;
  image?: MediaAsset;
};

export type MetadataSeed = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
};

export type ArticleSeed = {
  id: string;
  slug: string;
  headline: string;
  dek: string;
  excerpt: string;
  section: string;
  sectionSlug: string;
  type: string;
  author: string;
  date: string;
  readTime: string;
  readingTime: string;
  heroImage: MediaAsset;
  heroCaption: string;
  heroCredit: string;
  body: string[];
  pullQuote: string;
  quoteBy: string;
  conviction: string;
  ritual: string;
  timeline: Array<{ year: string; note: string }>;
  topics: string[];
  topicSlugs: string[];
  seasonSlug: string;
  personSlugs: string[];
  historicalEra?: string;
  seoTitle?: string;
  metaDescription?: string;
  relatedSlugs: string[];
};

export type Article = Omit<ArticleSeed, "relatedSlugs"> & {
  href: string;
  related: Story[];
};

export type SectionRecord = {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  landingDek: string;
  featuredArticleSlug: string;
};

export type Topic = {
  id: string;
  name: string;
  slug: string;
  description: string;
  featuredArticleSlug: string;
};

export type Season = {
  id: string;
  slug: string;
  label: string;
  startDate: string;
  endDate: string;
  summary: string;
  heroImage: MediaAsset;
  managers: string[];
  competitions: string[];
  keyStorySlugs: string[];
};

export type Person = {
  id: string;
  slug: string;
  name: string;
  personType: "editor" | "writer" | "player" | "manager" | "historian";
  role: string;
  specialty?: string;
  shortBio: string;
  bio?: string;
  trust?: string;
  fullBio: string;
  portrait: MediaAsset;
  nationality?: string;
  rolePosition?: string;
  yearsAtClub?: string;
  relatedSeasons: string[];
  notableQuotes: string[];
  relatedArticleSlugs: string[];
};

export type DispatchItem = {
  headline: string;
  summary: string;
  link: string;
  itemType: "must-read" | "note" | "quote" | "stat" | "archive-pick" | "watchlist";
};

export type DispatchIssue = {
  id: string;
  slug: string;
  issueTitle: string;
  issueNumber: number;
  editorsNote: string;
  publishDate: string;
  leadStorySlug: string;
  items: DispatchItem[];
  status: "published";
};

export type ArchiveCollection = {
  id: string;
  title: string;
  slug: string;
  description: string;
  collectionType: "Series" | "Dossier" | "Starter Pack" | "Timeline" | "Vault Shelf";
  itemSlugs: string[];
};

export type AboutData = {
  intro: { eyebrow: string; title: string; dek: string; body: string };
  mission: { title: string; body: string; companion: { eyebrow: string; body: string } };
  standardsTitle: string;
  standardsEyebrow: string;
  standards: Array<{ title: string; detail: string }>;
  coverageTitle: string;
  coverageEyebrow: string;
  coverage: Array<{ title: string; detail: string }>;
  principlesTitle: string;
  principlesEyebrow: string;
  principles: Array<{ title: string; detail: string }>;
  contributorsTitle: string;
  archiveTitle: string;
  archiveEvidence: Array<{ label: string; title: string; detail: string }>;
  contact: {
    title: string;
    body: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryLabel: string;
    secondaryValue: string;
  };
};

export type HomePageData = {
  hero: Story & { section: string; readingTime: string; image: MediaAsset };
  tickerItems: Array<{ label: string; href: string }>;
  analysisFeature: {
    kicker: string;
    headline: string;
    body: string;
    href: string;
    ctaLabel: string;
    image: MediaAsset;
  };
  cultureStories: Story[];
  briefDispatches: Array<{ stamp: string; body: string; href: string; featured?: boolean }>;
  vault: {
    kicker: string;
    heading: string;
    ctaLabel: string;
    ctaHref: string;
    items: Array<{ issue: string; title: string; href: string; image: string }>;
  };
  reflections: Array<{ quote: string; byline: string }>;
  newsletter: {
    eyebrow: string;
    heading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    secondaryLinkLabel: string;
    secondaryLinkHref: string;
    note: string;
  };
  missionPanel: {
    eyebrow: string;
    heading: string;
    body: string;
    points: Array<{ title: string; detail: string }>;
    primaryLinkLabel: string;
    primaryLinkHref: string;
    secondaryLinkLabel: string;
    secondaryLinkHref: string;
  };
};

export type ArticleCompanionCopy = {
  fieldNoteLabel: string;
  convictionLabel: string;
  notebookEyebrow: string;
  notebookTitle: string;
  notebookDescription: string;
};

function media(src: string, alt: string, caption?: string, credit?: string): MediaAsset {
  return { src, alt, caption, credit };
}

function storyFromSeed(seed: ArticleSeed): Story {
  return {
    slug: seed.slug,
    headline: seed.headline,
    excerpt: seed.excerpt,
    section: seed.section,
    href: `/article/${seed.slug}`,
    dek: seed.dek,
    author: seed.author,
    date: seed.date,
    readingTime: seed.readingTime,
    image: seed.heroImage,
  };
}

const generatedNewsroomPayload = newsroomSiteContent as NewsroomGeneratedSitePayload;

function compareContentDateDesc(left?: string, right?: string) {
  const leftTime = left ? Date.parse(left) : 0;
  const rightTime = right ? Date.parse(right) : 0;
  return rightTime - leftTime;
}

function toArticleSeed(record: NewsroomGeneratedSitePayload["articles"][number]): ArticleSeed {
  return {
    id: record.id,
    slug: record.slug,
    headline: record.headline,
    dek: record.dek,
    excerpt: record.excerpt,
    section: record.section,
    sectionSlug: record.sectionSlug,
    type: record.type,
    author: record.author,
    date: record.date,
    readTime: record.readTime,
    readingTime: record.readingTime,
    heroImage: record.heroImage,
    heroCaption: record.heroCaption,
    heroCredit: record.heroCredit,
    body: record.body,
    pullQuote: record.pullQuote,
    quoteBy: record.quoteBy,
    conviction: record.conviction,
    ritual: record.ritual,
    timeline: record.timeline,
    topics: record.topics,
    topicSlugs: record.topicSlugs,
    seasonSlug: record.seasonSlug,
    personSlugs: record.personSlugs,
    historicalEra: record.historicalEra,
    seoTitle: record.seoTitle,
    metaDescription: record.metaDescription,
    relatedSlugs: record.relatedSlugs,
  };
}

function toDispatchIssue(record: NewsroomGeneratedSitePayload["dispatchIssues"][number]): DispatchIssue {
  return {
    id: record.id,
    slug: record.slug,
    issueTitle: record.issueTitle,
    issueNumber: record.issueNumber,
    editorsNote: record.editorsNote,
    publishDate: record.publishDate,
    leadStorySlug: record.leadStorySlug,
    items: record.items,
    status: "published",
  };
}

function mergeArticleSeedLists(baseSeeds: ArticleSeed[], generatedRecords: NewsroomGeneratedSitePayload["articles"]) {
  return [...baseSeeds, ...generatedRecords.map(toArticleSeed)]
    .reduce<ArticleSeed[]>((accumulator, seed) => {
      const existingIndex = accumulator.findIndex((entry) => entry.slug === seed.slug);

      if (existingIndex >= 0) {
        accumulator[existingIndex] = seed;
      } else {
        accumulator.push(seed);
      }

      return accumulator;
    }, [])
    .sort((left, right) => compareContentDateDesc(left.date, right.date));
}

function mergeDispatchIssueLists(baseIssues: DispatchIssue[], generatedRecords: NewsroomGeneratedSitePayload["dispatchIssues"]) {
  return [...baseIssues, ...generatedRecords.map(toDispatchIssue)]
    .reduce<DispatchIssue[]>((accumulator, issue) => {
      const existingIndex = accumulator.findIndex((entry) => entry.slug === issue.slug);

      if (existingIndex >= 0) {
        accumulator[existingIndex] = issue;
      } else {
        accumulator.push(issue);
      }

      return accumulator;
    }, [])
    .sort((left, right) => compareContentDateDesc(left.publishDate, right.publishDate));
}

const articleSeeds: ArticleSeed[] = [
  {
    id: "article-weave-blau",
    slug: "the-weave-of-the-blau",
    headline: "The Weave of the Blau",
    dek: "Before the shirt became global merchandise, it was already a carrier of memory: wool, dye, weight, sweat, and civic meaning.",
    excerpt: "The shirt endures because it is more than symbol. In Barcelona it has always held the pressure of belonging, stitched into public life long before branding departments learned to sell nostalgia back to supporters.",
    section: "Archive",
    sectionSlug: "archive",
    type: "Historical",
    author: "Clara Montfort",
    date: "April 3, 2026",
    readTime: "12 min",
    readingTime: "12 min read",
    heroImage: media("https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=1200&q=80", "Folded football shirts arranged in warm low light."),
    heroCaption: "Archive shirts carry civic memory as much as club identity.",
    heroCredit: "Photo illustration for twotalBarça",
    body: [
      "Supporters talk about identity as though it lives in abstraction, but the shirt has always made the argument embarrassingly physical. Weight, weave, dye, collar, fit: each decision changes how the club appears in public, and therefore how the public is taught to recognize it.",
      "Barça's shirt has been read as a flag, a sales unit, and a relic. It has also been a practical object soaked through by rain, pulled by defenders, and dragged across mud. That practical life matters because the club's symbols do not remain noble once they leave the poster.",
      "In the old photographs the blaugrana bands do not look sleek. They look worked on. The colors absorb weather, the wool hangs differently, and the body carrying the garment appears more citizen than icon.",
      "The modern replica asks the supporter to buy closeness at industrial scale. Sometimes that works. Often it flattens the history into aesthetic shorthand. The task of archive writing is not to sneer at the present but to recover the stubborn material facts that made the symbol credible in the first place.",
      "That is why the archive matters. It reminds the contemporary institution that memory is not just a brand reserve. It is an obligation to the standards that earlier bodies carried without the promise of global applause.",
    ],
    pullQuote: "A Barça shirt means more when it still looks capable of surviving an actual football match.",
    quoteBy: "Clara Montfort",
    conviction: "The archive is useful only if it sharpens how we judge the present, not if it flatters it.",
    ritual: "Materials change, but the public test remains the same: can the shirt still bear the pressure of expectation without turning into costume?",
    timeline: [
      { year: "1920s", note: "Heavy wool made the shirt a burden as much as a badge." },
      { year: "1992", note: "Television saturation turned blaugrana into a global image." },
      { year: "2010s", note: "Replica culture separated commercial novelty from slower civic meaning." },
    ],
    topics: ["History", "Identity", "Culture & Catalonia"],
    topicSlugs: ["history", "identity", "culture-catalonia"],
    seasonSlug: "1991-92",
    personSlugs: ["clara-montfort", "johan-cruyff"],
    historicalEra: "Dream Team",
    seoTitle: "The Weave of the Blau | twotalBarça",
    metaDescription: "A Barça archive essay on the shirt as material memory, public symbol, and footballing object across generations.",
    relatedSlugs: ["home-and-the-sacred", "the-last-of-the-catalan-romantics", "the-camp-nou-exile-soundscape"],
  },
  {
    id: "article-catalan-romantics",
    slug: "the-last-of-the-catalan-romantics",
    headline: "The Last of the Catalan Romantics",
    dek: "What the club inherits is not only a style of football, but a way of carrying pressure in public. In a season of noise, Barça is trying to remember how conviction is supposed to look.",
    excerpt: "The modern club is asked to perform certainty before it has earned it. Barça is judged by a harsher standard: not just whether it wins, but whether it recognizes itself while winning.",
    section: "Culture",
    sectionSlug: "culture",
    type: "Feature",
    author: "Maury Vidal",
    date: "April 3, 2026",
    readTime: "9 min",
    readingTime: "9 min read",
    heroImage: media("https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80", "Floodlit football stadium under a dramatic evening sky."),
    heroCaption: "Public pressure at Barça is inherited before it is explained.",
    heroCredit: "Imagery study for twotalBarça",
    body: [
      "Barça still speaks in the language of inheritance even when the institution behaves like a modern conglomerate. That contradiction is not a bug in the club's public life. It is the central tension of it.",
      "Supporters do not only judge outcomes. They judge comportment: how the team uses the ball, how it speaks after a poor night, and how it responds when pressure arrives from its own history.",
      "That is why seasons of apparent progress can still feel emotionally unconvincing. The club is trying to become legible to itself, which is a harder task and a more interesting one.",
      "The present team has shown fragments of recovery. The midfield circulates with more patience, the back line holds its nerve longer, and the side looks less panicked by possession.",
      "None of that guarantees fulfillment. It does suggest the club is learning to stop performing certainty and start building it.",
    ],
    pullQuote: "Barça is most persuasive when style looks like discipline rather than self-mythology.",
    quoteBy: "Maury Vidal",
    conviction: "The club's identity is not a costume for difficult weeks. It is a standard for how those weeks are navigated.",
    ritual: "Supporters recognize the old signals quickly: calm circulation, bravery without chaos, and football that can withstand scrutiny after the final whistle.",
    timeline: [
      { year: "2008", note: "The Pep era reset expectations by making coherence visible." },
      { year: "2015", note: "A more vertical side still felt recognizably Barça because it carried conviction." },
      { year: "2026", note: "The current side is rebuilding credibility through smaller structural habits." },
    ],
    topics: ["Identity", "Culture & Catalonia", "First Team"],
    topicSlugs: ["identity", "culture-catalonia", "first-team"],
    seasonSlug: "2025-26",
    personSlugs: ["maury-vidal", "hansi-flick"],
    metaDescription: "A feature on Barça's public standards, inherited pressure, and the slow work of becoming legible again.",
    relatedSlugs: ["how-barca-found-the-free-man", "gavis-return-changes-the-rhythm", "the-weave-of-the-blau"],
  },
  {
    id: "article-free-man",
    slug: "how-barca-found-the-free-man",
    headline: "How Barça Found the Free Man on the Far Side",
    dek: "The pattern was simple enough to miss in real time: draw pressure into the left interior lane, then release early before the block could recover its width.",
    excerpt: "The best attacking sequences were disciplined, repeated, and timed a half-second earlier than the opposition could tolerate.",
    section: "Analysis",
    sectionSlug: "analysis",
    type: "Analysis",
    author: "Jordi Serra",
    date: "April 2, 2026",
    readTime: "8 min",
    readingTime: "8 min read",
    heroImage: media("https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80", "Overhead view of a football pitch with players spread across the flanks."),
    heroCaption: "The far-side release was available only because the first two passes were clean.",
    heroCredit: "Tactical illustration for twotalBarça",
    body: [
      "The far-side switch was not a miracle ball. It was the end point of a calmer first phase.",
      "Once the opposition shifted, the release toward the weak side arrived before the block could re-square.",
      "What changed from earlier matches was not ambition but timing. The pivot stayed a fraction deeper and the full-back resisted arriving too early.",
      "This is urgent football disguised as calm: movement arranged to make the decisive action easier rather than louder.",
      "If Barça can keep producing that release under more serious pressure, the attacking structure will stop depending on rescue acts.",
    ],
    pullQuote: "The free man is usually found two passes before the switch, not in the switch itself.",
    quoteBy: "Jordi Serra",
    conviction: "Positional play still depends on emotional discipline: trust the circulation and the release will appear.",
    ritual: "Tactical progress becomes real only when the same sequence repeats often enough to stop looking accidental.",
    timeline: [
      { year: "Phase one", note: "The pivot holds the central lane." },
      { year: "Phase two", note: "The interior draws pressure without losing body shape." },
      { year: "Phase three", note: "The release arrives before the block recovers width." },
    ],
    topics: ["Tactics", "First Team"],
    topicSlugs: ["tactics", "first-team"],
    seasonSlug: "2025-26",
    personSlugs: ["jordi-serra", "hansi-flick"],
    metaDescription: "A tactical read on Barça's far-side release pattern and the calmer structure underneath it.",
    relatedSlugs: ["gavis-return-changes-the-rhythm", "the-last-of-the-catalan-romantics", "why-finance-needs-plain-terms"],
  },
  {
    id: "article-gavi-rhythm",
    slug: "gavis-return-changes-the-rhythm",
    headline: "Gavi's Return Changes the Rhythm Before It Changes the Lineup",
    dek: "Even in limited minutes, he restores a kind of emotional tempo that the side has missed.",
    excerpt: "Pressing distances shorten, second balls feel winnable again, and the team stops waiting to discover its own intensity.",
    section: "The Brief",
    sectionSlug: "brief",
    type: "Brief",
    author: "Maury Vidal",
    date: "April 2, 2026",
    readTime: "4 min",
    readingTime: "4 min read",
    heroImage: media("https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80", "Footballer controlling the ball under pressure in midfield."),
    heroCaption: "Intensity can return to a side before any settled eleven is found.",
    heroCredit: "Match observation for twotalBarça",
    body: [
      "Returning players are usually measured immediately in lineups and end products. Gavi changes matches earlier than that.",
      "With him on the field, the side accepts more duels, closes distance faster, and recovers second balls as though they still belong to the team by right.",
      "That matters especially in a group still relearning how to dominate without theatricality.",
    ],
    pullQuote: "He restores tempo as a collective belief before he restores it as an individual star turn.",
    quoteBy: "Maury Vidal",
    conviction: "Intensity should feel contagious again, not borrowed from desperation.",
    ritual: "Barça at its best does not confuse calm with passivity. Gavi helps the side remember the difference.",
    timeline: [
      { year: "15 minutes", note: "Pressing distances shorten immediately after his introduction." },
      { year: "30 minutes", note: "The midfield regains appetite for second-ball duels." },
      { year: "Next phase", note: "Selection questions get more interesting once tempo stabilizes." },
    ],
    topics: ["First Team", "Identity"],
    topicSlugs: ["first-team", "identity"],
    seasonSlug: "2025-26",
    personSlugs: ["maury-vidal", "gavi"],
    metaDescription: "A brief on how Gavi changes Barça's rhythm, pressure, and emotional tempo before he changes the starting eleven.",
    relatedSlugs: ["how-barca-found-the-free-man", "flicks-back-line-is-holding-higher", "the-last-of-the-catalan-romantics"],
  },
  {
    id: "article-high-line",
    slug: "flicks-back-line-is-holding-higher",
    headline: "Flick's Back Line Is Holding Higher, but Only When the Midfield Can Rest With the Ball",
    dek: "The shift is less about bravery than trust. When the first pass is clean, the defensive line stops playing in retreat.",
    excerpt: "The high line has looked more coherent because the midfield is finally offering rest positions instead of emergency exits.",
    section: "Match Notes",
    sectionSlug: "match-notes",
    type: "Match Notebook",
    author: "Jordi Serra",
    date: "April 1, 2026",
    readTime: "5 min",
    readingTime: "5 min read",
    heroImage: media("https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80", "Football defenders stepping up in a line during open play."),
    heroCaption: "The line steps with conviction only when the ball is secure ahead of it.",
    heroCredit: "Frame study for twotalBarça",
    body: [
      "The headline change is visual: the back line sits higher. The real change is infrastructural.",
      "Defenders rarely choose their line in isolation. They choose it according to how trustworthy the next possession phase feels.",
      "The side is defending more meters through structure and fewer through emergency sprints.",
    ],
    pullQuote: "A high line is never just a line. It is a vote of confidence in the possession behind it.",
    quoteBy: "Jordi Serra",
    conviction: "Rest with the ball remains the first condition for brave defending.",
    ritual: "The most credible defensive aggression is often prepared by the calmest circulation.",
    timeline: [
      { year: "Before", note: "The line dropped early when first-phase possession looked fragile." },
      { year: "Now", note: "Rest positions in midfield let the center-backs hold their ground longer." },
      { year: "Next", note: "Sharper opponents will test whether the line stays coordinated." },
    ],
    topics: ["First Team", "Tactics"],
    topicSlugs: ["first-team", "tactics"],
    seasonSlug: "2025-26",
    personSlugs: ["jordi-serra", "hansi-flick"],
    relatedSlugs: ["how-barca-found-the-free-man", "gavis-return-changes-the-rhythm", "the-last-of-the-catalan-romantics"],
  },
  {
    id: "article-exile-soundscape",
    slug: "the-camp-nou-exile-soundscape",
    headline: "Camp Nou's Temporary Exile Has Altered the Soundscape of Matchday",
    dek: "Montjuïc is not just another venue. It changes where the tension settles and how quickly the crowd reaches the pitch.",
    excerpt: "Support is not only volume. It is proximity, habit, and a building's own acoustics, and temporary exile has changed all three.",
    section: "Culture",
    sectionSlug: "culture",
    type: "Feature",
    author: "Clara Montfort",
    date: "March 25, 2026",
    readTime: "6 min",
    readingTime: "6 min read",
    heroImage: media("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80", "Football crowd in a steeply raked stadium at dusk."),
    heroCaption: "The building changes what the crowd can become.",
    heroCredit: "Matchday observation for twotalBarça",
    body: [
      "Every ground teaches a crowd where to place its energy. Temporary exile has shifted that lesson.",
      "Montjuïc changes the walk, the angle of arrival, and the acoustic lag between incident and roar.",
      "The result is not lesser support so much as altered support: stretched, delayed, and newly aware of distance.",
    ],
    pullQuote: "A stadium is never neutral. It tutors the public in how to feel the match.",
    quoteBy: "Clara Montfort",
    conviction: "The ground is part of the football argument, not scenery behind it.",
    ritual: "Support is built from route, repetition, and the physical closeness between stand and pitch.",
    timeline: [
      { year: "Arrival", note: "The route to the ground changes how tension accumulates." },
      { year: "Kickoff", note: "Steeper distance changes how quickly sound reaches the pitch." },
      { year: "After", note: "Temporary homes rewrite matchday memory faster than institutions admit." },
    ],
    topics: ["Stadium / City", "Culture & Catalonia", "History"],
    topicSlugs: ["stadium-city", "culture-catalonia", "history"],
    seasonSlug: "2025-26",
    personSlugs: ["clara-montfort"],
    relatedSlugs: ["home-and-the-sacred", "the-last-of-the-catalan-romantics", "the-weave-of-the-blau"],
  },
  {
    id: "article-finance-plain-terms",
    slug: "why-finance-needs-plain-terms",
    headline: "The Club's Finance Messaging Needs Plainer Nouns",
    dek: "The problem is not austerity itself. It is the habit of speaking in abstractions when supporters want plain terms.",
    excerpt: "Legibility is respect, not weakness. Supporters can tolerate difficulty more easily than they can tolerate evasive language.",
    section: "Match Notes",
    sectionSlug: "match-notes",
    type: "Column",
    author: "Maury Vidal",
    date: "March 18, 2026",
    readTime: "5 min",
    readingTime: "5 min read",
    heroImage: media("https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80", "Financial report pages and a pen on a desk."),
    heroCaption: "Institutional language should clarify pressure, not obscure it.",
    heroCredit: "Desk study for twotalBarça",
    body: [
      "Barça's institutional language often mistakes abstraction for control.",
      "Supporters are capable of handling bad news. What they do not deserve is vocabulary designed to keep them outside the room.",
      "Plain terms will not solve the club's financial questions, but they would at least stop turning those questions into theatre.",
    ],
    pullQuote: "Clarity is not an indulgence. It is part of institutional credibility.",
    quoteBy: "Maury Vidal",
    conviction: "The club should speak like it remembers who pays attention and why.",
    ritual: "Public trust is built sentence by sentence long before it is rescued by a result.",
    timeline: [
      { year: "Announcement", note: "Supporters receive a concept before they receive an explanation." },
      { year: "Reaction", note: "Abstraction creates suspicion where legibility might have created patience." },
      { year: "Repair", note: "The club still has time to relearn plain language." },
    ],
    topics: ["Finance & Governance", "Club Politics"],
    topicSlugs: ["finance-governance", "club-politics"],
    seasonSlug: "2025-26",
    personSlugs: ["maury-vidal"],
    relatedSlugs: ["flicks-back-line-is-holding-higher", "how-barca-found-the-free-man", "the-last-of-the-catalan-romantics"],
  },
  {
    id: "article-home-sacred",
    slug: "home-and-the-sacred",
    headline: "Home and the Sacred",
    dek: "Camp Nou became sacred not because it was untouchable, but because repetition taught supporters how to inhabit it.",
    excerpt: "A stadium earns reverence through use: routes walked, songs repeated, and the familiar way tension traveled from stand to pitch.",
    section: "Archive",
    sectionSlug: "archive",
    type: "Historical",
    author: "Clara Montfort",
    date: "March 11, 2026",
    readTime: "7 min",
    readingTime: "7 min read",
    heroImage: media("https://images.unsplash.com/photo-1487466365202-1afdb86c764e?auto=format&fit=crop&w=1200&q=80", "Historic football stands before kickoff."),
    heroCaption: "Grounds become sacred by teaching the public how to gather.",
    heroCredit: "Archive study for twotalBarça",
    body: [
      "Supporters often speak about Camp Nou as if sanctity arrived all at once. It did not.",
      "The building accumulated charge through repetition: the same routes, the same thresholds, the same shift from city noise to match noise.",
      "That is why exile feels strange. It interrupts not only geography, but the learned sequence by which the public becomes a crowd.",
    ],
    pullQuote: "A stadium becomes sacred by repetition before it becomes sacred by rhetoric.",
    quoteBy: "Clara Montfort",
    conviction: "The old ground still matters because it taught habits that continue to shape expectations now.",
    ritual: "Matchday ritual begins long before kickoff, in the repeated choreography of arrival.",
    timeline: [
      { year: "Route", note: "The walk to the ground trained supporters in anticipation." },
      { year: "Threshold", note: "Entry points acted as emotional gears between city and match." },
      { year: "Memory", note: "Later reverence was built on countless practical repetitions." },
    ],
    topics: ["History", "Stadium / City"],
    topicSlugs: ["history", "stadium-city"],
    seasonSlug: "1991-92",
    personSlugs: ["clara-montfort"],
    relatedSlugs: ["the-camp-nou-exile-soundscape", "the-weave-of-the-blau", "the-last-of-the-catalan-romantics"],
  },
];

const mergedArticleSeeds = mergeArticleSeedLists(articleSeeds, generatedNewsroomPayload.articles ?? []);
const articleSeedMap = new Map(mergedArticleSeeds.map((seed) => [seed.slug, seed]));

function relatedStoriesFor(seed: ArticleSeed): Story[] {
  return seed.relatedSlugs
    .map((slug) => articleSeedMap.get(slug))
    .filter((entry): entry is ArticleSeed => Boolean(entry))
    .map((entry) => storyFromSeed(entry));
}

export const articles: Article[] = mergedArticleSeeds.map((seed) => ({
  ...seed,
  href: `/article/${seed.slug}`,
  related: relatedStoriesFor(seed),
}));

export const sections: SectionRecord[] = [
  { id: "section-brief", slug: "brief", name: "The Brief", eyebrow: "Publication / Brief", description: "Short pieces that translate the week's signals into plain editorial language.", landingDek: "Barça generates noise easily. The Brief keeps only the lines that still matter once the shouting stops.", featuredArticleSlug: "gavis-return-changes-the-rhythm" },
  { id: "section-match-notes", slug: "match-notes", name: "Match Notes", eyebrow: "Publication / Match Notes", description: "Immediate football readings from matches, training patterns, and game-state details.", landingDek: "Not liveblog residue. Match Notes keeps the observations that survive first adrenaline.", featuredArticleSlug: "flicks-back-line-is-holding-higher" },
  { id: "section-analysis", slug: "analysis", name: "Analysis", eyebrow: "Publication / Analysis", description: "Structure, spacing, role clarity, and the tactical logic beneath the result.", landingDek: "Analysis is where the game slows down enough for shape, timing, and responsibility to become visible.", featuredArticleSlug: "how-barca-found-the-free-man" },
  { id: "section-culture", slug: "culture", name: "Culture", eyebrow: "Publication / Culture", description: "Writing on Barça as place, public ritual, and Catalan civic argument.", landingDek: "Football remains the center of gravity, but a club this loaded also has atmosphere, memory, and public language worth documenting.", featuredArticleSlug: "the-last-of-the-catalan-romantics" },
  { id: "section-archive", slug: "archive", name: "Archive", eyebrow: "Publication / Archive", description: "Essays and shelves that keep the club's long memory active rather than ceremonial.", landingDek: "The archive is not a museum corner. It is the pressure of the past on the present tense.", featuredArticleSlug: "the-weave-of-the-blau" },
];

export const topics: Topic[] = [
  { id: "topic-first-team", name: "First Team", slug: "first-team", description: "The senior side as football team rather than content engine: roles, pressure, and match-to-match identity.", featuredArticleSlug: "how-barca-found-the-free-man" },
  { id: "topic-tactics", name: "Tactics", slug: "tactics", description: "Positional play, spacing, pressing habits, and the structural choices that decide matches.", featuredArticleSlug: "how-barca-found-the-free-man" },
  { id: "topic-history", name: "History", slug: "history", description: "The club's long memory as a usable pressure on the present rather than a decorative backdrop.", featuredArticleSlug: "the-weave-of-the-blau" },
  { id: "topic-identity", name: "Identity", slug: "identity", description: "Writing on how Barça tries to recognize itself through football, symbols, and standards.", featuredArticleSlug: "the-last-of-the-catalan-romantics" },
  { id: "topic-culture-catalonia", name: "Culture & Catalonia", slug: "culture-catalonia", description: "The relationship between club, city, language, and the civic textures around matchday.", featuredArticleSlug: "the-camp-nou-exile-soundscape" },
  { id: "topic-finance-governance", name: "Finance & Governance", slug: "finance-governance", description: "Institutional clarity, public trust, and the decisions that shape the club beyond the touchline.", featuredArticleSlug: "why-finance-needs-plain-terms" },
  { id: "topic-club-politics", name: "Club Politics", slug: "club-politics", description: "Power, messaging, and the internal arguments that spill into public life.", featuredArticleSlug: "why-finance-needs-plain-terms" },
  { id: "topic-stadium-city", name: "Stadium / City", slug: "stadium-city", description: "Architecture, atmosphere, and the relationship between Barça and the spaces that hold its public.", featuredArticleSlug: "home-and-the-sacred" },
];

export const seasons: Season[] = [
  { id: "season-2025-26", slug: "2025-26", label: "2025-26", startDate: "2025-08-01", endDate: "2026-06-01", summary: "A season of reconstruction measured less by declarations than by whether the side can look coherent again under pressure.", heroImage: media("https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1200&q=80", "A football pitch moments before kickoff with the crowd arriving."), managers: ["Hansi Flick"], competitions: ["La Liga", "UEFA Champions League", "Copa del Rey"], keyStorySlugs: ["the-last-of-the-catalan-romantics", "how-barca-found-the-free-man", "gavis-return-changes-the-rhythm", "flicks-back-line-is-holding-higher"] },
  { id: "season-1991-92", slug: "1991-92", label: "1991-92", startDate: "1991-08-01", endDate: "1992-06-01", summary: "The Dream Team season remains a point of pressure because it made imagination and seriousness look compatible.", heroImage: media("https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80", "Historic football stands before a European night."), managers: ["Johan Cruyff"], competitions: ["La Liga", "European Cup"], keyStorySlugs: ["the-weave-of-the-blau", "home-and-the-sacred"] },
];

export const people: Person[] = [
  { id: "person-maury-vidal", slug: "maury-vidal", name: "Maury Vidal", personType: "editor", role: "Editor", specialty: "Standards, present-tense writing, and the public language around the club", shortBio: "Writes about Barça as an argument between memory and performance.", bio: "Writes about Barça as an argument between memory and performance.", trust: "Edits the publication's voice and keeps the football specific when abstraction starts creeping in.", fullBio: "Maury Vidal writes on Barça as football club, institution, and public argument. His work keeps one foot in the present match and one in the longer expectations supporters inherit.", portrait: media("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80", "Portrait of a writer in natural light."), relatedSeasons: ["2025-26"], notableQuotes: ["Clarity is not a concession to the audience. It is respect for them."], relatedArticleSlugs: ["the-last-of-the-catalan-romantics", "gavis-return-changes-the-rhythm", "why-finance-needs-plain-terms"] },
  { id: "person-jordi-serra", slug: "jordi-serra", name: "Jordi Serra", personType: "writer", role: "Analysis & Tactics", specialty: "Spacing, role clarity, and the structural details that decide matches", shortBio: "Focuses on spacing, role clarity, and the small structural choices that decide matches.", bio: "Focuses on spacing, role clarity, and the small structural choices that decide matches.", trust: "Keeps analysis legible enough for readers who care about shape but do not want jargon as camouflage.", fullBio: "Jordi Serra writes the tactical side of twotalBarça, concentrating on how collective habits turn into recognisable football rather than one-off diagrams.", portrait: media("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80", "Portrait of a football analyst against a muted background."), relatedSeasons: ["2025-26"], notableQuotes: ["The free man is usually prepared two passes earlier."], relatedArticleSlugs: ["how-barca-found-the-free-man", "flicks-back-line-is-holding-higher"] },
  { id: "person-clara-montfort", slug: "clara-montfort", name: "Clara Montfort", personType: "historian", role: "Vault", specialty: "Club history, material culture, and the objects that carry Barça across generations", shortBio: "Covers club history, material culture, and the objects that carry Barça across generations.", bio: "Covers club history, material culture, and the objects that carry Barça across generations.", trust: "Builds archive work with usable evidence rather than nostalgia moodboards.", fullBio: "Clara Montfort covers the archive as living pressure. Her writing keeps old grounds, shirts, and civic rituals connected to the present club.", portrait: media("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80", "Portrait of a historian and essayist."), relatedSeasons: ["1991-92", "2025-26"], notableQuotes: ["The archive matters when it still inconveniences the present."], relatedArticleSlugs: ["the-weave-of-the-blau", "the-camp-nou-exile-soundscape", "home-and-the-sacred"] },
  { id: "person-hansi-flick", slug: "hansi-flick", name: "Hansi Flick", personType: "manager", role: "Head coach", shortBio: "Current head coach tasked with making Barça coherent before it can be fluent again.", fullBio: "Flick's relevance to the publication is footballing rather than celebrity-based: he is judged on whether the side can build recognizable habits under pressure.", portrait: media("https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80", "Coach standing on the touchline before kickoff."), nationality: "Germany", rolePosition: "Manager", yearsAtClub: "2024-present", relatedSeasons: ["2025-26"], notableQuotes: ["Systems only matter if players can inhabit them under pressure."], relatedArticleSlugs: ["the-last-of-the-catalan-romantics", "how-barca-found-the-free-man", "flicks-back-line-is-holding-higher"] },
  { id: "person-gavi", slug: "gavi", name: "Gavi", personType: "player", role: "Midfielder", shortBio: "Midfielder whose return shifts the emotional pitch of matches before it changes the lineup.", fullBio: "Gavi appears here as a footballing barometer: pressing appetite, second-ball hunger, and the sense that the side can impose its own tempo.", portrait: media("https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80", "Young midfielder under stadium floodlights."), nationality: "Spain", rolePosition: "Midfielder", yearsAtClub: "2021-present", relatedSeasons: ["2025-26"], notableQuotes: ["Intensity becomes a structural resource when enough players trust it together."], relatedArticleSlugs: ["gavis-return-changes-the-rhythm"] },
  { id: "person-johan-cruyff", slug: "johan-cruyff", name: "Johan Cruyff", personType: "manager", role: "Manager / reference figure", shortBio: "Reference figure because he made imagination and seriousness look compatible at Barça.", fullBio: "Cruyff remains present in the publication not as a shrine object but as a recurring pressure on how Barça thinks football should appear in public.", portrait: media("https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80", "Historic stadium lights before a major European night."), nationality: "Netherlands", rolePosition: "Manager", yearsAtClub: "1988-1996", relatedSeasons: ["1991-92"], notableQuotes: ["The club's old standards remain useful because they still ask something difficult of the present."], relatedArticleSlugs: ["the-weave-of-the-blau"] },
];

export const contributors = people.filter((person) => ["maury-vidal", "jordi-serra", "clara-montfort"].includes(person.slug));

export const archiveCollections: ArchiveCollection[] = [
  { id: "collection-vault-shelf", title: "The Vault Shelf", slug: "vault-shelf", description: "Objects, grounds, and older thresholds that still put demands on the present club.", collectionType: "Vault Shelf", itemSlugs: ["the-weave-of-the-blau", "home-and-the-sacred", "the-camp-nou-exile-soundscape"] },
  { id: "collection-rebuild-notebook", title: "The Rebuild Notebook", slug: "rebuild-notebook", description: "Pieces tracking whether the current side is becoming coherent enough to be judged seriously.", collectionType: "Dossier", itemSlugs: ["the-last-of-the-catalan-romantics", "how-barca-found-the-free-man", "flicks-back-line-is-holding-higher", "gavis-return-changes-the-rhythm"] },
];

const seededDispatchIssues: DispatchIssue[] = [
  {
    id: "dispatch-12",
    slug: "week-in-blaugrana-12",
    issueTitle: "The Week in Blaugrana, No. 12",
    issueNumber: 12,
    editorsNote: "Barça has looked more coherent than fluent. That is not an insult. Coherence is usually the first honest sign of a team becoming itself again.",
    publishDate: "April 4, 2026",
    leadStorySlug: "the-last-of-the-catalan-romantics",
    status: "published",
    items: [
      { headline: "The Last of the Catalan Romantics", summary: "A feature on inherited standards, public pressure, and why style only matters when it still looks serious.", link: "/article/the-last-of-the-catalan-romantics", itemType: "must-read" },
      { headline: "How Barça Found the Free Man on the Far Side", summary: "A tactical read on how the weak-side release was made available by calmer circulation.", link: "/article/how-barca-found-the-free-man", itemType: "note" },
      { headline: "The Weave of the Blau", summary: "A vault pick on the shirt as object, civic signal, and material memory.", link: "/article/the-weave-of-the-blau", itemType: "archive-pick" },
      { headline: "17 attacking-third recoveries", summary: "Barça recorded its best league figure in six weeks.", link: "/match-notes", itemType: "stat" },
      { headline: "Watch the midfield triangle if the right-back inverts earlier", summary: "The next structural question is whether the side can hold calm while changing the release point.", link: "/analysis", itemType: "watchlist" },
    ],
  },
  {
    id: "dispatch-11",
    slug: "week-in-blaugrana-11",
    issueTitle: "The Week in Blaugrana, No. 11",
    issueNumber: 11,
    editorsNote: "The club spent the week talking about future plans. The football was more persuasive when it focused on smaller present-tense repairs.",
    publishDate: "March 28, 2026",
    leadStorySlug: "how-barca-found-the-free-man",
    status: "published",
    items: [
      { headline: "How Barça Found the Free Man on the Far Side", summary: "A tactical read on how the weak-side release was made available by calmer circulation.", link: "/article/how-barca-found-the-free-man", itemType: "must-read" },
      { headline: "Camp Nou's Temporary Exile Has Altered the Soundscape of Matchday", summary: "Support is not only volume. It is proximity, habit, and a building's own acoustics.", link: "/article/the-camp-nou-exile-soundscape", itemType: "quote" },
      { headline: "The club's finance messaging needs plainer nouns", summary: "Legibility is respect, not weakness.", link: "/article/why-finance-needs-plain-terms", itemType: "note" },
    ],
  },
];

export const dispatchIssues: DispatchIssue[] = mergeDispatchIssueLists(
  seededDispatchIssues,
  generatedNewsroomPayload.dispatchIssues ?? [],
);

export const siteSections: SectionRecord[] = [
  sections[0]!,
  sections[1]!,
  sections[2]!,
  sections[3]!,
  sections[4]!,
  {
    id: "section-dispatch",
    slug: "dispatch",
    name: "Dispatch",
    eyebrow: "Publication / Dispatch",
    description: "The Weekly Dispatch archive: lead reads, archive picks, and the useful line of argument from the week.",
    landingDek: "Dispatch is the publication's weekly issue surface: curated, finite, and built to circulate the strongest work back into the present.",
    featuredArticleSlug: dispatchIssues[0]?.leadStorySlug ?? "the-last-of-the-catalan-romantics",
  },
];

export type Collection = {
  slug: string;
  title: string;
  description: string;
  collectionType: ArchiveCollection["collectionType"];
  articleSlugs: string[];
  itemArticleSlugs: string[];
};

export const collections: Collection[] = archiveCollections.map((collection) => ({
  slug: collection.slug,
  title: collection.title,
  description: collection.description,
  collectionType: collection.collectionType,
  articleSlugs: collection.itemSlugs,
  itemArticleSlugs: collection.itemSlugs,
}));

export const navItems: NavItem[] = [
  { label: "The Brief", href: "/section/brief" },
  { label: "Match Notes", href: "/match-notes" },
  { label: "Analysis", href: "/analysis" },
  { label: "Culture", href: "/culture" },
  { label: "Archive", href: "/archive" },
  { label: "About", href: "/about" },
];

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Read",
    links: [
      { label: "The Brief", href: "/section/brief" },
      { label: "Match Notes", href: "/match-notes" },
      { label: "Analysis", href: "/analysis" },
      { label: "Culture", href: "/culture" },
      { label: "Identity topic", href: "/topic/identity" },
    ],
  },
  {
    title: "Publication",
    links: [
      { label: "Weekly Dispatch", href: "/dispatch" },
      { label: "Archive", href: "/archive" },
      { label: "About", href: "/about" },
      { label: "Editorial principles", href: "/about#principles" },
    ],
  },
  {
    title: "Dispatch",
    links: [
      { label: "Latest issue", href: dispatchIssues[0] ? `/dispatch/${dispatchIssues[0].slug}` : "/dispatch" },
      { label: "Dispatch archive", href: "/dispatch" },
      { label: "Coverage map", href: "/about#coverage" },
      { label: "Contact", href: "/about#contact" },
    ],
  },
];

export const siteMeta = {
  name: "twotalBarça",
  url: "https://twotalbarca.com",
  locale: "en_US",
  description: "A premium FC Barcelona publication for essays, match notes, archive work, and analysis rooted in football rather than noise.",
  tagline: "FC Barcelona writing in the present tense and the club's long memory.",
  contactEmail: "editor@twotalbarca.com",
  keywords: [
    "FC Barcelona",
    "Barca analysis",
    "Barca culture",
    "Barca archive",
    "football writing",
    "Weekly Dispatch",
  ],
  footer: footerLinkGroups,
  footerMeta: {
    socialLinks: [
      { label: "About", href: "/about" },
      { label: "Weekly Dispatch", href: "/dispatch" },
      { label: "Archive", href: "/archive" },
    ],
    legalNotice: "FC Barcelona writing with memory, football specificity, and no tolerance for template noise.",
  },
} as const;

export const aboutData: AboutData = {
  intro: {
    eyebrow: "About the publication",
    title: "twotalBarça is a publication about FC Barcelona in the present tense and the long tense.",
    dek: "We publish essays, analysis, archive work, and dispatches that take the club seriously without surrendering to noise.",
    body: "Barça generates more commentary than understanding. We are interested in the harder work: rhythm over chatter, memory over cliche, and writing that treats supporters like adults while keeping football at the center of gravity.",
  },
  mission: {
    title: "Mission",
    body: "twotalBarça covers FC Barcelona as football club, institution, memory, and place. We want the site to read like a publication first: article-led, archive-aware, and literate without drifting into theatre about its own seriousness.",
    companion: {
      eyebrow: "Why now",
      body: "The club is entering another phase where coherence matters more than posture. The publication exists to track whether the football, the language, and the institutional self-understanding are keeping pace with one another.",
    },
  },
  standardsTitle: "Editorial standards",
  standardsEyebrow: "What we owe the reader",
  standards: [
    { title: "Football stays central", detail: "Even when we write about memory, politics, or stadium life, the club remains a football subject rather than a lifestyle abstraction." },
    { title: "Clarity over posture", detail: "If a sentence sounds like a slogan, a template, or borrowed theory hiding a weak point, it does not stay in the draft." },
    { title: "Archive with evidence", detail: "The vault is built with objects, seasons, grounds, and traceable claims, not generic heritage fog." },
  ],
  coverageTitle: "What we cover",
  coverageEyebrow: "Coverage map",
  coverage: [
    { title: "First team and Femení context", detail: "Selection logic, role clarity, tactical adjustments, and the pressure of present-tense results." },
    { title: "Governance and finance", detail: "The institutional language around the club, and whether it treats supporters like participants or spectators." },
    { title: "History, identity, and Catalan context", detail: "The civic, cultural, and historical forces that still shape what supporters think the club should be." },
    { title: "Stadium, city, and ritual", detail: "The spaces, routes, acoustics, and matchday habits that make Barcelona feel like a place rather than a brand." },
  ],
  principlesTitle: "Editorial principles",
  principlesEyebrow: "How we work",
  principles: [
    { title: "Curated signal over volume", detail: "We do not imitate a rumor wire. Fewer pieces, stronger pieces, and a clear reason each one belongs." },
    { title: "Publication language, not content sludge", detail: "The Brief, Match Notes, Analysis, Archive, and Dispatch describe function clearly so readers know what kind of reading they are entering." },
    { title: "Archive credibility", detail: "Older material is presented as living pressure on the present club, not as a museum brochure tucked into the footer." },
  ],
  contributorsTitle: "Contributors",
  archiveTitle: "In the club's long memory",
  archiveEvidence: [
    { label: "Vault shelf", title: "Objects that still demand something", detail: "Shirts, grounds, and old public rituals remain in the publication because they still sharpen our judgment of the current club." },
    { label: "Seasons", title: "The pressure of 1991-92 and 2025-26", detail: "Past triumphs and current rebuilds are placed beside one another so memory behaves like a standard rather than wallpaper." },
    { label: "Dispatch", title: "An archive that circulates", detail: "Weekly dispatch issues keep older work moving back into the present conversation instead of sealing it in a dead corner." },
  ],
  contact: {
    title: "Contact and dispatch",
    body: "The Weekly Dispatch is where we gather the week's must-read pieces, archive picks, and editorial notes. If you want to write, collaborate, or tip us toward a piece of Barça history worth reopening, this is the way in.",
    primaryCtaLabel: "Join the weekly dispatch",
    primaryCtaHref: "/dispatch",
    secondaryLabel: "Email",
    secondaryValue: siteMeta.contactEmail,
  },
};

function getFrontPageArticle(slug?: string) {
  return slug ? articleSeedMap.get(slug) : undefined;
}

function buildFrontPageHero() {
  const heroSeed =
    getFrontPageArticle(generatedNewsroomPayload.frontPagePlan?.heroArticleSlug) ??
    articleSeedMap.get("the-last-of-the-catalan-romantics")!;

  return {
    ...storyFromSeed(heroSeed),
    section: heroSeed.section,
    readingTime: heroSeed.readingTime,
    image: heroSeed.heroImage,
  };
}

function buildTickerItems() {
  const overrideSeeds = (generatedNewsroomPayload.frontPagePlan?.tickerArticleSlugs ?? [])
    .map((slug) => getFrontPageArticle(slug))
    .filter((item): item is ArticleSeed => Boolean(item));

  if (overrideSeeds.length > 0) {
    return overrideSeeds.map((seed) => ({
      label: `${seed.section}: ${seed.headline}`,
      href: `/article/${seed.slug}`,
    }));
  }

  return [
    { label: "Match Notes: The line only holds when the ball can rest", href: "/match-notes" },
    { label: "Analysis: The free man appears two passes before the switch", href: "/analysis" },
    { label: "Culture: Public pressure still shapes how conviction looks", href: "/culture" },
    { label: "Archive: The shirt still behaves like public memory", href: "/archive" },
  ];
}

function buildCultureStories() {
  const overrideSeeds = (generatedNewsroomPayload.frontPagePlan?.cultureStorySlugs ?? [])
    .map((slug) => getFrontPageArticle(slug))
    .filter((item): item is ArticleSeed => Boolean(item));

  if (overrideSeeds.length > 0) {
    return overrideSeeds.map((seed) => storyFromSeed(seed));
  }

  return [storyFromSeed(articleSeedMap.get("the-camp-nou-exile-soundscape")!), storyFromSeed(articleSeedMap.get("home-and-the-sacred")!)];
}

function buildBriefDispatches() {
  const overrideSeeds = (generatedNewsroomPayload.frontPagePlan?.briefArticleSlugs ?? [])
    .map((slug) => getFrontPageArticle(slug))
    .filter((item): item is ArticleSeed => Boolean(item));

  if (overrideSeeds.length > 0) {
    return overrideSeeds.slice(0, 3).map((seed, index) => ({
      stamp: `${seed.section} / ${seed.date}`,
      body: seed.headline,
      href: `/article/${seed.slug}`,
      featured: index === 0,
    }));
  }

  return [
    { stamp: "The Brief / April 2", body: "Gavi's return changes the rhythm before it changes the lineup.", href: "/article/gavis-return-changes-the-rhythm", featured: true },
    { stamp: "Match Notes / April 1", body: "Flick's back line is holding higher, but only when the midfield can rest with the ball.", href: "/article/flicks-back-line-is-holding-higher" },
    { stamp: "Governance / March 18", body: "The club's finance messaging needs plainer nouns.", href: "/article/why-finance-needs-plain-terms" },
  ];
}

function buildVaultItems() {
  const overrideSeeds = (generatedNewsroomPayload.frontPagePlan?.vaultArticleSlugs ?? [])
    .map((slug) => getFrontPageArticle(slug))
    .filter((item): item is ArticleSeed => Boolean(item));

  if (overrideSeeds.length > 0) {
    return overrideSeeds.slice(0, 3).map((seed, index) => ({
      issue: index === 0 ? "Vault shelf" : index === 1 ? "Ground study" : "Present archive",
      title: seed.headline,
      href: `/article/${seed.slug}`,
      image: seed.heroImage.src,
    }));
  }

  return [
    { issue: "Vault shelf", title: "The Weave of the Blau", href: "/article/the-weave-of-the-blau", image: articleSeedMap.get("the-weave-of-the-blau")!.heroImage.src },
    { issue: "Ground study", title: "Home and the Sacred", href: "/article/home-and-the-sacred", image: articleSeedMap.get("home-and-the-sacred")!.heroImage.src },
    { issue: "Present archive", title: "Camp Nou's temporary exile has altered the soundscape of matchday", href: "/article/the-camp-nou-exile-soundscape", image: articleSeedMap.get("the-camp-nou-exile-soundscape")!.heroImage.src },
  ];
}

function getFeaturedDispatchHref() {
  const featuredDispatchSlug = generatedNewsroomPayload.frontPagePlan?.featuredDispatchSlug;

  if (featuredDispatchSlug && dispatchIssues.some((issue) => issue.slug === featuredDispatchSlug)) {
    return `/dispatch/${featuredDispatchSlug}`;
  }

  return dispatchIssues[0] ? `/dispatch/${dispatchIssues[0].slug}` : "/dispatch";
}

export const homePageData: HomePageData = {
  hero: buildFrontPageHero(),
  tickerItems: buildTickerItems(),
  analysisFeature: {
    kicker: "Analysis / Tactical Board",
    headline: "How Barça Found the Free Man on the Far Side",
    body: "The pattern was simple enough to miss in real time: draw pressure into the left interior lane, then release early before the block could recover its width.",
    href: "/analysis",
    ctaLabel: "Read Analysis",
    image: articleSeedMap.get("how-barca-found-the-free-man")!.heroImage,
  },
  cultureStories: buildCultureStories(),
  briefDispatches: buildBriefDispatches(),
  vault: {
    kicker: "From the Archive",
    heading: "The vault stays close to the present tense.",
    ctaLabel: "Enter Archive",
    ctaHref: "/archive",
    items: buildVaultItems(),
  },
  reflections: [
    {
      quote: "A club does not lose its identity in one bad month. It loses it when convenience replaces standards.",
      byline: "From The Last of the Catalan Romantics",
    },
    {
      quote: "The crowd still knows the difference between speed and clarity, even when the club pretends it does not.",
      byline: "From the weekly notebook",
    },
  ],
  newsletter: {
    eyebrow: "Dispatch",
    heading: "The Weekly Dispatch",
    body: "A concise weekly issue with one lead read, one archive return, and the line of argument that still holds after the noise burns off.",
    ctaLabel: "Open the dispatch archive",
    ctaHref: "/dispatch",
    secondaryLinkLabel: "Read the latest issue",
    secondaryLinkHref: getFeaturedDispatchHref(),
    note: "This static build keeps the dispatch as a readable archive surface: no fake signup form, no inbox sludge, one careful issue at a time.",
  },
  missionPanel: {
    eyebrow: "Why twotalBarça exists",
    heading: "A Barça publication with memory, standards, and a clear reason for every shelf.",
    body: "twotalBarça is built for readers who want present-tense football analysis, cultural context, and archive work in the same publication without the churn of a generic sports feed.",
    points: [
      {
        title: "Curated, not crowded",
        detail: "The homepage is a deliberate front page: one lead argument, a few strong rails, and no fake urgency.",
      },
      {
        title: "Football stays central",
        detail: "Even the culture and archive shelves are there to sharpen how we read the current club.",
      },
      {
        title: "Weekly rhythm, long memory",
        detail: "The Dispatch keeps the week's strongest line of argument alive while the vault keeps older work active.",
      },
    ],
    primaryLinkLabel: "Read about the publication",
    primaryLinkHref: "/about",
    secondaryLinkLabel: "Browse the latest dispatch",
    secondaryLinkHref: getFeaturedDispatchHref(),
  },
};

export function getArticleBySlug(slug: string) {
  return articles.find((item) => item.slug === slug);
}

export function getArticleSlugs() {
  return articles.map((item) => item.slug);
}

export function getStoryHref(story: Pick<Story, "href">, fallback = "/archive") {
  return story.href ?? fallback;
}

export function getSectionBySlug(slug: string) {
  return sections.find((item) => item.slug === slug);
}

export function getSectionHref(slug: string) {
  const aliasMap: Record<string, string> = {
    analysis: "/analysis",
    culture: "/culture",
    "match-notes": "/match-notes",
  };

  return aliasMap[slug] ?? `/section/${slug}`;
}

export function getSectionSlugs() {
  return sections.map((item) => item.slug);
}

export function getTopicBySlug(slug: string) {
  return topics.find((item) => item.slug === slug);
}

export function getTopicSlugs() {
  return topics.map((item) => item.slug);
}

export function getSeasonBySlug(slug: string) {
  return seasons.find((item) => item.slug === slug);
}

export function getSeasonSlugs() {
  return seasons.map((item) => item.slug);
}

export function getPersonBySlug(slug: string) {
  return people.find((item) => item.slug === slug);
}

export function getPersonSlugs() {
  return people.map((item) => item.slug);
}

export function getDispatchBySlug(slug: string) {
  return dispatchIssues.find((item) => item.slug === slug);
}

export function getDispatchSlugs() {
  return dispatchIssues.map((item) => item.slug);
}

export function getDispatchIssueBySlug(slug: string) {
  return getDispatchBySlug(slug);
}

export function getDispatchIssueSlugs() {
  return getDispatchSlugs();
}

export function getLatestDispatchIssue() {
  return dispatchIssues[0];
}

export function getArticlesBySection(sectionSlug: string) {
  return articles.filter((item) => item.sectionSlug === sectionSlug);
}

export function getArticlesByTopic(topicSlug: string) {
  return articles.filter((item) => item.topicSlugs.includes(topicSlug));
}

export function getArticlesBySeason(seasonSlug: string) {
  return articles.filter((item) => item.seasonSlug === seasonSlug);
}

export function getArticlesByPerson(personSlug: string) {
  return articles.filter((item) => item.personSlugs.includes(personSlug));
}

export function getArchiveArticles() {
  return getArticlesBySection("archive");
}

export function getArchiveCollectionStories(collection: ArchiveCollection) {
  return collection.itemSlugs.map((slug) => getArticleBySlug(slug)).filter((item): item is Article => Boolean(item));
}

export function getCollectionArticles(collection: Collection | ArchiveCollection) {
  const itemSlugs = "itemArticleSlugs" in collection ? collection.itemArticleSlugs : collection.itemSlugs;
  return itemSlugs.map((slug) => getArticleBySlug(slug)).filter((item): item is Article => Boolean(item));
}

export function getFeaturedArticleForRecord(record: { featuredArticleSlug: string }) {
  return getArticleBySlug(record.featuredArticleSlug);
}

export function getDispatchLeadStory(issue: DispatchIssue) {
  return getArticleBySlug(issue.leadStorySlug);
}

export function getDispatchStories(issue: DispatchIssue) {
  return issue.items
    .map((item) => item.link.match(/^\/article\/(.+)$/)?.[1])
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => getArticleBySlug(slug))
    .filter((item): item is Article => Boolean(item));
}

export function getDispatchItemsAsStories(issue: DispatchIssue): Story[] {
  return issue.items.map((item) => ({
    headline: item.headline,
    excerpt: item.summary,
    section: "Dispatch",
    href: item.link,
  }));
}

export function toStory(articleItem: Article): Story {
  return {
    slug: articleItem.slug,
    headline: articleItem.headline,
    excerpt: articleItem.excerpt,
    section: articleItem.section,
    href: articleItem.href,
    dek: articleItem.dek,
    author: articleItem.author,
    date: articleItem.date,
    readingTime: articleItem.readingTime,
    image: articleItem.heroImage,
  };
}

export function formatDisplayDate(dateString: string) {
  const value = new Date(dateString);
  if (Number.isNaN(value.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(value);
}

export function getSectionForArticle(articleItem: Article) {
  return getSectionBySlug(articleItem.sectionSlug);
}

export function getSectionLabel(slug: string) {
  return getSectionBySlug(slug)?.name ?? slug;
}

export function getTopicLabel(slug: string) {
  return getTopicBySlug(slug)?.name ?? slug;
}

export function getPeopleForArticle(articleItem: Article) {
  return articleItem.personSlugs.map((slug) => getPersonBySlug(slug)).filter((item): item is Person => Boolean(item));
}

export function getRelatedArticles(articleItem: Article) {
  return articleItem.related
    .map((story) => story.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => getArticleBySlug(slug))
    .filter((item): item is Article => Boolean(item));
}

export function getArticleCompanionCopy(articleItem: Article): ArticleCompanionCopy {
  const sectionLabel = getSectionLabel(articleItem.sectionSlug);
  const archiveContext = articleItem.historicalEra ? `the ${articleItem.historicalEra} era` : "the club's long memory";

  if (articleItem.sectionSlug === "archive") {
    return {
      fieldNoteLabel: "Long-memory note",
      convictionLabel: "Why it endures",
      notebookEyebrow: "Archive notes",
      notebookTitle: `Three reference points in ${archiveContext}`,
      notebookDescription:
        "A short chronology keeps the archive grounded in usable evidence: dates, thresholds, and the concrete pressures that still reach the present club.",
    };
  }

  if (articleItem.sectionSlug === "analysis") {
    return {
      fieldNoteLabel: "Tactical note",
      convictionLabel: "Why it matters",
      notebookEyebrow: "Analysis notebook",
      notebookTitle: `Three reference points behind ${articleItem.headline}`,
      notebookDescription:
        "A short notebook keeps the tactical argument tied to repeatable sequences, timings, and the pressures that made the pattern visible.",
    };
  }

  if (articleItem.sectionSlug === "match-notes") {
    return {
      fieldNoteLabel: "Match note",
      convictionLabel: "At stake",
      notebookEyebrow: "Match notebook",
      notebookTitle: `Three checkpoints around ${articleItem.headline}`,
      notebookDescription:
        "The match notebook keeps the piece close to observable details: when the shift appeared, how it held, and where the next stress point sits.",
    };
  }

  return {
    fieldNoteLabel: `${sectionLabel} note`,
    convictionLabel: "Why it matters",
    notebookEyebrow: `${sectionLabel} notes`,
    notebookTitle: `Three reference points around ${articleItem.headline}`,
    notebookDescription:
      "A short editorial notebook keeps the piece anchored in dates, pressures, and recurring signals instead of letting the argument float free of the football context around it.",
  };
}

export function buildMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  authors,
  section,
  tags,
}: MetadataSeed) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title,
      description,
      siteName: siteMeta.name,
      locale: siteMeta.locale,
      publishedTime,
      authors,
      section,
      tags,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  };
}

export const article = getArticleBySlug("the-weave-of-the-blau") as Article;
export const dispatchIssue = getLatestDispatchIssue();
export const homeLead = homePageData.hero;
