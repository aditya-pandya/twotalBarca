import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  buildDashboardSummary,
  buildHealthcheckReport,
  buildIngestionReport,
  buildPublishQueueState,
  buildReviewSummary,
  compileNewsroomSitePayload,
  createEmptyRetryState,
  slugify,
  validateNewsroomData,
} from "./newsroom.ts";
import type {
  ApprovalRecord,
  ArticleRecord,
  AssignmentRecord,
  BarcaScoutArtifact,
  DispatchRecord,
  DraftArtifact,
  EditorialCalendarState,
  FrontPagePlan,
  HealthcheckReport,
  IngestionReport,
  NewsSignalRecord,
  NewsroomData,
  NewsroomGeneratedSitePayload,
  PublishQueueState,
  RetryState,
  ReviewArtifact,
  ReviewSummary,
  RunLogEntry,
  ScoutEvidenceRecord,
  ScoutFeedbackEntry,
  ScoutFeedbackEntryInput,
  ScoutFeedbackState,
  ScoutImageLead,
  ScoutImageLeadStatus,
  SourceRegistryRecord,
  ValidationIssue,
  WorkflowConfig,
} from "./newsroom-types.ts";

export const NEWSROOM_ROOT = "newsroom";

type RelativeNewsroomPath =
  | "config/workflow.json"
  | "state/frontpage.json"
  | "state/editorial-calendar.json"
  | "state/scout-feedback.json"
  | "generated/site-content.json"
  | "generated/publish-queue.json"
  | "generated/review-summary.json"
  | "generated/ingestion-report.json"
  | "generated/retry-state.json"
  | "generated/healthcheck.json"
  | "generated/barca-live-source.json"
  | "generated/barca-scout-report.json";

function newsroomPath(rootDir: string, relativePath: string) {
  return path.join(rootDir, NEWSROOM_ROOT, relativePath);
}

async function ensureDir(dirPath: string) {
  await mkdir(dirPath, { recursive: true });
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const contents = await readFile(filePath, "utf8");
  return JSON.parse(contents) as T;
}

async function readJsonDirectory<T>(directoryPath: string): Promise<T[]> {
  try {
    const entries = (await readdir(directoryPath)).filter((entry) => entry.endsWith(".json")).sort();
    return await Promise.all(entries.map((entry) => readJsonFile<T>(path.join(directoryPath, entry))));
  } catch {
    return [];
  }
}

async function readJsonFileOrDefault<T>(filePath: string, fallback: T): Promise<T> {
  try {
    return await readJsonFile<T>(filePath);
  } catch {
    return fallback;
  }
}

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => stableValue(entry));
  }
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((accumulator, key) => {
        accumulator[key] = stableValue((value as Record<string, unknown>)[key]);
        return accumulator;
      }, {});
  }
  return value;
}

export function stringifyStableJson(value: unknown) {
  return `${JSON.stringify(stableValue(value), null, 2)}\n`;
}

export function resolveLocalNewsroomRootDir(defaultRoot = process.cwd()) {
  return process.env.TWOTALBARCA_NEWSROOM_ROOT ?? defaultRoot;
}

function createScoutFeedbackId(entry: ScoutFeedbackEntryInput, createdAt: string) {
  return slugify(`${entry.targetType}-${entry.targetId ?? entry.targetLabel}-${entry.verdict}-${createdAt}`);
}

function emptyScoutFeedbackState(now = new Date(0).toISOString()): ScoutFeedbackState {
  return {
    schemaVersion: 1,
    updatedAt: now,
    entries: [],
  };
}

function normalizeScoutFeedbackEntry(entry: Partial<ScoutFeedbackEntry>, fallbackCreatedAt = new Date(0).toISOString()): ScoutFeedbackEntry {
  const createdAt = typeof entry.createdAt === "string" ? entry.createdAt : fallbackCreatedAt;
  const targetType =
    entry.targetType === "candidate" ||
    entry.targetType === "cluster" ||
    entry.targetType === "source-lane" ||
    entry.targetType === "general-strategy-note"
      ? entry.targetType
      : "general-strategy-note";
  const verdictOptions = new Set([
    "promising",
    "weak",
    "noisy",
    "duplicate",
    "add-source",
    "needs-confirmation",
    "femeni-priority",
    "club-priority",
    "imagery-needed",
  ]);
  const verdict = verdictOptions.has(String(entry.verdict))
    ? (String(entry.verdict) as ScoutFeedbackEntry["verdict"])
    : "needs-confirmation";
  const targetLabel = String(entry.targetLabel ?? entry.targetId ?? "Strategy note").trim() || "Strategy note";

  return {
    id: String(entry.id ?? createScoutFeedbackId({ targetType, targetId: entry.targetId, targetLabel, verdict }, createdAt)),
    targetType,
    targetId: typeof entry.targetId === "string" && entry.targetId.trim() ? entry.targetId : undefined,
    targetLabel,
    verdict,
    note: typeof entry.note === "string" && entry.note.trim() ? entry.note.trim() : undefined,
    createdAt,
  };
}

function normalizeScoutFeedbackState(record: Partial<ScoutFeedbackState> | undefined): ScoutFeedbackState {
  const base = emptyScoutFeedbackState(record?.updatedAt ?? new Date(0).toISOString());
  return {
    ...base,
    ...record,
    entries: (record?.entries ?? [])
      .map((entry) => normalizeScoutFeedbackEntry(entry, record?.updatedAt ?? new Date(0).toISOString()))
      .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)),
  };
}

function mapLegacySourceType(kind: string): SourceRegistryRecord["type"] {
  if (kind === "match") return "match";
  if (kind === "archive") return "archive";
  return "editorial";
}

function mapLegacySignalType(kind: string): NewsSignalRecord["signalType"] {
  if (kind === "match") return "match";
  if (kind === "news") return "news";
  if (kind === "archive") return "archive_anniversary";
  return "editorial_follow_up";
}

function normalizeSourceRecord(record: Record<string, unknown>): SourceRegistryRecord {
  if (Array.isArray(record.pendingEvents)) {
    return record as unknown as SourceRegistryRecord;
  }

  const assignmentHint = (record.assignmentHint ?? {}) as Record<string, unknown>;
  const eventId = typeof record.slug === "string" ? record.slug : typeof record.id === "string" ? record.id : `source-${Date.now()}`;

  return {
    schemaVersion: 1,
    id: String(record.id),
    slug: String(record.slug),
    name: String(record.name ?? record.sourceName ?? record.slug ?? record.id),
    type: mapLegacySourceType(String(record.kind ?? "editorial_follow_up")),
    enabled: record.enabled === undefined ? record.status !== "ignored" : Boolean(record.enabled),
    cadence: (record.cadence as SourceRegistryRecord["cadence"]) ?? "daily",
    notes: typeof record.summary === "string" ? record.summary : undefined,
    tags: Array.isArray(record.tags) ? (record.tags as string[]) : [],
    discoveryMode: (record.discoveryMode as SourceRegistryRecord["discoveryMode"]) ?? "internal",
    lastScoutAt: typeof record.updatedAt === "string" ? record.updatedAt : undefined,
    pendingEvents: [
      {
        id: eventId,
        headline: String(record.title ?? record.slug ?? record.id),
        summary: String(record.summary ?? ""),
        signalType: mapLegacySignalType(String(record.kind ?? "editorial_follow_up")),
        eventAt: String(record.eventAt ?? record.createdAt ?? new Date().toISOString()),
        urgency: (record.urgency as SourceRegistryRecord["pendingEvents"][number]["urgency"]) ?? "medium",
        tags: Array.isArray(record.tags) ? (record.tags as string[]) : [],
        priorityScore: typeof record.priorityScore === "number" ? record.priorityScore : undefined,
        priorityReason: typeof record.priorityReason === "string" ? record.priorityReason : undefined,
        assignmentTopic: typeof record.assignmentTopic === "string" ? record.assignmentTopic : undefined,
        evidence: Array.isArray(record.evidence)
          ? (record.evidence as SourceRegistryRecord["pendingEvents"][number]["evidence"])
          : undefined,
        assignment: {
          title: String(assignmentHint.title ?? `Assignment from ${record.slug}`),
          kind: (assignmentHint.kind as "article" | "dispatch") ?? "article",
          owner: String(assignmentHint.owner ?? "editor-in-chief"),
          approver: String(assignmentHint.approver ?? "editor-in-chief"),
          deadline: new Date(
            Date.parse(String(record.eventAt ?? record.createdAt ?? new Date().toISOString())) +
              (Number(assignmentHint.deadlineHours ?? 24) || 24) * 60 * 60 * 1000,
          ).toISOString(),
          brief: String(assignmentHint.brief ?? "Follow up this newsroom signal."),
          deliverables: Array.isArray(assignmentHint.deliverables) ? (assignmentHint.deliverables as string[]) : ["One draft"],
        },
      },
    ],
  };
}

export async function ensureNewsroomDirectories(rootDir = process.cwd()) {
  const directories = [
    "config",
    "content/articles",
    "content/dispatch",
    "state",
    "assignments",
    "approvals",
    "sources",
    "drafts",
    "reviews",
    "generated",
    "generated/signals",
    "generated/logs",
    "generated/locks",
    "generated/backups",
  ];
  await Promise.all(directories.map((relativePath) => ensureDir(newsroomPath(rootDir, relativePath))));
}

function emptyReviewSummary(now = new Date(0).toISOString()): ReviewSummary {
  return {
    schemaVersion: 1,
    generatedAt: now,
    pendingApprovals: [],
    blockedRecords: [],
    readyToSchedule: [],
    openReviews: [],
  };
}

function emptyPublishQueue(now = new Date(0).toISOString()): PublishQueueState {
  return {
    schemaVersion: 1,
    generatedAt: now,
    items: [],
  };
}

function emptyIngestionReport(now = new Date(0).toISOString()): IngestionReport {
  return {
    schemaVersion: 1,
    generatedAt: now,
    sourceCount: 0,
    enabledSourceCount: 0,
    signalCount: 0,
    assignmentSuggestionCount: 0,
    activeSignals: [],
  };
}

function isScoutImageLeadStatus(status: unknown): status is ScoutImageLeadStatus {
  return (
    status === "usable-lead-image" ||
    status === "review-needed-social-preview" ||
    status === "needs-free-license-replacement" ||
    status === "needs-generation"
  );
}

function normalizeScoutImageLead(lead: unknown): ScoutImageLead | undefined {
  if (!lead || typeof lead !== "object") {
    return undefined;
  }

  const record = lead as Record<string, unknown>;
  if (typeof record.src !== "string" || typeof record.alt !== "string" || typeof record.source !== "string") {
    return undefined;
  }

  return {
    src: record.src,
    alt: record.alt,
    href: typeof record.href === "string" ? record.href : undefined,
    source: record.source,
    label: typeof record.label === "string" ? record.label : undefined,
    note: typeof record.note === "string" ? record.note : undefined,
    credit: typeof record.credit === "string" ? record.credit : undefined,
    status: isScoutImageLeadStatus(record.status) ? record.status : "needs-generation",
  };
}

function normalizeScoutEvidenceRecord(record: Record<string, unknown>): ScoutEvidenceRecord {
  return {
    source: String(record.source ?? ""),
    label: String(record.label ?? ""),
    url: typeof record.url === "string" ? record.url : undefined,
    excerpt: typeof record.excerpt === "string" ? record.excerpt : undefined,
    publishedAt: typeof record.publishedAt === "string" ? record.publishedAt : undefined,
    engagement: typeof record.engagement === "number" ? record.engagement : undefined,
    image: normalizeScoutImageLead(record.image),
  };
}

function emptyBarcaScoutArtifact(now = new Date(0).toISOString()): BarcaScoutArtifact {
  return {
    schemaVersion: 1,
    generatedAt: now,
    sourceStatuses: [],
    candidates: [],
    themeClusters: [],
    calibrationPrompts: [],
    sourceExpansionSuggestions: [],
    qualitySummary: {
      headline: "No scout calibration data yet.",
      evidenceCount: 0,
      sourceCount: 0,
      healthySourceCount: 0,
      candidateCount: 0,
      clusterCount: 0,
      crossPlatformClusterCount: 0,
      trustedBackedCandidateCount: 0,
      chatterHeavyCandidateCount: 0,
      womenCoverageGapCount: 0,
      weakSourceCount: 0,
    },
    coverageSummary: {
      tracks: [],
      weakSpots: [],
    },
    imageSummary: {
      candidateLeadCount: 0,
      clusterLeadCount: 0,
      reviewNeededCount: 0,
      replacementNeededCount: 0,
      missingCount: 0,
    },
    feedbackSummary: {
      entryCount: 0,
      targetTypeCounts: {
        candidate: 0,
        cluster: 0,
        "source-lane": 0,
        "general-strategy-note": 0,
      },
      verdictCounts: {},
      recentEntries: [],
    },
    sources: [],
  };
}

function normalizeBarcaScoutArtifact(record: Partial<BarcaScoutArtifact> | undefined): BarcaScoutArtifact {
  const base = emptyBarcaScoutArtifact(record?.generatedAt ?? new Date(0).toISOString());

  return {
    ...base,
    ...record,
    sourceStatuses: (record?.sourceStatuses ?? []).map((status) => {
      const {
        source,
        ok,
        fetchedAt,
        itemCount,
        detail,
        error,
        family = "web",
        label = status.source,
        target = "",
        sourceRole = "reference",
        sampleItems = [],
        contributionCount = 0,
        contributionEfficiency = 0,
        contributionSample = [],
        matchedCandidateIds = [],
        matchedCandidateTitles = [],
        qualityLabel = "quiet",
        repeatLowSignal = false,
        imageLeadCount = 0,
      } = status;

      return {
        source,
        family,
        label,
        target,
        ok,
        fetchedAt,
        itemCount,
        detail,
        error,
        sourceRole,
        sampleItems,
        contributionCount,
        contributionEfficiency,
        contributionSample,
        matchedCandidateIds,
        matchedCandidateTitles,
        qualityLabel,
        repeatLowSignal,
        imageLeadCount,
      };
    }),
    candidates: (record?.candidates ?? []).map((candidate) => {
      const calibration = candidate.calibration as Partial<typeof candidate.calibration> | undefined;
      const imageLead = normalizeScoutImageLead(candidate.imageLead);

      return {
        ...candidate,
        evidence: (candidate.evidence ?? []).map((evidence) => normalizeScoutEvidenceRecord(evidence as Record<string, unknown>)),
        calibration: {
          label: calibration?.label ?? "mixed",
          note: calibration?.note ?? "Scout calibration will update on the next run.",
          officialEvidenceCount: calibration?.officialEvidenceCount ?? 0,
          trustedEvidenceCount: calibration?.trustedEvidenceCount ?? 0,
          chatterEvidenceCount: calibration?.chatterEvidenceCount ?? 0,
          referenceEvidenceCount: calibration?.referenceEvidenceCount ?? 0,
          sourceFamilyCount: calibration?.sourceFamilyCount ?? 0,
          crossPlatform: calibration?.crossPlatform ?? false,
          needsTrustedConfirmation: calibration?.needsTrustedConfirmation ?? false,
          needsWomenDepth: calibration?.needsWomenDepth ?? false,
        },
        imageStatus:
          candidate.imageStatus === "usable-lead-image" ||
          candidate.imageStatus === "review-needed-social-preview" ||
          candidate.imageStatus === "needs-free-license-replacement" ||
          candidate.imageStatus === "needs-generation"
            ? candidate.imageStatus
            : imageLead?.status ?? "needs-generation",
        imageLead,
      };
    }),
    themeClusters: (record?.themeClusters ?? []).map((cluster) => {
      const imageLead = normalizeScoutImageLead(cluster.imageLead);
      return {
        ...cluster,
        representativeEvidence: (cluster.representativeEvidence ?? []).map((evidence) => normalizeScoutEvidenceRecord(evidence as Record<string, unknown>)),
        imageStatus:
          cluster.imageStatus === "usable-lead-image" ||
          cluster.imageStatus === "review-needed-social-preview" ||
          cluster.imageStatus === "needs-free-license-replacement" ||
          cluster.imageStatus === "needs-generation"
            ? cluster.imageStatus
            : imageLead?.status ?? "needs-generation",
        imageLead,
      };
    }),
    calibrationPrompts: record?.calibrationPrompts ?? [],
    sourceExpansionSuggestions: record?.sourceExpansionSuggestions ?? [],
    qualitySummary: {
      ...base.qualitySummary,
      ...record?.qualitySummary,
    },
    coverageSummary: {
      tracks: record?.coverageSummary?.tracks ?? [],
      weakSpots: record?.coverageSummary?.weakSpots ?? [],
    },
    imageSummary: {
      ...base.imageSummary,
      ...record?.imageSummary,
    },
    feedbackSummary: {
      ...base.feedbackSummary,
      ...record?.feedbackSummary,
      targetTypeCounts: {
        ...base.feedbackSummary.targetTypeCounts,
        ...(record?.feedbackSummary?.targetTypeCounts ?? {}),
      },
      verdictCounts: {
        ...base.feedbackSummary.verdictCounts,
        ...(record?.feedbackSummary?.verdictCounts ?? {}),
      },
      recentEntries: (record?.feedbackSummary?.recentEntries ?? []).map((entry) => normalizeScoutFeedbackEntry(entry)),
    },
    sources: record?.sources ?? [],
  };
}

export async function loadBarcaScoutArtifact(rootDir = process.cwd()) {
  const artifact = await readJsonFileOrDefault<Partial<BarcaScoutArtifact>>(newsroomPath(rootDir, "generated/barca-live-source.json"), emptyBarcaScoutArtifact());
  return normalizeBarcaScoutArtifact(artifact);
}

export async function loadScoutFeedbackState(rootDir = process.cwd()) {
  await ensureNewsroomDirectories(rootDir);
  const state = await readJsonFileOrDefault<Partial<ScoutFeedbackState>>(newsroomPath(rootDir, "state/scout-feedback.json"), emptyScoutFeedbackState());
  return normalizeScoutFeedbackState(state);
}

export async function loadScoutFeedbackEntries(rootDir = process.cwd()) {
  return (await loadScoutFeedbackState(rootDir)).entries;
}

export async function appendScoutFeedbackEntry(rootDir: string, entry: ScoutFeedbackEntryInput, now = new Date().toISOString()) {
  if (!entry.targetLabel?.trim()) {
    throw new Error("targetLabel is required");
  }

  const normalizedEntry = normalizeScoutFeedbackEntry(entry, entry.createdAt ?? now);
  const currentState = await loadScoutFeedbackState(rootDir);
  const nextState: ScoutFeedbackState = {
    schemaVersion: 1,
    updatedAt: now,
    entries: [normalizedEntry, ...currentState.entries].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)),
  };
  await writeNewsroomJson(rootDir, "state/scout-feedback.json", nextState);
  return normalizedEntry;
}

export async function loadNewsroomData(rootDir = process.cwd()): Promise<NewsroomData> {
  await ensureNewsroomDirectories(rootDir);

  const workflow = await readJsonFile<WorkflowConfig>(newsroomPath(rootDir, "config/workflow.json"));
  const frontPage = await readJsonFile<FrontPagePlan>(newsroomPath(rootDir, "state/frontpage.json"));
  const editorialCalendar = await readJsonFile<EditorialCalendarState>(newsroomPath(rootDir, "state/editorial-calendar.json"));
  const articles = await readJsonDirectory<ArticleRecord>(newsroomPath(rootDir, "content/articles"));
  const dispatch = await readJsonDirectory<DispatchRecord>(newsroomPath(rootDir, "content/dispatch"));
  const assignments = await readJsonDirectory<AssignmentRecord>(newsroomPath(rootDir, "assignments"));
  const approvals = await readJsonDirectory<ApprovalRecord>(newsroomPath(rootDir, "approvals"));
  const rawSources = await readJsonDirectory<Record<string, unknown>>(newsroomPath(rootDir, "sources"));
  const scoutArtifact = await loadBarcaScoutArtifact(rootDir);
  const sources = [...rawSources, ...scoutArtifact.sources].map((source) => normalizeSourceRecord(source as Record<string, unknown>));
  const signals = await readJsonDirectory<NewsSignalRecord>(newsroomPath(rootDir, "generated/signals"));
  const drafts = await readJsonDirectory<DraftArtifact>(newsroomPath(rootDir, "drafts"));
  const reviews = await readJsonDirectory<ReviewArtifact>(newsroomPath(rootDir, "reviews"));
  const publishQueue = await readJsonFileOrDefault<PublishQueueState>(newsroomPath(rootDir, "generated/publish-queue.json"), emptyPublishQueue());
  const reviewSummary = await readJsonFileOrDefault<ReviewSummary>(newsroomPath(rootDir, "generated/review-summary.json"), emptyReviewSummary());
  const ingestionReport = await readJsonFileOrDefault<IngestionReport>(newsroomPath(rootDir, "generated/ingestion-report.json"), emptyIngestionReport());
  const retryState = await readJsonFileOrDefault<RetryState>(newsroomPath(rootDir, "generated/retry-state.json"), createEmptyRetryState());

  return {
    workflow,
    articles,
    dispatch,
    assignments,
    approvals,
    frontPage,
    editorialCalendar,
    sources,
    signals,
    drafts,
    reviews,
    publishQueue,
    reviewSummary,
    ingestionReport,
    retryState,
  };
}

export async function writeNewsroomJson(rootDir: string, relativePath: RelativeNewsroomPath, value: unknown) {
  const filePath = newsroomPath(rootDir, relativePath);
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, stringifyStableJson(value), "utf8");
  return filePath;
}

export async function writeRecordJson(rootDir: string, relativeDirectory: string, filename: string, value: unknown) {
  const filePath = newsroomPath(rootDir, path.join(relativeDirectory, filename));
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, stringifyStableJson(value), "utf8");
  return filePath;
}

export async function deleteRecordJson(rootDir: string, relativeDirectory: string, filename: string) {
  const filePath = newsroomPath(rootDir, path.join(relativeDirectory, filename));
  await rm(filePath, { force: true });
  return filePath;
}

export async function validateLoadedNewsroom(rootDir = process.cwd()) {
  const data = await loadNewsroomData(rootDir);
  const issues = validateNewsroomData(data);
  return { data, issues };
}

export async function writePublishQueue(rootDir = process.cwd(), now = new Date().toISOString()) {
  const data = await loadNewsroomData(rootDir);
  const queue = buildPublishQueueState({
    articles: data.articles,
    dispatch: data.dispatch,
    approvals: data.approvals,
    workflow: data.workflow,
    drafts: data.drafts,
    reviews: data.reviews,
    editorialCalendar: data.editorialCalendar,
    retryState: data.retryState,
    now,
  });
  const outputPath = await writeNewsroomJson(rootDir, "generated/publish-queue.json", queue);
  return { queue, outputPath };
}

export async function writeReviewSummary(rootDir = process.cwd(), now = new Date().toISOString()) {
  const data = await loadNewsroomData(rootDir);
  const summary = buildReviewSummary(data, now);
  const outputPath = await writeNewsroomJson(rootDir, "generated/review-summary.json", summary);
  return { summary, outputPath };
}

export async function refreshGeneratedNewsroomState(rootDir = process.cwd(), now = new Date().toISOString()) {
  const data = await loadNewsroomData(rootDir);
  const ingestionReport = buildIngestionReport(data.sources, data.signals, now);
  const reviewSummary = buildReviewSummary(data, now);
  const publishQueue = buildPublishQueueState({
    articles: data.articles,
    dispatch: data.dispatch,
    approvals: data.approvals,
    workflow: data.workflow,
    drafts: data.drafts,
    reviews: data.reviews,
    editorialCalendar: data.editorialCalendar,
    retryState: data.retryState,
    now,
  });

  await Promise.all([
    writeNewsroomJson(rootDir, "generated/ingestion-report.json", ingestionReport),
    writeNewsroomJson(rootDir, "generated/review-summary.json", reviewSummary),
    writeNewsroomJson(rootDir, "generated/publish-queue.json", publishQueue),
  ]);

  return { ingestionReport, reviewSummary, publishQueue };
}

export async function buildGeneratedSitePayload(rootDir = process.cwd(), now = new Date().toISOString()) {
  await refreshGeneratedNewsroomState(rootDir, now);
  const data = await loadNewsroomData(rootDir);
  const issues = validateNewsroomData(data);
  const payload = compileNewsroomSitePayload(data, now);
  const outputPath = await writeNewsroomJson(rootDir, "generated/site-content.json", payload);
  return { data, issues, payload, outputPath };
}

export async function loadGeneratedSitePayload(rootDir = process.cwd()) {
  return readJsonFile<NewsroomGeneratedSitePayload>(newsroomPath(rootDir, "generated/site-content.json"));
}

export async function buildDashboard(rootDir = process.cwd(), now = new Date().toISOString()) {
  const data = await loadNewsroomData(rootDir);
  return buildDashboardSummary(data, now);
}

export async function writeHealthcheck(rootDir = process.cwd(), now = new Date().toISOString()) {
  const data = await loadNewsroomData(rootDir);
  const issues = validateNewsroomData(data);
  const summary = buildHealthcheckReport(data, issues, now);
  const outputPath = await writeNewsroomJson(rootDir, "generated/healthcheck.json", summary);
  return { summary, outputPath };
}

export async function writeLogEntry(rootDir: string, entry: RunLogEntry) {
  const filePath = newsroomPath(rootDir, "generated/logs/newsroom-runs.jsonl");
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, `${JSON.stringify(entry)}\n`, { encoding: "utf8", flag: "a" });
  return filePath;
}

export async function updateRetryState(rootDir: string, key: string, outcome: { ok: boolean; reason?: string }, now = new Date().toISOString()) {
  const retryPath = newsroomPath(rootDir, "generated/retry-state.json");
  const current = await readJsonFileOrDefault<RetryState>(retryPath, createEmptyRetryState(now));
  const retries = { ...current.retries };

  if (outcome.ok) {
    delete retries[key];
  } else {
    const previous = retries[key];
    retries[key] = {
      count: (previous?.count ?? 0) + 1,
      lastFailureAt: now,
      reason: outcome.reason ?? "unknown failure",
    };
  }

  const nextState: RetryState = {
    schemaVersion: 1,
    updatedAt: now,
    retries,
  };
  await writeNewsroomJson(rootDir, "generated/retry-state.json", nextState);
  return nextState;
}

export async function withNewsroomLock<T>(rootDir: string, lockName: string, runner: () => Promise<T>) {
  const lockPath = newsroomPath(rootDir, `generated/locks/${slugify(lockName)}.lock`);
  await ensureDir(path.dirname(lockPath));
  const startedAt = new Date().toISOString();

  try {
    await writeFile(lockPath, JSON.stringify({ lockName, startedAt, pid: process.pid }, null, 2), { flag: "wx" });
  } catch {
    throw new Error(`Lock '${lockName}' is already held. Clear ${lockPath} if a previous run crashed.`);
  }

  try {
    return await runner();
  } finally {
    await rm(lockPath, { force: true });
  }
}

export async function runNewsroomScript<T>(args: {
  rootDir?: string;
  script: string;
  lock?: string;
  runner: () => Promise<{ details: string[]; metadata?: Record<string, string | number | boolean>; result?: T }>;
}) {
  const rootDir = args.rootDir ?? process.cwd();
  const startedAt = new Date().toISOString();
  const runId = `${slugify(args.script)}-${Date.now()}`;

  const execute = async () => {
    try {
      const outcome = await args.runner();
      const finishedAt = new Date().toISOString();
      await writeLogEntry(rootDir, {
        runId,
        script: args.script,
        startedAt,
        finishedAt,
        status: "ok",
        details: outcome.details,
        metadata: outcome.metadata,
      });
      await updateRetryState(rootDir, args.script, { ok: true }, finishedAt);
      return { runId, ...outcome };
    } catch (error) {
      const finishedAt = new Date().toISOString();
      const message = error instanceof Error ? error.message : String(error);
      await writeLogEntry(rootDir, {
        runId,
        script: args.script,
        startedAt,
        finishedAt,
        status: "error",
        details: [message],
      });
      await updateRetryState(rootDir, args.script, { ok: false, reason: message }, finishedAt);
      throw error;
    }
  };

  return args.lock ? withNewsroomLock(rootDir, args.lock, execute) : execute();
}

export async function runWithLoggedMutation<T>(
  rootDir: string,
  script: string,
  runner: () => Promise<T>,
  toMetadata?: (value: T) => Record<string, unknown>,
) {
  const outcome = await runNewsroomScript({
    rootDir,
    script,
    lock: script,
    runner: async () => {
      const result = await runner();
      const rawMetadata = toMetadata ? toMetadata(result) : {};
      const metadata = Object.fromEntries(
        Object.entries(rawMetadata)
          .filter(([, value]) => ["string", "number", "boolean"].includes(typeof value))
          .map(([key, value]) => [key, value as string | number | boolean]),
      );
      const details = Object.entries(rawMetadata).map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
      return { details, metadata, result };
    },
  });

  return outcome.result as T;
}

export async function createNewsroomBackup(rootDir = process.cwd(), label?: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const suffix = label ? `-${slugify(label)}` : "";
  const targetDir = newsroomPath(rootDir, `generated/backups/${timestamp}${suffix}`);
  await ensureDir(path.dirname(targetDir));
  await cp(newsroomPath(rootDir, "."), targetDir, {
    recursive: true,
    filter: (source) => !source.includes(`${path.sep}generated${path.sep}backups${path.sep}`),
  });
  return targetDir;
}

export async function listNewsroomBackups(rootDir = process.cwd()) {
  const backupsDir = newsroomPath(rootDir, "generated/backups");
  try {
    return (await readdir(backupsDir)).sort().reverse();
  } catch {
    return [];
  }
}

export async function getNewsroomLogStats(rootDir = process.cwd()) {
  const logPath = newsroomPath(rootDir, "generated/logs/newsroom-runs.jsonl");
  try {
    const logStat = await stat(logPath);
    return { exists: true, size: logStat.size, path: logPath };
  } catch {
    return { exists: false, size: 0, path: logPath };
  }
}

export async function readHealthcheck(rootDir = process.cwd()) {
  return readJsonFile<HealthcheckReport>(newsroomPath(rootDir, "generated/healthcheck.json"));
}
