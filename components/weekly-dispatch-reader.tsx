"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, TouchEvent } from "react";
import realPhotoManifest from "@/public/editorial/real/commons-fcbarcelona-images.json";
import type { Article, DispatchIssue, MatchContextEntry } from "@/lib/site-data";

type WeeklyDispatchReaderProps = {
  issue: DispatchIssue;
  stories?: Article[];
  recentMatch?: MatchContextEntry;
  upcomingMatch?: MatchContextEntry;
  archive?: DispatchIssue[];
  surface?: "home" | "dispatch" | "issue";
};

type ThemeId = "classic" | "dark" | "supporters" | "coastal";

type RealPhotoManifestItem = {
  title: string;
  slug: string;
  description: string;
  artist: string;
  license: string;
  source: string;
  width: number;
  height: number;
  src: string;
};

type RealDispatchPhoto = RealPhotoManifestItem & {
  alt: string;
  credit: string;
  objectPosition: string;
  overlay: string;
};

type Theme = {
  id: ThemeId;
  name: string;
  bg: string;
  fg: string;
  surface: string;
  surfaceEdge: string;
  accent: string;
  accent2: string;
  gold: string;
  mute: string;
  rule: string;
  isDark: boolean;
};

type TypeSpec = {
  font: string;
  size: number;
  weight: number;
  lh?: number;
  track?: string;
  italic?: boolean;
  up?: boolean;
};

type DispatchTopicView = {
  n: number;
  mark: string;
  label: string;
  headline: string;
  take: string;
  body: string;
  why: string;
  tag: string;
};

type MatchView = {
  opponent: string;
  competition: string;
  date: string;
  kickoff: string;
  result: string;
  scorers: string;
  read: string;
  aggregate?: string;
  venue?: string;
  watch?: string;
};

type IssueView = {
  number: number;
  roman: string;
  date: string;
  week: string;
  readMinutes: number;
  title: string;
  summary: string;
  editorNote: string;
  signoff: string;
  topics: DispatchTopicView[];
  last: MatchView;
  next: MatchView;
  standing: {
    position: number;
    played: number;
    points: number;
    gd: string;
    form: string[];
  };
};

const PALETTE = {
  ink: "#0a0a0d",
  inkSoft: "#22232a",
  off: "#f4f4f1",
  offEdge: "#e7e7e2",
  paper: "#f0eee9",
  garnet: "#9b1f2c",
  garnetDk: "#6f1620",
  blue: "#1f3aaa",
  blueDeep: "#162a85",
  gold: "#c9a961",
  goldSoft: "#d4b878",
};

const THEMES: Record<ThemeId, Theme> = {
  classic: {
    id: "classic",
    name: "Classic",
    bg: PALETTE.paper,
    fg: PALETTE.ink,
    surface: PALETTE.off,
    surfaceEdge: PALETTE.offEdge,
    accent: PALETTE.garnet,
    accent2: PALETTE.blue,
    gold: PALETTE.gold,
    mute: "rgba(10,10,13,0.55)",
    rule: "rgba(10,10,13,0.14)",
    isDark: false,
  },
  dark: {
    id: "dark",
    name: "Night",
    bg: "#0d0e12",
    fg: "#ece9e0",
    surface: "#16181f",
    surfaceEdge: "#22242c",
    accent: "#d54a55",
    accent2: "#5c79e0",
    gold: PALETTE.gold,
    mute: "rgba(236,233,224,0.55)",
    rule: "rgba(236,233,224,0.14)",
    isDark: true,
  },
  supporters: {
    id: "supporters",
    name: "Supporters",
    bg: "#faf6f4",
    fg: PALETTE.ink,
    surface: PALETTE.off,
    surfaceEdge: "#ead8d6",
    accent: PALETTE.garnet,
    accent2: PALETTE.garnetDk,
    gold: PALETTE.gold,
    mute: "rgba(10,10,13,0.55)",
    rule: "rgba(155,31,44,0.18)",
    isDark: false,
  },
  coastal: {
    id: "coastal",
    name: "Coastal",
    bg: "#f1f3f8",
    fg: "#0a0e1c",
    surface: PALETTE.off,
    surfaceEdge: "#d6dde8",
    accent: PALETTE.blue,
    accent2: PALETTE.garnet,
    gold: PALETTE.gold,
    mute: "rgba(10,14,28,0.55)",
    rule: "rgba(31,58,170,0.18)",
    isDark: false,
  },
};

const F = {
  voice: "var(--font-newsreader), \"Newsreader\", \"Source Serif 4\", Georgia, serif",
  body: "var(--font-newsreader), \"Newsreader\", \"Source Serif 4\", Georgia, serif",
  headline: "var(--font-archivo), \"Archivo\", -apple-system, \"Inter Tight\", sans-serif",
  label: "var(--font-archivo), \"Archivo\", -apple-system, \"Inter Tight\", sans-serif",
  mono: "var(--font-jetbrains-mono), \"JetBrains Mono\", monospace",
  slab: "var(--font-roboto-slab), \"Roboto Slab\", \"Courier Prime\", Rockwell, serif",
};

const T = {
  eyebrow: { font: F.label, size: 11, weight: 600, track: "0.18em", up: true },
  label: { font: F.label, size: 11, weight: 600, track: "0.16em", up: true },
  micro: { font: F.mono, size: 10, weight: 500, track: "0.18em", up: true },
  pull: { font: F.voice, size: 26, weight: 400, italic: true, lh: 1.18, track: "-0.01em" },
  headline: { font: F.headline, size: 17, weight: 600, lh: 1.32, track: "-0.005em" },
  body: { font: F.body, size: 15, weight: 400, lh: 1.55 },
  bodyIt: { font: F.body, size: 14, weight: 400, italic: true, lh: 1.55 },
  coverH1: { font: F.voice, size: 38, weight: 400, italic: true, lh: 0.96, track: "-0.02em" },
  score: { font: F.slab, size: 64, weight: 200, lh: 0.9, track: "-0.045em" },
  ghost: { font: F.voice, size: 220, weight: 400, italic: true, lh: 0.85, track: "-0.06em" },
} satisfies Record<string, TypeSpec>;

const commonsRealPhotos = realPhotoManifest as RealPhotoManifestItem[];
const commonsRealPhotosBySlug = Object.fromEntries(commonsRealPhotos.map((photo) => [photo.slug, photo])) as Record<
  string,
  RealPhotoManifestItem
>;

function getRealDispatchPhoto(
  slug: string,
  overrides: Pick<RealDispatchPhoto, "alt" | "objectPosition"> & Partial<Pick<RealDispatchPhoto, "overlay">>,
): RealDispatchPhoto {
  const photo = commonsRealPhotosBySlug[slug];
  if (!photo) {
    throw new Error(`Missing real dispatch photo: ${slug}`);
  }

  return {
    ...photo,
    alt: overrides.alt,
    credit: `Photo: ${photo.artist} / ${photo.license}`,
    objectPosition: overrides.objectPosition,
    overlay:
      overrides.overlay ??
      "linear-gradient(180deg, rgba(10,10,13,0.06) 0%, rgba(10,10,13,0.12) 45%, rgba(10,10,13,0.3) 100%)",
  };
}

const coverRealPhoto = getRealDispatchPhoto("camp-nou-during-2014-la-liga-match-fc-barcelona-2-athletic-bilbao-0-05-jpg", {
  alt: "A massive Barça and Catalan tifo unfurled across the Camp Nou crowd before kickoff.",
  objectPosition: "56% 42%",
  overlay: "linear-gradient(180deg, rgba(10,10,13,0.08) 0%, rgba(10,10,13,0.14) 42%, rgba(10,10,13,0.62) 100%)",
});

const takeRealPhotos: Record<number, RealDispatchPhoto> = {
  1: getRealDispatchPhoto("brann-bar-a-femen-cg3a6290-jpg", {
    alt: "Salma Paralluelo drives the ball between Brann defenders for FC Barcelona Femení.",
    objectPosition: "52% 40%",
  }),
  2: getRealDispatchPhoto("fc-barcelona-camp-nou-on-a-matchday-ank-kumar-05-jpg", {
    alt: "Supporters gather outside Camp Nou below FC Barcelona banners on matchday.",
    objectPosition: "44% 34%",
  }),
  3: getRealDispatchPhoto("camp-nou-during-la-liga-match-fc-barcelona-2-athletic-bilbao-0-06-jpg", {
    alt: "The Camp Nou stand with FCBARCELONA seating rises above the pitch under heavy clouds.",
    objectPosition: "50% 44%",
  }),
  4: getRealDispatchPhoto("camp-nou-fc-barcelona-llevant-27-abril-2019-jpg", {
    alt: "Camp Nou fills up around the pitch as FC Barcelona stage a packed night under the lights.",
    objectPosition: "38% 42%",
  }),
  5: getRealDispatchPhoto("fc-barcelona-camp-nou-on-a-matchday-ank-kumar-04-jpg", {
    alt: "Camp Nou's curved exterior and FC Barcelona banner loom above the concourse.",
    objectPosition: "38% 30%",
  }),
};

function ts(t: TypeSpec, extra: CSSProperties = {}): CSSProperties {
  return {
    fontFamily: t.font,
    fontSize: t.size,
    fontWeight: t.weight,
    lineHeight: t.lh ?? 1,
    letterSpacing: t.track ?? "normal",
    fontStyle: t.italic ? "italic" : "normal",
    textTransform: t.up ? "uppercase" : "none",
    ...extra,
  };
}

function cleanDispatchCopy(value: string) {
  return value.replace(/\bThe Brief\b/g, "The issue").replace(/\bBrief\b/g, "issue");
}

function formatItemType(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getStoryForItem(itemLink: string, stories: Article[]) {
  const slug = itemLink.match(/^\/article\/(.+)$/)?.[1];
  return stories.find((story) => story.slug === slug || story.href === itemLink);
}

function toRoman(value: number) {
  const numerals: Array<[number, string]> = [
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let next = value;
  let result = "";
  for (const [amount, symbol] of numerals) {
    while (next >= amount) {
      result += symbol;
      next -= amount;
    }
  }
  return result || "I";
}

function trimPeriod(value: string) {
  return value.replace(/[.。]\s*$/, "");
}

function parseRecentMatch(entry?: MatchContextEntry): MatchView {
  const label = entry?.label ?? "Last match updating";
  const detail = entry?.detail ?? "The previous match capsule returns when the issue has current evidence.";
  const scoreMatch = label.match(/\d+\s*[–-]\s*\d+/);
  const result = scoreMatch?.[0] ?? "—";
  const cleanSide = (value: string) => value.replace(/^[·:|\s-]+/, "").replace(/[·:|\s-]+$/, "").trim();
  const [home = "", away = ""] = scoreMatch ? label.split(scoreMatch[0], 2).map(cleanSide) : [];
  const fallbackOpponent = cleanSide((scoreMatch ? label.replace(scoreMatch[0], " ") : label).replace(/\s{2,}/g, " ")) || label;
  const opponent = /^barcelona$/i.test(home) ? away : /^barcelona$/i.test(away) ? home : fallbackOpponent;

  return {
    opponent,
    competition: "Last result",
    date: detail,
    kickoff: "",
    result,
    scorers: detail,
    read: detail,
  };
}

function parseUpcomingMatch(entry?: MatchContextEntry): MatchView {
  const label = entry?.label ?? "Next match updating";
  const detail = entry?.detail ?? "The next match capsule stays minimal until the fixture context is clean.";
  const opponent = label.replace(/^Barcelona\s+(vs\.?\s+)?/i, "").trim() || label;

  return {
    opponent,
    competition: "Next match",
    date: detail,
    kickoff: detail.match(/\b\d{1,2}:\d{2}\s*(?:AM|PM)?\b/i)?.[0] ?? "TBD",
    result: "",
    scorers: "",
    aggregate: detail,
    venue: detail,
    read: detail,
    watch: detail,
  };
}

function buildIssueView(
  issue: DispatchIssue,
  stories: Article[],
  recentMatch?: MatchContextEntry,
  upcomingMatch?: MatchContextEntry,
): IssueView {
  const topics = issue.items.slice(0, 5).map((item, index) => {
    const story = getStoryForItem(item.link, stories);
    const label = formatItemType(item.itemType);
    return {
      n: index + 1,
      mark: item.itemType,
      label,
      headline: item.headline,
      take: cleanDispatchCopy(item.take ?? item.summary),
      body: cleanDispatchCopy(item.commentary ?? story?.body?.[0] ?? item.summary),
      why: cleanDispatchCopy(item.whyItMatters ?? story?.conviction ?? story?.dek ?? item.summary),
      tag: label,
    };
  });

  return {
    number: issue.issueNumber,
    roman: toRoman(issue.issueNumber),
    date: issue.publishDate,
    week: "Weekly Dispatch",
    readMinutes: 4,
    title: trimPeriod(cleanDispatchCopy(issue.issueTitle)),
    summary: cleanDispatchCopy(issue.editorsNote),
    editorNote: cleanDispatchCopy(issue.editorsNote),
    signoff: "— totalBarça",
    topics,
    last: parseRecentMatch(recentMatch),
    next: parseUpcomingMatch(upcomingMatch),
    standing: {
      position: topics.length,
      played: topics.length,
      points: topics.length,
      gd: "+1",
      form: ["W", "D", "W", "W", "D"],
    },
  };
}

function paletteFor(theme: Theme, index: number) {
  const variants = [
    { bg: theme.isDark ? "#06070b" : theme.fg, fg: theme.isDark ? theme.fg : theme.bg, accent: theme.gold },
    { bg: theme.surface, fg: theme.fg, accent: theme.accent },
    { bg: theme.accent, fg: theme.bg, accent: theme.gold },
    { bg: theme.surfaceEdge, fg: theme.fg, accent: theme.accent2 },
    { bg: theme.accent2, fg: theme.bg, accent: theme.gold },
    { bg: theme.isDark ? "#06070b" : theme.fg, fg: theme.isDark ? theme.fg : theme.bg, accent: theme.accent },
    { bg: theme.surface, fg: theme.fg, accent: theme.accent },
    { bg: theme.isDark ? "#06070b" : theme.fg, fg: theme.isDark ? theme.fg : theme.bg, accent: theme.gold },
  ];
  return variants[index] ?? variants[0];
}

const iconButton = (color: string, opacity = 0.85): CSSProperties => ({
  background: "transparent",
  border: "none",
  padding: 6,
  margin: 0,
  color,
  opacity,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
});

const dockIconButton = (color: string, opacity = 0.85): CSSProperties => ({
  ...iconButton(color, opacity),
  width: 44,
  height: 44,
  minWidth: 44,
  minHeight: 44,
  borderRadius: 999,
  flexShrink: 0,
  touchAction: "manipulation",
});

const pillButton = (bg: string, fg: string, border?: string): CSSProperties => ({
  background: bg,
  color: fg,
  border: border ? `1px solid ${border}` : "none",
  borderRadius: 999,
  padding: "14px 22px",
  cursor: "pointer",
  ...ts(T.eyebrow, { color: fg }),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});

export function WeeklyDispatchReader({
  issue,
  stories = [],
  recentMatch,
  upcomingMatch,
  archive = [],
  surface = "issue",
}: WeeklyDispatchReaderProps) {
  const view = useMemo(() => buildIssueView(issue, stories, recentMatch, upcomingMatch), [issue, stories, recentMatch, upcomingMatch]);
  const [themeId, setThemeId] = useState<ThemeId>("classic");
  const theme = THEMES[themeId];

  return (
    <section className="comm-dispatch-shell" data-surface={surface} aria-label="Weekly Dispatch reader">
      <MobileDispatch issue={view} setThemeId={setThemeId} theme={theme} themeId={themeId} />
      <DesktopDispatch archive={archive} issue={view} setThemeId={setThemeId} theme={theme} themeId={themeId} />
    </section>
  );
}

function MobileDispatch({
  issue,
  setThemeId,
  theme,
  themeId,
}: {
  issue: IssueView;
  setThemeId: (themeId: ThemeId) => void;
  theme: Theme;
  themeId: ThemeId;
}) {
  const cards = useMemo(
    () => [{ kind: "cover" as const }, ...issue.topics.map((topic) => ({ kind: "take" as const, topic })), { kind: "matches" as const }, { kind: "end" as const }],
    [issue],
  );
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [shareOpen, setShareOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const lastIndexRef = useRef(0);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, lastX: 0, lastT: 0, vx: 0 });
  const touchRef = useRef({ active: false, startX: 0, startY: 0, startScrollLeft: 0, startIndex: 0, startTime: 0 });

  const tickFor = useCallback((index: number) => {
    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      try {
        window.navigator.vibrate(8);
      } catch {
        // vibration is optional
      }
    }
    setTick((current) => current + 1);
    setActive(index);
  }, []);

  const updateActive = useCallback(() => {
    const element = trackRef.current;
    if (!element) return;
    const index = Math.round(element.scrollLeft / Math.max(1, element.clientWidth));
    const bounded = Math.max(0, Math.min(cards.length - 1, index));
    if (bounded !== lastIndexRef.current) {
      lastIndexRef.current = bounded;
      tickFor(bounded);
    }
  }, [cards.length, tickFor]);

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const element = trackRef.current;
    if (!element) return;

    const target = Math.max(0, Math.min(cards.length - 1, index));
    const left = target * element.clientWidth;
    const startLeft = element.scrollLeft;
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const nextBehavior = prefersReducedMotion ? "auto" : behavior;

    try {
      element.scrollTo({ left, behavior: nextBehavior });
    } catch {
      element.scrollLeft = left;
      return;
    }

    if (nextBehavior !== "smooth") {
      if (Math.abs(element.scrollLeft - left) > 1) {
        element.scrollLeft = left;
      }
      return;
    }

    window.setTimeout(() => {
      if (trackRef.current !== element) return;
      const stalled = Math.abs(element.scrollLeft - startLeft) <= 1;
      const offTarget = Math.abs(element.scrollLeft - left) > 1;
      if (stalled && offTarget) {
        element.scrollLeft = left;
      }
    }, 180);
  }, [cards.length]);

  useEffect(() => {
    const element = trackRef.current;
    if (!element) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActive);
    };
    element.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      element.removeEventListener("scroll", onScroll);
    };
  }, [updateActive]);

  const go = useCallback((index: number) => {
    const element = trackRef.current;
    if (!element) return;
    const target = Math.max(0, Math.min(cards.length - 1, index));
    scrollToIndex(target, "smooth");
    lastIndexRef.current = target;
    setActive(target);
  }, [cards.length, scrollToIndex]);

  const resetTouch = useCallback(() => {
    touchRef.current.active = false;
    touchRef.current.startTime = 0;
  }, []);

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    if (event.touches.length !== 1) {
      resetTouch();
      return;
    }

    const element = trackRef.current;
    const touch = event.touches[0];
    if (!element || !touch) {
      resetTouch();
      return;
    }

    const width = Math.max(1, element.clientWidth);
    touchRef.current = {
      active: true,
      startX: touch.clientX,
      startY: touch.clientY,
      startScrollLeft: element.scrollLeft,
      startIndex: Math.max(0, Math.min(cards.length - 1, Math.round(element.scrollLeft / width))),
      startTime: typeof performance !== "undefined" ? performance.now() : Date.now(),
    };
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (!touchRef.current.active || touchRef.current.startTime === 0) return;

    const element = trackRef.current;
    const touch = event.changedTouches[0];
    const gesture = touchRef.current;
    resetTouch();

    if (!element || !touch) return;

    const dx = touch.clientX - gesture.startX;
    const dy = touch.clientY - gesture.startY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const handledSwipe = absDx >= 40 && absDx > absDy * 1.2;
    if (!handledSwipe) return;

    const target = Math.max(0, Math.min(cards.length - 1, gesture.startIndex + (dx < 0 ? 1 : -1)));
    if (target === gesture.startIndex) return;

    const nativeDelta = element.scrollLeft - gesture.startScrollLeft;
    const movedTowardTarget = (target > gesture.startIndex && nativeDelta > 0) || (target < gesture.startIndex && nativeDelta < 0);

    event.preventDefault();
    scrollToIndex(target, movedTowardTarget ? "auto" : "smooth");
    lastIndexRef.current = target;
    setActive(target);
  }

  function onTouchCancel() {
    resetTouch();
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if ((event.target as HTMLElement | null)?.closest("button, a, input, select, textarea, summary, [role='button']")) return;

    const element = trackRef.current;
    if (!element) return;

    drag.current = {
      active: true,
      startX: event.clientX,
      startScroll: element.scrollLeft,
      lastX: event.clientX,
      lastT: performance.now(),
      vx: 0,
    };
    element.style.scrollSnapType = "none";
    element.style.cursor = "grabbing";
    element.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const element = trackRef.current;
    if (!element) return;
    const dx = event.clientX - drag.current.startX;
    element.scrollLeft = drag.current.startScroll - dx;
    const now = performance.now();
    const dt = now - drag.current.lastT;
    if (dt > 0) drag.current.vx = (event.clientX - drag.current.lastX) / dt;
    drag.current.lastX = event.clientX;
    drag.current.lastT = now;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    drag.current.active = false;
    const element = trackRef.current;
    if (!element) return;

    try {
      element.releasePointerCapture?.(event.pointerId);
    } catch {
      // releasePointerCapture is best-effort for desktop dragging only
    }

    const width = element.clientWidth;
    const current = element.scrollLeft / Math.max(1, width);
    const velocity = drag.current.vx;
    let target = Math.round(current);
    if (velocity < -0.4) target = Math.ceil(current);
    else if (velocity > 0.4) target = Math.floor(current);
    target = Math.max(0, Math.min(cards.length - 1, target));
    element.style.scrollSnapType = "";
    element.style.cursor = "";
    scrollToIndex(target, "smooth");
    lastIndexRef.current = target;
    setActive(target);
  }

  const cardTheme = paletteFor(theme, active);
  const progress = Math.min(100, Math.round((active / Math.max(1, cards.length - 1)) * 100));
  const minutesLeft = Math.max(0, issue.readMinutes - Math.floor(active * (issue.readMinutes / Math.max(1, cards.length - 1))));
  const savedCount = Object.values(saved).filter(Boolean).length;

  return (
    <div className="comm-mobile-stage">
      <div className="comm-mobile-phone" style={{ background: cardTheme.bg }}>
        <TickFlash key={tick} fg={cardTheme.fg} />
        <AppChrome
          active={active}
          cardTheme={cardTheme}
          issueNo={issue.number}
          minutesLeft={minutesLeft}
          onPalette={() => setPaletteOpen(true)}
          progress={progress}
          saved={savedCount}
          total={cards.length}
        />

        <div
          className="comm-mobile-track"
          ref={trackRef}
          onPointerCancel={onPointerUp}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onTouchCancel={onTouchCancel}
          onTouchEnd={onTouchEnd}
          onTouchStart={onTouchStart}
        >
          {cards.map((card, index) => {
            const ct = paletteFor(theme, index);
            return (
              <div className="comm-mobile-card" key={index} style={{ background: ct.bg, color: ct.fg }}>
                {card.kind === "cover" ? <CoverCard issue={issue} onBegin={() => go(1)} theme={theme} tone={ct} /> : null}
                {card.kind === "take" ? (
                  <TakeCard
                    expanded={!!expanded[card.topic.n]}
                    onExpand={() => setExpanded((current) => ({ ...current, [card.topic.n]: !current[card.topic.n] }))}
                    onSave={() => setSaved((current) => ({ ...current, [card.topic.n]: !current[card.topic.n] }))}
                    onShare={() => setShareOpen(true)}
                    saved={!!saved[card.topic.n]}
                    tone={ct}
                    topic={card.topic}
                  />
                ) : null}
                {card.kind === "matches" ? <MatchesCard issue={issue} tone={ct} /> : null}
                {card.kind === "end" ? <EndCard issue={issue} onShare={() => setShareOpen(true)} savedCount={savedCount} tone={ct} /> : null}
              </div>
            );
          })}
        </div>

        <BottomDock active={active} cardTheme={cardTheme} onGo={go} total={cards.length} />

        {shareOpen ? <ShareSheet issue={issue} onClose={() => setShareOpen(false)} tone={cardTheme} /> : null}
        {paletteOpen ? <PaletteSheet current={themeId} onClose={() => setPaletteOpen(false)} setThemeId={setThemeId} tone={cardTheme} /> : null}
      </div>
    </div>
  );
}

function DesktopDispatch({
  archive,
  issue,
  setThemeId,
  theme,
  themeId,
}: {
  archive: DispatchIssue[];
  issue: IssueView;
  setThemeId: (themeId: ThemeId) => void;
  theme: Theme;
  themeId: ThemeId;
}) {
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [progress, setProgress] = useState(0);
  const scrollerRef = useRef<HTMLElement | null>(null);
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const sections = useMemo(
    () => [
      { id: "cover", label: "Cover" },
      ...issue.topics.map((topic) => ({ id: `take-${topic.n}`, label: `0${topic.n} · ${topic.label}` })),
      { id: "matches", label: "Match context" },
      { id: "end", label: "End of issue" },
    ],
    [issue.topics],
  );

  useEffect(() => {
    const element = scrollerRef.current;
    if (!element) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const top = element.scrollTop;
        const max = element.scrollHeight - element.clientHeight;
        setProgress(Math.min(100, Math.round((top / Math.max(1, max)) * 100)));
        let best = 0;
        let bestDistance = Number.POSITIVE_INFINITY;
        sections.forEach((section, index) => {
          const ref = refs.current[section.id];
          if (!ref) return;
          const distance = Math.abs(ref.offsetTop - top - 80);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = index;
          }
        });
        setActive(best);
      });
    };
    element.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      element.removeEventListener("scroll", onScroll);
    };
  }, [sections]);

  function goto(id: string) {
    const element = scrollerRef.current;
    const target = refs.current[id];
    if (!element || !target) return;
    element.scrollTo({ top: target.offsetTop - 40, behavior: "smooth" });
  }

  const accent = theme.accent;
  const blue = PALETTE.blue;
  const gold = PALETTE.gold;
  const activeNumber = active === 0
    ? String(issue.number).padStart(2, "0")
    : active <= issue.topics.length
      ? String(active)
      : active === issue.topics.length + 1
        ? "M"
        : "→";

  return (
    <div className="comm-desktop-reader-shell" style={{ background: theme.bg, color: theme.fg, fontFamily: F.body }}>
      <aside className="comm-desktop-rail" style={{ borderRight: `1px solid ${theme.rule}`, background: theme.surface }}>
        <div style={ts(T.eyebrow, { color: accent })}>The Dispatch</div>
        <div style={{ ...ts({ ...T.coverH1, size: 26 }, { color: theme.fg }), marginTop: 6, lineHeight: 1.05 }}>totalBarça.</div>
        <div style={ts({ ...T.bodyIt, size: 13 }, { color: theme.mute, marginTop: 6 })}>A weekly note on the club, edited down to five things.</div>

        <div style={{ marginTop: 28 }}>
          <div style={ts(T.label, { color: theme.mute })}>This week</div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column" }}>
            {sections.map((section, index) => {
              const isActive = index === active;
              return (
                <button
                  key={section.id}
                  onClick={() => goto(section.id)}
                  style={{
                    padding: "8px 0",
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    borderTop: index === 0 ? `1px solid ${theme.rule}` : "none",
                    borderBottom: `1px solid ${theme.rule}`,
                    cursor: "pointer",
                    color: isActive ? accent : theme.fg,
                    opacity: isActive ? 1 : 0.7,
                    display: "flex",
                    alignItems: "baseline",
                    gap: 12,
                    ...ts({ ...T.headline, size: 14, weight: isActive ? 700 : 500 }),
                  }}
                  type="button"
                >
                  <span style={{ width: 4, height: 16, borderRadius: 2, background: isActive ? accent : "transparent", transition: "background 200ms" }} />
                  <span style={{ flex: 1 }}>{section.label}</span>
                  <span style={ts({ ...T.micro, size: 10 }, { color: theme.mute })}>{String(index + 1).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <div style={ts(T.label, { color: theme.mute })}>Past issues</div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 12 }}>
            {archive.slice(1, 5).map((item) => (
              <div key={item.slug} style={{ paddingTop: 10, borderTop: `1px solid ${theme.rule}` }}>
                <div style={ts({ ...T.micro, size: 10 }, { color: accent })}>№{String(item.issueNumber).padStart(3, "0")} · {item.publishDate}</div>
                <div style={ts({ ...T.headline, size: 13, weight: 500, lh: 1.35 }, { color: theme.fg, marginTop: 4 })}>{item.issueTitle}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }} />
        <div style={ts({ ...T.micro, size: 10 }, { color: theme.mute, marginTop: 28 })}>est. 1899 · Més que un club</div>
      </aside>

      <main className="comm-desktop-main" ref={scrollerRef}>
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 5,
            padding: "14px 56px",
            background: `${theme.bg}ee`,
            backdropFilter: "blur(10px)",
            borderBottom: `1px solid ${theme.rule}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={ts(T.micro, { color: theme.mute })}>Issue №{String(issue.number).padStart(3, "0")} · {issue.date}</div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span style={ts(T.micro, { color: theme.mute })}>{progress}% read</span>
            <span style={{ width: 88, height: 2, background: theme.rule, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, top: 0, height: "100%", background: accent, width: `${progress}%`, transition: "width 220ms ease" }} />
            </span>
            <span style={ts(T.micro, { color: theme.mute })}>{Object.values(saved).filter(Boolean).length} saved</span>
            <details style={{ position: "relative" }}>
              <summary style={{ cursor: "pointer", listStyle: "none", ...ts(T.micro, { color: accent }) }}>Mode: {theme.name}</summary>
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", zIndex: 12, width: 180, padding: 8, background: theme.surface, border: `1px solid ${theme.rule}`, boxShadow: "0 18px 45px rgba(0,0,0,0.14)", display: "grid", gap: 6 }}>
                {Object.values(THEMES).map((item) => {
                  const selected = item.id === themeId;
                  return (
                    <button key={item.id} onClick={() => setThemeId(item.id)} style={{ padding: "9px 10px", background: selected ? theme.bg : "transparent", border: `1px solid ${selected ? accent : "transparent"}`, borderRadius: 8, cursor: "pointer", textAlign: "left", color: selected ? accent : theme.fg, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, ...ts({ ...T.micro, size: 10, weight: selected ? 700 : 500 }) }} type="button">
                      <span>{item.name}</span>
                      <span aria-hidden="true" style={{ display: "flex", gap: 3 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: item.bg, border: `1px solid ${theme.fg}22` }} />
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: item.accent }} />
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: item.accent2 }} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </details>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="comm-desktop-active-number"
          key={`desktop-number-${activeNumber}`}
          style={ts({ ...T.ghost, size: 190, lh: 0.82, track: "-0.07em" }, { color: accent })}
        >
          {activeNumber}
        </div>

        <section
          ref={(el) => {
            refs.current.cover = el;
          }}
          style={{ padding: "64px 56px 48px", display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(220px, 300px)", alignItems: "start", columnGap: 40, position: "relative", borderBottom: `1px solid ${theme.rule}` }}
        >
          <div>
            <div style={ts(T.eyebrow, { color: accent })}>Issue №{String(issue.number).padStart(3, "0")} · {issue.roman} · {issue.week}</div>
            <h1 style={{ margin: "18px 0 16px", ...ts({ ...T.coverH1, size: 76, lh: 1.0 }, { color: theme.fg }), maxWidth: 760 }}>{issue.title}.</h1>
            <p style={{ margin: 0, maxWidth: 620, ...ts({ ...T.body, size: 19, italic: true, lh: 1.5 }, { color: theme.mute }) }}>{issue.summary}</p>
            <div style={{ marginTop: 28, display: "flex", gap: 22, alignItems: "center", ...ts(T.micro, { color: theme.mute }) }}>
              <span>{issue.readMinutes} min read</span>
              <span style={{ width: 4, height: 4, background: theme.mute, borderRadius: 2 }} />
              <span>5 takes · 1 fixture context</span>
              <span style={{ width: 4, height: 4, background: theme.mute, borderRadius: 2 }} />
              <span>Published {issue.date}</span>
            </div>
          </div>
          <div style={{ position: "relative", minHeight: 360, overflow: "hidden", borderRadius: 0, background: PALETTE.blueDeep, border: `1px solid ${theme.rule}` }}>
            <DispatchCoverPhoto creditBg={theme.isDark ? "rgba(6,7,11,0.76)" : "rgba(10,10,13,0.7)"} creditFg={PALETTE.off} photo={coverRealPhoto} />
            <div style={{ position: "absolute", right: -12, bottom: -28, ...ts({ ...T.ghost, size: 220, lh: 0.85 }, { color: theme.gold, opacity: 0.42, pointerEvents: "none", userSelect: "none" }) }}>{issue.number}</div>
          </div>

          <div style={{ gridColumn: "1 / -1", marginTop: 36, padding: "24px 28px", background: theme.surface, borderLeft: `3px solid ${accent}`, maxWidth: 760 }}>
            <div style={ts(T.label, { color: accent, marginBottom: 8 })}>Editor's note</div>
            <p style={{ margin: 0, ...ts({ ...T.body, size: 17, italic: true, lh: 1.55 }, { color: theme.fg }) }}>{issue.editorNote}</p>
            <div style={ts(T.bodyIt, { color: theme.mute, marginTop: 10 })}>{issue.signoff}</div>
          </div>
        </section>

        {issue.topics.map((topic) => {
          const sectionTone = paletteFor(theme, topic.n);
          const sectionIsColorBlock = topic.n % 2 === 0;
          const sectionBg = sectionIsColorBlock ? sectionTone.bg : theme.bg;
          const sectionText = sectionIsColorBlock ? sectionTone.fg : theme.fg;
          const sectionMute = sectionIsColorBlock ? `${sectionTone.fg}aa` : theme.mute;
          const photo = takeRealPhotos[topic.n];
          const figure = photo ? (
            <div style={{ alignSelf: "start", justifySelf: "end", width: "100%", maxWidth: 330, position: "relative", zIndex: 1 }}>
              <TakePhotoFigure accent={sectionTone.accent} fg={sectionText} photo={photo} />
            </div>
          ) : null;

          return (
            <section
              className="comm-desktop-take-section"
              key={topic.n}
              ref={(el) => {
                refs.current[`take-${topic.n}`] = el;
              }}
              style={{ padding: "64px 56px", position: "relative", overflow: "hidden", borderBottom: `1px solid ${theme.rule}`, background: sectionBg, color: sectionText }}
            >
              <div aria-hidden="true" style={{ ...ts({ ...T.ghost, size: 230, lh: 0.85, track: "-0.06em" }, { color: sectionTone.accent, opacity: sectionIsColorBlock ? 0.12 : 0.08 }), userSelect: "none", position: "absolute", right: -28, top: 18, pointerEvents: "none", zIndex: 1 }}>{topic.n}</div>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 330px)", gap: 44, alignItems: "start", position: "relative", zIndex: 2 }}>
                <div style={{ minWidth: 0, maxWidth: 760 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14 }}>
                    <span style={ts(T.eyebrow, { color: sectionTone.accent })}>{topic.label}</span>
                    <span style={ts({ ...T.micro, size: 10 }, { color: sectionMute })}>Take 0{topic.n} · {topic.tag}</span>
                    <button
                      onClick={() => setSaved((current) => ({ ...current, [topic.n]: !current[topic.n] }))}
                      style={{ marginLeft: "auto", background: "transparent", border: "none", cursor: "pointer", color: saved[topic.n] ? sectionTone.accent : sectionMute, display: "flex", alignItems: "center", gap: 6, ...ts(T.micro) }}
                      type="button"
                    >
                      <BookmarkIcon filled={!!saved[topic.n]} />
                      {saved[topic.n] ? "Saved" : "Save"}
                    </button>
                  </div>
                  <h2 style={{ margin: "0 0 16px", ...ts({ ...T.headline, size: 40, weight: 700, lh: 1.12, track: "-0.014em" }, { color: sectionText }) }}>{topic.headline}</h2>
                  <div style={{ borderTop: `2px solid ${sectionTone.accent}`, padding: "14px 0 4px", marginBottom: 22 }}>
                    <div style={ts({ ...T.label, size: 10 }, { color: sectionTone.accent, marginBottom: 6 })}>The take</div>
                    <p style={{ margin: 0, ...ts({ ...T.pull, size: 25, lh: 1.24 }, { color: sectionText }) }}>"{topic.take}"</p>
                  </div>
                  <p style={{ margin: "0 0 18px", ...ts({ ...T.body, size: 17, lh: 1.68 }, { color: sectionText }) }}>{topic.body}</p>
                  <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${sectionIsColorBlock ? `${sectionText}33` : theme.rule}` }}>
                    <div style={ts({ ...T.label, size: 10 }, { color: sectionMute, marginBottom: 6 })}>Why it matters</div>
                    <p style={{ margin: 0, ...ts({ ...T.bodyIt, size: 16, lh: 1.6 }, { color: sectionMute }) }}>{topic.why}</p>
                  </div>
                </div>
                {figure}
              </div>
            </section>
          );
        })}

        <section
          ref={(el) => {
            refs.current.matches = el;
          }}
          style={{ padding: "56px 56px", background: theme.surface, borderBottom: `1px solid ${theme.rule}` }}
        >
          <div style={ts(T.eyebrow, { color: accent, marginBottom: 28 })}>Match context · the bookends</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            <div style={{ paddingTop: 16, borderTop: `3px solid ${accent}` }}>
              <div style={ts(T.label, { color: accent, marginBottom: 12 })}>Last result · {issue.last.competition}</div>
              <div style={ts({ ...T.coverH1, size: 40 }, { color: theme.fg, marginBottom: 10 })}>vs {issue.last.opponent}.</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 22, marginBottom: 14 }}>
                <span style={ts({ ...T.score, size: 88 }, { color: PALETTE.garnet, fontVariantNumeric: "tabular-nums" })}>{issue.last.result}</span>
                <div>
                  <div style={ts({ ...T.micro, size: 10 }, { color: theme.mute })}>{issue.last.date}</div>
                  <div style={ts({ ...T.bodyIt, size: 13 }, { color: theme.mute, marginTop: 4 })}>{issue.last.scorers}</div>
                </div>
              </div>
              <p style={{ margin: 0, maxWidth: 480, ...ts({ ...T.bodyIt, size: 16, lh: 1.55 }, { color: theme.fg, opacity: 0.82 }) }}>{issue.last.read}</p>
            </div>

            <div style={{ paddingTop: 16, borderTop: `3px solid ${blue}` }}>
              <div style={ts(T.label, { color: blue, marginBottom: 12 })}>Next match · {issue.next.competition}</div>
              <div style={ts({ ...T.coverH1, size: 40 }, { color: theme.fg, marginBottom: 10 })}>vs {issue.next.opponent}.</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 22, marginBottom: 14 }}>
                <span style={ts({ ...T.score, size: 42, weight: 200 }, { color: blue, fontVariantNumeric: "tabular-nums" })}>{issue.next.kickoff}</span>
                <div>
                  <div style={ts({ ...T.micro, size: 10 }, { color: theme.mute })}>{issue.next.aggregate}</div>
                  <div style={ts({ ...T.bodyIt, size: 13 }, { color: theme.mute, marginTop: 4 })}>{issue.next.venue}</div>
                </div>
              </div>
              <p style={{ margin: 0, maxWidth: 480, ...ts({ ...T.bodyIt, size: 16, lh: 1.55 }, { color: theme.fg, opacity: 0.82 }) }}>{issue.next.watch}</p>
            </div>
          </div>

          <div style={{ marginTop: 28, padding: "14px 18px", background: theme.bg, borderRadius: 4, display: "flex", gap: 28, alignItems: "center", border: `1px solid ${theme.rule}`, ...ts(T.micro, { color: theme.fg }) }}>
            <span><b style={{ color: accent }}>Issue shape:</b> {issue.topics.length} takes</span>
            <span><b>Context:</b> last and next</span>
            <span><b>Frequency:</b> weekly</span>
            <span style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: "auto" }}>
              <b>Form:</b>
              {issue.standing.form.map((result, index) => (
                <span key={index} style={{ width: 18, height: 18, borderRadius: 9, background: result === "W" ? PALETTE.garnet : result === "D" ? gold : theme.fg, color: PALETTE.off, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: F.mono, fontSize: 10, fontWeight: 700 }}>{result}</span>
              ))}
            </span>
          </div>
        </section>

        <section
          ref={(el) => {
            refs.current.end = el;
          }}
          style={{ padding: "64px 56px 96px", display: "flex", flexDirection: "column", gap: 22, maxWidth: 760 }}
        >
          <div style={ts(T.eyebrow, { color: accent })}>End of issue</div>
          <h2 style={ts({ ...T.coverH1, size: 56 }, { color: theme.fg, margin: 0 })}>That’s the week.</h2>
          <p style={{ margin: 0, maxWidth: 620, ...ts({ ...T.body, size: 17, italic: true, lh: 1.6 }, { color: theme.mute }) }}>Five takes, one fixture context, no in-betweens. We’re back next week when the football has made its case.</p>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button style={{ padding: "14px 22px", background: accent, color: theme.bg, border: "none", borderRadius: 999, cursor: "pointer", ...ts(T.eyebrow, { color: theme.bg }), display: "flex", alignItems: "center", gap: 10 }} type="button">Send to a friend <ArrowIcon dir="up-right" color={theme.bg} /></button>
            <button style={{ padding: "14px 22px", background: "transparent", color: theme.fg, border: `1px solid ${theme.fg}33`, borderRadius: 999, cursor: "pointer", ...ts(T.eyebrow, { color: theme.fg }) }} type="button">Read past issues</button>
          </div>
          <div style={ts({ ...T.micro, size: 10 }, { color: theme.mute, marginTop: 28 })}>totalBarça · est. 1899 · Less noise. More Barça.</div>
        </section>
      </main>

    </div>
  );
}

function TickFlash({ fg }: { fg: string }) {
  return <div className="comm-tick-flash" style={{ background: fg }} />;
}

function AppChrome({
  active,
  cardTheme,
  issueNo,
  minutesLeft,
  onPalette,
  progress,
  saved,
  total,
}: {
  active: number;
  cardTheme: ReturnType<typeof paletteFor>;
  issueNo: number;
  minutesLeft: number;
  onPalette: () => void;
  progress: number;
  saved: number;
  total: number;
}) {
  return (
    <div className="comm-app-chrome" style={{ color: cardTheme.fg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={ts(T.eyebrow, { color: cardTheme.accent })}>The Dispatch</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button aria-label="Theme" onClick={onPalette} style={iconButton(cardTheme.fg)} type="button"><PaletteIcon /></button>
          <button aria-label="Saves" style={iconButton(cardTheme.fg)} type="button">
            <BookmarkIcon filled={saved > 0} />
            {saved > 0 ? <span className="comm-save-count" style={{ background: cardTheme.accent, color: cardTheme.bg }}>{saved}</span> : null}
          </button>
          <button aria-label="Menu" style={iconButton(cardTheme.fg)} type="button"><MenuIcon /></button>
        </div>
      </div>
      <div style={{ marginTop: 10, height: 2, width: "100%", background: "currentColor", opacity: 0.18, position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", background: cardTheme.accent, width: `${progress}%`, transition: "width 280ms ease" }} />
      </div>
      <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", ...ts(T.micro, { color: cardTheme.fg, opacity: 0.55 }) }}>
        <span>Issue №{String(issueNo).padStart(3, "0")}</span>
        <span>{active + 1} / {total} · {minutesLeft} min left</span>
      </div>
    </div>
  );
}

function BottomDock({ active, cardTheme, onGo, total }: { active: number; cardTheme: ReturnType<typeof paletteFor>; onGo: (index: number) => void; total: number }) {
  return (
    <nav aria-label="Mobile issue navigation" className="comm-bottom-dock" style={{ color: cardTheme.fg }}>
      <button aria-label="Previous" className="comm-dock-button" disabled={active === 0} onClick={() => onGo(Math.max(0, active - 1))} style={dockIconButton(cardTheme.fg, active === 0 ? 0.25 : 0.85)} type="button"><ArrowIcon dir="left" /></button>
      <div className="comm-pip-pill">
        {Array.from({ length: total }).map((_, index) => (
          <button
            aria-current={index === active ? "step" : undefined}
            aria-label={`Card ${index + 1}`}
            className="comm-pip"
            key={index}
            onClick={() => onGo(index)}
            style={{ width: index === active ? 18 : 6, background: cardTheme.fg, opacity: index === active ? 1 : 0.4 }}
            type="button"
          />
        ))}
      </div>
      <button aria-label="Next" className="comm-dock-button" disabled={active === total - 1} onClick={() => onGo(Math.min(total - 1, active + 1))} style={dockIconButton(cardTheme.fg, active === total - 1 ? 0.25 : 0.85)} type="button"><ArrowIcon dir="right" /></button>
    </nav>
  );
}

function CoverCard({ issue, onBegin, theme, tone }: { issue: IssueView; onBegin: () => void; theme: Theme; tone: ReturnType<typeof paletteFor> }) {
  return (
    <div className="comm-cover-card">
      <div className="comm-cover-photo-wrap">
        <DispatchCoverPhoto creditBg="rgba(10,10,13,0.58)" creditFg={PALETTE.off} photo={coverRealPhoto} />
        <div className="comm-read-chip"><ClockIcon /> {issue.readMinutes} min · 5 takes</div>
      </div>
      <div className="comm-cover-copy">
        <div style={{ position: "absolute", right: -10, top: -50, ...ts(T.ghost, { color: tone.accent, opacity: 0.18, pointerEvents: "none", userSelect: "none" }) }}>{issue.number}</div>
        <div style={{ display: "flex", justifyContent: "space-between", ...ts(T.micro, { color: tone.fg }), position: "relative", zIndex: 2 }}>
          <span style={{ color: tone.accent }}>Issue №{String(issue.number).padStart(3, "0")} · {issue.roman}</span>
          <span style={{ opacity: 0.6 }}>{issue.date}</span>
        </div>
        <h1 style={{ margin: "14px 0 12px", ...ts(T.coverH1, { color: tone.fg }), position: "relative", zIndex: 2 }}>{issue.title}.</h1>
        <p style={{ margin: 0, ...ts({ ...T.body, italic: true }, { color: tone.fg, opacity: 0.78 }), position: "relative", zIndex: 2 }}>{issue.summary}</p>
        <div style={{ flex: 1 }} />
        <button onClick={onBegin} style={pillButton(tone.accent, tone.bg)} type="button"><span>Read this week's five</span><ArrowIcon dir="right" /></button>
      </div>
    </div>
  );
}

function TakeCard({
  expanded,
  onExpand,
  onSave,
  onShare,
  saved,
  tone,
  topic,
}: {
  expanded: boolean;
  onExpand: () => void;
  onSave: () => void;
  onShare: () => void;
  saved: boolean;
  tone: ReturnType<typeof paletteFor>;
  topic: DispatchTopicView;
}) {
  const photo = takeRealPhotos[topic.n];

  return (
    <div className="comm-take-card" style={{ color: tone.fg }}>
      <div aria-hidden="true" className="comm-mobile-section-number" style={ts({ ...T.ghost, size: 250, lh: 0.82, track: "-0.07em" }, { color: tone.accent, opacity: 0.12 })}>{topic.n}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 3 }}>
        <span style={ts(T.eyebrow, { color: tone.accent })}>{topic.label} · 0{topic.n}/05</span>
        <div style={{ display: "flex", gap: 6 }}>
          <button aria-label="Share" onClick={onShare} style={iconButton(tone.fg)} type="button"><ShareIcon /></button>
          <button aria-label={saved ? "Saved" : "Save"} onClick={onSave} style={iconButton(tone.fg)} type="button"><BookmarkIcon filled={saved} /></button>
        </div>
      </div>
      {photo ? <MobileTakePhoto accent={tone.accent} fg={tone.fg} photo={photo} /> : <div style={{ flex: 1 }} />}
      <div style={{ ...ts(T.label, { color: tone.accent }), marginBottom: 10, position: "relative", zIndex: 3 }}>The take</div>
      <p style={{ margin: 0, ...ts(T.pull, { color: tone.fg }), position: "relative", zIndex: 3 }}>"{topic.take}"</p>
      <h2 style={{ margin: "12px 0 0", ...ts(T.headline, { color: tone.fg, opacity: 0.92 }), position: "relative", zIndex: 3 }}>{topic.headline}</h2>
      <button onClick={onExpand} style={{ marginTop: 14, padding: "10px 14px", background: "transparent", color: tone.fg, border: `1px solid ${tone.fg}`, borderRadius: 999, opacity: 0.72, cursor: "pointer", ...ts(T.micro, { color: tone.fg }), display: "flex", alignItems: "center", gap: 8, width: "fit-content", position: "relative", zIndex: 3 }} type="button">
        <span style={{ display: "inline-block", transition: "transform 220ms", transform: expanded ? "rotate(45deg)" : "rotate(0)" }}>＋</span>
        Why it matters
      </button>
      {expanded ? <div style={{ marginTop: 12, ...ts(T.bodyIt, { color: tone.fg, opacity: 0.86 }), position: "relative", zIndex: 3, animation: "comm-fade 280ms ease" }}>{topic.why}</div> : null}
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", ...ts(T.micro, { color: tone.fg, opacity: 0.58 }), position: "relative", zIndex: 3, paddingTop: 14 }}>
        <span>{topic.tag}</span><span>Swipe →</span>
      </div>
    </div>
  );
}

function MatchesCard({ issue, tone }: { issue: IssueView; tone: ReturnType<typeof paletteFor> }) {
  return (
    <div className="comm-matches-card" style={{ color: tone.fg }}>
      <div style={ts(T.eyebrow, { color: tone.accent })}>Match context · the bookends</div>
      <div style={{ borderTop: `3px solid ${tone.accent}`, paddingTop: 14 }}>
        <div style={{ ...ts(T.label, { color: tone.accent }), marginBottom: 8 }}>Last result · {issue.last.competition}</div>
        <div style={{ ...ts({ ...T.coverH1, size: 28 }, { color: tone.fg }), marginBottom: 4 }}>vs {issue.last.opponent}.</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 10 }}>
          <span style={ts({ ...T.score, size: 56 }, { color: PALETTE.garnet, fontVariantNumeric: "tabular-nums" })}>{issue.last.result}</span>
          <span style={ts(T.micro, { color: tone.fg, opacity: 0.6 })}>{issue.last.scorers}</span>
        </div>
        <p style={{ margin: 0, ...ts({ ...T.body, italic: true, size: 14 }, { color: tone.fg, opacity: 0.78 }) }}>{issue.last.read}</p>
      </div>
      <div style={{ borderTop: `3px solid ${PALETTE.blue}`, paddingTop: 14 }}>
        <div style={{ ...ts(T.label, { color: PALETTE.blue }), marginBottom: 8 }}>Next match · {issue.next.competition}</div>
        <div style={{ ...ts({ ...T.coverH1, size: 28 }, { color: tone.fg }), marginBottom: 4 }}>vs {issue.next.opponent}.</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 4 }}>
          <span style={ts({ ...T.score, size: 28, weight: 200 }, { color: PALETTE.blue, fontVariantNumeric: "tabular-nums" })}>{issue.next.kickoff}</span>
          <span style={ts(T.micro, { color: tone.fg, opacity: 0.55 })}>{issue.next.aggregate}</span>
        </div>
        <div style={{ ...ts(T.label, { color: tone.fg, opacity: 0.55 }), marginBottom: 10 }}>{issue.next.venue}</div>
        <p style={{ margin: 0, ...ts({ ...T.body, italic: true, size: 14 }, { color: tone.fg, opacity: 0.78 }) }}>{issue.next.watch}</p>
      </div>
      <div style={{ marginTop: "auto", padding: "10px 12px", background: "rgba(0,0,0,0.06)", borderRadius: 8, display: "flex", justifyContent: "space-between", ...ts(T.micro, { color: tone.fg }) }}>
        <span>Weekly · {issue.topics.length} takes</span>
        <span style={{ display: "flex", gap: 4 }}>{issue.standing.form.map((result, index) => <span key={index} style={{ width: 14, height: 14, borderRadius: 7, background: result === "W" ? PALETTE.garnet : result === "D" ? PALETTE.gold : tone.fg, color: PALETTE.off, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: F.mono, fontSize: 10, fontWeight: 700 }}>{result}</span>)}</span>
      </div>
    </div>
  );
}

function EndCard({ issue, onShare, savedCount, tone }: { issue: IssueView; onShare: () => void; savedCount: number; tone: ReturnType<typeof paletteFor> }) {
  return (
    <div className="comm-end-card" style={{ color: tone.fg }}>
      <div style={ts(T.eyebrow, { color: tone.accent })}>End of issue</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
        <h1 style={{ margin: 0, ...ts({ ...T.coverH1, size: 36 }, { color: tone.fg }) }}>That’s the week.</h1>
        <p style={{ margin: 0, ...ts({ ...T.body, italic: true }, { color: tone.fg, opacity: 0.78 }) }}>Five takes, one fixture context, no in-betweens. We’re back next week when the football has made its case.</p>
        <div style={{ ...ts(T.bodyIt, { color: tone.fg, opacity: 0.62 }), paddingLeft: 12, borderLeft: `2px solid ${tone.accent}` }}>{issue.signoff}</div>
        {savedCount > 0 ? <div style={{ padding: "12px 14px", background: "rgba(0,0,0,0.06)", borderLeft: `3px solid ${tone.accent}`, ...ts({ ...T.body, size: 13, italic: true }, { color: tone.fg }) }}>You saved {savedCount} take{savedCount === 1 ? "" : "s"} this week. They're in your archive.</div> : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={onShare} style={pillButton(tone.accent, tone.bg)} type="button"><span>Send to a friend</span><ArrowIcon dir="up-right" /></button>
          <button style={pillButton("transparent", tone.fg, tone.fg)} type="button"><span>Read past issues</span><ArrowIcon dir="right" /></button>
        </div>
      </div>
      <div style={{ ...ts(T.micro, { color: tone.fg, opacity: 0.45 }), textAlign: "center" }}>totalBarça · est. 1899 · Issue №{String(issue.number).padStart(3, "0")}</div>
    </div>
  );
}

function ShareSheet({ issue, onClose, tone }: { issue: IssueView; onClose: () => void; tone: ReturnType<typeof paletteFor> }) {
  const items = ["Copy link", "iMessage", "Email", "WhatsApp", "Save as image"];
  return (
    <div className="comm-sheet">
      <button aria-label="Close share sheet" className="comm-sheet-backdrop" onClick={onClose} type="button" />
      <div className="comm-sheet-panel" style={{ background: tone.bg, color: tone.fg }}>
        <div className="comm-sheet-handle" style={{ background: tone.fg }} />
        <div style={{ ...ts(T.eyebrow, { color: tone.accent }), marginBottom: 4 }}>Send Issue №{String(issue.number).padStart(3, "0")}</div>
        <div style={{ ...ts({ ...T.coverH1, size: 22 }, { color: tone.fg }), marginBottom: 16 }}>"{issue.title}."</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {items.map((item) => <button key={item} style={{ background: "transparent", border: "none", color: tone.fg, cursor: "pointer", padding: 4, display: "grid", gap: 8, justifyItems: "center" }} type="button"><span style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(0,0,0,0.07)", border: `1px solid ${tone.fg}22`, display: "grid", placeItems: "center" }}><ShareIcon /></span><span style={ts({ ...T.micro, size: 10 }, { color: tone.fg, opacity: 0.75 })}>{item}</span></button>)}
        </div>
        <button onClick={onClose} style={{ marginTop: 18, width: "100%", padding: 12, background: "transparent", color: tone.fg, border: `1px solid ${tone.fg}33`, borderRadius: 12, cursor: "pointer", ...ts(T.eyebrow, { color: tone.fg }) }} type="button">Cancel</button>
      </div>
    </div>
  );
}

function PaletteSheet({ current, onClose, setThemeId, tone }: { current: ThemeId; onClose: () => void; setThemeId: (themeId: ThemeId) => void; tone: ReturnType<typeof paletteFor> }) {
  const choices: ThemeId[] = ["classic", "dark", "supporters", "coastal"];
  return (
    <div className="comm-sheet">
      <button aria-label="Close reading mode" className="comm-sheet-backdrop" onClick={onClose} type="button" />
      <div className="comm-sheet-panel" style={{ background: tone.bg, color: tone.fg }}>
        <div className="comm-sheet-handle" style={{ background: tone.fg }} />
        <div style={{ ...ts(T.eyebrow, { color: tone.accent }), marginBottom: 14 }}>Reading mode</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {choices.map((id) => {
            const item = THEMES[id];
            const selected = id === current;
            return (
              <button key={id} onClick={() => { setThemeId(id); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: selected ? "rgba(0,0,0,0.06)" : "transparent", border: `1px solid ${selected ? tone.accent : `${tone.fg}22`}`, borderRadius: 12, color: tone.fg, cursor: "pointer", textAlign: "left" }} type="button">
                <span style={{ display: "flex", gap: 4 }}><span style={{ width: 22, height: 22, borderRadius: 6, background: item.bg, border: `1px solid ${tone.fg}22` }} /><span style={{ width: 22, height: 22, borderRadius: 6, background: item.accent }} /><span style={{ width: 22, height: 22, borderRadius: 6, background: item.accent2 }} /></span>
                <span style={{ flex: 1 }}><div style={ts({ ...T.headline, size: 14, weight: 600 }, { color: tone.fg })}>{item.name}</div><div style={ts({ ...T.micro, size: 10 }, { color: tone.fg, opacity: 0.6 })}>{id === "classic" ? "Bone paper · garnet ink" : id === "dark" ? "Night reading · low light" : id === "supporters" ? "Garnet-led · matchday warmth" : "Blue-led · home colors"}</div></span>
                {selected ? <CheckIcon fg={tone.accent} /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DispatchCoverPhoto({
  creditBg,
  creditFg,
  photo,
}: {
  creditBg: string;
  creditFg: string;
  photo: RealDispatchPhoto;
}) {
  return (
    <>
      <img
        alt={photo.alt}
        draggable={false}
        height={photo.height}
        src={photo.src}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: photo.objectPosition,
          userSelect: "none",
        }}
        width={photo.width}
      />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: photo.overlay }} />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${PALETTE.garnet} 0%, ${PALETTE.gold} 55%, ${PALETTE.blue} 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 18,
          bottom: 14,
          zIndex: 2,
          maxWidth: "calc(100% - 36px)",
          padding: "6px 8px",
          borderRadius: 10,
          background: creditBg,
          color: creditFg,
          ...ts({ ...T.micro, size: 10, track: "0.06em", up: false }, { lineHeight: 1.35 }),
        }}
      >
        {photo.credit}
      </div>
    </>
  );
}

function MobileTakePhoto({ accent, fg, photo }: { accent: string; fg: string; photo: RealDispatchPhoto }) {
  return (
    <figure style={{ margin: "12px 0 14px", position: "relative", zIndex: 3 }}>
      <div style={{ position: "relative", width: "100%", height: "clamp(82px, 16svh, 132px)", background: "#0a0a0d", overflow: "hidden" }}>
        <img
          alt={photo.alt}
          draggable={false}
          height={photo.height}
          src={photo.src}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: photo.objectPosition,
            userSelect: "none",
          }}
          width={photo.width}
        />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: photo.overlay }} />
        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: accent }} />
      </div>
      <figcaption
        className="comm-take-photo-credit"
        style={{
          marginTop: 7,
          color: fg,
          opacity: 0.72,
          ...ts({ ...T.micro, size: 10, track: "0.06em", up: false }, { lineHeight: 1.4 }),
        }}
      >
        {photo.credit}
      </figcaption>
    </figure>
  );
}

function TakePhotoFigure({ accent, fg, photo }: { accent: string; fg: string; photo: RealDispatchPhoto }) {
  return (
    <figure style={{ margin: 0, position: "relative", display: "block" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", background: "#0a0a0d", overflow: "hidden" }}>
        <img
          alt={photo.alt}
          draggable={false}
          height={photo.height}
          src={photo.src}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: photo.objectPosition,
            userSelect: "none",
          }}
          width={photo.width}
        />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: photo.overlay }} />
        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: accent }} />
      </div>
      <figcaption
        style={{
          marginTop: 8,
          color: fg,
          opacity: 0.72,
          ...ts({ ...T.micro, size: 10, track: "0.06em", up: false }, { lineHeight: 1.45 }),
        }}
      >
        {photo.credit}
      </figcaption>
    </figure>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return <svg fill={filled ? "currentColor" : "none"} height="18" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 16 18" width="16" aria-hidden="true"><path d="M2 1.5h12v15l-6-4-6 4v-15z" /></svg>;
}

function ShareIcon() {
  return <svg fill="none" height="18" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 18" width="16" aria-hidden="true"><path d="M8 11V1M8 1L4 5M8 1l4 4" /><path d="M2 9v7h12V9" /></svg>;
}

function ClockIcon() {
  return <svg fill="none" height="11" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 12 12" width="11" aria-hidden="true"><circle cx="6" cy="6" r="5" /><path d="M6 3v3l2 1.5" /></svg>;
}

function ArrowIcon({ color = "currentColor", dir }: { color?: string; dir: "left" | "right" | "up-right" }) {
  const rotate = dir === "right" ? 0 : dir === "left" ? 180 : -45;
  return <svg fill="none" height="14" stroke={color} strokeWidth="1.6" style={{ transform: `rotate(${rotate}deg)`, transition: "transform 200ms" }} viewBox="0 0 14 14" width="14" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4" /></svg>;
}

function MenuIcon() {
  return <svg fill="none" height="14" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 18 14" width="18" aria-hidden="true"><path d="M0 1h18M0 7h18M0 13h18" /></svg>;
}

function PaletteIcon() {
  return <svg fill="none" height="18" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 18 18" width="18" aria-hidden="true"><circle cx="9" cy="9" r="7.5" /><circle cx="5.5" cy="6.5" fill="currentColor" r="0.9" /><circle cx="9" cy="5" fill="currentColor" r="0.9" /><circle cx="12.5" cy="6.5" fill="currentColor" r="0.9" /><circle cx="13.5" cy="10" fill="currentColor" r="0.9" /></svg>;
}

function CheckIcon({ fg }: { fg: string }) {
  return <svg fill="none" height="16" stroke={fg} strokeWidth="2" viewBox="0 0 16 16" width="16" aria-hidden="true"><path d="M3 8.5 L7 12 L13 4" /></svg>;
}
