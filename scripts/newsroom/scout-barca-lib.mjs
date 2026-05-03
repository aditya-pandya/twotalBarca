import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const birdPath = process.env.BIRD_PATH ?? "/Users/aditya/.local/bin/bird";
const ytDlpPath = process.env.YT_DLP_PATH ?? "/Users/aditya/.local/bin/yt-dlp";
const userAgent = "twotalbarca-newsroom/1.0";

const OFFICIAL_SITE_NEWS_URL = "https://r.jina.ai/http://www.fcbarcelona.com/en/football/first-team/news";
const OFFICIAL_SITE_RESULTS_URL = "https://r.jina.ai/http://www.fcbarcelona.com/en/football/first-team/results";
const OFFICIAL_SITE_SQUAD_URL = "https://r.jina.ai/http://www.fcbarcelona.com/en/football/first-team/squad";
const OFFICIAL_WOMEN_NEWS_URL = "https://r.jina.ai/http://www.fcbarcelona.com/en/football/womens-football/news";
const OFFICIAL_WOMEN_RESULTS_URL = "https://r.jina.ai/http://www.fcbarcelona.com/en/football/womens-football/results";
const OFFICIAL_WOMEN_SQUAD_URL = "https://r.jina.ai/http://www.fcbarcelona.com/en/football/womens-football/squad";
const ESPN_FIXTURES_URL = "https://r.jina.ai/http://www.espn.com/soccer/team/fixtures/_/id/83/barcelona";
const ESPN_RESULTS_URL = "https://r.jina.ai/http://www.espn.com/soccer/team/results/_/id/83/barcelona";
const ESPN_STANDINGS_URL = "https://r.jina.ai/http://www.espn.com/soccer/standings/_/league/esp.1";
const OFFICIAL_YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@FCBarcelona/videos";

const TRUSTED_GOOGLE_NEWS_PUBLISHER_PATTERNS = [
  /\breuters\b/i,
  /\b(?:associated press|ap news|ap)\b/i,
  /\bespn(?: fc)?\b/i,
  /\bthe athletic\b/i,
  /\bbbc sport\b/i,
  /\bthe guardian\b/i,
  /\bguardian sport\b/i,
  /\bopta(?: analyst|jose)?\b/i,
  /\bfc barcelona\b/i,
];

const BLOCKED_GOOGLE_NEWS_PUBLISHER_PATTERNS = [
  /republic world/i,
  /sports mole/i,
  /tribuna/i,
  /barca\s*universal/i,
  /barcacentre/i,
  /betting/i,
  /bookmaker/i,
  /odds/i,
  /prediction/i,
  /tips/i,
];

const GOOGLE_NEWS_QUERIES = [
  {
    source: "rss:google-news-match-context",
    label: "Google News: match context",
    query: "Barcelona Atletico Espanyol",
    detail: "Searched Google News RSS for derby, second-leg, and title-race coverage from broad football outlets.",
  },
  {
    source: "rss:google-news-player-watch",
    label: "Google News: player watch",
    query: "FC Barcelona Pedri Rashford Olmo Yamal",
    detail: "Searched Google News RSS for player-selection and performance coverage around Barca's current week.",
  },
  {
    source: "rss:google-news-women-watch",
    label: "Google News: women watch",
    query: "Barcelona Women Aitana Alexia Bayern Liga F",
    detail: "Searched Google News RSS for trusted Femení coverage around Bayern, Liga F, and the current player focus.",
  },
  {
    source: "rss:google-news-press-conference-watch",
    label: "Google News: press conference watch",
    query: "Barcelona Flick press conference Espanyol Atletico mixed zone",
    detail: "Searched Google News RSS for trusted pre-match press conference and mixed-zone lines around Espanyol and Atlético.",
  },
];

const LOW_SIGNAL_PATTERNS = [
  /snapchat/i,
  /kit leak/i,
  /kit launch/i,
  /museum/i,
  /tour(s|ing)?\b/i,
  /ticket(s|ing)?\b/i,
  /camp nou experience/i,
  /spotify camp nou/i,
  /store\b/i,
  /merch/i,
  /retro jersey/i,
  /new shirt/i,
  /betting tips/i,
  /booking code/i,
  /prediction/i,
  /22bet/i,
  /fakta\.co/i,
];

const MAX_EVIDENCE_AGE_DAYS = 10;

const CONSEQUENCE_KEYWORDS = [
  "atletico",
  "atlético",
  "espanyol",
  "derby",
  "second leg",
  "return leg",
  "title race",
  "training",
  "suspension",
  "red card",
  "injury",
  "fit",
  "fitness",
  "available",
  "start",
  "starting",
  "selection",
  "rotation",
  "lineup",
  "line-up",
  "midfield",
  "defence",
  "defense",
  "attack",
  "goal",
  "goals",
  "result",
  "results",
  "standings",
  "points",
  "metropolitano",
  "squad",
  "preview",
];

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function safeDate(value, fallback = new Date().toISOString()) {
  const timestamp = Date.parse(value ?? "");
  return Number.isNaN(timestamp) ? fallback : new Date(timestamp).toISOString();
}

function compactText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function dedupeBy(items, keyBuilder) {
  const seen = new Set();
  const deduped = [];

  for (const item of items) {
    const key = keyBuilder(item);
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(item);
  }

  return deduped;
}

function keywordMatch(text, keywords) {
  const lowered = compactText(text).toLowerCase();
  return keywords.some((keyword) => lowered.includes(keyword));
}

function hasFootballConsequence(text) {
  return keywordMatch(text, CONSEQUENCE_KEYWORDS);
}

function isLowSignalText(text) {
  const compact = compactText(text);
  return LOW_SIGNAL_PATTERNS.some((pattern) => pattern.test(compact));
}

function normalizeImageLead(image) {
  if (!image?.src || !image?.alt || !image?.source) {
    return undefined;
  }

  return {
    src: compactText(image.src),
    alt: compactText(image.alt),
    href: compactText(image.href) || undefined,
    source: compactText(image.source),
    label: compactText(image.label) || undefined,
    note: compactText(image.note) || undefined,
    credit: compactText(image.credit) || undefined,
    status:
      image.status === "usable-lead-image" ||
      image.status === "review-needed-social-preview" ||
      image.status === "needs-free-license-replacement" ||
      image.status === "needs-generation"
        ? image.status
        : "needs-generation",
  };
}

function buildEvidenceRecord(args) {
  return {
    id: args.id,
    family: args.family,
    source: args.source,
    label: compactText(args.label),
    text: compactText(args.text),
    url: args.url,
    publishedAt: safeDate(args.publishedAt, args.fallbackPublishedAt),
    engagement: Number.isFinite(args.engagement) ? args.engagement : 0,
    image: normalizeImageLead(args.image),
  };
}

function finalizeEvidence(items) {
  return dedupeBy(
    items
      .filter((item) => item?.label && item?.text)
      .filter((item) => !isLowSignalText(`${item.label} ${item.text}`)),
    (item) => item.id,
  );
}

function filterFreshEvidence(items, referenceTime) {
  const cutoff = Date.parse(referenceTime) - MAX_EVIDENCE_AGE_DAYS * 24 * 60 * 60 * 1000;
  const ceiling = Date.parse(referenceTime) + 12 * 60 * 60 * 1000;

  return items.filter((item) => {
    const publishedAt = Date.parse(item.publishedAt ?? "");
    if (Number.isNaN(publishedAt)) {
      return true;
    }
    return publishedAt >= cutoff && publishedAt <= ceiling;
  });
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": userAgent,
      accept: "application/json,text/plain;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": userAgent,
      accept: "application/rss+xml,application/xml,text/plain,text/html,text/markdown;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.text();
}

async function searchBird(query) {
  const { stdout } = await execFileAsync(birdPath, ["search", "--json", "--count", "6", query], {
    timeout: 30000,
    maxBuffer: 1024 * 1024 * 4,
  });
  return JSON.parse(stdout);
}

function normalizeYouTubePublishedAt(rawValue, rawTimestamp) {
  if (typeof rawTimestamp === "number" && Number.isFinite(rawTimestamp)) {
    return new Date(rawTimestamp * 1000).toISOString();
  }
  if (/^\d{8}$/.test(String(rawValue ?? ""))) {
    const text = String(rawValue);
    return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}T00:00:00.000Z`;
  }
  return undefined;
}

async function listYouTubeVideos(channelUrl, { limit = 18 } = {}) {
  const { stdout } = await execFileAsync(
    ytDlpPath,
    ["--flat-playlist", "--playlist-end", String(limit), "--dump-single-json", channelUrl],
    {
      timeout: 60000,
      maxBuffer: 1024 * 1024 * 8,
    },
  );
  const payload = JSON.parse(stdout);

  return (payload?.entries ?? [])
    .map((entry) => ({
      id: compactText(entry?.id),
      title: compactText(entry?.title),
      url: compactText(entry?.url)?.startsWith("http") ? compactText(entry?.url) : compactText(entry?.id) ? `https://www.youtube.com/watch?v=${entry.id}` : "",
      publishedAt: normalizeYouTubePublishedAt(entry?.upload_date, entry?.timestamp),
    }))
    .filter((entry) => entry.id && entry.title && entry.url);
}

function pickYouTubeCaptionTrack(tracksByLanguage = {}) {
  for (const language of ["en", "en-orig", "es", "ca"]) {
    const tracks = tracksByLanguage?.[language] ?? [];
    const preferredTrack = tracks.find((track) => track?.ext === "json3" && track?.url) ?? tracks.find((track) => track?.url);
    if (preferredTrack?.url) {
      return preferredTrack.url;
    }
  }

  return null;
}

function parseYouTubeTranscriptPayload(payload) {
  return dedupeBy(
    (payload?.events ?? [])
      .map((event) => compactText((event?.segs ?? []).map((segment) => segment?.utf8 ?? "").join(" ")))
      .filter(Boolean)
      .filter((line) => !/^\[[^\]]+\]$/.test(line)),
    (line) => line.toLowerCase(),
  );
}

async function fetchYouTubeTranscript(videoUrl, { fetchJsonImpl = fetchJson } = {}) {
  const { stdout } = await execFileAsync(ytDlpPath, ["--dump-json", "--skip-download", videoUrl], {
    timeout: 60000,
    maxBuffer: 1024 * 1024 * 8,
  });
  const metadata = JSON.parse(stdout);
  const captionUrl = pickYouTubeCaptionTrack(metadata?.automatic_captions) ?? pickYouTubeCaptionTrack(metadata?.subtitles);

  if (!captionUrl) {
    throw new Error(`No usable captions found for ${videoUrl}`);
  }

  const transcriptPayload = await fetchJsonImpl(captionUrl);
  const transcriptLines = parseYouTubeTranscriptPayload(transcriptPayload);

  if (!transcriptLines.length) {
    throw new Error(`Empty transcript payload for ${videoUrl}`);
  }

  return {
    title: compactText(metadata?.title),
    publishedAt: normalizeYouTubePublishedAt(metadata?.upload_date, metadata?.timestamp),
    transcript: transcriptLines.join("\n"),
  };
}

async function collectOfficialVideoTranscriptEvidence({
  sourceLabel,
  channelUrl,
  titleKeywords,
  transcriptKeywords,
  fallbackPublishedAt,
  listYouTubeVideosImpl = listYouTubeVideos,
  fetchYouTubeTranscriptImpl = fetchYouTubeTranscript,
  maxVideos = 3,
  lineLimit = 4,
}) {
  const videos = await listYouTubeVideosImpl(channelUrl, { limit: 18 });
  const matchingVideos = dedupeBy(
    videos.filter((video) => keywordMatch(video.title, titleKeywords)),
    (video) => video.url,
  ).slice(0, maxVideos);

  const items = [];

  for (const video of matchingVideos) {
    try {
      const transcriptRecord = await fetchYouTubeTranscriptImpl(video.url, { fetchJsonImpl: fetchJson });
      const lines = extractRelevantLines(transcriptRecord.transcript, transcriptKeywords, {
        limit: lineLimit,
        minLength: 20,
      });

      lines.forEach((line, index) => {
        items.push(
          buildEvidenceRecord({
            id: `${sourceLabel}:${video.id}:${index}`,
            family: "official",
            source: sourceLabel,
            label: line,
            text: `${transcriptRecord.title || video.title} ${line}`,
            url: video.url,
            publishedAt: transcriptRecord.publishedAt ?? video.publishedAt,
            fallbackPublishedAt,
            engagement: 0,
          }),
        );
      });
    } catch {
      continue;
    }
  }

  return finalizeEvidence(items);
}

function stripHtml(value) {
  return compactText(
    String(value ?? "")
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/<[^>]+>/g, " "),
  );
}

function cleanStructuredLine(rawLine) {
  const cleaned = compactText(
    String(rawLine ?? "")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/https?:\/\/\S+/g, " ")
      .replace(/label\.aria\.[\w.-]+/gi, " ")
      .replace(/\b\d+\s*(hrs?|days?) ago\b/gi, " ")
      .replace(/\bFirst Team\b/gi, " ")
      .replace(/^[-*#>]+\s*/g, " "),
  );

  if (/^(title|url source|markdown content):/i.test(cleaned)) {
    return "";
  }
  if (/official website/i.test(cleaned)) {
    return "";
  }
  if (/^share$/i.test(cleaned)) {
    return "";
  }

  return cleaned;
}

function decodeHtmlEntities(value) {
  return String(value ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ");
}

function extractTag(xml, tag) {
  const match = String(xml ?? "").match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? stripHtml(decodeHtmlEntities(match[1])) : "";
}

function extractTagWithAttributes(xml, tag) {
  const match = String(xml ?? "").match(new RegExp(`<${tag}([^>]*)>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match
    ? {
        attributes: match[1] ?? "",
        value: stripHtml(decodeHtmlEntities(match[2])),
      }
    : null;
}

function extractTitleSuffixPublisher(title) {
  const match = compactText(title).match(/\s[-–—]\s([^–—-]+)$/);
  return compactText(match?.[1]);
}

function extractGoogleNewsSourceMeta(itemXml, title) {
  const sourceTag = extractTagWithAttributes(itemXml, "source");
  const urlMatch = sourceTag?.attributes?.match(/url=(['"])(.*?)\1/i);

  return {
    name: compactText(sourceTag?.value || extractTitleSuffixPublisher(title)),
    url: compactText(urlMatch?.[2]),
  };
}

function isTrustedGoogleNewsPublisher({ name, url, title }) {
  const publisherSignals = compactText([name, url, extractTitleSuffixPublisher(title)].filter(Boolean).join(" "));

  if (!publisherSignals) {
    return false;
  }

  if (BLOCKED_GOOGLE_NEWS_PUBLISHER_PATTERNS.some((pattern) => pattern.test(publisherSignals))) {
    return false;
  }

  return TRUSTED_GOOGLE_NEWS_PUBLISHER_PATTERNS.some((pattern) => pattern.test(publisherSignals));
}

function parseRssItems(xmlText) {
  return Array.from(String(xmlText ?? "").matchAll(/<item>([\s\S]*?)<\/item>/gi)).map((match) => match[1]);
}

export function parseGoogleNewsRss(xmlText, sourceLabel, { query, fallbackPublishedAt = new Date().toISOString() } = {}) {
  const items = parseRssItems(xmlText)
    .map((itemXml, index) => {
      const title = extractTag(itemXml, "title");
      const description = extractTag(itemXml, "description");
      const sourceMeta = extractGoogleNewsSourceMeta(itemXml, title);
      const sourceName = sourceMeta.name;
      const text = [title, description, sourceName].filter(Boolean).join(" ");

      if (!isTrustedGoogleNewsPublisher({ name: sourceName, url: sourceMeta.url, title })) {
        return null;
      }

      return buildEvidenceRecord({
        id: `${sourceLabel}:${index}:${slugify(title || description || sourceName || String(index))}`,
        family: "news",
        source: sourceLabel,
        label: title || description || sourceName || `News item ${index + 1}`,
        text,
        url: extractTag(itemXml, "link") || undefined,
        publishedAt: extractTag(itemXml, "pubDate"),
        fallbackPublishedAt,
        engagement: 0,
      });
    })
    .filter(Boolean);

  return finalizeEvidence(items);
}

function normalizeRedditPosts(payload, sourceLabel) {
  const children = payload?.data?.children ?? [];
  return finalizeEvidence(
    children
      .map((entry) => entry?.data)
      .filter(Boolean)
      .map((post) =>
        buildEvidenceRecord({
          id: `${sourceLabel}:${post.id}`,
          family: "reddit",
          source: sourceLabel,
          label: post.title,
          text: `${post.title} ${post.selftext ?? ""}`,
          url: post.permalink ? `https://www.reddit.com${post.permalink}` : post.url,
          publishedAt: typeof post.created_utc === "number" ? new Date(post.created_utc * 1000).toISOString() : undefined,
          engagement: (Number(post.score) || 0) + (Number(post.num_comments) || 0) * 4,
        }),
      ),
  );
}

function tweetStatusUrl(tweet, sourceLabel) {
  return tweet?.id && tweet?.author?.username ? `https://x.com/${tweet.author.username}/status/${tweet.id}` : undefined;
}

function pickTweetPhoto(tweet) {
  const mediaCollections = [
    ...(Array.isArray(tweet?.photos) ? tweet.photos : []),
    ...(Array.isArray(tweet?.media) ? tweet.media : []),
    ...(Array.isArray(tweet?.extendedEntities?.media) ? tweet.extendedEntities.media : []),
    ...(Array.isArray(tweet?.entities?.media) ? tweet.entities.media : []),
  ];

  const candidate = mediaCollections.find((item) => item?.url || item?.media_url_https || item?.media_url);
  if (!candidate) {
    return undefined;
  }

  return {
    src: compactText(candidate.url || candidate.media_url_https || candidate.media_url),
    alt:
      compactText(candidate.alt_text || candidate.ext_alt_text || candidate.description || tweet?.text || `${tweet?.author?.username ?? sourceLabel} preview`) ||
      `${tweet?.author?.username ?? sourceLabel} preview`,
  };
}

function extractTweetImageLead(tweet, sourceLabel) {
  const photo = pickTweetPhoto(tweet);
  if (!photo?.src) {
    return undefined;
  }

  return normalizeImageLead({
    ...photo,
    href: tweetStatusUrl(tweet, sourceLabel),
    source: sourceLabel,
    label: `${tweet?.author?.username ?? sourceLabel} preview`,
    note: "Internal review only until licensing is confirmed.",
    status: "review-needed-social-preview",
  });
}

function normalizeBirdTweets(tweets, sourceLabel) {
  return finalizeEvidence(
    (tweets ?? []).map((tweet) =>
      buildEvidenceRecord({
        id: `${sourceLabel}:${tweet.id}`,
        family: "x",
        source: sourceLabel,
        label: `${tweet.author?.username ?? sourceLabel}: ${tweet.text}`,
        text: tweet.text,
        url: tweetStatusUrl(tweet, sourceLabel),
        publishedAt: tweet.createdAt,
        engagement: (Number(tweet.likeCount) || 0) + (Number(tweet.retweetCount) || 0) * 3 + (Number(tweet.replyCount) || 0) * 2,
        image: extractTweetImageLead(tweet, sourceLabel),
      }),
    ),
  );
}

function extractRelevantLines(text, keywords, { limit = 8, minLength = 18 } = {}) {
  const loweredKeywords = keywords.map((keyword) => keyword.toLowerCase());
  const lines = [];

  for (const rawLine of String(text ?? "").split("\n")) {
    const line = cleanStructuredLine(rawLine);
    if (line.length < minLength || line.length > 400) {
      continue;
    }

    const loweredLine = line.toLowerCase();
    if (!loweredKeywords.some((keyword) => loweredLine.includes(keyword))) {
      continue;
    }

    lines.push(line);
  }

  return dedupeBy(lines, (line) => line.toLowerCase()).slice(0, limit);
}

function normalizeWebLines(lines, sourceLabel, url, family, fallbackPublishedAt) {
  return finalizeEvidence(
    lines.map((line, index) =>
      buildEvidenceRecord({
        id: `${sourceLabel}:${index}:${slugify(line)}`,
        family,
        source: sourceLabel,
        label: line,
        text: line,
        url,
        publishedAt: fallbackPublishedAt,
        fallbackPublishedAt,
        engagement: 0,
      }),
    ),
  );
}

function isOfficialClubSource(source) {
  return (
    source === "x:official-club-men" ||
    source === "x:official-club-women" ||
    (source.startsWith("web:fcbarcelona") && !source.endsWith("-squad"))
  );
}

function isOfficialReferenceSource(source) {
  return source === "web:fcbarcelona-squad" || source === "web:fcbarcelona-women-squad";
}

function isTrustedXSource(source) {
  return ["x:official-club-men", "x:official-club-women", "x:trusted-football-media", "x:trusted-football-stats"].includes(source);
}

function isTrustedSource(source) {
  return (
    isTrustedXSource(source) ||
    isOfficialClubSource(source) ||
    isOfficialReferenceSource(source) ||
    source.startsWith("rss:google-news") ||
    source.startsWith("web:espn-")
  );
}

function isChatterSource(source) {
  return source.startsWith("reddit:");
}

function sourceAuthorityWeight(source) {
  if (isOfficialClubSource(source)) return 6;
  if (source === "x:trusted-football-media" || source === "x:trusted-football-stats") return 5;
  if (source.startsWith("rss:google-news")) return 5;
  if (source === "web:espn-fixtures" || source === "web:espn-results" || source === "web:espn-standings") return 4;
  if (isOfficialReferenceSource(source)) return 2;
  if (isChatterSource(source)) return 1;
  if (source.startsWith("x:")) return 3;
  return 1;
}

function sumEngagement(evidence) {
  return evidence.reduce((total, item) => total + (item.engagement ?? 0), 0);
}

function scoreCandidate(definition, evidence) {
  const uniqueSources = dedupeBy(evidence, (item) => item.source);
  const sourceFamilies = new Set(evidence.map((item) => item.family));
  const authorityScore = uniqueSources.reduce((total, item) => total + sourceAuthorityWeight(item.source), 0);
  const trustedSourceCount = uniqueSources.filter((item) => isTrustedSource(item.source)).length;
  const chatterSourceCount = uniqueSources.filter((item) => isChatterSource(item.source)).length;
  const trustedEvidenceCount = evidence.filter((item) => isTrustedSource(item.source)).length;
  const chatterEvidenceCount = evidence.filter((item) => isChatterSource(item.source)).length;
  const officialCoverage = uniqueSources.some((item) => isOfficialClubSource(item.source) || isOfficialReferenceSource(item.source));
  const newsCoverage = uniqueSources.some(
    (item) =>
      item.source.startsWith("rss:google-news") ||
      item.source.startsWith("web:espn-") ||
      item.source === "x:trusted-football-media" ||
      item.source === "x:trusted-football-stats",
  );
  const socialCoverage = uniqueSources.some((item) => isTrustedXSource(item.source) || isChatterSource(item.source));
  const consequenceCount = evidence.filter((item) => hasFootballConsequence(`${item.label} ${item.text}`)).length;

  let score = definition.baseScore;
  score += sourceFamilies.size * 3;
  score += Math.min(18, authorityScore);
  score += Math.min(12, trustedSourceCount * 3);
  score += Math.min(3, chatterSourceCount);
  score += Math.min(8, consequenceCount * 2);
  score += Math.min(6, Math.floor(sumEngagement(evidence) / 1200));

  if (officialCoverage) {
    score += 6;
  }
  if (newsCoverage) {
    score += 4;
  }
  if (officialCoverage && socialCoverage) {
    score += 5;
  }
  if (newsCoverage && socialCoverage) {
    score += 3;
  }
  if (!officialCoverage && !newsCoverage) {
    score -= 6;
  }
  if (trustedSourceCount === 0 && chatterSourceCount > 0) {
    score -= 12;
  }
  if (trustedEvidenceCount > 0 && chatterEvidenceCount > trustedEvidenceCount) {
    score -= 2;
  }

  return clamp(score, 0, 100);
}

function urgencyFromScore(score) {
  if (score >= 88) return "critical";
  if (score >= 74) return "high";
  if (score >= 60) return "medium";
  return "low";
}

function latestEventAt(evidence, fallback) {
  const timestamps = evidence.map((item) => Date.parse(item.publishedAt ?? "")).filter((value) => !Number.isNaN(value));
  return timestamps.length > 0 ? new Date(Math.max(...timestamps)).toISOString() : fallback;
}

function sortEvidenceForCandidate(evidence) {
  return [...evidence].sort((left, right) => {
    const authorityDelta = sourceAuthorityWeight(right.source) - sourceAuthorityWeight(left.source);
    if (authorityDelta !== 0) {
      return authorityDelta;
    }

    const consequenceDelta = Number(hasFootballConsequence(`${right.label} ${right.text}`)) - Number(hasFootballConsequence(`${left.label} ${left.text}`));
    if (consequenceDelta !== 0) {
      return consequenceDelta;
    }

    const dateDelta = Date.parse(right.publishedAt ?? "") - Date.parse(left.publishedAt ?? "");
    if (!Number.isNaN(dateDelta) && dateDelta !== 0) {
      return dateDelta;
    }

    return (right.engagement ?? 0) - (left.engagement ?? 0);
  });
}

function candidateEvidenceRecords(evidence) {
  return dedupeBy(evidence, (item) => item.source)
    .slice(0, 6)
    .map((item) => ({
      source: item.source,
      label: item.label,
      url: item.url,
      excerpt: item.text.slice(0, 280),
      publishedAt: item.publishedAt,
      engagement: item.engagement,
      image: item.image,
    }));
}

function pickImageLead(evidence) {
  return sortEvidenceForCandidate(evidence).find((item) => item.image)?.image;
}

function collectThemeEvidence(definition, evidencePool) {
  const matches = evidencePool.filter((item) => {
    const text = `${item.label} ${item.text}`;
    if (definition.requiredKeywordGroups && !definition.requiredKeywordGroups.every((group) => keywordMatch(text, group))) {
      return false;
    }
    if (definition.requiredKeywords && !keywordMatch(text, definition.requiredKeywords)) {
      return false;
    }
    return keywordMatch(text, definition.keywords);
  });
  return sortEvidenceForCandidate(dedupeBy(matches, (item) => item.id));
}

function buildAssignmentSuggestion(definition, score, now) {
  const deadlineHours = score >= 88 ? 8 : score >= 74 ? 12 : 20;
  return {
    title: definition.assignmentTitle,
    kind: "article",
    owner: definition.owner,
    approver: "editor-in-chief",
    deadline: new Date(Date.parse(now) + deadlineHours * 60 * 60 * 1000).toISOString(),
    brief: definition.brief,
    deliverables: [
      "One publishable article draft",
      "Exact match/player/topic framing",
      "Dispatch recommendation grounded in the live scout",
    ],
  };
}

function buildPriorityReason(evidence, sourceMetaById) {
  const sourceFamilies = Array.from(new Set(evidence.map((item) => item.family))).sort();
  const strongestFeeds = dedupeBy(evidence, (item) => item.source)
    .slice(0, 3)
    .map((item) => sourceMetaById.get(item.source)?.label ?? item.source);

  return `Matched ${evidence.length} live evidence item(s) across ${sourceFamilies.join(", ")}. Strongest feeds: ${strongestFeeds.join("; ")}.`;
}

function buildThemeCandidates(evidencePool, now, sourceMetaById) {
  const definitions = [
    {
      id: "madrid-without-cubarsi",
      title: "Madrid without Cubarsí changes the second-leg plan",
      assignmentTitle: "Madrid without Cubarsí",
      owner: "editor-in-chief",
      baseScore: 78,
      editorialWeight: 4,
      minSourceFamilies: 2,
      requiredKeywords: ["cubarsi", "suspension", "red card"],
      keywords: ["cubarsi", "suspension", "red card", "return leg", "second leg", "metropolitano", "atletico", "atlético"],
      summary:
        "Cubarsí's suspension is the clearest immediate football consequence from the first leg, with supporter chatter and fixture context both pointing to the back-line reshuffle in Madrid.",
      brief:
        "Build the angle around the exact defensive consequence of Cubarsí's suspension, how Barcelona can reshape the line in Madrid, and why the first goal now matters even more.",
      assignmentTopic: "Atlético Madrid vs Barcelona second leg / Pau Cubarsí suspension",
      tags: ["match-adjacent", "selection", "ucl", "atletico", "cubarsi", "second-leg"],
    },
    {
      id: "one-opponent-four-days-two-truths",
      title: "One opponent, four days, two different truths",
      assignmentTitle: "One opponent, four days, two different truths",
      owner: "editor-in-chief",
      baseScore: 74,
      editorialWeight: 2,
      minSourceFamilies: 2,
      requiredKeywordGroups: [["atletico", "atlético"], ["0 - 2", "1 - 2", "2 - 0", "2-0", "same opponent", "league meeting", "champions league", "scoreline", "split-screen"]],
      keywords: ["atletico madrid", "atlético madrid", "0 - 2", "1 - 2", "2 - 0", "2-0", "barcelona", "same opponent", "league meeting", "champions league", "scoreline", "split-screen"],
      summary:
        "The contrast between the recent Atlético meetings gives the desk a clean split-screen angle on why the same opponent produced different Barcelona performances.",
      brief:
        "Compare the recent Atlético meetings to explain what changed in game state, control, and threat rather than writing another generic reaction piece.",
      assignmentTopic: "Atlético Madrid split-screen / league and European meetings",
      tags: ["match-context", "atletico", "comparison", "ucl", "laliga"],
    },
    {
      id: "espanyol-between-the-legs",
      title: "Espanyol between the legs is the real selection test",
      assignmentTitle: "Espanyol between the legs",
      owner: "editor-in-chief",
      baseScore: 76,
      editorialWeight: 4,
      minSourceFamilies: 2,
      requiredKeywords: ["espanyol", "derby"],
      keywords: ["espanyol", "pedri", "frenkie", "de jong", "hamstring", "training", "play vs. espanyol", "rotation", "derby"],
      summary:
        "The derby now sits between the Atlético legs, and the strongest live signals revolve around who is fit enough to start, manage minutes, or be protected before Madrid.",
      brief:
        "Frame Espanyol as the real selection problem between Champions League legs: who can start, who should be protected, and what the derby means for the title race and Madrid return.",
      assignmentTopic: "Espanyol vs Barcelona / rotation and fitness before Atlético second leg",
      tags: ["derby", "rotation", "fitness", "pedri", "frenkie", "espanyol"],
    },
    {
      id: "first-goal-in-madrid-changes-the-tie",
      title: "The first goal in Madrid changes everything",
      assignmentTitle: "The first goal in Madrid",
      owner: "editor-in-chief",
      baseScore: 70,
      editorialWeight: 3,
      minSourceFamilies: 2,
      requiredKeywordGroups: [["first goal", "not over", "comeback", "possible"], ["return leg", "second leg", "metropolitano", "atletico", "atlético"]],
      keywords: ["not over", "return leg", "comeback", "possible", "first goal", "second leg", "metropolitano", "atletico", "atlético"],
      summary:
        "Belief discourse is strong, but the usable football version of it is simple: the first goal at the Metropolitano radically changes how the tie will feel and be played.",
      brief:
        "Strip the comeback talk down to football terms: what the first goal does to the tie, to Barcelona's risk profile, and to Atlético's game management.",
      assignmentTopic: "Atlético Madrid vs Barcelona second leg / first-goal leverage",
      tags: ["second-leg", "comeback", "game-state", "ucl"],
    },
    {
      id: "territory-without-punch",
      title: "Territory without punch is still Barça's problem",
      assignmentTitle: "Territory without punch",
      owner: "editor-in-chief",
      baseScore: 75,
      editorialWeight: 3,
      minSourceFamilies: 2,
      keywords: ["14 shots", "2 on target", "64.5", "9 corners", "rashford", "olmo", "attack", "chance", "threat", "possession"],
      summary:
        "The strongest attack angle is not vague frustration but the gap between Barcelona's territory and the lack of decisive threat after the red card and broken attacking sequences.",
      brief:
        "Use the shot, on-target, and possession context to explain why Barcelona owned territory without creating enough punch, and connect it to the attack discussion around Olmo and Rashford.",
      assignmentTopic: "Barcelona attack after Atlético / possession without decisive threat",
      tags: ["attack", "tactics", "olmo", "rashford", "shots", "possession"],
    },
    {
      id: "femeni-bayern-pulse",
      title: "Femení's Bayern pulse is already building",
      assignmentTitle: "Femení Bayern pulse",
      owner: "editor-in-chief",
      baseScore: 68,
      editorialWeight: 3,
      minSourceFamilies: 2,
      requiredKeywordGroups: [
        ["femeni", "femení", "barcelona women", "barça women", "aitana", "alexia"],
        ["bayern", "champions league", "semi-final", "semifinal", "uwcl"],
      ],
      keywords: [
        "femeni",
        "femení",
        "barcelona women",
        "barça women",
        "aitana",
        "alexia",
        "patri",
        "claudia pina",
        "salma",
        "bayern",
        "champions league",
        "semi-final",
        "semifinal",
        "uwcl",
      ],
      summary:
        "The scout now keeps a live eye on Femení too, and the cleanest current angle is how official club signals and community chatter are already converging on the Bayern benchmark.",
      brief:
        "Use official Femení reporting, trusted X, and community chatter to frame why the Bayern meeting is the next real football test and which players are setting the tone for it.",
      assignmentTopic: "FC Barcelona Femení / Bayern / Champions League pulse",
      tags: ["femeni", "women", "aitana", "alexia", "bayern", "uwcl"],
    },
    {
      id: "keep-cubarsi-blame-in-proportion",
      title: "Keep Cubarsí blame in proportion",
      assignmentTitle: "Keep Cubarsí blame in proportion",
      owner: "editor-in-chief",
      baseScore: 62,
      editorialWeight: 1,
      minSourceFamilies: 2,
      keywords: ["cubarsi", "support him", "blame", "frustrated", "not over", "second leg"],
      summary:
        "The live reaction around Cubarsí is real, but the usable editorial angle is proportion: what belongs to the red card, what belongs to the broader game, and how supporters are framing him.",
      brief:
        "Keep the Cubarsí conversation measured: separate the sending-off from the wider performance and explain why the blame story should stay in proportion.",
      assignmentTopic: "Pau Cubarsí red card / supporter response",
      tags: ["cubarsi", "supporter", "perspective", "ucl"],
    },
  ];

  const candidates = [];

  for (const definition of definitions) {
    const evidence = collectThemeEvidence(definition, evidencePool);
    const sourceFamilies = new Set(evidence.map((item) => item.family));

    if (evidence.length === 0 || sourceFamilies.size < definition.minSourceFamilies) {
      continue;
    }

    const priorityScore = scoreCandidate(definition, evidence);
    const imageLead = pickImageLead(evidence);
    candidates.push({
      id: definition.id,
      title: definition.title,
      summary: definition.summary,
      eventAt: latestEventAt(evidence, now),
      signalType: "match",
      urgency: urgencyFromScore(priorityScore),
      tags: definition.tags,
      priorityScore,
      priorityReason: buildPriorityReason(evidence, sourceMetaById),
      assignmentTopic: definition.assignmentTopic,
      assignmentSuggestion: buildAssignmentSuggestion(definition, priorityScore, now),
      evidence: candidateEvidenceRecords(evidence),
      imageStatus: imageLead?.status ?? "needs-generation",
      imageLead,
      _evidenceItems: evidence,
      _editorialWeight: definition.editorialWeight ?? 0,
    });
  }

  return candidates.sort(
    (left, right) =>
      right.priorityScore - left.priorityScore ||
      right._editorialWeight - left._editorialWeight ||
      Date.parse(right.eventAt) - Date.parse(left.eventAt),
  );
}

async function safeSourceRun(definition, runner, fetchedAt = new Date().toISOString()) {
  try {
    const { detail, items } = await runner();
    const freshItems = filterFreshEvidence(items, fetchedAt);
    return {
      source: definition.source,
      family: definition.family,
      label: definition.label,
      target: definition.target,
      ok: true,
      fetchedAt,
      itemCount: freshItems.length,
      detail,
      items: freshItems,
    };
  } catch (error) {
    return {
      source: definition.source,
      family: definition.family,
      label: definition.label,
      target: definition.target,
      ok: false,
      fetchedAt,
      itemCount: 0,
      detail: "Source unavailable during this scout run.",
      error: error instanceof Error ? error.message : String(error),
      items: [],
    };
  }
}

const THEME_STOP_WORDS = new Set([
  "barcelona",
  "barca",
  "fc",
  "club",
  "team",
  "match",
  "matches",
  "game",
  "games",
  "week",
  "ahead",
  "before",
  "after",
  "against",
  "from",
  "with",
  "into",
  "the",
  "for",
  "are",
  "this",
  "that",
  "still",
  "already",
  "current",
  "live",
  "watch",
  "report",
  "reporting",
  "via",
  "jina",
  "today",
  "tomorrow",
  "first",
  "second",
  "third",
  "official",
  "trusted",
  "news",
  "result",
  "results",
  "context",
  "prepares",
  "prepare",
  "preparing",
  "continues",
  "continue",
  "builds",
  "build",
  "around",
  "line",
  "tone",
  "talk",
  "turns",
  "feels",
  "league",
  "laliga",
  "uefa",
  "quarter",
  "quarterfinal",
  "quarterfinals",
  "semi",
  "final",
  "semifinal",
  "and",
  "coach",
  "says",
  "said",
  "press",
  "conference",
  "mixed",
  "zone",
  "manage",
  "manages",
  "management",
  "minute",
  "minutes",
  "ready",
  "enough",
  "month",
  "biggest",
  "test",
  "joins",
  "group",
  "parts",
  "training",
]);

const THEME_TOKEN_ALIASES = {
  atleti: "atletico",
  femeni: "femeni",
  bonmati: "aitana",
  putellas: "alexia",
  jong: "frenkie",
  uwcl: "uwcl",
  availability: "selection",
  transcript: "presser",
  presser: "presser",
};

const BRIDGE_THEME_TOKENS = new Set([
  "espanyol",
  "atletico",

  "pedri",
  "frenkie",
  "olmo",
  "rashford",
  "lewandowski",
  "lamine",
  "aitana",
  "alexia",
  "patri",
  "bayern",
  "femeni",
  "second-leg",
  "red-card",
  "rotation",
  "fitness",
  "selection",
  "derby",
  "shots",
  "possession",
  "champions-league",
  "uwcl",
]);

function normalizeThemeText(value) {
  return compactText(String(value ?? ""))
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, " ");
}

function sourceRoleForScoutSource({ source = "", family = "" } = {}) {
  if (family === "reddit" || source.startsWith("reddit:")) {
    return "chatter";
  }
  if (family === "official" || source.includes("official-club") || source.startsWith("web:fcbarcelona")) {
    return "official";
  }
  if (family === "news" || source.startsWith("x:trusted") || source.startsWith("rss:google-news") || source.startsWith("web:espn")) {
    return "trusted";
  }
  return "reference";
}

function countEvidenceRoles(evidenceItems, sourceMetaById) {
  return evidenceItems.reduce(
    (counts, item) => {
      const sourceRole = sourceRoleForScoutSource({
        source: item.source,
        family: sourceMetaById.get(item.source)?.family ?? item.family,
      });
      counts[sourceRole] += 1;
      return counts;
    },
    {
      official: 0,
      trusted: 0,
      chatter: 0,
      reference: 0,
    },
  );
}

function isWomenThemeCandidate(candidate) {
  const context = normalizeThemeText([candidate.title, candidate.summary, candidate.assignmentTopic, candidate.tags.join(" ")].join(" "));
  return /femeni|women|aitana|alexia|patri|claudia pina|salma|pajor|bayern|uwcl/.test(context);
}

function buildCandidateCalibration(candidate, sourceMetaById) {
  const evidenceCounts = countEvidenceRoles(candidate._evidenceItems, sourceMetaById);
  const trustedBackfill = evidenceCounts.official + evidenceCounts.trusted;
  const sourceFamilyCount = new Set(candidate._evidenceItems.map((item) => item.family)).size;
  const womenTheme = isWomenThemeCandidate(candidate);
  const needsWomenDepth = womenTheme && trustedBackfill < 2;
  const needsTrustedConfirmation = trustedBackfill === 0 || evidenceCounts.chatter > trustedBackfill;
  const singlePlatform = sourceFamilyCount <= 1;

  let label = "mixed";
  let note = "Theme has usable corroboration, but the evidence mix is still uneven.";

  if (womenTheme && needsWomenDepth) {
    label = "women-gap";
    note = "Femení chatter is live, but the trusted bench is still shallow for a confident promotion.";
  } else if (needsTrustedConfirmation) {
    label = "needs-trusted-check";
    note = "Chatter is outrunning trusted confirmation here; add another corroboration pass before leaning on it.";
  } else if (singlePlatform) {
    label = "single-platform";
    note = "This theme is only showing on one lane so far, so treat it as provisional.";
  } else if (trustedBackfill >= evidenceCounts.chatter) {
    label = "well-backed";
    note = "Official, trusted, and community evidence are all pointing at the same football consequence.";
  }

  return {
    label,
    note,
    officialEvidenceCount: evidenceCounts.official,
    trustedEvidenceCount: evidenceCounts.trusted,
    chatterEvidenceCount: evidenceCounts.chatter,
    referenceEvidenceCount: evidenceCounts.reference,
    sourceFamilyCount,
    crossPlatform: sourceFamilyCount > 1,
    needsTrustedConfirmation,
    needsWomenDepth,
  };
}

function buildThemeTokens(item) {
  const text = normalizeThemeText(`${item.label} ${item.text}`);
  const tokens = new Set();

  const phraseTokens = [
    ["second-leg", [/\bsecond leg\b/, /\breturn leg\b/]],
    ["red-card", [/\bred card\b/]],
    ["title-race", [/\btitle race\b/]],
    ["champions-league", [/\bchampions league\b/]],
    ["selection", [/\blineup\b/, /\bline-up\b/, /\bselection\b/, /\bminutes\b/, /\bavailable\b/]],
    ["fitness", [/\bfitness\b/, /\bfit enough\b/, /\bfit\b/]],
    ["presser", [/\bpress conference\b/, /\bmixed zone\b/]],
    ["frenkie", [/\bfrenkie de jong\b/, /\bde jong\b/]],
    ["cubarsi", [/\bpau cubarsi\b/]],
    ["aitana", [/\baitana bonmati\b/]],
    ["alexia", [/\balexia putellas\b/]],
    ["claudia-pina", [/\bclaudia pina\b/]],
  ];

  for (const [token, patterns] of phraseTokens) {
    if (patterns.some((pattern) => pattern.test(text))) {
      tokens.add(token);
    }
  }

  for (const match of text.matchAll(/\b\d+\s*-\s*\d+\b/g)) {
    tokens.add(`score-${match[0].replace(/\s+/g, "")}`);
  }

  for (const rawWord of text.replace(/[^a-z0-9\s-]+/g, " ").split(/\s+/)) {
    const word = THEME_TOKEN_ALIASES[rawWord] ?? rawWord;
    if (!word || word.length < 3 || THEME_STOP_WORDS.has(word)) {
      continue;
    }
    tokens.add(word);
  }

  return tokens;
}

function sharedTokenList(leftTokens, rightTokens) {
  return [...leftTokens].filter((token) => rightTokens.has(token));
}

function buildEvidenceCandidateMap(candidates) {
  const map = new Map();

  for (const candidate of candidates) {
    for (const item of candidate._evidenceItems) {
      const current = map.get(item.id) ?? [];
      current.push(candidate.id);
      map.set(item.id, current);
    }
  }

  return map;
}

function shouldClusterEntries(left, right) {
  const sharedTokens = sharedTokenList(left.tokens, right.tokens);
  const sharedBridgeTokens = sharedTokens.filter((token) => BRIDGE_THEME_TOKENS.has(token));
  const sharedCandidate = left.candidateIds.some((candidateId) => right.candidateIds.includes(candidateId));
  const crossLane = left.item.family !== right.item.family || left.sourceRole !== right.sourceRole;

  if (sharedCandidate && sharedTokens.length >= 1) {
    return true;
  }

  return sharedBridgeTokens.length >= 1 && sharedTokens.length >= 2 && crossLane;
}

function formatThemeTokenLabel(token) {
  if (token === "uwcl") {
    return "UWCL";
  }
  if (token === "femeni") {
    return "Femení";
  }
  return token
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatThemeList(values) {
  if (values.length <= 1) {
    return values[0] ?? "the scout";
  }
  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function describeClusterFamilies(sourceFamilies) {
  const familyLabels = sourceFamilies.map((family) => {
    if (family === "official") return "official club";
    if (family === "news") return "trusted news";
    if (family === "reddit") return "Reddit";
    if (family === "x") return "X";
    return family;
  });
  return `${formatThemeList(familyLabels)} lanes`;
}

function buildClusterTitle(topTokens, candidateIds, candidateMetaById) {
  if (topTokens.includes("espanyol") && (topTokens.includes("pedri") || topTokens.includes("frenkie") || topTokens.includes("selection") || topTokens.includes("fitness"))) {
    return "Espanyol selection squeeze";
  }
  if (topTokens.includes("femeni") && (topTokens.includes("bayern") || topTokens.includes("aitana") || topTokens.includes("alexia"))) {
    return "Femení Bayern pulse";
  }
  if (topTokens.includes("cubarsi") && (topTokens.includes("second-leg") || topTokens.includes("atletico"))) {
    return "Cubarsí second-leg fallout";
  }
  if (topTokens.includes("atletico") && topTokens.includes("second-leg")) {
    return "Atlético second-leg reset";
  }
  if (topTokens.includes("presser") && (topTokens.includes("espanyol") || topTokens.includes("atletico"))) {
    return "Pre-match availability line";
  }
  if (topTokens.includes("rashford") || topTokens.includes("olmo") || topTokens.includes("shots")) {
    return "Attack without punch";
  }
  if (candidateIds.length === 1) {
    return candidateMetaById.get(candidateIds[0])?.assignmentSuggestion?.title ?? candidateMetaById.get(candidateIds[0])?.title ?? candidateIds[0];
  }
  return topTokens.slice(0, 2).map(formatThemeTokenLabel).join(" / ") || "Scout overlap";
}

function buildClusterTheme(title, topTokens, candidateIds, candidateMetaById, sourceFamilies) {
  const familySummary = describeClusterFamilies(sourceFamilies);

  if (title === "Espanyol selection squeeze") {
    return `Selection and availability around Espanyol are now showing up across ${familySummary}.`;
  }
  if (title === "Femení Bayern pulse") {
    return `The Bayern build-up around Barça Femení is now showing up across ${familySummary}.`;
  }
  if (title === "Cubarsí second-leg fallout") {
    return `Cubarsí's suspension fallout for the Atlético return leg is now showing up across ${familySummary}.`;
  }
  if (title === "Atlético second-leg reset") {
    return `Second-leg framing around Atlético is now showing up across ${familySummary}.`;
  }
  if (title === "Attack without punch") {
    return `Barcelona's territory-versus-threat debate is now showing up across ${familySummary}.`;
  }

  const leadCandidate = candidateIds.length === 1 ? candidateMetaById.get(candidateIds[0]) : null;
  if (leadCandidate?.summary) {
    return `${leadCandidate.summary} Cross-lane overlap is now visible across ${familySummary}.`;
  }

  return `${topTokens.slice(0, 3).map(formatThemeTokenLabel).join(", ")} are surfacing together across ${familySummary}.`;
}

function buildClusterHealthLabel(roleCounts, sourceFamilies) {
  const trustedBackfill = roleCounts.official + roleCounts.trusted;

  if (sourceFamilies.length <= 1) {
    return "single-platform";
  }
  if (roleCounts.chatter > 0 && trustedBackfill === 0) {
    return "chatter-heavy";
  }
  if (trustedBackfill > 0 && roleCounts.chatter > 0) {
    return "cross-platform-confirmed";
  }
  if (trustedBackfill > 0) {
    return "trusted-led";
  }
  return "mixed";
}

function buildClusterReviewHint(healthLabel, roleCounts) {
  if (healthLabel === "chatter-heavy") {
    return "Recurring chatter is visible here, but the desk still needs a trusted confirmation lane.";
  }
  if (healthLabel === "single-platform") {
    return "This pattern is only showing on one platform so far; verify before treating it as durable.";
  }
  if (healthLabel === "cross-platform-confirmed") {
    return "Trusted and community lanes overlap here; keep it on the board, but watch for duplicate pitches.";
  }
  if (healthLabel === "trusted-led") {
    return "Trusted context is carrying this cluster; watch whether broader chatter catches up or not.";
  }
  if (roleCounts.reference > 0 && roleCounts.chatter === 0) {
    return "Mostly contextual evidence right now; wait for stronger football consequences before escalating it.";
  }
  return "Useful overlap is forming, but the signal is still thin enough to keep on watch rather than lock in.";
}

function buildThemeClusters(evidencePool, candidates, sourceMetaById) {
  if (evidencePool.length < 2) {
    return [];
  }

  const candidateMetaById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  const candidateIdsByEvidenceId = buildEvidenceCandidateMap(candidates);
  const entries = evidencePool
    .map((item) => ({
      item,
      tokens: buildThemeTokens(item),
      candidateIds: candidateIdsByEvidenceId.get(item.id) ?? [],
      sourceRole: sourceRoleForScoutSource({
        source: item.source,
        family: sourceMetaById.get(item.source)?.family ?? item.family,
      }),
    }))
    .filter((entry) => entry.tokens.size > 0);

  if (entries.length < 2) {
    return [];
  }

  const parents = entries.map((_, index) => index);
  const find = (index) => {
    if (parents[index] !== index) {
      parents[index] = find(parents[index]);
    }
    return parents[index];
  };
  const union = (leftIndex, rightIndex) => {
    const leftRoot = find(leftIndex);
    const rightRoot = find(rightIndex);
    if (leftRoot !== rightRoot) {
      parents[rightRoot] = leftRoot;
    }
  };

  for (let leftIndex = 0; leftIndex < entries.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < entries.length; rightIndex += 1) {
      if (shouldClusterEntries(entries[leftIndex], entries[rightIndex])) {
        union(leftIndex, rightIndex);
      }
    }
  }

  const groupedEntries = new Map();
  entries.forEach((entry, index) => {
    const root = find(index);
    const group = groupedEntries.get(root) ?? [];
    group.push(entry);
    groupedEntries.set(root, group);
  });

  return [...groupedEntries.values()]
    .filter((group) => group.length >= 2)
    .map((group, index) => {
      const items = dedupeBy(
        group.map((entry) => entry.item),
        (item) => item.id,
      );
      const sourceFamilies = [...new Set(group.map((entry) => entry.item.family))].sort();
      const sourceRoles = [...new Set(group.map((entry) => entry.sourceRole))].sort();
      const roleCounts = group.reduce(
        (counts, entry) => {
          counts[entry.sourceRole] += 1;
          return counts;
        },
        {
          official: 0,
          trusted: 0,
          chatter: 0,
          reference: 0,
        },
      );
      const tokenScores = new Map();
      group.forEach((entry) => {
        entry.tokens.forEach((token) => {
          tokenScores.set(token, (tokenScores.get(token) ?? 0) + 1 + (BRIDGE_THEME_TOKENS.has(token) ? 0.5 : 0));
        });
      });
      const topTokens = [...tokenScores.entries()]
        .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
        .slice(0, 5)
        .map(([token]) => token);
      const candidateIds = [...new Set(group.flatMap((entry) => entry.candidateIds))];
      const candidateTitles = candidateIds.map((candidateId) => candidateMetaById.get(candidateId)?.title ?? candidateId);
      const healthLabel = buildClusterHealthLabel(roleCounts, sourceFamilies);
      const title = buildClusterTitle(topTokens, candidateIds, candidateMetaById);
      const imageLead = pickImageLead(items);

      return {
        id: `cluster-${slugify(topTokens.join("-") || `theme-${index + 1}`)}`,
        title,
        theme: buildClusterTheme(title, topTokens, candidateIds, candidateMetaById, sourceFamilies),
        itemCount: items.length,
        sourceFamilies,
        sourceRoles,
        officialEvidenceCount: roleCounts.official,
        trustedEvidenceCount: roleCounts.trusted,
        chatterEvidenceCount: roleCounts.chatter,
        referenceEvidenceCount: roleCounts.reference,
        crossPlatform: sourceFamilies.length > 1,
        healthLabel,
        reviewHint: buildClusterReviewHint(healthLabel, roleCounts),
        candidateIds,
        candidateTitles,
        topTokens,
        representativeEvidence: candidateEvidenceRecords(sortEvidenceForCandidate(items).slice(0, 3)),
        imageStatus: imageLead?.status ?? "needs-generation",
        imageLead,
      };
    })
    .sort(
      (left, right) =>
        Number(right.crossPlatform) - Number(left.crossPlatform) ||
        right.itemCount - left.itemCount ||
        right.candidateIds.length - left.candidateIds.length ||
        left.title.localeCompare(right.title),
    )
    .slice(0, 12);
}

function buildSourceStatuses(results, candidates, previousArtifact) {
  const previousStatusesBySource = new Map((previousArtifact?.sourceStatuses ?? []).map((status) => [status.source, status]));

  return results.map((result) => {
    const contributionItems = dedupeBy(
      candidates.flatMap((candidate) => candidate._evidenceItems.filter((item) => item.source === result.source)),
      (item) => item.id,
    );
    const matchedCandidates = candidates.filter((candidate) => candidate._evidenceItems.some((item) => item.source === result.source));
    const previousStatus = previousStatusesBySource.get(result.source);
    const contributionEfficiency = result.itemCount ? Number((contributionItems.length / result.itemCount).toFixed(2)) : 0;
    const repeatLowSignal = result.itemCount > 0 && contributionItems.length === 0 && (previousStatus?.contributionCount ?? 0) === 0 && (previousStatus?.itemCount ?? 0) > 0;
    const imageLeadCount = result.items.filter((item) => item.image).length;

    let qualityLabel = "watch";
    if (!result.ok || (result.itemCount > 0 && contributionItems.length === 0)) {
      qualityLabel = "quiet";
    } else if (contributionEfficiency >= 0.75 || contributionItems.length >= 2) {
      qualityLabel = "core";
    } else if (contributionItems.length > 0) {
      qualityLabel = "useful";
    }

    return {
      source: result.source,
      family: result.family,
      label: result.label,
      target: result.target,
      ok: result.ok,
      fetchedAt: result.fetchedAt,
      itemCount: result.itemCount,
      detail: result.detail,
      error: result.error,
      sourceRole: sourceRoleForScoutSource(result),
      sampleItems: result.items.slice(0, 3).map((item) => item.label),
      contributionCount: contributionItems.length,
      contributionEfficiency,
      contributionSample: contributionItems.slice(0, 3).map((item) => item.label),
      matchedCandidateIds: matchedCandidates.map((candidate) => candidate.id),
      matchedCandidateTitles: matchedCandidates.map((candidate) => candidate.title),
      qualityLabel,
      repeatLowSignal,
      imageLeadCount,
    };
  });
}

function buildQualitySummary(evidencePool, sourceStatuses, candidates, themeClusters) {
  const trustedBackedCandidateCount = candidates.filter(
    (candidate) => candidate.calibration.officialEvidenceCount + candidate.calibration.trustedEvidenceCount > 0,
  ).length;
  const chatterHeavyCandidateCount = candidates.filter((candidate) => candidate.calibration.label === "needs-trusted-check").length;
  const womenCoverageGapCount = candidates.filter((candidate) => candidate.calibration.needsWomenDepth).length;
  const weakSourceCount = sourceStatuses.filter((status) => status.qualityLabel === "quiet" || status.repeatLowSignal).length;

  let headline = `${trustedBackedCandidateCount} of ${candidates.length} live theme(s) already have trusted or official backing.`;
  if (chatterHeavyCandidateCount > 0) {
    headline += ` ${chatterHeavyCandidateCount} theme(s) still lean too hard on chatter.`;
  }
  if (womenCoverageGapCount > 0) {
    headline += ` ${womenCoverageGapCount} Femení angle(s) want deeper trusted depth.`;
  }
  if (weakSourceCount > 0) {
    headline += ` ${weakSourceCount} source lane(s) stayed quiet.`;
  }
  if (!candidates.length) {
    headline = weakSourceCount > 0 ? `${weakSourceCount} source lane(s) fetched, but no durable candidate theme emerged.` : "No durable scout themes emerged from this run.";
  }

  return {
    headline,
    evidenceCount: evidencePool.length,
    sourceCount: sourceStatuses.length,
    healthySourceCount: sourceStatuses.filter((status) => status.ok).length,
    candidateCount: candidates.length,
    clusterCount: themeClusters.length,
    crossPlatformClusterCount: themeClusters.filter((cluster) => cluster.crossPlatform).length,
    trustedBackedCandidateCount,
    chatterHeavyCandidateCount,
    womenCoverageGapCount,
    weakSourceCount,
  };
}

function buildCoverageSummary(candidates, themeClusters, sourceStatuses, sourceMetaById) {
  const tracks = [
    {
      id: "men",
      label: "Men's team",
      candidates: candidates.filter((candidate) => !isWomenThemeCandidate(candidate)),
    },
    {
      id: "women",
      label: "Femení",
      candidates: candidates.filter((candidate) => isWomenThemeCandidate(candidate)),
    },
  ]
    .map((track) => {
      const evidenceItems = dedupeBy(
        track.candidates.flatMap((candidate) => candidate._evidenceItems),
        (item) => item.id,
      );
      const roleCounts = countEvidenceRoles(evidenceItems, sourceMetaById);

      if (!track.candidates.length && evidenceItems.length === 0) {
        return null;
      }

      let note = `${track.label} has ${track.candidates.length} candidate theme(s) in play.`;
      if (track.id === "women" && roleCounts.official + roleCounts.trusted < 2 && track.candidates.length) {
        note = "A Femení angle is live, but another trusted confirmation lane would help.";
      } else if (roleCounts.chatter > 0 && roleCounts.official + roleCounts.trusted > 0) {
        note = "Trusted and community evidence are both contributing usable signal here.";
      }

      return {
        id: track.id,
        label: track.label,
        candidateCount: track.candidates.length,
        officialEvidenceCount: roleCounts.official,
        trustedEvidenceCount: roleCounts.trusted,
        chatterEvidenceCount: roleCounts.chatter,
        note,
      };
    })
    .filter(Boolean);

  const weakSpots = [];
  if (tracks.some((track) => track.id === "women" && track.trustedEvidenceCount + track.officialEvidenceCount < 2 && track.candidateCount > 0)) {
    weakSpots.push("Femení themes are visible, but trusted depth is still thin.");
  }
  if (themeClusters.some((cluster) => cluster.healthLabel === "single-platform")) {
    weakSpots.push("At least one cluster only appears on a single platform so far.");
  }
  if (sourceStatuses.some((status) => status.qualityLabel === "quiet" || status.repeatLowSignal)) {
    weakSpots.push("One or more source lanes produced little or no usable Barça evidence this run.");
  }
  if (!weakSpots.length) {
    weakSpots.push("No acute pipeline gaps stood out in this scout run.");
  }

  return {
    tracks,
    weakSpots,
  };
}

function buildCalibrationPrompts(candidates, themeClusters, sourceStatuses) {
  const prompts = [];

  for (const candidate of candidates) {
    const candidateSourceIds = [...new Set(candidate._evidenceItems.map((item) => item.source))];

    if (candidate.calibration.needsTrustedConfirmation) {
      prompts.push({
        id: `prompt-${candidate.id}-trusted-check`,
        kind: "candidate-needs-trusted-confirmation",
        priority: "high",
        title: `${candidate.title} needs trusted confirmation`,
        summary: `${candidate.calibration.chatterEvidenceCount} chatter item(s) are outrunning ${candidate.calibration.officialEvidenceCount + candidate.calibration.trustedEvidenceCount} trusted/official corroboration lane(s).`,
        action: "Run one more trusted confirmation pass before this theme graduates from watchlist to assignment default.",
        candidateIds: [candidate.id],
        clusterIds: [],
        sourceIds: candidateSourceIds,
      });
    }

    if (candidate.calibration.needsWomenDepth) {
      prompts.push({
        id: `prompt-${candidate.id}-women-gap`,
        kind: "women-coverage-gap",
        priority: "high",
        title: `Femení trusted depth is thin for ${candidate.title}`,
        summary: "A women's-team angle is visible, but the scout still leans too heavily on club copy and chatter instead of deeper corroboration.",
        action: "Add another trusted Femení lane so the next run can confirm the theme without leaning on Reddit alone.",
        candidateIds: [candidate.id],
        clusterIds: [],
        sourceIds: candidateSourceIds,
      });
    }
  }

  for (const cluster of themeClusters) {
    if (cluster.healthLabel === "single-platform") {
      prompts.push({
        id: `prompt-${cluster.id}-single-platform`,
        kind: "single-platform-cluster",
        priority: "medium",
        title: `${cluster.title} is only showing on one platform`,
        summary: "The overlap is real inside one lane, but it has not crossed into another source family yet.",
        action: "Treat this as a watch item until a second platform or trusted source echoes it.",
        candidateIds: cluster.candidateIds,
        clusterIds: [cluster.id],
        sourceIds: [],
      });
    }

    if (cluster.healthLabel === "chatter-heavy") {
      prompts.push({
        id: `prompt-${cluster.id}-cluster-trusted-check`,
        kind: "cluster-needs-trusted-check",
        priority: "high",
        title: `${cluster.title} is recurring without trusted backing`,
        summary: "Reddit/X overlap is visible, but the cluster still lacks trusted or official confirmation.",
        action: "Add a trusted corroboration search keyed to this cluster before using it to seed another assignment.",
        candidateIds: cluster.candidateIds,
        clusterIds: [cluster.id],
        sourceIds: [],
      });
    }

    if (cluster.candidateIds.length > 1) {
      prompts.push({
        id: `prompt-${cluster.id}-duplicate-pitch`,
        kind: "duplicate-theme-cluster",
        priority: "medium",
        title: `${cluster.title} is feeding multiple candidate pitches`,
        summary: "More than one candidate is drawing from the same evidence cluster, so the desk may be splitting one theme into duplicates.",
        action: "Decide whether to merge the candidate angles or sharpen their distinctions before the next ingest cycle.",
        candidateIds: cluster.candidateIds,
        clusterIds: [cluster.id],
        sourceIds: [],
      });
    }
  }

  for (const status of sourceStatuses) {
    if (status.repeatLowSignal || (status.ok && status.itemCount > 0 && status.contributionCount === 0)) {
      prompts.push({
        id: `prompt-${slugify(status.source)}-source-gap`,
        kind: "source-quality-gap",
        priority: status.repeatLowSignal ? "high" : "medium",
        title: `${status.label} is quiet against the live themes`,
        summary: `${status.itemCount} fetched item(s) produced no usable candidate evidence${status.repeatLowSignal ? " for a second straight run" : ""}.`,
        action: "Retune the query, narrow the keywords, or replace the lane if it stays quiet again.",
        candidateIds: [],
        clusterIds: [],
        sourceIds: [status.source],
      });
    }
  }

  return prompts;
}

function buildImageSummary(candidates, themeClusters) {
  const imageStatuses = [...candidates.map((candidate) => candidate.imageStatus), ...themeClusters.map((cluster) => cluster.imageStatus)];
  return {
    candidateLeadCount: candidates.filter((candidate) => candidate.imageLead).length,
    clusterLeadCount: themeClusters.filter((cluster) => cluster.imageLead).length,
    reviewNeededCount: imageStatuses.filter((status) => status === "review-needed-social-preview").length,
    replacementNeededCount: imageStatuses.filter((status) => status === "needs-free-license-replacement").length,
    missingCount: candidates.filter((candidate) => candidate.imageStatus === "needs-generation").length,
  };
}

function buildFeedbackSummary(operatorFeedback = []) {
  const targetTypeCounts = {
    candidate: 0,
    cluster: 0,
    "source-lane": 0,
    "general-strategy-note": 0,
  };
  const verdictCounts = {};

  operatorFeedback.forEach((entry) => {
    targetTypeCounts[entry.targetType] += 1;
    verdictCounts[entry.verdict] = (verdictCounts[entry.verdict] ?? 0) + 1;
  });

  return {
    entryCount: operatorFeedback.length,
    targetTypeCounts,
    verdictCounts,
    recentEntries: [...operatorFeedback]
      .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
      .slice(0, 8),
  };
}

function buildSourceExpansionSuggestions(calibrationPrompts, candidates, themeClusters, sourceStatuses) {
  const suggestions = [];

  if (candidates.some((candidate) => candidate.calibration.needsWomenDepth)) {
    suggestions.push({
      id: "suggestion-femeni-depth",
      title: "Add another trusted Femení corroboration lane",
      summary: "Women's themes are visible, but the trusted bench can still be deeper.",
      rationale: "A second non-club corroboration lane reduces overreliance on Reddit when Femení chatter spikes.",
      suggestedSourceFamilies: ["x", "news"],
      exampleTargets: [
        "from:TheAthleticFC OR from:ESPNFC (Aitana OR Alexia OR Bayern OR Femeni)",
        "https://news.google.com/rss/search?q=Barcelona%20Women%20Aitana%20Alexia%20Bayern",
      ],
      relatedPromptIds: calibrationPrompts.filter((prompt) => prompt.kind === "women-coverage-gap").map((prompt) => prompt.id),
    });
  }

  const chatterGapCluster = themeClusters.find((cluster) => cluster.healthLabel === "chatter-heavy");
  if (chatterGapCluster) {
    const searchTerms = chatterGapCluster.topTokens.slice(0, 3).join(" OR ") || "Barcelona";
    suggestions.push({
      id: "suggestion-trusted-confirmation-pass",
      title: `Add a trusted confirmation lane for ${chatterGapCluster.title}`,
      summary: "Cross-platform chatter is there, but the next scout pass needs a stronger trusted checkpoint.",
      rationale: "When Reddit/X overlap outruns corroboration, another trusted query is cheaper than promoting a weak theme into the newsroom queue.",
      suggestedSourceFamilies: ["x", "news"],
      exampleTargets: [
        `from:TheAthleticFC OR from:ESPNFC (${searchTerms})`,
        `https://news.google.com/rss/search?q=${encodeURIComponent(`Barcelona ${chatterGapCluster.topTokens.slice(0, 3).join(" ")}`)}`,
      ],
      relatedPromptIds: calibrationPrompts.filter((prompt) => prompt.kind === "cluster-needs-trusted-check").map((prompt) => prompt.id),
    });
  }

  const quietSources = sourceStatuses.filter((status) => status.qualityLabel === "quiet" || status.repeatLowSignal);
  if (quietSources.length) {
    suggestions.push({
      id: "suggestion-retune-quiet-sources",
      title: "Retune or replace quiet source lanes",
      summary: `${quietSources.length} source lane(s) fetched but did not produce usable scout evidence.`,
      rationale: "Periodic cleanup keeps the ingestion loop from accumulating context sources that never turn into live themes.",
      suggestedSourceFamilies: [...new Set(quietSources.map((status) => status.family))],
      exampleTargets: quietSources.slice(0, 4).map((status) => status.source),
      relatedPromptIds: calibrationPrompts.filter((prompt) => prompt.kind === "source-quality-gap").map((prompt) => prompt.id),
    });
  }

  return dedupeBy(suggestions, (suggestion) => suggestion.id);
}

function buildScoutSources(candidates, now) {
  if (!candidates.length) {
    return [];
  }

  return [
    {
      schemaVersion: 1,
      id: "source-barca-live-scout",
      slug: "barca-live-scout",
      name: "Barca Live Scout",
      type: "watcher",
      enabled: true,
      cadence: "live",
      discoveryMode: "live",
      lastScoutAt: now,
      notes: "Live multi-source Barca scouting feed built from official club feeds, trusted X accounts, filtered Google News RSS, Reddit chatter, and scoreboard context.",
      tags: ["barca", "live", "scout", "trusted-sources", "official", "reddit"],
      pendingEvents: candidates.map((candidate) => ({
        id: candidate.id,
        headline: candidate.title,
        summary: candidate.summary,
        signalType: candidate.signalType,
        eventAt: candidate.eventAt,
        urgency: candidate.urgency,
        tags: candidate.tags,
        priorityScore: candidate.priorityScore,
        priorityReason: candidate.priorityReason,
        assignmentTopic: candidate.assignmentTopic,
        evidence: candidate.evidence,
        assignment: {
          title: candidate.assignmentSuggestion.title,
          kind: candidate.assignmentSuggestion.kind,
          owner: candidate.assignmentSuggestion.owner,
          approver: candidate.assignmentSuggestion.approver,
          deadline: candidate.assignmentSuggestion.deadline,
          brief: candidate.assignmentSuggestion.brief,
          deliverables: candidate.assignmentSuggestion.deliverables,
        },
      })),
    },
  ];
}

export function buildScoutArtifact(results, now = new Date().toISOString(), { previousArtifact, operatorFeedback = [] } = {}) {
  const evidencePool = dedupeBy(
    results.flatMap((result) => result.items),
    (item) => item.id,
  );
  const sourceMetaById = new Map(results.map((result) => [result.source, result]));
  const candidateStates = buildThemeCandidates(evidencePool, now, sourceMetaById).map((candidate) => ({
    ...candidate,
    calibration: buildCandidateCalibration(candidate, sourceMetaById),
  }));
  const sourceStatuses = buildSourceStatuses(results, candidateStates, previousArtifact);
  const themeClusters = buildThemeClusters(evidencePool, candidateStates, sourceMetaById);
  const qualitySummary = buildQualitySummary(evidencePool, sourceStatuses, candidateStates, themeClusters);
  const coverageSummary = buildCoverageSummary(candidateStates, themeClusters, sourceStatuses, sourceMetaById);
  const calibrationPrompts = buildCalibrationPrompts(candidateStates, themeClusters, sourceStatuses);
  const sourceExpansionSuggestions = buildSourceExpansionSuggestions(calibrationPrompts, candidateStates, themeClusters, sourceStatuses);
  const imageSummary = buildImageSummary(candidateStates, themeClusters);
  const feedbackSummary = buildFeedbackSummary(operatorFeedback);
  const candidates = candidateStates.map(({ _evidenceItems, _editorialWeight, ...candidate }) => candidate);

  return {
    schemaVersion: 1,
    generatedAt: now,
    sourceStatuses,
    candidates,
    themeClusters,
    calibrationPrompts,
    sourceExpansionSuggestions,
    qualitySummary,
    coverageSummary,
    imageSummary,
    feedbackSummary,
    sources: buildScoutSources(candidates, now),
  };
}

export async function runScoutDiscovery({
  now = new Date().toISOString(),
  fetchJsonImpl = fetchJson,
  fetchTextImpl = fetchText,
  birdSearchImpl = searchBird,
  listYouTubeVideosImpl = listYouTubeVideos,
  fetchYouTubeTranscriptImpl = fetchYouTubeTranscript,
} = {}) {
  const sourceDefinitions = [
    {
      source: "x:official-club-men",
      family: "x",
      label: "Official club X (men)",
      target:
        "from:FCBarcelona OR from:FCBarcelona_es (Atletico OR Espanyol OR Pedri OR Frenkie OR Cubarsi OR Lamine OR Olmo OR Lewandowski OR Rashford)",
      run: async () => ({
        detail: "Searched official FC Barcelona X accounts for men's-team statements, training, squad, and match-prep signals.",
        items: normalizeBirdTweets(
          await birdSearchImpl(
            "from:FCBarcelona OR from:FCBarcelona_es (Atletico OR Espanyol OR Pedri OR Frenkie OR Cubarsi OR Lamine OR Olmo OR Lewandowski OR Rashford)",
          ),
          "x:official-club-men",
        ),
      }),
    },
    {
      source: "x:official-club-women",
      family: "x",
      label: "FC Barcelona Femení X",
      target: "from:FCBFemeni (Aitana OR Alexia OR Patri OR Claudia Pina OR Salma OR Pajor OR Bayern OR Champions League OR Femeni)",
      run: async () => ({
        detail: "Searched the official FCB Femení X account for line-up, player, and big-match signals.",
        items: normalizeBirdTweets(
          await birdSearchImpl(
            "from:FCBFemeni (Aitana OR Alexia OR Patri OR Claudia Pina OR Salma OR Pajor OR Bayern OR Champions League OR Femeni)",
          ),
          "x:official-club-women",
        ),
      }),
    },
    {
      source: "x:trusted-football-media",
      family: "x",
      label: "Trusted football media X",
      target: "from:TheAthleticFC OR from:ESPNFC (Barcelona OR Barca OR Barça OR Espanyol OR Atletico OR Pedri OR Frenkie OR Aitana OR Alexia OR Bayern OR Femeni)",
      run: async () => ({
        detail: "Searched trusted football publication X accounts for Barça and Femení reporting without fan-account relay noise.",
        items: normalizeBirdTweets(
          await birdSearchImpl(
            "from:TheAthleticFC OR from:ESPNFC (Barcelona OR Barca OR Barça OR Espanyol OR Atletico OR Pedri OR Frenkie OR Aitana OR Alexia OR Bayern OR Femeni)",
          ),
          "x:trusted-football-media",
        ),
      }),
    },
    {
      source: "x:trusted-football-stats",
      family: "x",
      label: "Trusted football stats X",
      target: "from:OptaJose (Barcelona OR Barça OR Espanyol OR Atletico OR Pedri OR Aitana OR Bayern OR Champions League)",
      run: async () => ({
        detail: "Searched trusted football stats X for hard-context Barça and Femení numbers.",
        items: normalizeBirdTweets(
          await birdSearchImpl(
            "from:OptaJose (Barcelona OR Barça OR Espanyol OR Atletico OR Pedri OR Aitana OR Bayern OR Champions League)",
          ),
          "x:trusted-football-stats",
        ),
      }),
    },
    {
      source: "reddit:r/Barca:new",
      family: "reddit",
      label: "Reddit /r/Barca new",
      target: "https://www.reddit.com/r/Barca/new.json?limit=8&raw_json=1",
      run: async () => ({
        detail: "Pulled /r/Barca new posts for fresh supporter chatter around the current match week.",
        items: normalizeRedditPosts(await fetchJsonImpl("https://www.reddit.com/r/Barca/new.json?limit=8&raw_json=1"), "reddit:r/Barca:new"),
      }),
    },
    {
      source: "reddit:r/Barca:top-week",
      family: "reddit",
      label: "Reddit /r/Barca top of week",
      target: "https://www.reddit.com/r/Barca/top.json?sort=top&t=week&limit=8&raw_json=1",
      run: async () => ({
        detail: "Pulled /r/Barca top-of-week posts for supporter themes that kept holding resonance.",
        items: normalizeRedditPosts(
          await fetchJsonImpl("https://www.reddit.com/r/Barca/top.json?sort=top&t=week&limit=8&raw_json=1"),
          "reddit:r/Barca:top-week",
        ),
      }),
    },
    {
      source: "reddit:r/soccer:barca-search",
      family: "reddit",
      label: "Reddit /r/soccer Barça search",
      target: "https://www.reddit.com/r/soccer/search.json?q=Barcelona%20Atletico%20Espanyol%20Aitana&restrict_sr=1&sort=new&t=week&limit=8&raw_json=1",
      run: async () => ({
        detail: "Pulled targeted /r/soccer search results for broader football chatter around Barça's live topics.",
        items: normalizeRedditPosts(
          await fetchJsonImpl(
            "https://www.reddit.com/r/soccer/search.json?q=Barcelona%20Atletico%20Espanyol%20Aitana&restrict_sr=1&sort=new&t=week&limit=8&raw_json=1",
          ),
          "reddit:r/soccer:barca-search",
        ),
      }),
    },
    {
      source: "reddit:r/FCBFemeni:new",
      family: "reddit",
      label: "Reddit /r/FCBFemeni new",
      target: "https://www.reddit.com/r/FCBFemeni/new.json?limit=8&raw_json=1",
      run: async () => ({
        detail: "Pulled /r/FCBFemeni new posts for current women's-team chatter and angle discovery.",
        items: normalizeRedditPosts(await fetchJsonImpl("https://www.reddit.com/r/FCBFemeni/new.json?limit=8&raw_json=1"), "reddit:r/FCBFemeni:new"),
      }),
    },
    {
      source: "reddit:r/WomensSoccer:barca-search",
      family: "reddit",
      label: "Reddit /r/WomensSoccer Barça search",
      target: "https://www.reddit.com/r/WomensSoccer/search.json?q=Barcelona%20Women%20Aitana%20Bayern&restrict_sr=1&sort=new&t=month&limit=8&raw_json=1",
      run: async () => ({
        detail: "Pulled targeted /r/WomensSoccer search results for broader women's-football chatter when Barça Femení spikes.",
        items: normalizeRedditPosts(
          await fetchJsonImpl(
            "https://www.reddit.com/r/WomensSoccer/search.json?q=Barcelona%20Women%20Aitana%20Bayern&restrict_sr=1&sort=new&t=month&limit=8&raw_json=1",
          ),
          "reddit:r/WomensSoccer:barca-search",
        ),
      }),
    },
    {
      source: "web:fcbarcelona-news",
      family: "official",
      label: "FC Barcelona first-team news via Jina",
      target: OFFICIAL_SITE_NEWS_URL,
      run: async () => ({
        detail: "Checked official FC Barcelona first-team news via Jina for training, squad, and match-preview updates.",
        items: normalizeWebLines(
          extractRelevantLines(await fetchTextImpl(OFFICIAL_SITE_NEWS_URL), [
            "espanyol",
            "atletico",
            "atlético",
            "pedri",
            "frenkie",
            "de jong",
            "cubarsi",
            "yamal",
            "olmo",
            "lewandowski",
            "rashford",
            "training",
            "derby",
            "return leg",
            "second leg",
            "preview",
            "squad",
          ]),
          "web:fcbarcelona-news",
          OFFICIAL_SITE_NEWS_URL,
          "official",
          now,
        ),
      }),
    },
    {
      source: "web:fcbarcelona-results",
      family: "official",
      label: "FC Barcelona results via Jina",
      target: OFFICIAL_SITE_RESULTS_URL,
      run: async () => ({
        detail: "Checked official FC Barcelona results via Jina for recent scoreline and opponent context.",
        items: normalizeWebLines(
          extractRelevantLines(await fetchTextImpl(OFFICIAL_SITE_RESULTS_URL), ["barcelona", "espanyol", "atletico", "atlético", "result"], {
            limit: 6,
            minLength: 10,
          }),
          "web:fcbarcelona-results",
          OFFICIAL_SITE_RESULTS_URL,
          "official",
          now,
        ),
      }),
    },
    {
      source: "web:fcbarcelona-squad",
      family: "official",
      label: "FC Barcelona squad via Jina",
      target: OFFICIAL_SITE_SQUAD_URL,
      run: async () => ({
        detail: "Checked official FC Barcelona squad page via Jina for player-reference context around the live watchlist.",
        items: normalizeWebLines(
          extractRelevantLines(
            await fetchTextImpl(OFFICIAL_SITE_SQUAD_URL),
            ["pedri", "frenkie", "de jong", "lamine", "yamal", "olmo", "lewandowski", "cubarsi", "rashford"],
            { limit: 4, minLength: 8 },
          ),
          "web:fcbarcelona-squad",
          OFFICIAL_SITE_SQUAD_URL,
          "official",
          now,
        ),
      }),
    },
    {
      source: "web:fcbarcelona-women-news",
      family: "official",
      label: "FC Barcelona women news via Jina",
      target: OFFICIAL_WOMEN_NEWS_URL,
      run: async () => ({
        detail: "Checked official FC Barcelona women's news via Jina for Femení updates, previews, and player signals.",
        items: normalizeWebLines(
          extractRelevantLines(await fetchTextImpl(OFFICIAL_WOMEN_NEWS_URL), [
            "femeni",
            "femení",
            "barcelona women",
            "barça women",
            "aitana",
            "alexia",
            "patri",
            "claudia pina",
            "salma",
            "pajor",
            "bayern",
            "champions league",
            "uwcl",
            "semi-final",
            "semifinal",
            "preview",
          ]),
          "web:fcbarcelona-women-news",
          OFFICIAL_WOMEN_NEWS_URL,
          "official",
          now,
        ),
      }),
    },
    {
      source: "web:fcbarcelona-women-results",
      family: "official",
      label: "FC Barcelona women results via Jina",
      target: OFFICIAL_WOMEN_RESULTS_URL,
      run: async () => ({
        detail: "Checked official FC Barcelona women's results via Jina for scoreline and opponent context.",
        items: normalizeWebLines(
          extractRelevantLines(await fetchTextImpl(OFFICIAL_WOMEN_RESULTS_URL), ["barcelona women", "aitana", "alexia", "bayern", "chelsea", "liga f", "result"], {
            limit: 6,
            minLength: 10,
          }),
          "web:fcbarcelona-women-results",
          OFFICIAL_WOMEN_RESULTS_URL,
          "official",
          now,
        ),
      }),
    },
    {
      source: "web:fcbarcelona-women-squad",
      family: "official",
      label: "FC Barcelona women squad via Jina",
      target: OFFICIAL_WOMEN_SQUAD_URL,
      run: async () => ({
        detail: "Checked official FC Barcelona women's squad page via Jina for player-reference context around live Femení topics.",
        items: normalizeWebLines(
          extractRelevantLines(
            await fetchTextImpl(OFFICIAL_WOMEN_SQUAD_URL),
            ["aitana", "alexia", "patri", "claudia pina", "salma", "pajor", "femeni", "femení"],
            { limit: 4, minLength: 8 },
          ),
          "web:fcbarcelona-women-squad",
          OFFICIAL_WOMEN_SQUAD_URL,
          "official",
          now,
        ),
      }),
    },
    {
      source: "web:fcbarcelona-men-video-transcripts",
      family: "official",
      label: "FC Barcelona official video transcripts (men)",
      target: OFFICIAL_YOUTUBE_CHANNEL_URL,
      run: async () => ({
        detail: "Scanned recent official FC Barcelona video transcripts for pre-match, presser, and mixed-zone lines around the men's team.",
        items: await collectOfficialVideoTranscriptEvidence({
          sourceLabel: "web:fcbarcelona-men-video-transcripts",
          channelUrl: OFFICIAL_YOUTUBE_CHANNEL_URL,
          titleKeywords: ["press conference", "mixed zone", "preview", "training", "espanyol", "atletico", "atlético", "flick"],
          transcriptKeywords: ["espanyol", "derby", "atletico", "atlético", "pedri", "frenkie", "de jong", "olmo", "lamine", "lewandowski", "cubarsi", "selection", "available", "fit", "fitness", "minutes"],
          fallbackPublishedAt: now,
          listYouTubeVideosImpl,
          fetchYouTubeTranscriptImpl,
        }),
      }),
    },
    {
      source: "web:fcbarcelona-women-video-transcripts",
      family: "official",
      label: "FC Barcelona official video transcripts (women)",
      target: OFFICIAL_YOUTUBE_CHANNEL_URL,
      run: async () => ({
        detail: "Scanned recent official FC Barcelona video transcripts for Femení preview, presser, and mixed-zone lines.",
        items: await collectOfficialVideoTranscriptEvidence({
          sourceLabel: "web:fcbarcelona-women-video-transcripts",
          channelUrl: OFFICIAL_YOUTUBE_CHANNEL_URL,
          titleKeywords: ["femeni", "femení", "women", "bayern", "uwcl", "liga f", "press conference", "preview"],
          transcriptKeywords: ["femeni", "femení", "women", "aitana", "alexia", "patri", "claudia pina", "salma", "pajor", "bayern", "uwcl", "champions league", "liga f"],
          fallbackPublishedAt: now,
          listYouTubeVideosImpl,
          fetchYouTubeTranscriptImpl,
        }),
      }),
    },
    ...GOOGLE_NEWS_QUERIES.map((item) => ({
      source: item.source,
      family: "news",
      label: item.label,
      target: `https://news.google.com/rss/search?q=${encodeURIComponent(item.query)}`,
      run: async () => ({
        detail: item.detail,
        items: parseGoogleNewsRss(await fetchTextImpl(`https://news.google.com/rss/search?q=${encodeURIComponent(item.query)}`), item.source, {
          query: item.query,
          fallbackPublishedAt: now,
        }),
      }),
    })),
    {
      source: "web:espn-fixtures",
      family: "web",
      label: "ESPN fixtures via Jina",
      target: ESPN_FIXTURES_URL,
      run: async () => ({
        detail: "Checked ESPN fixtures via Jina for upcoming opponent sequencing around the derby and return leg.",
        items: normalizeWebLines(
          extractRelevantLines(await fetchTextImpl(ESPN_FIXTURES_URL), ["espanyol", "atletico", "atlético", "barcelona"], {
            limit: 6,
            minLength: 10,
          }),
          "web:espn-fixtures",
          ESPN_FIXTURES_URL,
          "web",
          now,
        ),
      }),
    },
    {
      source: "web:espn-results",
      family: "web",
      label: "ESPN results via Jina",
      target: ESPN_RESULTS_URL,
      run: async () => ({
        detail: "Checked ESPN results via Jina for recent scoreline context.",
        items: normalizeWebLines(
          extractRelevantLines(await fetchTextImpl(ESPN_RESULTS_URL), ["barcelona", "espanyol", "atletico", "atlético", "0 - 2", "1 - 2", "2 - 1"], {
            limit: 6,
            minLength: 10,
          }),
          "web:espn-results",
          ESPN_RESULTS_URL,
          "web",
          now,
        ),
      }),
    },
    {
      source: "web:espn-standings",
      family: "web",
      label: "ESPN standings via Jina",
      target: ESPN_STANDINGS_URL,
      run: async () => ({
        detail: "Checked ESPN standings via Jina for title-race context around Barcelona's current week.",
        items: normalizeWebLines(
          extractRelevantLines(await fetchTextImpl(ESPN_STANDINGS_URL), ["barcelona", "atletico", "atlético", "espanyol", "pts", "points"], {
            limit: 4,
            minLength: 8,
          }),
          "web:espn-standings",
          ESPN_STANDINGS_URL,
          "web",
          now,
        ),
      }),
    },
  ];

  return Promise.all(sourceDefinitions.map((definition) => safeSourceRun(definition, definition.run, now)));
}
