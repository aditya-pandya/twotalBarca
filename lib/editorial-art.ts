export type EditorialArt = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
};

export type EditorialArtKey =
  | "home-hero"
  | "home-brief-module"
  | "home-dispatch-module"
  | "home-week-montjuic"
  | "home-week-romantics"
  | "home-week-soundscape"
  | "brief-hero"
  | "brief-keep-reading-rest-defense"
  | "brief-keep-reading-montjuic"
  | "dispatch-index-cover"
  | "dispatch-issue-cover"
  | "about-hero"
  | "about-read-front-page"
  | "about-read-brief"
  | "about-read-dispatch"
  | "about-read-longform";

const STUDIO_CREDIT = "Illustration: totalBarca studio";

const EDITORIAL_ART: Record<EditorialArtKey, EditorialArt> = {
  "home-hero": {
    src: "/editorial/home-hero-pressure-map.svg",
    alt: "Floodlit Barça pitch with tactical geometry and a charged crowd bowl.",
    caption: "Pressure, structure, and crowd memory should share the same frame.",
    credit: STUDIO_CREDIT,
  },
  "home-brief-module": {
    src: "/editorial/home-brief-derby-rhythm.svg",
    alt: "Blaugrana silhouettes and motion arcs gathering around a bright derby spotlight.",
    caption: "The next response starts with tempo before it turns into score.",
    credit: STUDIO_CREDIT,
  },
  "home-dispatch-module": {
    src: "/editorial/home-dispatch-night-desk.svg",
    alt: "Editorial desk collage with match notes, stadium lights, and dispatch papers.",
    caption: "A weekly issue should feel edited before a word is read.",
    credit: STUDIO_CREDIT,
  },
  "home-week-montjuic": {
    src: "/editorial/home-week-montjuic-rise.svg",
    alt: "Floodlit stadium bowl rising above a dark matchday climb.",
    caption: "Some football evenings are carried by the long approach as much as the whistle.",
    credit: STUDIO_CREDIT,
  },
  "home-week-romantics": {
    src: "/editorial/home-week-romantics-ritual.svg",
    alt: "Supporter silhouettes lifting scarves beneath garnet and navy stadium light.",
    caption: "Supporter ritual keeps Barça legible when certainty is harder to stage.",
    credit: STUDIO_CREDIT,
  },
  "home-week-soundscape": {
    src: "/editorial/home-week-soundscape.svg",
    alt: "Night sky carrying floodlight haze above a crowded football ground.",
    caption: "Atmosphere matters most when it can survive the final whistle.",
    credit: STUDIO_CREDIT,
  },
  "brief-hero": {
    src: "/editorial/brief-hero-derby-tunnel.svg",
    alt: "Players emerging from shadow toward a bright blaugrana pitch tunnel.",
    caption: "Derby week narrows into one tunnel: restore rhythm, then widen the field.",
    credit: STUDIO_CREDIT,
  },
  "brief-keep-reading-rest-defense": {
    src: "/editorial/brief-keep-reading-rest-defense.svg",
    alt: "Rest-defense diagram drawn over a dark pitch with gold passing lanes.",
    caption: "Rest defense is not passive; it is geometry with conviction.",
    credit: STUDIO_CREDIT,
  },
  "brief-keep-reading-montjuic": {
    src: "/editorial/brief-keep-reading-montjuic-lanterns.svg",
    alt: "Floodlights marking the long walk into a football ground at night.",
    caption: "Matchday mood starts before kickoff.",
    credit: STUDIO_CREDIT,
  },
  "dispatch-index-cover": {
    src: "/editorial/dispatch-index-cover-issue-one.svg",
    alt: "Magazine-style weekly dispatch cover built from papers, pitch lines, and floodlights.",
    caption: "The weekly issue should feel edited before a word is read.",
    credit: STUDIO_CREDIT,
  },
  "dispatch-issue-cover": {
    src: "/editorial/dispatch-issue-cover-issue-one.svg",
    alt: "Single-issue cover art with a luminous pitch framed by deep blaugrana shadow.",
    caption: "Issue one frames the week as response, pressure, and selection.",
    credit: STUDIO_CREDIT,
  },
  "about-hero": {
    src: "/editorial/about-hero-archive-table.svg",
    alt: "Archive table with shirt weave, ticket stubs, and notebook objects under warm light.",
    caption: "A publication earns trust by treating objects, notes, and memory like working evidence.",
    credit: STUDIO_CREDIT,
  },
  "about-read-front-page": {
    src: "/editorial/about-read-front-page.svg",
    alt: "Front page layout study with hero frame, match strip, and editorial rails.",
    caption: "The front page should tell readers where the week's attention belongs.",
    credit: STUDIO_CREDIT,
  },
  "about-read-brief": {
    src: "/editorial/about-read-brief.svg",
    alt: "Five-point briefing card with numbered markers and a sharp midfield diagram.",
    caption: "Five points. One argument. No wasted motions.",
    credit: STUDIO_CREDIT,
  },
  "about-read-dispatch": {
    src: "/editorial/about-read-dispatch.svg",
    alt: "Stacked dispatch issues tied together with a gold spine ribbon.",
    caption: "Dispatch keeps the week's strongest line tied together.",
    credit: STUDIO_CREDIT,
  },
  "about-read-longform": {
    src: "/editorial/about-read-longform.svg",
    alt: "Close-up blaugrana weave and archive objects arranged like a long-read opener.",
    caption: "Long reads slow the club down enough to see the grain.",
    credit: STUDIO_CREDIT,
  },
};

const HOME_WEEK_ART_BY_SLUG: Record<string, EditorialArtKey> = {
  "home-and-the-sacred": "home-week-montjuic",
  "the-last-of-the-catalan-romantics": "home-week-romantics",
  "the-weave-of-the-blau": "home-week-soundscape",
};

const HOME_WEEK_FALLBACK_KEYS: EditorialArtKey[] = [
  "home-week-montjuic",
  "home-week-romantics",
  "home-week-soundscape",
];

const BRIEF_KEEP_READING_ART_BY_SLUG: Record<string, EditorialArtKey> = {
  "how-barca-found-the-free-man": "brief-keep-reading-rest-defense",
  "the-weave-of-the-blau": "brief-keep-reading-rest-defense",
  "home-and-the-sacred": "brief-keep-reading-montjuic",
  "the-last-of-the-catalan-romantics": "brief-keep-reading-montjuic",
};

const BRIEF_KEEP_READING_FALLBACK_KEYS: EditorialArtKey[] = [
  "brief-keep-reading-rest-defense",
  "brief-keep-reading-montjuic",
];

const ABOUT_REGULAR_READ_ART: Record<"front-page" | "brief" | "dispatch" | "longreads", EditorialArtKey> = {
  "front-page": "about-read-front-page",
  brief: "about-read-brief",
  dispatch: "about-read-dispatch",
  longreads: "about-read-longform",
};

export function getEditorialArt(key: EditorialArtKey): EditorialArt {
  return { ...EDITORIAL_ART[key] };
}

export function getHomeWeekArt(slug?: string, index = 0): EditorialArt {
  const mappedKey = slug ? HOME_WEEK_ART_BY_SLUG[slug] : undefined;
  const fallbackKey = HOME_WEEK_FALLBACK_KEYS[index] ?? HOME_WEEK_FALLBACK_KEYS[index % HOME_WEEK_FALLBACK_KEYS.length]!;
  return getEditorialArt(mappedKey ?? fallbackKey);
}

export function getBriefKeepReadingArt(slug?: string, index = 0): EditorialArt {
  const mappedKey = slug ? BRIEF_KEEP_READING_ART_BY_SLUG[slug] : undefined;
  const fallbackKey =
    BRIEF_KEEP_READING_FALLBACK_KEYS[index] ?? BRIEF_KEEP_READING_FALLBACK_KEYS[index % BRIEF_KEEP_READING_FALLBACK_KEYS.length]!;
  return getEditorialArt(mappedKey ?? fallbackKey);
}

export function getAboutRegularReadArt(kind: "front-page" | "brief" | "dispatch" | "longreads"): EditorialArt {
  return getEditorialArt(ABOUT_REGULAR_READ_ART[kind]);
}

