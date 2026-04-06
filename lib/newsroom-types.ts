export type EditorialRecordKind = "article" | "dispatch";

export type EditorialStatus =
  | "draft"
  | "assigned"
  | "in_progress"
  | "in_review"
  | "copy_review"
  | "approved"
  | "scheduled"
  | "published"
  | "killed";

export type ApprovalRole = "copy-chief" | "editor-in-chief" | "ceo-publisher";

export type ApprovalDecision = "approved" | "changes_requested" | "blocked";

export type MediaAssetRecord = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
};

export type TimelineEntry = {
  year: string;
  note: string;
};

export type ApprovalRecord = {
  id: string;
  recordKind: EditorialRecordKind;
  recordId: string;
  role: ApprovalRole;
  decision: ApprovalDecision;
  summary: string;
  createdAt: string;
};

export type AssignmentRecord = {
  id: string;
  slug: string;
  title: string;
  kind: EditorialRecordKind | "frontpage" | "distribution";
  status: "open" | "active" | "blocked" | "done" | "canceled";
  priority: "low" | "medium" | "high" | "critical";
  owner: string;
  approver: string;
  brief: string;
  deadline: string;
  dependencies: string[];
  deliverables: string[];
  createdAt: string;
  updatedAt: string;
};

export type ArticleRecord = {
  schemaVersion: 1;
  kind: "article";
  id: string;
  slug: string;
  status: EditorialStatus;
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
  heroImage: MediaAssetRecord;
  heroCaption: string;
  heroCredit: string;
  body: string[];
  pullQuote: string;
  quoteBy: string;
  conviction: string;
  ritual: string;
  timeline: TimelineEntry[];
  topics: string[];
  topicSlugs: string[];
  seasonSlug: string;
  personSlugs: string[];
  historicalEra?: string;
  seoTitle?: string;
  metaDescription?: string;
  relatedSlugs: string[];
  assignmentIds: string[];
  approvalIds: string[];
  createdAt: string;
  updatedAt: string;
  publishAt?: string;
  publishedAt?: string;
  distributionStatus: "deferred";
  notes?: string;
};

export type DispatchItemRecord = {
  headline: string;
  summary: string;
  link: string;
  itemType: "must-read" | "note" | "quote" | "stat" | "archive-pick" | "watchlist";
};

export type DispatchRecord = {
  schemaVersion: 1;
  kind: "dispatch";
  id: string;
  slug: string;
  status: EditorialStatus;
  issueTitle: string;
  issueNumber: number;
  editorsNote: string;
  publishDate: string;
  publishAt?: string;
  publishedAt?: string;
  leadStorySlug: string;
  items: DispatchItemRecord[];
  assignmentIds: string[];
  approvalIds: string[];
  createdAt: string;
  updatedAt: string;
  distributionStatus: "deferred";
  notes?: string;
};

export type FrontPagePlan = {
  activePlanId: string;
  updatedAt: string;
  heroArticleSlug?: string;
  tickerArticleSlugs: string[];
  cultureStorySlugs: string[];
  briefArticleSlugs: string[];
  vaultArticleSlugs: string[];
  featuredDispatchSlug?: string;
  notes: string;
};

export type EditorialCalendarState = {
  weekOf: string;
  updatedAt: string;
  focus: string;
  priorities: string[];
  plannedAssignments: string[];
  plannedDispatchSlug?: string;
};

export type WorkflowConfig = {
  statuses: EditorialStatus[];
  transitions: Record<EditorialStatus, EditorialStatus[]>;
  requiredApprovals: Record<EditorialRecordKind, ApprovalRole[]>;
  distribution: {
    status: "deferred";
    specPath: string;
    queueDir: string;
  };
};

export type NewsroomData = {
  workflow: WorkflowConfig;
  articles: ArticleRecord[];
  dispatch: DispatchRecord[];
  assignments: AssignmentRecord[];
  approvals: ApprovalRecord[];
  frontPage: FrontPagePlan;
  editorialCalendar: EditorialCalendarState;
};

export type ValidationIssue = {
  severity: "error" | "warning";
  path: string;
  message: string;
};

export type DashboardSummary = {
  counts: {
    articles: number;
    dispatch: number;
    assignments: number;
    approvals: number;
  };
  byStatus: Record<EditorialStatus, number>;
  published: {
    articleSlugs: string[];
    dispatchSlugs: string[];
  };
  pendingApproval: string[];
  frontPage: {
    heroArticleSlug?: string;
    featuredDispatchSlug?: string;
  };
};

export type GeneratedSiteArticle = Omit<ArticleRecord, "schemaVersion" | "kind" | "status" | "assignmentIds" | "approvalIds" | "createdAt" | "updatedAt" | "publishAt" | "publishedAt" | "distributionStatus" | "notes">;

export type GeneratedSiteDispatch = Omit<DispatchRecord, "schemaVersion" | "kind" | "status" | "assignmentIds" | "approvalIds" | "createdAt" | "updatedAt" | "publishAt" | "publishedAt" | "distributionStatus" | "notes"> & {
  status: "published";
};

export type GeneratedFrontPagePlan = FrontPagePlan & {
  isValid: boolean;
  validationNotes: string[];
};

export type NewsroomGeneratedSitePayload = {
  generatedAt: string;
  sourceRoot: "newsroom";
  articles: GeneratedSiteArticle[];
  dispatchIssues: GeneratedSiteDispatch[];
  frontPagePlan: GeneratedFrontPagePlan;
};
