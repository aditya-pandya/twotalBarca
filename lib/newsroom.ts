import type {
  ApprovalDecision,
  ApprovalRecord,
  ApprovalRole,
  ArticleRecord,
  DashboardSummary,
  DispatchRecord,
  EditorialRecordKind,
  EditorialStatus,
  FrontPagePlan,
  GeneratedFrontPagePlan,
  NewsroomData,
  NewsroomGeneratedSitePayload,
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
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function hasIsoishDate(value: unknown): value is string {
  return isNonEmptyString(value) && !Number.isNaN(Date.parse(value));
}

function compareDateDesc(a?: string, b?: string) {
  const left = a ? Date.parse(a) : 0;
  const right = b ? Date.parse(b) : 0;
  return right - left;
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function buildIssue(path: string, message: string, severity: ValidationIssue["severity"] = "error"): ValidationIssue {
  return { severity, path, message };
}

function approvalsForRecord(
  approvals: ApprovalRecord[],
  recordKind: EditorialRecordKind,
  recordId: string,
  approvalIds: string[],
) {
  const approvalSet = new Set(approvalIds);
  return approvals.filter((approval) => approval.recordKind === recordKind && approval.recordId === recordId && approvalSet.has(approval.id));
}

export function getRequiredApprovals(
  workflow: Pick<WorkflowConfig, "requiredApprovals"> | undefined,
  kind: EditorialRecordKind,
) {
  return workflow?.requiredApprovals?.[kind] ?? defaultRequiredApprovals[kind];
}

export function getApprovalCoverage(
  approvalIds: string[],
  approvals: ApprovalRecord[],
  workflow: Pick<WorkflowConfig, "requiredApprovals"> | undefined,
  recordKind: EditorialRecordKind,
  recordId: string,
) {
  const matched = approvalsForRecord(approvals, recordKind, recordId, approvalIds);
  const roleDecisionMap = new Map<ApprovalRole, ApprovalDecision>();

  matched.forEach((approval) => {
    const current = roleDecisionMap.get(approval.role);

    if (current !== "blocked") {
      roleDecisionMap.set(approval.role, approval.decision);
    }
  });

  const required = getRequiredApprovals(workflow, recordKind);
  const missing = required.filter((role) => roleDecisionMap.get(role) !== "approved");
  const blocked = required.filter((role) => roleDecisionMap.get(role) === "blocked");

  return {
    matched,
    required,
    missing,
    blocked,
  };
}

export function canTransitionStatus(
  from: EditorialStatus,
  to: EditorialStatus,
  workflow: Pick<WorkflowConfig, "transitions"> | undefined,
) {
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

function validateWorkflow(workflow: WorkflowConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  editorialStatuses.forEach((status) => {
    if (!workflow.statuses.includes(status)) {
      issues.push(buildIssue("newsroom/config/workflow.json", `Missing workflow status '${status}'.`));
    }
  });

  editorialStatuses.forEach((status) => {
    const transitions = workflow.transitions[status];

    if (!Array.isArray(transitions)) {
      issues.push(buildIssue("newsroom/config/workflow.json", `Missing transition list for '${status}'.`));
      return;
    }

    transitions.forEach((target) => {
      if (!editorialStatuses.includes(target)) {
        issues.push(buildIssue("newsroom/config/workflow.json", `Invalid transition target '${target}' from '${status}'.`));
      }
    });
  });

  (["article", "dispatch"] as const).forEach((kind) => {
    const approvals = workflow.requiredApprovals[kind];

    if (!Array.isArray(approvals) || approvals.length === 0) {
      issues.push(buildIssue("newsroom/config/workflow.json", `Workflow must require at least one approval for ${kind}.`));
    }
  });

  return issues;
}

function validateAssignmentRecord(record: unknown, path: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!isObject(record)) {
    return [buildIssue(path, "Assignment record must be an object.")];
  }

  ["id", "slug", "title", "owner", "approver", "brief", "deadline", "createdAt", "updatedAt"].forEach((field) => {
    if (!isNonEmptyString(record[field])) {
      issues.push(buildIssue(path, `Assignment field '${field}' must be a non-empty string.`));
    }
  });

  if (!isStringArray(record.dependencies)) {
    issues.push(buildIssue(path, "Assignment dependencies must be a string array."));
  }

  if (!isStringArray(record.deliverables)) {
    issues.push(buildIssue(path, "Assignment deliverables must be a string array."));
  }

  return issues;
}

function validateApprovalRecord(record: unknown, path: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!isObject(record)) {
    return [buildIssue(path, "Approval record must be an object.")];
  }

  ["id", "recordId", "summary", "createdAt"].forEach((field) => {
    if (!isNonEmptyString(record[field])) {
      issues.push(buildIssue(path, `Approval field '${field}' must be a non-empty string.`));
    }
  });

  if (!["article", "dispatch"].includes(String(record.recordKind))) {
    issues.push(buildIssue(path, "Approval recordKind must be 'article' or 'dispatch'."));
  }

  if (!["copy-chief", "editor-in-chief", "ceo-publisher"].includes(String(record.role))) {
    issues.push(buildIssue(path, "Approval role is invalid."));
  }

  if (!["approved", "changes_requested", "blocked"].includes(String(record.decision))) {
    issues.push(buildIssue(path, "Approval decision is invalid."));
  }

  return issues;
}

function validateArticleRecord(record: unknown, path: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!isObject(record)) {
    return [buildIssue(path, "Article record must be an object.")];
  }

  const stringFields = [
    "id",
    "slug",
    "headline",
    "dek",
    "excerpt",
    "section",
    "sectionSlug",
    "type",
    "author",
    "date",
    "readTime",
    "readingTime",
    "heroCaption",
    "heroCredit",
    "pullQuote",
    "quoteBy",
    "conviction",
    "ritual",
    "seasonSlug",
    "createdAt",
    "updatedAt",
    "distributionStatus",
  ];

  stringFields.forEach((field) => {
    if (!isNonEmptyString(record[field])) {
      issues.push(buildIssue(path, `Article field '${field}' must be a non-empty string.`));
    }
  });

  if (!editorialStatuses.includes(String(record.status) as EditorialStatus)) {
    issues.push(buildIssue(path, "Article status is invalid."));
  }

  if (!Array.isArray(record.body) || record.body.some((entry) => !isNonEmptyString(entry))) {
    issues.push(buildIssue(path, "Article body must be a non-empty string array."));
  }

  if (!Array.isArray(record.timeline) || record.timeline.some((entry) => !isObject(entry) || !isNonEmptyString(entry.year) || !isNonEmptyString(entry.note))) {
    issues.push(buildIssue(path, "Article timeline entries must include year and note."));
  }

  ["topics", "topicSlugs", "personSlugs", "relatedSlugs", "assignmentIds", "approvalIds"].forEach((field) => {
    if (!isStringArray(record[field])) {
      issues.push(buildIssue(path, `Article field '${field}' must be a string array.`));
    }
  });

  if (!isObject(record.heroImage) || !isNonEmptyString(record.heroImage.src) || !isNonEmptyString(record.heroImage.alt)) {
    issues.push(buildIssue(path, "Article heroImage must include src and alt."));
  }

  if (record.publishAt && !hasIsoishDate(record.publishAt)) {
    issues.push(buildIssue(path, "Article publishAt must be a parseable date-time string."));
  }

  if (record.publishedAt && !hasIsoishDate(record.publishedAt)) {
    issues.push(buildIssue(path, "Article publishedAt must be a parseable date-time string."));
  }

  return issues;
}

function validateDispatchRecord(record: unknown, path: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!isObject(record)) {
    return [buildIssue(path, "Dispatch record must be an object.")];
  }

  ["id", "slug", "issueTitle", "editorsNote", "publishDate", "leadStorySlug", "createdAt", "updatedAt", "distributionStatus"].forEach((field) => {
    if (!isNonEmptyString(record[field])) {
      issues.push(buildIssue(path, `Dispatch field '${field}' must be a non-empty string.`));
    }
  });

  if (!editorialStatuses.includes(String(record.status) as EditorialStatus)) {
    issues.push(buildIssue(path, "Dispatch status is invalid."));
  }

  if (typeof record.issueNumber !== "number" || !Number.isInteger(record.issueNumber) || record.issueNumber < 1) {
    issues.push(buildIssue(path, "Dispatch issueNumber must be a positive integer."));
  }

  if (!Array.isArray(record.items) || record.items.length === 0) {
    issues.push(buildIssue(path, "Dispatch must contain at least one item."));
  } else {
    record.items.forEach((item, index) => {
      if (!isObject(item)) {
        issues.push(buildIssue(path, `Dispatch item ${index} must be an object.`));
        return;
      }

      ["headline", "summary", "link", "itemType"].forEach((field) => {
        if (!isNonEmptyString(item[field])) {
          issues.push(buildIssue(path, `Dispatch item ${index} field '${field}' must be a non-empty string.`));
        }
      });
    });
  }

  ["assignmentIds", "approvalIds"].forEach((field) => {
    if (!isStringArray(record[field])) {
      issues.push(buildIssue(path, `Dispatch field '${field}' must be a string array.`));
    }
  });

  if (record.publishAt && !hasIsoishDate(record.publishAt)) {
    issues.push(buildIssue(path, "Dispatch publishAt must be a parseable date-time string."));
  }

  if (record.publishedAt && !hasIsoishDate(record.publishedAt)) {
    issues.push(buildIssue(path, "Dispatch publishedAt must be a parseable date-time string."));
  }

  return issues;
}

function validateFrontPagePlan(
  frontPage: FrontPagePlan,
  articles: ArticleRecord[],
  dispatch: DispatchRecord[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const publishedArticleSlugs = new Set(articles.filter((record) => record.status === "published").map((record) => record.slug));
  const publishedDispatchSlugs = new Set(dispatch.filter((record) => record.status === "published").map((record) => record.slug));

  const ensurePublishedSlug = (slug: string | undefined, path: string, kind: "article" | "dispatch") => {
    if (!slug) {
      return;
    }

    const set = kind === "article" ? publishedArticleSlugs : publishedDispatchSlugs;

    if (!set.has(slug)) {
      issues.push(buildIssue(path, `${kind} slug '${slug}' is not published and cannot drive the front page.`, "warning"));
    }
  };

  ensurePublishedSlug(frontPage.heroArticleSlug, "newsroom/state/frontpage.json", "article");
  ensurePublishedSlug(frontPage.featuredDispatchSlug, "newsroom/state/frontpage.json", "dispatch");
  frontPage.tickerArticleSlugs.forEach((slug) => ensurePublishedSlug(slug, "newsroom/state/frontpage.json", "article"));
  frontPage.cultureStorySlugs.forEach((slug) => ensurePublishedSlug(slug, "newsroom/state/frontpage.json", "article"));
  frontPage.briefArticleSlugs.forEach((slug) => ensurePublishedSlug(slug, "newsroom/state/frontpage.json", "article"));
  frontPage.vaultArticleSlugs.forEach((slug) => ensurePublishedSlug(slug, "newsroom/state/frontpage.json", "article"));

  return issues;
}

function validateCrossReferences(data: NewsroomData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const assignmentIds = new Set(data.assignments.map((record) => record.id));
  const approvalIds = new Set(data.approvals.map((record) => record.id));
  const articleIds = new Set(data.articles.map((record) => record.id));
  const articleSlugs = new Set(data.articles.map((record) => record.slug));
  const publishedArticleSlugs = new Set(data.articles.filter((record) => record.status === "published").map((record) => record.slug));

  data.articles.forEach((record) => {
    record.assignmentIds.forEach((assignmentId) => {
      if (!assignmentIds.has(assignmentId)) {
        issues.push(buildIssue(`newsroom/content/articles/${record.slug}.json`, `Missing assignment '${assignmentId}'.`));
      }
    });

    record.approvalIds.forEach((approvalId) => {
      if (!approvalIds.has(approvalId)) {
        issues.push(buildIssue(`newsroom/content/articles/${record.slug}.json`, `Missing approval '${approvalId}'.`));
      }
    });

    record.relatedSlugs.forEach((slug) => {
      if (slug !== record.slug && !articleSlugs.has(slug)) {
        issues.push(buildIssue(`newsroom/content/articles/${record.slug}.json`, `Related slug '${slug}' does not exist in newsroom article records.`, "warning"));
      }
    });

    if (record.status === "published") {
      const coverage = getApprovalCoverage(record.approvalIds, data.approvals, data.workflow, "article", record.id);

      if (coverage.missing.length > 0) {
        issues.push(buildIssue(`newsroom/content/articles/${record.slug}.json`, `Published article is missing required approvals: ${coverage.missing.join(", ")}.`));
      }
    }
  });

  data.dispatch.forEach((record) => {
    record.assignmentIds.forEach((assignmentId) => {
      if (!assignmentIds.has(assignmentId)) {
        issues.push(buildIssue(`newsroom/content/dispatch/${record.slug}.json`, `Missing assignment '${assignmentId}'.`));
      }
    });

    record.approvalIds.forEach((approvalId) => {
      if (!approvalIds.has(approvalId)) {
        issues.push(buildIssue(`newsroom/content/dispatch/${record.slug}.json`, `Missing approval '${approvalId}'.`));
      }
    });

    if (!articleSlugs.has(record.leadStorySlug)) {
      issues.push(buildIssue(`newsroom/content/dispatch/${record.slug}.json`, `Lead story '${record.leadStorySlug}' does not exist.`));
    }

    record.items.forEach((item, index) => {
      const slug = item.link.match(/^\/article\/(.+)$/)?.[1];

      if (slug && !publishedArticleSlugs.has(slug)) {
        issues.push(buildIssue(`newsroom/content/dispatch/${record.slug}.json`, `Dispatch item ${index} points to unpublished article '${slug}'.`, "warning"));
      }
    });

    if (record.status === "published") {
      const coverage = getApprovalCoverage(record.approvalIds, data.approvals, data.workflow, "dispatch", record.id);

      if (coverage.missing.length > 0) {
        issues.push(buildIssue(`newsroom/content/dispatch/${record.slug}.json`, `Published dispatch is missing required approvals: ${coverage.missing.join(", ")}.`));
      }
    }
  });

  data.approvals.forEach((record) => {
    if (record.recordKind === "article" && !articleIds.has(record.recordId)) {
      issues.push(buildIssue(`newsroom/approvals/${record.id}.json`, `Approval points to missing article '${record.recordId}'.`));
    }
  });

  return issues;
}

export function validateNewsroomData(data: NewsroomData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  issues.push(...validateWorkflow(data.workflow));

  data.assignments.forEach((record) => {
    issues.push(...validateAssignmentRecord(record, `newsroom/assignments/${record.slug}.json`));
  });

  data.approvals.forEach((record) => {
    issues.push(...validateApprovalRecord(record, `newsroom/approvals/${record.id}.json`));
  });

  data.articles.forEach((record) => {
    issues.push(...validateArticleRecord(record, `newsroom/content/articles/${record.slug}.json`));
  });

  data.dispatch.forEach((record) => {
    issues.push(...validateDispatchRecord(record, `newsroom/content/dispatch/${record.slug}.json`));
  });

  issues.push(...validateFrontPagePlan(data.frontPage, data.articles, data.dispatch));
  issues.push(...validateCrossReferences(data));

  return issues;
}

function sortArticles(records: ArticleRecord[]) {
  return [...records].sort((left, right) => compareDateDesc(left.publishedAt ?? left.publishAt, right.publishedAt ?? right.publishAt));
}

function sortDispatch(records: DispatchRecord[]) {
  return [...records].sort((left, right) => {
    const byDate = compareDateDesc(left.publishedAt ?? left.publishAt, right.publishedAt ?? right.publishAt);
    return byDate !== 0 ? byDate : right.issueNumber - left.issueNumber;
  });
}

function buildFrontPagePlan(data: NewsroomData, publishedArticleSlugs: Set<string>, publishedDispatchSlugs: Set<string>): GeneratedFrontPagePlan {
  const notes: string[] = [];

  const pickPublishedArticleSlugs = (slugs: string[]) => unique(slugs).filter((slug) => {
    if (publishedArticleSlugs.has(slug)) {
      return true;
    }

    notes.push(`Dropped unpublished front-page article reference '${slug}'.`);
    return false;
  });

  const featuredDispatchSlug =
    data.frontPage.featuredDispatchSlug && publishedDispatchSlugs.has(data.frontPage.featuredDispatchSlug)
      ? data.frontPage.featuredDispatchSlug
      : undefined;

  if (data.frontPage.featuredDispatchSlug && !featuredDispatchSlug) {
    notes.push(`Dropped unpublished featured dispatch '${data.frontPage.featuredDispatchSlug}'.`);
  }

  const heroArticleSlug =
    data.frontPage.heroArticleSlug && publishedArticleSlugs.has(data.frontPage.heroArticleSlug)
      ? data.frontPage.heroArticleSlug
      : undefined;

  if (data.frontPage.heroArticleSlug && !heroArticleSlug) {
    notes.push(`Dropped unpublished hero article '${data.frontPage.heroArticleSlug}'.`);
  }

  return {
    ...data.frontPage,
    heroArticleSlug,
    featuredDispatchSlug,
    tickerArticleSlugs: pickPublishedArticleSlugs(data.frontPage.tickerArticleSlugs),
    cultureStorySlugs: pickPublishedArticleSlugs(data.frontPage.cultureStorySlugs),
    briefArticleSlugs: pickPublishedArticleSlugs(data.frontPage.briefArticleSlugs),
    vaultArticleSlugs: pickPublishedArticleSlugs(data.frontPage.vaultArticleSlugs),
    isValid: Boolean(heroArticleSlug || featuredDispatchSlug || notes.length === 0),
    validationNotes: notes,
  };
}

export function compileNewsroomSitePayload(data: NewsroomData): NewsroomGeneratedSitePayload {
  const publishedArticles = sortArticles(data.articles.filter((record) => record.status === "published"));
  const publishedDispatch = sortDispatch(data.dispatch.filter((record) => record.status === "published"));
  const publishedArticleSlugs = new Set(publishedArticles.map((record) => record.slug));
  const publishedDispatchSlugs = new Set(publishedDispatch.map((record) => record.slug));

  return {
    generatedAt: new Date().toISOString(),
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
      status: "published",
    })),
    frontPagePlan: buildFrontPagePlan(data, publishedArticleSlugs, publishedDispatchSlugs),
  };
}

export function buildDashboardSummary(data: NewsroomData): DashboardSummary {
  const byStatus = editorialStatuses.reduce<Record<EditorialStatus, number>>((accumulator, status) => {
    accumulator[status] = 0;
    return accumulator;
  }, {} as Record<EditorialStatus, number>);

  [...data.articles, ...data.dispatch].forEach((record) => {
    byStatus[record.status] += 1;
  });

  const pendingApproval = [...data.articles, ...data.dispatch]
    .filter((record) => ["copy_review", "approved", "scheduled"].includes(record.status))
    .filter((record) => getApprovalCoverage(record.approvalIds, data.approvals, data.workflow, record.kind, record.id).missing.length > 0)
    .map((record) => `${record.kind}:${record.slug}`);

  return {
    counts: {
      articles: data.articles.length,
      dispatch: data.dispatch.length,
      assignments: data.assignments.length,
      approvals: data.approvals.length,
    },
    byStatus,
    published: {
      articleSlugs: sortArticles(data.articles.filter((record) => record.status === "published")).map((record) => record.slug),
      dispatchSlugs: sortDispatch(data.dispatch.filter((record) => record.status === "published")).map((record) => record.slug),
    },
    pendingApproval,
    frontPage: {
      heroArticleSlug: data.frontPage.heroArticleSlug,
      featuredDispatchSlug: data.frontPage.featuredDispatchSlug,
    },
  };
}
