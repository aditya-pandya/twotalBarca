export type Story = {
  slug: string;
  section: string;
  headline: string;
  excerpt: string;
  href?: string;
  dek?: string;
  author?: string;
  date?: string;
  readingTime?: string;
};

export type NavItem = {
  href: string;
  label: string;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/#brief", label: "The Brief" },
  { href: "/#match-notes", label: "Match Notes" },
  { href: "/#analysis", label: "Analysis" },
  { href: "/#archive", label: "Archive" },
  { href: "/about", label: "About" },
];

export const siteMeta = {
  name: "twotalBarça",
  description:
    "A premium FC Barcelona editorial publication: article-first, archive-minded, and football-specific.",
  nav: navItems,
};

export const homeLead: Story & { type: string; href: string } = {
  slug: "the-last-of-the-catalan-romantics",
  section: "Reflections",
  type: "Feature",
  headline: "The Last of the Catalan Romantics",
  dek:
    "What the club inherits is not only a style of football, but a way of carrying pressure in public. In a season of noise, Barça is trying to remember how conviction is supposed to look.",
  excerpt:
    "The modern club is asked to perform certainty before it has earned it. Barça, because of its history, is judged by a harsher standard: not just whether it wins, but whether it recognizes itself while winning.",
  author: "Maury Vidal",
  date: "April 3, 2026",
  readingTime: "9 min read",
  href: "/article/the-weave-of-the-blau",
};

export const briefItems: Story[] = [
  {
    slug: "flick-back-line-higher",
    section: "The Brief",
    headline: "Flick’s back line is holding higher, but only when the midfield can rest with the ball",
    excerpt:
      "The shift is less about bravery than trust. When the first pass is clean, the defensive line stops playing in retreat.",
  },
  {
    slug: "gavi-return-rhythm",
    section: "The Brief",
    headline: "Gavi’s return changes the rhythm before it changes the lineup",
    excerpt:
      "Even in limited minutes, he restores a kind of emotional tempo that the side has missed.",
  },
  {
    slug: "montjuic-soundscape",
    section: "The Brief",
    headline: "Camp Nou’s temporary exile has altered the soundscape of matchday",
    excerpt:
      "Montjuïc is not just another venue. It changes where the tension settles and how quickly the crowd reaches the pitch.",
  },
  {
    slug: "finance-messaging-legible",
    section: "The Brief",
    headline: "The club’s messaging around finance remains defensive when it should be legible",
    excerpt:
      "The problem is not austerity itself. It is the habit of speaking in abstractions when supporters want plain terms.",
  },
];

export const analysisLead: Story = {
  slug: "free-man-on-the-far-side",
  section: "Analysis & Tactics",
  headline: "How Barça found the free man on the far side",
  dek:
    "The pattern was simple enough to miss in real time: draw pressure into the left interior lane, then release early before the block could recover its width.",
  excerpt:
    "The best attacking sequences were not spectacular. They were disciplined, repeated, and timed a half-second earlier than the opposition could tolerate.",
  author: "Jordi Serra",
  readingTime: "7 min read",
  href: "/article/the-weave-of-the-blau",
};

export const analysisSupport: Story[] = [
  {
    slug: "pivot-calmer-full-back-height",
    section: "Notebook",
    headline: "Why the pivot looked calmer once the full-back stopped arriving at the same height",
    excerpt: "A close read of small structural choices that made the match feel calmer than it looked.",
    href: "/article/the-weave-of-the-blau",
  },
  {
    slug: "striker-decoy-run",
    section: "Notebook",
    headline: "The striker’s best contribution was not the finish but the first decoy run",
    excerpt: "The move mattered because it bent the block before the pass ever arrived.",
    href: "/article/the-weave-of-the-blau",
  },
];

export const reflections: Story[] = [
  {
    slug: "what-remains-when-style-falters",
    section: "Reflection",
    headline: "What remains when the style falters",
    excerpt:
      "A club does not lose its identity in one bad month. It loses it when convenience replaces standards.",
    href: "/article/the-weave-of-the-blau",
  },
  {
    slug: "crowd-knows-difference",
    section: "Reflection",
    headline: "The crowd still knows the difference between speed and clarity",
    excerpt:
      "Barça’s supporters have always accepted risk more easily than confusion.",
    href: "/article/the-weave-of-the-blau",
  },
];

export const vaultFeature: Story & { era: string; href: string } = {
  slug: "the-weave-of-the-blau",
  section: "The Vault",
  headline: "The Weave of the Blau: A Textile History",
  dek:
    "Before the shirt became global merchandise, it was already a carrier of memory: wool, dye, weight, sweat, and civic meaning.",
  excerpt: "Club identity is often discussed as symbol. The shirt reminds us it is also material.",
  author: "Clara Montfort",
  era: "Dream Team",
  href: "/article/the-weave-of-the-blau",
};

export const vaultLinks = [
  "Home and the Sacred: Camp Nou before the rebuild",
  "The season the club learned to survive itself",
  "Notes on the old tunnel, the new distance",
];

export type DispatchData = {
  issue: string;
  note: string;
  items: string[];
};

export const dispatch: DispatchData = {
  issue: "The Week in Blaugrana, No. 12",
  note:
    "Barça has looked more coherent than fluent. That is not an insult. Coherence is usually the first honest sign of a team becoming itself again.",
  items: [
    "Must-read: The Last of the Catalan Romantics",
    "Note: Why the left side has become the team’s pressure valve",
    "Archive pick: The Weave of the Blau: A Textile History",
    "Stat: Barça completed 17 recoveries in the attacking third, their best league figure in six weeks",
    "Watchlist: What to monitor if the midfield triangle changes shape again",
  ],
};

export type AboutData = {
  intro: string;
  why: string;
  covers: string[];
  standard: string;
  memory: string;
};

export const aboutData: AboutData = {
  intro:
    "twotalBarça is a publication about FC Barcelona as football club, institution, memory, and place. We publish essays, analysis, archive work, and reflections that take the club seriously without surrendering to noise.",
  why:
    "Barça generates more commentary than understanding. We are interested in the harder work: rhythm over chatter, memory over cliché, and writing that treats supporters like adults.",
  covers: [
    "the first team and Femení",
    "tactics and squad construction",
    "club governance and finance",
    "history, identity, and Catalan context",
    "the stadium, the city, and the rituals around matchday",
  ],
  standard:
    "We prefer clarity to speed, specificity to posture, and reporting that leaves a trace. If a piece sounds like a template, a slogan, or a lecture in borrowed theory, it does not belong here.",
  memory:
    "The archive is not a museum corner. It is the pressure of the past on the present: old shirts, old matches, old failures, old standards, still shaping what the club believes it is.",
};

export type Contributor = {
  name: string;
  role: string;
  bio: string;
};

export const contributors: Contributor[] = [
  {
    name: "Maury Vidal",
    role: "Editor",
    bio: "Writes about Barça as an argument between memory and performance.",
  },
  {
    name: "Jordi Serra",
    role: "Analysis & Tactics",
    bio: "Focuses on spacing, role clarity, and the small structural choices that decide matches.",
  },
  {
    name: "Clara Montfort",
    role: "Vault",
    bio: "Covers club history, material culture, and the objects that carry Barça across generations.",
  },
];

export type Article = {
  slug: string;
  headline: string;
  dek: string;
  excerpt: string;
  section: string;
  type: string;
  author: string;
  date: string;
  readTime: string;
  readingTime: string;
  historicalEra: string;
  heroCaption: string;
  heroCredit: string;
  ritual: string;
  conviction: string;
  body: string[];
  quote: string;
  pullQuote: string;
  quoteBy: string;
  topics: string[];
  timeline: Array<{ year: string; note: string }>;
  related: Story[];
};

export const article: Article = {
  slug: "the-weave-of-the-blau",
  headline: "The Weave of the Blau",
  dek:
    "Tracing the textile lineage of Catalonia’s most sacred garment, from the looms of Sant Andreu to the global stage.",
  excerpt:
    "Before the shirt became global merchandise, it was already a carrier of memory: wool, dye, weight, sweat, and civic meaning.",
  section: "Archive",
  type: "Historical",
  author: "Clara Montfort",
  date: "April 3, 2026",
  readTime: "14 min read",
  readingTime: "14 min read",
  historicalEra: "Dream Team",
  heroCaption:
    "A woven field of midnight blue and garnet, where the shirt becomes less an object than a carrier of public memory.",
  heroCredit: "Conceptual illustration · twotalBarça",
  ritual:
    "The Saturday press, coffee at the Boqueria, and the donning of the heavy cotton stripe.",
  conviction:
    "A club is not its stadium, but the thread that connects generations of the faithful.",
  body: [
    "To understand the soul of Barcelona, one must first feel the weight of its cotton. Long before technical synthetics and aerodynamic weaves, the Blaugrana shirt was a physical burden — sweat-heavy, weather-heavy, civic with meaning. It asked the player not only to represent a club but to carry a city’s argument about itself.",
    "The deep midnight blue and the rich oxidized garnet were not chosen by a lifestyle team. They emerged from industrial Barcelona, from dye, labor, repetition, and trade. Material history matters here because Barça has always turned the practical into the symbolic. The shirt was never just an emblem. It was a surface where class, region, and aspiration met each other in public.",
    "By the 1920s, the fabric had tightened and the collars had sharpened, but the essential thing stayed. The shirt remained dense enough to resist the weather and plain enough to let the crest do its quiet work. That balance still defines the strongest iterations of Barça identity: not spectacle for its own sake, but pressure held in form.",
    "Modern kits promise lightness and frictionless movement, yet supporters continue to project old meanings onto new cloth. That is not nostalgia. It is recognition. The blau in Blaugrana still carries water, night, and discipline; the grana still carries heat, stubbornness, and civic heat. Together they create something football can only occasionally explain and never fully replace.",
  ],
  quote:
    "The jersey is a second skin, woven not from polyester, but from the collective memory of a people who refused to be forgotten.",
  pullQuote:
    "The jersey is a second skin, woven not from polyester, but from the collective memory of a people who refused to be forgotten.",
  quoteBy: "Ferran Olivella, 1964",
  topics: ["History", "Identity", "Material culture"],
  timeline: [
    {
      year: "1920s",
      note: "Collars sharpen, fabric tightens, and the shirt becomes visibly modern without losing civic heaviness.",
    },
    {
      year: "1970s",
      note: "Television circulation turns the shirt into a global sign, even as local supporters continue to read it as public memory.",
    },
    {
      year: "1990s",
      note: "The Dream Team era fixes one of the clearest modern silhouettes, proving that lightness and seriousness do not have to be enemies.",
    },
  ],
  related: [
    {
      slug: "the-last-of-the-catalan-romantics",
      section: "Reflections",
      headline: "The Last of the Catalan Romantics",
      excerpt: "Exploring the bridge between the old world and the new.",
      href: "/article/the-weave-of-the-blau",
    },
    {
      slug: "the-geometry-of-rinus-michels",
      section: "Tactics",
      headline: "The Geometry of Rinus Michels",
      excerpt: "How order became style before style became myth.",
      href: "/article/the-weave-of-the-blau",
    },
    {
      slug: "the-hans-gamper-manifesto",
      section: "History",
      headline: "1899: The Hans Gamper Manifesto",
      excerpt: "The institutional imagination of the club before the institution hardened.",
      href: "/article/the-weave-of-the-blau",
    },
  ] satisfies Story[],
};

export const articles = [article];

export function getArticleSlugs() {
  return articles.map((entry) => entry.slug);
}

export function getArticleBySlug(slug: string) {
  return articles.find((entry) => entry.slug === slug);
}

export function getStoryHref(story: Pick<Story, "href">, fallback = "#") {
  return story.href ?? fallback;
}
