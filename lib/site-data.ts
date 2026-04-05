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

export type FooterLinkGroup = {
  title: string;
  links: NavItem[];
};

export type FooterMeta = {
  socialLinks: NavItem[];
  legalNotice: string;
};

export const navItems: NavItem[] = [
  { href: "/#brief", label: "The Brief" },
  { href: "/#match-notes", label: "Match Notes" },
  { href: "/#analysis", label: "Analysis" },
  { href: "/#archive", label: "Archive" },
  { href: "/about", label: "About" },
];

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Read",
    links: [
      { href: "/#brief", label: "The Brief" },
      { href: "/#analysis", label: "Analysis" },
      { href: "/#archive", label: "From the Archive" },
    ],
  },
  {
    title: "Publication",
    links: [
      { href: "/about", label: "About twotalBarça" },
      { href: "/about#principles", label: "Editorial standards" },
      { href: "/about#contributors", label: "Contributors" },
    ],
  },
  {
    title: "Dispatch",
    links: [
      { href: "/#dispatch", label: "Weekly Dispatch" },
      { href: "/about#coverage", label: "What we cover" },
      { href: "/about#contact", label: "Send a note" },
    ],
  },
];

export const footerMeta: FooterMeta = {
  socialLinks: [
    { href: "/about", label: "About" },
    { href: "/#dispatch", label: "Dispatch" },
    { href: "/#archive", label: "Archive" },
  ],
  legalNotice: "© 2026 twotalBarça. FC Barcelona writing with memory, clarity, and no churn.",
};

export const siteMeta = {
  name: "twotalBarça",
  shortName: "twotalBarça",
  url: "https://twotalbarca.vercel.app",
  description:
    "A premium FC Barcelona editorial publication covering the first team, tactics, culture, and the club's long memory.",
  tagline:
    "A publication with memory for readers who want durable FC Barcelona writing, not churn.",
  locale: "en_US",
  contactEmail: "dispatch@twotalbarca.com",
  nav: navItems,
  footer: footerLinkGroups,
  footerMeta,
};

export type HomeHero = {
  section: string;
  readingTime: string;
  headline: string;
  dek: string;
  author: string;
  href: string;
  image: {
    alt: string;
    src: string;
  };
};

export type HomeTickerItem = {
  label: string;
};

export type HomeCultureStory = {
  title: string;
  excerpt: string;
  href: string;
};

export type HomeDispatch = {
  stamp: string;
  body: string;
  featured?: boolean;
};

export type HomeVaultItem = {
  issue: string;
  title: string;
  image: string;
  href: string;
};

export type HomeReflection = {
  quote: string;
  byline: string;
};

export type HomeFeatureCard = {
  kicker: string;
  headline: string;
  body: string;
  href: string;
  ctaLabel: string;
  image: {
    alt: string;
    src: string;
  };
};

export type HomeVaultSection = {
  kicker: string;
  heading: string;
  ctaLabel: string;
  ctaHref: string;
  items: HomeVaultItem[];
};

export type HomeNewsletter = {
  heading: string;
  body: string;
  buttonLabel: string;
  privacyNote: string;
  inputLabel: string;
  inputPlaceholder: string;
};

export type HomePageData = {
  hero: HomeHero;
  tickerItems: HomeTickerItem[];
  analysisFeature: HomeFeatureCard;
  cultureStories: HomeCultureStory[];
  briefDispatches: HomeDispatch[];
  vault: HomeVaultSection;
  reflections: HomeReflection[];
  newsletter: HomeNewsletter;
};

export const homePageData: HomePageData = {
  hero: {
    section: "Longform Journalism",
    readingTime: "14 Minute Read",
    headline: "The Last of the Catalan Romantics",
    dek:
      "Inheritance is not merely about what is left behind, but what is carried forward with conviction. A deep dive into the ritual of identity at the modern Camp Nou.",
    author: "Martí Perarnau",
    href: "/article/the-weave-of-the-blau",
    image: {
      alt: "Dramatic high-contrast black and white shot of concrete stadium arches with sharp shadows and morning mist",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8PKbGR5K3fjHL_XJo8kBBGWkAQnv_7VHEv5n309MxiLNJWOaepXFkdIWTTm7o7xlP5sNrH6hkNRKRruLSqLIx527bcU73glgIuEChx1e0s_WUIYuaqFh_QiWlj3rnh-ydpPbecyP39Zw_BNhLylzhHjyHhlNnVDnTMiUByLVZlX5FwkldKTchzgSyps1sdbr9Q1wWCpLip7FsOuuDxVJgGBlRK89SM2Fa-VEtdPuMczYQ7qpppSdvJgg5IW_KY6XbiOaOFKMrrFTJ",
    },
  },
  tickerItems: [
    { label: "Live: Tactical Rhythm Analysis - 14'" },
    { label: "Ticket Release: Mediterranean Derby - Oct 24" },
    { label: "Archive: The 1974 Ritual Re-examined" },
    { label: "Dispatch: Conviction in the Midfield" },
  ],
  analysisFeature: {
    kicker: "Analysis & Tactics",
    headline: "The Geometry of Silence",
    body:
      "How structural discipline creates the space for creative rebellion. A study of defensive positioning and collective soul.",
    href: "/article/the-weave-of-the-blau",
    ctaLabel: "Read Analysis",
    image: {
      alt: "Aerial view of empty football pitch markings at dusk with long geometric shadows across the grass",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwFBdCO85Tb4xlWqipX_mo3fyf2gZ3ikk1pOEgJGpT-7ivt4veXj8WmvIQAnvxkC4z-9jNpMxa5voEgccs3wJsy3jVYHOYXNIylBfJKyY335CvscGl_tiENZgtYmoDxZPd_Bh9C1F5hldwCze9wMyeSJYJkw-kewvW_jLChD6HaEhgolYnftvkYDXhFYiKzgr6oAgFLuIJVnZ3VoNFBuuO8epPiME6wwCY9gzewCsuzGGsEKeeiwfqCe37_c8Qnbit95zklFxL2SLx",
    },
  },
  cultureStories: [
    {
      title: "Rituals of the Rambla",
      excerpt: "The pre-match liturgy that binds the city to the crest.",
      href: "/about",
    },
    {
      title: "Concrete & Soul",
      excerpt: "The Brutalist poetry of the stadium's third tier.",
      href: "/article/the-weave-of-the-blau",
    },
    {
      title: "Textiles of Identity",
      excerpt: "The sensory history of the Blaugrana weave.",
      href: "/article/the-weave-of-the-blau",
    },
  ],
  briefDispatches: [
    {
      stamp: "10:42 AM - DISPATCH",
      body: '"The rhythm of the passing game is not a tactic; it is a philosophy of patience."',
      featured: true,
    },
    {
      stamp: "Yesterday - DISPATCH",
      body: "New training ground rituals observed. Focus on silent communication.",
    },
    {
      stamp: "Oct 19 - DISPATCH",
      body: "Notes on the legacy of the Catalan youth system.",
    },
  ],
  vault: {
    kicker: "The Vault",
    heading: "The Archive of Conviction",
    ctaLabel: "Enter Library",
    ctaHref: "/article/the-weave-of-the-blau",
    items: [
      {
        issue: "Issue 04, 1974",
        title: "The Dutch Influence",
        href: "/article/the-weave-of-the-blau",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDSluL7_QGAmz3bQ8oZs10-zQm7AcaileH9H_kvujw8Xqynkx71uR_7bMUYJc2dPikwnAwcMUsSHm6_tcllHT87JEgDqZPpTWAC_aW5S2Z_3kEfbml6SDyXP7rQjFrMim0mw44hbEkHYZhXLpu1UWAi0da-fPle5VFIk2GMkjEj-cnAfyBs9Ba-sS-QAPDi_U-zk3jaEQ5hj5wGl3oakvCYeoy2Evvz9lB1qylFAFy0sdPCQxrugJnIBcFhyR00sJ553ZLQSykgAA-4",
      },
      {
        issue: "Issue 12, 1992",
        title: "Wembley's Midnight Sun",
        href: "/article/the-weave-of-the-blau",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuB9oV0w67ns25NYqiuop3nczZGkq-0ZrIbFMeN6h4dWdQnZRLHMosVVBHS8m9fa6_jQdpP6NYok6bjS7CIO7wHuc2yV2dOJS24kE0EsreuUaw09y37bcACaFS95ivufHvULlfh2YQkbDTKVcFIm8OqpkChxUm3MZbY8tiNv87TMeHBrUldERakEbeJ6W4FMrtk3P_tpDEUnTzO3bTdrOOe8qswKkG18_p8JA6V_QFBJBYrQRevqB7nSoiJTVpdrbhINHD4ui6Wc89Gu",
      },
      {
        issue: "Issue 28, 2009",
        title: "Rome and the Six Seals",
        href: "/article/the-weave-of-the-blau",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuC_hv0tep9knrTq3gBczsOZEzWQ95RNSDKToJzu_2BMj_0S8U5fj8f3gKfI_Qe_R1GdzdyOsOVaWJu6OsiRYV7FF5-mKS72bgrsJatBzDKvYNOeKXUAnlIWOmUT3okfkt4dX2YS205p-htHuTjPrwssYhbyQQZVVLIWbOr0xDdfGg4zuzpgV6ilhDrg1dTOyttYG5TGeclFgvdii1_-FbXamAdc57MahODGSWSNC88pNfUFMHrEgNIllG0di4XAUwh0G_Z6MEuEkrlR",
      },
    ],
  },
  reflections: [
    {
      quote:
        "To watch the team this season is to witness a return to the quiet confidence of the late 80s. It's not just the wins; it's the way the grass seems to settle after every pass.",
      byline: "Jordi V., Member since 1982",
    },
    {
      quote:
        "Inheritance is a burden for some, but for us, it is the only way to breathe.",
      byline: "Elena M., Journalism Fellow",
    },
  ],
  newsletter: {
    heading: "The Weekly Dispatch",
    body:
      "Literary dispatches, tactical deep-dives, and club history delivered every Sunday morning. No noise. Just conviction.",
    buttonLabel: "Subscribe to the Review",
    privacyNote: "Privacy is part of our ritual. We never share your data.",
    inputLabel: "Your electronic mail",
    inputPlaceholder: "Your electronic mail",
  },
};

export const homeLead: Story & { type: string; href: string } = {
  slug: "the-last-of-the-catalan-romantics",
  section: "Longform Journalism",
  type: "Flagship",
  headline: "The Last of the Catalan Romantics",
  dek:
    "Inheritance is not merely about what is left behind, but what is carried forward with conviction. A deep dive into the ritual of identity at the modern Camp Nou.",
  excerpt:
    "The modern club is asked to perform certainty before it has earned it. Barca, because of its history, is judged by a harsher standard: not just whether it wins, but whether it recognizes itself while winning.",
  author: "Marti Perarnau",
  date: "April 4, 2026",
  readingTime: "14 minute read",
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
  intro: {
    eyebrow: string;
    title: string;
    dek: string;
    body: string;
  };
  mission: {
    title: string;
    body: string;
    companion: {
      eyebrow: string;
      body: string;
    };
  };
  coverageTitle: string;
  coverageEyebrow: string;
  coverage: Array<{
    title: string;
    detail: string;
  }>;
  principlesTitle: string;
  principlesEyebrow: string;
  principles: Array<{
    title: string;
    detail: string;
  }>;
  contributorsTitle: string;
  archiveTitle: string;
  archiveEvidence: Array<{
    label: string;
    title: string;
    detail: string;
  }>;
  contact: {
    title: string;
    body: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryLabel: string;
    secondaryValue: string;
  };
};

export const aboutData: AboutData = {
  intro: {
    eyebrow: "About the publication",
    title: "twotalBarça is a publication about FC Barcelona in the present tense and the long tense.",
    dek:
      "We publish essays, match notes, tactical analysis, archive work, and reflections that take the club seriously without surrendering to noise.",
    body:
      "That means football first, memory close behind, and enough specificity that a supporter can tell we are writing about Barça rather than a generic idea of elite football.",
  },
  mission: {
    title: "Mission",
    body:
      "Barça generates more commentary than understanding. We are interested in the harder work: rhythm over chatter, memory over cliché, and writing that treats supporters like adults. The aim is not to keep pace with the noise cycle. It is to leave behind analysis, reporting, and club memory worth returning to after the match has passed.",
    companion: {
      eyebrow: "What twotalBarça is",
      body:
        "An article-first Barça publication for readers who want present-tense football analysis, cultural context, and the pressure of the archive in the same place.",
    },
  },
  coverageTitle: "What we cover",
  coverageEyebrow: "Coverage map",
  coverage: [
    {
      title: "First team and Femení",
      detail:
        "How the football looks, what the squad is becoming, and where the emotional temperature of the club really sits week to week.",
    },
    {
      title: "Tactics and role clarity",
      detail:
        "Spacing, structure, pressing shapes, and the small decisions that turn a familiar Barça performance into either clarity or confusion.",
    },
    {
      title: "Governance and finance",
      detail:
        "Club messaging, board decisions, and the financial context that supporters need explained in plain language rather than executive fog.",
    },
    {
      title: "History, identity, and Catalan context",
      detail:
        "The political, civic, and cultural pressures that make Barça more than a shirt and more specific than a global superclub template.",
    },
    {
      title: "Stadium, city, and matchday ritual",
      detail:
        "Camp Nou, Montjuïc, the walk to the ground, the soundscape, and the habits through which the club is actually lived.",
    },
  ],
  principlesTitle: "Editorial principles",
  principlesEyebrow: "Standard",
  principles: [
    {
      title: "Clarity over speed",
      detail:
        "We would rather publish slightly later and say something legible than chase the tempo of transfer chatter, social fragments, or borrowed certainty.",
    },
    {
      title: "Specificity over posture",
      detail:
        "If a piece sounds like a template, a slogan, or a lecture in borrowed theory, it does not belong here. Barça deserves plain, exact writing.",
    },
    {
      title: "Memory with evidence",
      detail:
        "History is not decorative copy. When we invoke the club's past, we try to anchor it in matches, objects, eras, and standards that still press on the present.",
    },
  ],
  contributorsTitle: "Contributors",
  archiveTitle: "In the club's long memory",
  archiveEvidence: [
    {
      label: "Archive feature",
      title: "The Weave of the Blau",
      detail:
        "A material history of the shirt that treats identity as something worn, handled, and argued over, not just sloganized.",
    },
    {
      label: "Vault shelf",
      title: "Camp Nou before the rebuild",
      detail:
        "Reporting and essays on the ground, the old tunnel, and the civic meaning of a stadium that keeps changing shape without losing its charge.",
    },
    {
      label: "Historical standard",
      title: "Dream Team to the present",
      detail:
        "Pieces that connect old failures, old silhouettes, and old expectations to the questions the current club is still trying to answer.",
    },
  ],
  contact: {
    title: "Contact and dispatch",
    body:
      "If you want to send a note, point us toward archive material, or receive the weekly dispatch, this is the door. We are interested in smart leads, sharp corrections, and supporters who care about the club's memory as much as its next lineup.",
    primaryCtaLabel: "Join the weekly dispatch",
    primaryCtaHref: "/#dispatch",
    secondaryLabel: "Email",
    secondaryValue: siteMeta.contactEmail,
  },
};

export type Contributor = {
  name: string;
  role: string;
  specialty: string;
  bio: string;
  trust: string;
};

export const contributors: Contributor[] = [
  {
    name: "Maury Vidal",
    role: "Editor",
    specialty: "Club identity, longform editing, and the line between memory and performance.",
    bio: "Writes about Barça as an argument between memory and performance.",
    trust: "Edits for tone, standards, and whether a piece still feels true once the match cycle noise has passed.",
  },
  {
    name: "Jordi Serra",
    role: "Analysis & Tactics",
    specialty: "Spacing, role clarity, pressing structures, and the details coaches usually hide in plain sight.",
    bio: "Focuses on spacing, role clarity, and the small structural choices that decide matches.",
    trust: "Brings the footballing evidence: why a pattern worked, what changed, and whether the explanation survives a second watch.",
  },
  {
    name: "Clara Montfort",
    role: "Vault",
    specialty: "Club history, material culture, and the objects that carry Barça across generations.",
    bio: "Covers club history, material culture, and the objects that carry Barça across generations.",
    trust: "Keeps the archive anchored in real artifacts, eras, and civic context so the past informs the present instead of decorating it.",
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
  seoTitle?: string;
  metaDescription?: string;
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
  seoTitle: "The Weave of the Blau",
  metaDescription:
    "An archival twotalBarça feature on the shirt as material memory, tracing how Barça's colors carried civic meaning before they became global merchandise.",
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
