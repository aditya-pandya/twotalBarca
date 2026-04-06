import type {
  ApprovalDecision,
  ApprovalDiagnostic,
  ApprovalRecord,
  ApprovalRole,
  ArticleRecord,
  AssignmentRecord,
  DashboardSummary,
  DispatchRecord,
  DraftArtifact,
  EditorialRecordKind,
  EditorialStatus,
  GeneratedFrontPagePlan,
  HealthcheckReport,
  IngestionReport,
  NewsSignalRecord,
  NewsSignalType,
  NewsroomData,
  NewsroomGeneratedSitePayload,
  PublishQueueEntry,
  PublishQueueState,
  ReviewArtifact,
  ReviewSummary,
  SourcePendingEvent,
  SourceRegistryRecord,
  ValidationIssue,
  WorkflowConfig,
} from "./newsroom-types.ts";

export const editorialStatuses: EditorialStatus[] = [
  "draft",
  "assigned",
  "in_progress",
  "in_review",
  "copy_review",
  "approved",
  "scheduled",
  "published",
  "killed",
];

export const defaultWorkflowTransitions: Record<EditorialStatus, EditorialStatus[]> = {
  draft: ["assigned", "killed"],
  assigned: ["in_progress", "killed"],
  in_progress: ["in_review", "killed"],
  in_review: ["copy_review", "in_progress", "killed"],
  copy_review: ["approved", "in_review", "killed"],
  approved: ["scheduled", "published", "in_review", "killed"],
  scheduled: ["published", "in_review", "killed"],
  published: [],
  killed: [],
};

export const defaultRequiredApprovals: Record<EditorialRecordKind, ApprovalRole[]> = {
  article: ["copy-chief", "editor-in-chief"],
  dispatch: ["copy-chief", "editor-in-chief"],
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function hasParseableDate(value: unknown): value is string {
  return isNonEmptyString(value) && !Number.isNaN(Date.parse(value));
}

function compareDateAsc(left?: string, right?: string) {
  return (Date.parse(left ?? "") || 0) - (Date.parse(right ?? "") || 0);
}

function compareDateDesc(left?: string, right?: string) {
  return (Date.parse(right ?? "") || 0) - (Date.parse(left ?? "") || 0);
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function issue(path: string, message: string, severity: ValidationIssue["severity"] = "error"): ValidationIssue {
  return { severity, path, message };
}

function pendingEventSignalSlug(source: SourceRegistryRecord, event: SourcePendingEvent) {
  const eventSlug = slugify(event.id);
  return eventSlug.startsWith(`${source.slug}-`) || eventSlug === source.slug ? eventSlug : `${source.slug}-${eventSlug}`;
}

function sortArticles(records: ArticleRecord[]) {
  return [...records].sort((left, right) => compareDateDesc(left.publishedAt ?? left.publishAt ?? left.updatedAt, right.publishedAt ?? right.publishAt ?? right.updatedAt));
}

function sortDispatch(records: DispatchRecord[]) {
  return [...records].sort((left, right) => {
    const byDate = compareDateDesc(left.publishedAt ?? left.publishAt ?? left.updatedAt, right.publishedAt ?? right.publishAt ?? right.updatedAt);
    return byDate !== 0 ? byDate : right.issueNumber - left.issueNumber;
  });
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function getRecordCollection(data: NewsroomData, kind: EditorialRecordKind) {
  return kind === "article" ? data.articles : data.dispatch;
}

export function getRequiredApprovals(workflow: Pick<WorkflowConfig, "requiredApprovals"> | undefined, kind: EditorialRecordKind) {
  return workflow?.requiredApprovals?.[kind] ?? defaultRequiredApprovals[kind];
}

export function getApprovalCoverage(
  approvalIds: string[],
  approvals: ApprovalRecord[],
  workflow: Pick<WorkflowConfig, "requiredApprovals"> | undefined,
  recordKind: EditorialRecordKind,
  recordId: string,
) {
  const relevant = approvals.filter(
    (approval) => approval.recordKind === recordKind && approval.recordId === recordId && approvalIds.includes(approval.id),
  );
  const decisions = new Map<ApprovalRole, ApprovalDecision>();

  for (const approval of relevant) {
    const current = decisions.get(approval.role);
    if (current === "blocked") {
      continue;
    }
    decisions.set(approval.role, approval.decision);
  }

  const required = getRequiredApprovals(workflow, recordKind);
  const missing = required.filter((role) => decisions.get(role) !== "approved");
  const blocked = required.filter((role) => decisions.get(role) === "blocked");
  const changesRequested = required.filter((role) => decisions.get(role) === "changes_requested");

  return { matched: relevant, required, missing, blocked, changesRequested };
}

export function canTransitionStatus(from: EditorialStatus, to: EditorialStatus, workflow: Pick<WorkflowConfig, "transitions"> | undefined) {
  const allowed = workflow?.transitions?.[from] ?? defaultWorkflowTransitions[from];
  return allowed.includes(to);
}

type TransitionRecord = Pick<ArticleRecord, "id" | "slug" | "status" | "approvalIds" | "publishAt" | "publishedAt"> &
  Pick<DispatchRecord, "id" | "slug" | "status" | "approvalIds" | "publishAt" | "publishedAt">;

export function assertTransitionAllowed(args: {
  record: TransitionRecord;
  kind: EditorialRecordKind;
  targetStatus: EditorialStatus;
  approvals: ApprovalRecord[];
  workflow: WorkflowConfig;
}) {
  const { record, kind, targetStatus, approvals, workflow } = args;

  if (!canTransitionStatus(record.status, targetStatus, workflow)) {
    throw new Error(`Invalid transition: ${kind} ${record.slug} cannot move from ${record.status} to ${targetStatus}.`);
  }

  if (["approved", "scheduled", "published"].includes(targetStatus)) {
    const coverage = getApprovalCoverage(record.approvalIds, approvals, workflow, kind, record.id);
    if (coverage.blocked.length > 0) {
      throw new Error(`Transition blocked: ${kind} ${record.slug} has blocked approvals from ${coverage.blocked.join(", ")}.`);
    }
    if (coverage.changesRequested.length > 0) {
      throw new Error(`Transition blocked: ${kind} ${record.slug} has changes requested from ${coverage.changesRequested.join(", ")}.`);
    }
    if (coverage.missing.length > 0) {
      throw new Error(`Transition blocked: ${kind} ${record.slug} is missing approvals from ${coverage.missing.join(", ")}.`);
    }
  }

  if (targetStatus === "scheduled" && !record.publishAt) {
    throw new Error(`Scheduled status requires publishAt on ${kind} ${record.slug}.`);
  }

  if (targetStatus === "published" && !(record.publishedAt ?? record.publishAt)) {
    throw new Error(`Published status requires publishedAt or publishAt on ${kind} ${record.slug}.`);
  }
}

export function buildSignalRecords(
  sources: SourceRegistryRecord[],
  existingSignals: NewsSignalRecord[],
  now = new Date().toISOString(),
) {
  const existingById = new Map(existingSignals.map((signal) => [signal.id, signal]));
  const nextSignals: NewsSignalRecord[] = [];

  for (const source of sources.filter((entry) => entry.enabled)) {
    for (const event of source.pendingEvents) {
      const id = `signal-${pendingEventSignalSlug(source, event)}`;
      const existing = existingById.get(id);
      nextSignals.push({
        schemaVersion: 1,
        id,
        slug: pendingEventSignalSlug(source, event),
        sourceId: source.id,
        sourceSlug: source.slug,
        signalType: event.signalType,
        status: existing?.status ?? "new",
        title: event.headline,
        summary: event.summary,
        eventAt: event.eventAt,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        urgency: event.urgency,
        confidence: existing?.confidence ?? 0.78,
        tags: unique([...source.tags, ...event.tags]),
        assignmentSuggestion: event.assignment,
        assignmentId: existing?.assignmentId,
      });
    }
  }

  return nextSignals.sort((left, right) => compareDateDesc(left.eventAt, right.eventAt));
}

export function buildAssignmentFromSignal(signal: NewsSignalRecord, assignments: AssignmentRecord[], now = new Date().toISOString()): AssignmentRecord {
  const baseSlug = slugify(signal.assignmentSuggestion.title);
  let slug = baseSlug;
  let index = 2;

  while (assignments.some((assignment) => assignment.slug === slug || assignment.id === `assignment-${slug}`)) {
    slug = `${baseSlug}-${index}`;
    index += 1;
  }

  return {
    id: `assignment-${slug}`,
    slug,
    title: signal.assignmentSuggestion.title,
    kind: signal.assignmentSuggestion.kind,
    status: "open",
    priority: signal.urgency,
    owner: signal.assignmentSuggestion.owner,
    approver: signal.assignmentSuggestion.approver,
    brief: signal.assignmentSuggestion.brief,
    deadline: signal.assignmentSuggestion.deadline,
    dependencies: [`signal:${signal.id}`],
    deliverables: signal.assignmentSuggestion.deliverables,
    createdAt: now,
    updatedAt: now,
    sourceSignalId: signal.id,
    recordKind: signal.assignmentSuggestion.kind,
    targetSlug: slug,
  };
}

function buildArticleDraftBody(record: ArticleRecord, assignment: AssignmentRecord, sourceSignals: NewsSignalRecord[]) {
  const additions = sourceSignals.map((signal) => `Source note: ${signal.title} (${signal.signalType.replaceAll("_", " ")}).`);
  return [...record.body, ...additions, `Desk brief: ${assignment.brief}`];
}

function buildDispatchDraftBody(record: DispatchRecord, assignment: AssignmentRecord, sourceSignals: NewsSignalRecord[]) {
  const itemLines = record.items.map((item) => `${item.headline}: ${item.summary}`);
  const signalLines = sourceSignals.map((signal) => `Signal: ${signal.title} - ${signal.summary}`);
  return [record.editorsNote, ...itemLines, ...signalLines, `Desk brief: ${assignment.brief}`];
}

export function generateDraftArtifact(args: {
  assignment: AssignmentRecord;
  record: ArticleRecord | DispatchRecord;
  existingDrafts: DraftArtifact[];
  sourceSignals: NewsSignalRecord[];
  now?: string;
}) {
  const now = args.now ?? new Date().toISOString();
  const existingVersions = args.existingDrafts.filter((draft) => draft.recordId === args.record.id);
  const version = existingVersions.length + 1;
  const slug = `${args.record.slug}-v${version}`;

  return {
    schemaVersion: 1,
    id: `draft-${args.record.slug}-v${version}`,
    slug,
    recordKind: args.record.kind,
    recordId: args.record.id,
    assignmentId: args.assignment.id,
    version,
    status: "ready_for_review",
    title: args.record.kind === "article" ? args.record.headline : args.record.issueTitle,
    dek: args.record.kind === "article" ? args.record.dek : args.record.editorsNote,
    excerpt: args.record.kind === "article" ? args.record.excerpt : `Dispatch planning draft for issue ${args.record.issueNumber}.`,
    body:
      args.record.kind === "article"
        ? buildArticleDraftBody(args.record, args.assignment, args.sourceSignals)
        : buildDispatchDraftBody(args.record, args.assignment, args.sourceSignals),
    notes: [
      `Generated from assignment ${args.assignment.id}.`,
      args.sourceSignals.length > 0 ? `Includes ${args.sourceSignals.length} linked newsroom signal(s).` : "No linked signals were available.",
    ],
    sourceSignalIds: args.sourceSignals.map((signal) => signal.id),
    sourceIds: unique(args.sourceSignals.map((signal) => signal.sourceId)),
    createdAt: now,
    updatedAt: now,
    latest: true,
  } satisfies DraftArtifact;
}

export function reviseDraftArtifact(args: {
  currentDraft: DraftArtifact;
  summary: string;
  requestedBy: string;
  changes: string[];
  now?: string;
}) {
  const now = args.now ?? new Date().toISOString();
  const version = args.currentDraft.version + 1;
  const nextDraft: DraftArtifact = {
    ...args.currentDraft,
    id: args.currentDraft.id.replace(/-v\d+$/, `-v${version}`),
    slug: args.currentDraft.slug.replace(/-v\d+$/, `-v${version}`),
    version,
    status: "ready_for_review",
    notes: [...args.currentDraft.notes, `Revision created: ${args.summary}`],
    body: [...args.currentDraft.body, `Revision note: ${args.summary}`],
    createdAt: now,
    updatedAt: now,
    latest: true,
  };

  const review: ReviewArtifact = {
    schemaVersion: 1,
    id: `review-${args.currentDraft.recordId}-${Date.parse(now)}`,
    draftId: args.currentDraft.id,
    recordKind: args.currentDraft.recordKind,
    recordId: args.currentDraft.recordId,
    kind: "revision",
    status: "resolved",
    summary: args.summary,
    requestedBy: args.requestedBy,
    requestedAt: now,
    changes: args.changes,
    resultingDraftId: nextDraft.id,
    resolvedAt: now,
  };

  return { nextDraft, review };
}

export function buildIngestionReport(sources: SourceRegistryRecord[], signals: NewsSignalRecord[], now = new Date().toISOString()): IngestionReport {
  return {
    schemaVersion: 1,
    generatedAt: now,
    sourceCount: sources.length,
    enabledSourceCount: sources.filter((source) => source.enabled).length,
    signalCount: signals.length,
    assignmentSuggestionCount: signals.filter((signal) => !signal.assignmentId).length,
    activeSignals: signals.slice(0, 10).map((signal) => signal.slug),
  };
}

export function buildPrePublishChecks(args: {
  record: ArticleRecord | DispatchRecord;
  approvals: ApprovalRecord[];
  workflow: WorkflowConfig;
  drafts: DraftArtifact[];
  reviews: ReviewArtifact[];
}) {
  const diagnostics: string[] = [];
  const coverage = getApprovalCoverage(args.record.approvalIds, args.approvals, args.workflow, args.record.kind, args.record.id);

  if (coverage.blocked.length > 0) {
    diagnostics.push(`Blocked approvals: ${coverage.blocked.join(", ")}`);
  }
  if (coverage.changesRequested.length > 0) {
    diagnostics.push(`Changes requested: ${coverage.changesRequested.join(", ")}`);
  }
  if (coverage.missing.length > 0) {
    diagnostics.push(`Missing approvals: ${coverage.missing.join(", ")}`);
  }
  if (!args.record.latestDraftId) {
    diagnostics.push("Missing latest draft binding.");
  }
  if (args.record.latestDraftId && !args.drafts.some((draft) => draft.id === args.record.latestDraftId && draft.latest)) {
    diagnostics.push(`Latest draft '${args.record.latestDraftId}' is missing or not marked latest.`);
  }

  const openReviews = args.reviews.filter(
    (review) => review.recordId === args.record.id && review.recordKind === args.record.kind && review.status === "open",
  );
  if (openReviews.length > 0) {
    diagnostics.push(`Open reviews: ${openReviews.map((review) => review.id).join(", ")}`);
  }
  if (args.record.status === "scheduled" && !args.record.publishAt) {
    diagnostics.push("Scheduled record is missing publishAt.");
  }

  return { ok: diagnostics.length === 0, diagnostics };
}

export function buildPublishQueueState(args: {
  articles: ArticleRecord[];
  dispatch: DispatchRecord[];
  approvals: ApprovalRecord[];
  workflow: WorkflowConfig;
  drafts: DraftArtifact[];
  reviews: ReviewArtifact[];
  retryState?: NewsroomData["retryState"];
  now?: string;
}): PublishQueueState {
  const now = args.now ?? new Date().toISOString();
  const items = [...args.articles, ...args.dispatch]
    .filter((record) => record.status === "scheduled" || record.status === "published")
    .sort((left, right) => compareDateAsc(left.publishAt ?? left.publishedAt, right.publishAt ?? right.publishedAt))
    .map<PublishQueueEntry>((record) => {
      const checks = buildPrePublishChecks({
        record,
        approvals: args.approvals,
        workflow: args.workflow,
        drafts: args.drafts,
        reviews: args.reviews,
      });
      const retryKey = `${record.kind}:${record.slug}`;
      const retry = args.retryState?.retries?.[retryKey];
      return {
        schemaVersion: 1,
        id: `publish-${record.kind}-${record.slug}`,
        recordKind: record.kind,
        recordId: record.id,
        slug: record.slug,
        status: record.status === "published" ? "published" : checks.ok ? "scheduled" : "blocked",
        publishAt: record.publishAt ?? record.publishedAt ?? now,
        latestDraftId: record.latestDraftId,
        retryCount: retry?.count ?? 0,
        maxRetries: 3,
        lastAttemptAt: retry?.lastFailureAt,
        lastError: retry?.reason,
        publishedAt: record.publishedAt,
        diagnostics: checks.diagnostics,
      };
    });

  return {
    schemaVersion: 1,
    generatedAt: now,
    items,
  };
}

export function buildPublishQueue(data: NewsroomData, now = new Date().toISOString()) {
  return buildPublishQueueState({
    articles: data.articles,
    dispatch: data.dispatch,
    approvals: data.approvals,
    workflow: data.workflow,
    drafts: data.drafts,
    reviews: data.reviews,
    retryState: data.retryState,
    now,
  }).items;
}

export function getPublishDiagnostics(record: ArticleRecord | DispatchRecord, _kind: EditorialRecordKind, data: NewsroomData) {
  return buildPrePublishChecks({
    record,
    approvals: data.approvals,
    workflow: data.workflow,
    drafts: data.drafts,
    reviews: data.reviews,
  }).diagnostics;
}

function buildApprovalDiagnostic(record: ArticleRecord | DispatchRecord, data: NewsroomData): ApprovalDiagnostic {
  const coverage = getApprovalCoverage(record.approvalIds, data.approvals, data.workflow, record.kind, record.id);
  const openReviews = data.reviews
    .filter((review) => review.recordKind === record.kind && review.recordId === record.id && review.status === "open")
    .map((review) => review.id);

  const diagnostics = [
    ...coverage.changesRequested.map((role) => `${role} requested changes`),
    ...coverage.blocked.map((role) => `${role} blocked`),
    ...coverage.missing.map((role) => `${role} still missing`),
    ...openReviews.map((reviewId) => `Open review ${reviewId}`),
  ];

  return {
    slug: record.slug,
    kind: record.kind,
    status: record.status,
    latestDraftId: record.latestDraftId,
    latestReviewId: record.latestReviewId,
    missingApprovals: coverage.missing,
    blockedApprovals: unique([...coverage.blocked, ...coverage.changesRequested]),
    openReviews,
    diagnostics: diagnostics.length > 0 ? diagnostics : ["Approval coverage complete."],
  };
}

export function buildReviewSummary(data: NewsroomData, now = new Date().toISOString()): ReviewSummary {
  const records = [...data.articles, ...data.dispatch];
  const pendingApprovals = records
    .filter((record) => ["in_review", "copy_review", "approved", "scheduled"].includes(record.status))
    .map((record) => buildApprovalDiagnostic(record, data))
    .sort((left, right) => left.slug.localeCompare(right.slug));

  const blockedRecords = pendingApprovals.filter(
    (item) => item.blockedApprovals.length > 0 || item.openReviews.length > 0 || item.missingApprovals.length > 0,
  );

  const readyToSchedule = records
    .filter((record) => record.status === "approved")
    .filter((record) => getPublishDiagnostics(record, record.kind, data).length === 0)
    .map((record) => record.slug);

  const openReviews = data.reviews
    .filter((review) => review.status === "open")
    .sort((left, right) => compareDateDesc(left.requestedAt, right.requestedAt));

  return {
    schemaVersion: 1,
    generatedAt: now,
    pendingApprovals,
    blockedRecords,
    readyToSchedule,
    openReviews,
  };
}

export function buildDashboardSummary(data: NewsroomData, now = new Date().toISOString()): DashboardSummary {
  const byStatus = editorialStatuses.reduce<Record<EditorialStatus, number>>((accumulator, status) => {
    accumulator[status] = 0;
    return accumulator;
  }, {} as Record<EditorialStatus, number>);

  [...data.articles, ...data.dispatch].forEach((record) => {
    byStatus[record.status] += 1;
  });

  const reviewSummary = buildReviewSummary(data, now);
  const publishQueue = buildPublishQueueState({
    articles: data.articles,
    dispatch: data.dispatch,
    approvals: data.approvals,
    workflow: data.workflow,
    drafts: data.drafts,
    reviews: data.reviews,
    retryState: data.retryState,
    now,
  });

  return {
    generatedAt: now,
    counts: {
      articles: data.articles.length,
      dispatch: data.dispatch.length,
      assignments: data.assignments.length,
      approvals: data.approvals.length,
      signals: data.signals.length,
      drafts: data.drafts.length,
      openReviews: reviewSummary.openReviews.length,
      publishQueue: publishQueue.items.length,
    },
    byStatus,
    published: {
      articleSlugs: sortArticles(data.articles.filter((record) => record.status === "published")).map((record) => record.slug),
      dispatchSlugs: sortDispatch(data.dispatch.filter((record) => record.status === "published")).map((record) => record.slug),
    },
    pendingApproval: reviewSummary.pendingApprovals.map((item) => item.slug),
    frontPage: {
      heroArticleSlug: data.frontPage.heroArticleSlug,
      featuredDispatchSlug: data.frontPage.featuredDispatchSlug,
    },
    latestSignals: [...data.signals].sort((left, right) => compareDateDesc(left.updatedAt, right.updatedAt)).slice(0, 6),
    upcomingPublishes: publishQueue.items.filter((item) => item.status !== "published").slice(0, 6),
  };
}

function buildFrontPagePlan(data: NewsroomData, publishedArticleSlugs: Set<string>, publishedDispatchSlugs: Set<string>): GeneratedFrontPagePlan {
  const notes: string[] = [];
  const keepPublishedArticleSlugs = (slugs: string[]) =>
    unique(slugs).filter((slug) => {
      if (publishedArticleSlugs.has(slug)) {
        return true;
      }
      notes.push(`Dropped unpublished front-page article '${slug}'.`);
      return false;
    });

  const heroArticleSlug =
    data.frontPage.heroArticleSlug && publishedArticleSlugs.has(data.frontPage.heroArticleSlug) ? data.frontPage.heroArticleSlug : undefined;
  if (data.frontPage.heroArticleSlug && !heroArticleSlug) {
    notes.push(`Dropped unpublished hero article '${data.frontPage.heroArticleSlug}'.`);
  }

  const featuredDispatchSlug =
    data.frontPage.featuredDispatchSlug && publishedDispatchSlugs.has(data.frontPage.featuredDispatchSlug)
      ? data.frontPage.featuredDispatchSlug
      : undefined;
  if (data.frontPage.featuredDispatchSlug && !featuredDispatchSlug) {
    notes.push(`Dropped unpublished featured dispatch '${data.frontPage.featuredDispatchSlug}'.`);
  }

  return {
    ...data.frontPage,
    heroArticleSlug,
    featuredDispatchSlug,
    tickerArticleSlugs: keepPublishedArticleSlugs(data.frontPage.tickerArticleSlugs),
    cultureStorySlugs: keepPublishedArticleSlugs(data.frontPage.cultureStorySlugs),
    briefArticleSlugs: keepPublishedArticleSlugs(data.frontPage.briefArticleSlugs),
    vaultArticleSlugs: keepPublishedArticleSlugs(data.frontPage.vaultArticleSlugs),
    isValid: notes.length === 0 || Boolean(heroArticleSlug || featuredDispatchSlug),
    validationNotes: notes,
  };
}

export function compileNewsroomSitePayload(data: NewsroomData, now = new Date().toISOString()): NewsroomGeneratedSitePayload {
  const publishedArticles = sortArticles(data.articles.filter((record) => record.status === "published"));
  const publishedDispatch = sortDispatch(data.dispatch.filter((record) => record.status === "published"));
  const publishedArticleSlugs = new Set(publishedArticles.map((record) => record.slug));
  const publishedDispatchSlugs = new Set(publishedDispatch.map((record) => record.slug));

  return {
    generatedAt: now,
    sourceRoot: "newsroom",
    articles: publishedArticles.map((record) => ({
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
      relatedSlugs: record.relatedSlugs.filter((slug) => slug !== record.slug),
    })),
    dispatchIssues: publishedDispatch.map((record) => ({
      id: record.id,
      slug: record.slug,
      issueTitle: record.issueTitle,
      issueNumber: record.issueNumber,
      editorsNote: record.editorsNote,
      publishDate: record.publishDate,
      leadStorySlug: record.leadStorySlug,
      items: record.items,
      status: "published" as const,
    })),
    frontPagePlan: buildFrontPagePlan(data, publishedArticleSlugs, publishedDispatchSlugs),
  };
}

function validateWorkflow(workflow: WorkflowConfig) {
  const issues: ValidationIssue[] = [];

  for (const status of editorialStatuses) {
    if (!workflow.statuses.includes(status)) {
      issues.push(issue("newsroom/config/workflow.json", `Missing workflow status '${status}'.`));
    }
    if (!Array.isArray(workflow.transitions[status])) {
      issues.push(issue("newsroom/config/workflow.json", `Missing transition list for '${status}'.`));
    }
  }

  if (workflow.distribution.status !== "deferred") {
    issues.push(issue("newsroom/config/workflow.json", "Distribution must remain deferred in Phase 2."));
  }

  return issues;
}

function validateAssignmentRecord(record: AssignmentRecord, path: string) {
  const issues: ValidationIssue[] = [];
  if (!isNonEmptyString(record.id) || !isNonEmptyString(record.slug) || !isNonEmptyString(record.title)) {
    issues.push(issue(path, "Assignment must include id, slug, and title."));
  }
  if (!isStringArray(record.dependencies)) {
    issues.push(issue(path, "Assignment dependencies must be a string array."));
  }
  if (!isStringArray(record.deliverables)) {
    issues.push(issue(path, "Assignment deliverables must be a string array."));
  }
  return issues;
}

function validateApprovalRecord(record: ApprovalRecord, path: string) {
  const issues: ValidationIssue[] = [];
  if (!isNonEmptyString(record.id) || !isNonEmptyString(record.recordId) || !isNonEmptyString(record.summary)) {
    issues.push(issue(path, "Approval must include id, recordId, and summary."));
  }
  return issues;
}

function validateArticleRecord(record: ArticleRecord, path: string) {
  const issues: ValidationIssue[] = [];
  if (!record.headline || !record.dek || !record.excerpt) {
    issues.push(issue(path, "Article must include headline, dek, and excerpt."));
  }
  if (!isStringArray(record.body) || record.body.length === 0) {
    issues.push(issue(path, "Article body must contain at least one paragraph."));
  }
  if (!isStringArray(record.assignmentIds) || !isStringArray(record.approvalIds)) {
    issues.push(issue(path, "Article assignmentIds and approvalIds must be string arrays."));
  }
  if (record.publishAt && !hasParseableDate(record.publishAt)) {
    issues.push(issue(path, "Article publishAt must be a valid date-time string."));
  }
  return issues;
}

function validateDispatchRecord(record: DispatchRecord, path: string) {
  const issues: ValidationIssue[] = [];
  if (!record.issueTitle || !record.publishDate) {
    issues.push(issue(path, "Dispatch must include issueTitle and publishDate."));
  }
  if (!Array.isArray(record.items) || record.items.length === 0) {
    issues.push(issue(path, "Dispatch must contain at least one item."));
  }
  return issues;
}

function validateSourceRecord(record: SourceRegistryRecord, path: string) {
  const issues: ValidationIssue[] = [];
  if (!isNonEmptyString(record.name)) {
    issues.push(issue(path, "Source registry entry must include a name."));
  }
  if (!Array.isArray(record.pendingEvents)) {
    issues.push(issue(path, "Source registry entry must include pendingEvents."));
  }
  for (const [index, event] of record.pendingEvents.entries()) {
    if (!isNonEmptyString(event.id) || !isNonEmptyString(event.headline)) {
      issues.push(issue(path, `Pending event ${index} must include id and headline.`));
    }
  }
  return issues;
}

function validateSignalRecord(record: NewsSignalRecord, path: string) {
  const issues: ValidationIssue[] = [];
  if (!isNonEmptyString(record.sourceId) || !isNonEmptyString(record.title)) {
    issues.push(issue(path, "Signal must include sourceId and title."));
  }
  return issues;
}

function validateDraftRecord(record: DraftArtifact, path: string) {
  const issues: ValidationIssue[] = [];
  if (!record.recordId || !record.assignmentId || !record.title) {
    issues.push(issue(path, "Draft must include recordId, assignmentId, and title."));
  }
  if (!isStringArray(record.body) || record.body.length === 0) {
    issues.push(issue(path, "Draft body must contain at least one line."));
  }
  return issues;
}

function validateReviewRecord(record: ReviewArtifact, path: string) {
  const issues: ValidationIssue[] = [];
  if (!record.draftId || !record.recordId || !record.summary) {
    issues.push(issue(path, "Review must include draftId, recordId, and summary."));
  }
  if (!isStringArray(record.changes)) {
    issues.push(issue(path, "Review changes must be a string array."));
  }
  return issues;
}

function validateGeneratedState(data: NewsroomData) {
  const issues: ValidationIssue[] = [];
  if (data.publishQueue.schemaVersion !== 1) {
    issues.push(issue("newsroom/generated/publish-queue.json", "Publish queue schemaVersion must be 1."));
  }
  if (data.reviewSummary.schemaVersion !== 1) {
    issues.push(issue("newsroom/generated/review-summary.json", "Review summary schemaVersion must be 1."));
  }
  if (data.ingestionReport.schemaVersion !== 1) {
    issues.push(issue("newsroom/generated/ingestion-report.json", "Ingestion report schemaVersion must be 1."));
  }
  if (data.retryState.schemaVersion !== 1) {
    issues.push(issue("newsroom/generated/retry-state.json", "Retry state schemaVersion must be 1."));
  }
  return issues;
}

function validateFrontPagePlan(data: NewsroomData) {
  const issues: ValidationIssue[] = [];
  const publishedArticleSlugs = new Set(data.articles.filter((record) => record.status === "published").map((record) => record.slug));
  const publishedDispatchSlugs = new Set(data.dispatch.filter((record) => record.status === "published").map((record) => record.slug));

  for (const slug of data.frontPage.tickerArticleSlugs) {
    if (!publishedArticleSlugs.has(slug)) {
      issues.push(issue("newsroom/state/frontpage.json", `Ticker article '${slug}' is not published.`, "warning"));
    }
  }
  if (data.frontPage.heroArticleSlug && !publishedArticleSlugs.has(data.frontPage.heroArticleSlug)) {
    issues.push(issue("newsroom/state/frontpage.json", `Hero article '${data.frontPage.heroArticleSlug}' is not published.`, "warning"));
  }
  if (data.frontPage.featuredDispatchSlug && !publishedDispatchSlugs.has(data.frontPage.featuredDispatchSlug)) {
    issues.push(issue("newsroom/state/frontpage.json", `Featured dispatch '${data.frontPage.featuredDispatchSlug}' is not published.`, "warning"));
  }

  return issues;
}

function validateCrossReferences(data: NewsroomData) {
  const issues: ValidationIssue[] = [];
  const assignmentIds = new Set(data.assignments.map((record) => record.id));
  const approvalIds = new Set(data.approvals.map((record) => record.id));
  const sourceIds = new Set(data.sources.map((record) => record.id));
  const signalIds = new Set(data.signals.map((record) => record.id));
  const draftIds = new Set(data.drafts.map((record) => record.id));
  const reviewIds = new Set(data.reviews.map((record) => record.id));
  const articleIds = new Set(data.articles.map((record) => record.id));
  const articleSlugs = new Set(data.articles.map((record) => record.slug));
  const dispatchIds = new Set(data.dispatch.map((record) => record.id));

  for (const record of data.articles) {
    for (const assignmentId of record.assignmentIds) {
      if (!assignmentIds.has(assignmentId)) {
        issues.push(issue(`newsroom/content/articles/${record.slug}.json`, `Missing assignment '${assignmentId}'.`));
      }
    }
    for (const approvalId of record.approvalIds) {
      if (!approvalIds.has(approvalId)) {
        issues.push(issue(`newsroom/content/articles/${record.slug}.json`, `Missing approval '${approvalId}'.`));
      }
    }
    for (const relatedSlug of record.relatedSlugs) {
      if (relatedSlug !== record.slug && !articleSlugs.has(relatedSlug)) {
        issues.push(issue(`newsroom/content/articles/${record.slug}.json`, `Related article '${relatedSlug}' does not exist.`, "warning"));
      }
    }
    if (record.latestDraftId && !draftIds.has(record.latestDraftId)) {
      issues.push(issue(`newsroom/content/articles/${record.slug}.json`, `Latest draft '${record.latestDraftId}' does not exist.`, "warning"));
    }
    if (record.latestReviewId && !reviewIds.has(record.latestReviewId)) {
      issues.push(issue(`newsroom/content/articles/${record.slug}.json`, `Latest review '${record.latestReviewId}' does not exist.`, "warning"));
    }
  }

  for (const record of data.dispatch) {
    for (const assignmentId of record.assignmentIds) {
      if (!assignmentIds.has(assignmentId)) {
        issues.push(issue(`newsroom/content/dispatch/${record.slug}.json`, `Missing assignment '${assignmentId}'.`));
      }
    }
    for (const approvalId of record.approvalIds) {
      if (!approvalIds.has(approvalId)) {
        issues.push(issue(`newsroom/content/dispatch/${record.slug}.json`, `Missing approval '${approvalId}'.`));
      }
    }
    if (record.latestDraftId && !draftIds.has(record.latestDraftId)) {
      issues.push(issue(`newsroom/content/dispatch/${record.slug}.json`, `Latest draft '${record.latestDraftId}' does not exist.`, "warning"));
    }
    if (record.latestReviewId && !reviewIds.has(record.latestReviewId)) {
      issues.push(issue(`newsroom/content/dispatch/${record.slug}.json`, `Latest review '${record.latestReviewId}' does not exist.`, "warning"));
    }
  }

  for (const approval of data.approvals) {
    if (approval.recordKind === "article" && !articleIds.has(approval.recordId)) {
      issues.push(issue(`newsroom/approvals/${approval.id}.json`, `Approval points to missing article '${approval.recordId}'.`));
    }
    if (approval.recordKind === "dispatch" && !dispatchIds.has(approval.recordId)) {
      issues.push(issue(`newsroom/approvals/${approval.id}.json`, `Approval points to missing dispatch '${approval.recordId}'.`));
    }
  }

  for (const signal of data.signals) {
    if (!sourceIds.has(signal.sourceId)) {
      issues.push(issue(`newsroom/generated/signals/${signal.slug}.json`, `Signal points to missing source '${signal.sourceId}'.`));
    }
    if (signal.assignmentId && !assignmentIds.has(signal.assignmentId)) {
      issues.push(issue(`newsroom/generated/signals/${signal.slug}.json`, `Signal points to missing assignment '${signal.assignmentId}'.`));
    }
  }

  for (const draft of data.drafts) {
    if (!assignmentIds.has(draft.assignmentId)) {
      issues.push(issue(`newsroom/drafts/${draft.slug}.json`, `Draft points to missing assignment '${draft.assignmentId}'.`));
    }
    for (const signalId of draft.sourceSignalIds) {
      if (!signalIds.has(signalId)) {
        issues.push(issue(`newsroom/drafts/${draft.slug}.json`, `Draft points to missing signal '${signalId}'.`, "warning"));
      }
    }
  }

  for (const review of data.reviews) {
    if (!draftIds.has(review.draftId)) {
      issues.push(issue(`newsroom/reviews/${review.id}.json`, `Review points to missing draft '${review.draftId}'.`));
    }
  }

  for (const queueItem of data.publishQueue.items) {
    const exists = queueItem.recordKind === "article" ? articleIds.has(queueItem.recordId) : dispatchIds.has(queueItem.recordId);
    if (!exists) {
      issues.push(issue("newsroom/generated/publish-queue.json", `Queue item '${queueItem.id}' points to a missing record.`, "warning"));
    }
  }

  return issues;
}

export function validateNewsroomData(data: NewsroomData) {
  const issues: ValidationIssue[] = [];
  issues.push(...validateWorkflow(data.workflow));
  data.assignments.forEach((record) => issues.push(...validateAssignmentRecord(record, `newsroom/assignments/${record.slug}.json`)));
  data.approvals.forEach((record) => issues.push(...validateApprovalRecord(record, `newsroom/approvals/${record.id}.json`)));
  data.articles.forEach((record) => issues.push(...validateArticleRecord(record, `newsroom/content/articles/${record.slug}.json`)));
  data.dispatch.forEach((record) => issues.push(...validateDispatchRecord(record, `newsroom/content/dispatch/${record.slug}.json`)));
  data.sources.forEach((record) => issues.push(...validateSourceRecord(record, `newsroom/sources/${record.slug}.json`)));
  data.signals.forEach((record) => issues.push(...validateSignalRecord(record, `newsroom/generated/signals/${record.slug}.json`)));
  data.drafts.forEach((record) => issues.push(...validateDraftRecord(record, `newsroom/drafts/${record.slug}.json`)));
  data.reviews.forEach((record) => issues.push(...validateReviewRecord(record, `newsroom/reviews/${record.id}.json`)));
  issues.push(...validateGeneratedState(data));
  issues.push(...validateFrontPagePlan(data));
  issues.push(...validateCrossReferences(data));
  return issues;
}

export function buildHealthcheckReport(data: NewsroomData, issues: ValidationIssue[], now = new Date().toISOString()): HealthcheckReport {
  const errors = issues.filter((entry) => entry.severity === "error").map((entry) => `${entry.path}: ${entry.message}`);
  const warnings = issues.filter((entry) => entry.severity === "warning").map((entry) => `${entry.path}: ${entry.message}`);
  const checks = [
    {
      name: "validation",
      ok: errors.length === 0,
      detail: `${errors.length} errors, ${warnings.length} warnings`,
    },
    {
      name: "signals",
      ok: data.sources.filter((source) => source.enabled).length > 0 && data.signals.length > 0,
      detail: `${data.sources.filter((source) => source.enabled).length} enabled sources, ${data.signals.length} signals`,
    },
    {
      name: "reviews",
      ok: data.reviewSummary.openReviews.every((review) => isNonEmptyString(review.draftId) && isNonEmptyString(review.recordId)),
      detail: `${data.reviewSummary.openReviews.length} open review artifact(s) tracked`,
    },
    {
      name: "publishing",
      ok: !data.publishQueue.items.some((entry) => entry.status === "failed"),
      detail: `${data.publishQueue.items.filter((entry) => entry.status === "blocked").length} blocked queue item(s)`,
    },
  ];

  return {
    schemaVersion: 1,
    generatedAt: now,
    healthy: errors.length === 0,
    checks,
    errors,
    warnings,
  };
}

export function buildHealthcheckSummary(data: NewsroomData, issues: ValidationIssue[], now = new Date().toISOString()) {
  return buildHealthcheckReport(data, issues, now);
}

export function createEmptyRetryState(now = new Date().toISOString()) {
  return {
    schemaVersion: 1,
    updatedAt: now,
    retries: {},
  } as const;
}
