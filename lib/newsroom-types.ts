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
export type AssignmentKind = EditorialRecordKind | "frontpage" | "distribution";
export type AssignmentStatus = "open" | "active" | "blocked" | "done" | "canceled";
export type AssignmentPriority = "low" | "medium" | "high" | "critical";

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
  kind: AssignmentKind;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  owner: string;
  approver: string;
  brief: string;
  deadline: string;
  dependencies: string[];
  deliverables: string[];
  createdAt: string;
  updatedAt: string;
  sourceSignalId?: string;
  recordKind?: EditorialRecordKind;
  targetSlug?: string;
};

type EditorialRecordBase = {
  schemaVersion: 1;
  kind: EditorialRecordKind;
  id: string;
  slug: string;
  status: EditorialStatus;
  assignmentIds: string[];
  approvalIds: string[];
  createdAt: string;
  updatedAt: string;
  publishAt?: string;
  publishedAt?: string;
  distributionStatus: "deferred";
  notes?: string;
  latestDraftId?: string;
  latestReviewId?: string;
};

export type ArticleRecord = EditorialRecordBase & {
  kind: "article";
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
};

export type DispatchItemRecord = {
  headline: string;
  summary: string;
  link: string;
  itemType: "must-read" | "note" | "quote" | "stat" | "archive-pick" | "watchlist";
  take?: string;
  commentary?: string;
  whyItMatters?: string;
};

export type DispatchRecord = EditorialRecordBase & {
  kind: "dispatch";
  issueTitle: string;
  issueNumber: number;
  editorsNote: string;
  publishDate: string;
  leadStorySlug: string;
  items: DispatchItemRecord[];
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

export type NewsroomSourceType = "watcher" | "match" | "archive" | "editorial";
export type NewsSignalType = "match" | "news" | "archive_anniversary" | "editorial_follow_up";

export type SignalAssignmentSuggestion = {
  title: string;
  kind: EditorialRecordKind;
  owner: string;
  approver: string;
  deadline: string;
  brief: string;
  deliverables: string[];
};

export type ScoutFeedbackTargetType = "candidate" | "cluster" | "source-lane" | "general-strategy-note";
export type ScoutFeedbackVerdict =
  | "promising"
  | "weak"
  | "noisy"
  | "duplicate"
  | "add-source"
  | "needs-confirmation"
  | "femeni-priority"
  | "club-priority"
  | "imagery-needed";

export type ScoutFeedbackEntry = {
  id: string;
  targetType: ScoutFeedbackTargetType;
  targetId?: string;
  targetLabel: string;
  verdict: ScoutFeedbackVerdict;
  note?: string;
  createdAt: string;
};

export type ScoutFeedbackEntryInput = {
  targetType: ScoutFeedbackTargetType;
  targetId?: string;
  targetLabel: string;
  verdict: ScoutFeedbackVerdict;
  note?: string;
  createdAt?: string;
};

export type ScoutFeedbackState = {
  schemaVersion: 1;
  updatedAt: string;
  entries: ScoutFeedbackEntry[];
};

export type ScoutImageLeadStatus =
  | "usable-lead-image"
  | "review-needed-social-preview"
  | "needs-free-license-replacement"
  | "needs-generation";

export type ScoutImageLead = {
  src: string;
  alt: string;
  href?: string;
  source: string;
  label?: string;
  note?: string;
  credit?: string;
  status: ScoutImageLeadStatus;
};

export type ScoutEvidenceRecord = {
  source: string;
  label: string;
  url?: string;
  excerpt?: string;
  publishedAt?: string;
  engagement?: number;
  image?: ScoutImageLead;
};

export type DiscoveryMode = "live" | "internal";

export type SourcePendingEvent = {
  id: string;
  headline: string;
  summary: string;
  signalType: NewsSignalType;
  eventAt: string;
  urgency: AssignmentPriority;
  tags: string[];
  assignment: SignalAssignmentSuggestion;
  priorityScore?: number;
  priorityReason?: string;
  assignmentTopic?: string;
  evidence?: ScoutEvidenceRecord[];
};

export type SourceRegistryRecord = {
  schemaVersion: 1;
  id: string;
  slug: string;
  name: string;
  type: NewsroomSourceType;
  enabled: boolean;
  cadence: "live" | "hourly" | "daily" | "weekly";
  notes?: string;
  tags: string[];
  pendingEvents: SourcePendingEvent[];
  discoveryMode?: DiscoveryMode;
  lastScoutAt?: string;
};

export type SignalStatus = "new" | "triaged" | "converted" | "ignored";

export type NewsSignalRecord = {
  schemaVersion: 1;
  id: string;
  slug: string;
  sourceId: string;
  sourceSlug: string;
  signalType: NewsSignalType;
  status: SignalStatus;
  title: string;
  summary: string;
  eventAt: string;
  createdAt: string;
  updatedAt: string;
  urgency: AssignmentPriority;
  confidence: number;
  tags: string[];
  assignmentSuggestion: SignalAssignmentSuggestion;
  assignmentId?: string;
  priorityScore?: number;
  priorityReason?: string;
  assignmentTopic?: string;
  discoveryMode?: DiscoveryMode;
  evidence?: ScoutEvidenceRecord[];
};

export type DraftArtifactStatus = "draft" | "needs_changes" | "ready_for_review" | "superseded";

export type DraftArtifact = {
  schemaVersion: 1;
  id: string;
  slug: string;
  recordKind: EditorialRecordKind;
  recordId: string;
  assignmentId: string;
  version: number;
  status: DraftArtifactStatus;
  title: string;
  dek: string;
  excerpt: string;
  body: string[];
  notes: string[];
  sourceSignalIds: string[];
  sourceIds: string[];
  createdAt: string;
  updatedAt: string;
  latest: boolean;
};

export type ReviewArtifactKind = "change_request" | "revision" | "approval_request";
export type ReviewArtifactStatus = "open" | "resolved";

export type ReviewArtifact = {
  schemaVersion: 1;
  id: string;
  draftId: string;
  recordKind: EditorialRecordKind;
  recordId: string;
  kind: ReviewArtifactKind;
  status: ReviewArtifactStatus;
  summary: string;
  requestedBy: string;
  requestedAt: string;
  changes: string[];
  resultingDraftId?: string;
  resolvedAt?: string;
};

export type PublishQueueEntryStatus = "scheduled" | "published" | "blocked" | "failed";

export type PublishQueueEntry = {
  schemaVersion: 1;
  id: string;
  recordKind: EditorialRecordKind;
  recordId: string;
  slug: string;
  status: PublishQueueEntryStatus;
  publishAt: string;
  latestDraftId?: string;
  retryCount: number;
  maxRetries: number;
  lastAttemptAt?: string;
  lastError?: string;
  publishedAt?: string;
  diagnostics: string[];
};

export type PublishQueueState = {
  schemaVersion: 1;
  generatedAt: string;
  items: PublishQueueEntry[];
};

export type ApprovalDiagnostic = {
  slug: string;
  kind: EditorialRecordKind;
  status: EditorialStatus;
  latestDraftId?: string;
  latestReviewId?: string;
  missingApprovals: ApprovalRole[];
  blockedApprovals: ApprovalRole[];
  openReviews: string[];
  diagnostics: string[];
};

export type ReviewSummary = {
  schemaVersion: 1;
  generatedAt: string;
  pendingApprovals: ApprovalDiagnostic[];
  blockedRecords: ApprovalDiagnostic[];
  readyToSchedule: string[];
  openReviews: ReviewArtifact[];
};

export type IngestionReport = {
  schemaVersion: 1;
  generatedAt: string;
  sourceCount: number;
  enabledSourceCount: number;
  signalCount: number;
  assignmentSuggestionCount: number;
  activeSignals: string[];
};

export type BarcaScoutSourceRole = "official" | "trusted" | "chatter" | "reference";
export type BarcaScoutSourceQualityLabel = "core" | "useful" | "watch" | "quiet";

export type BarcaScoutSourceStatus = {
  source: string;
  family: string;
  label: string;
  target: string;
  ok: boolean;
  fetchedAt: string;
  itemCount: number;
  detail: string;
  error?: string;
  sourceRole: BarcaScoutSourceRole;
  sampleItems: string[];
  contributionCount: number;
  contributionEfficiency: number;
  contributionSample: string[];
  matchedCandidateIds: string[];
  matchedCandidateTitles: string[];
  qualityLabel: BarcaScoutSourceQualityLabel;
  repeatLowSignal?: boolean;
  imageLeadCount: number;
};

export type BarcaScoutCandidateCalibration = {
  label: "well-backed" | "mixed" | "needs-trusted-check" | "single-platform" | "women-gap";
  note: string;
  officialEvidenceCount: number;
  trustedEvidenceCount: number;
  chatterEvidenceCount: number;
  referenceEvidenceCount: number;
  sourceFamilyCount: number;
  crossPlatform: boolean;
  needsTrustedConfirmation: boolean;
  needsWomenDepth: boolean;
};

export type BarcaScoutCandidate = {
  id: string;
  title: string;
  summary: string;
  eventAt: string;
  signalType: NewsSignalType;
  urgency: AssignmentPriority;
  tags: string[];
  priorityScore: number;
  priorityReason: string;
  assignmentTopic: string;
  assignmentSuggestion: SignalAssignmentSuggestion;
  calibration: BarcaScoutCandidateCalibration;
  evidence: ScoutEvidenceRecord[];
  imageStatus: ScoutImageLeadStatus;
  imageLead?: ScoutImageLead;
};

export type BarcaScoutThemeCluster = {
  id: string;
  title: string;
  theme: string;
  itemCount: number;
  sourceFamilies: string[];
  sourceRoles: BarcaScoutSourceRole[];
  officialEvidenceCount: number;
  trustedEvidenceCount: number;
  chatterEvidenceCount: number;
  referenceEvidenceCount: number;
  crossPlatform: boolean;
  healthLabel: "cross-platform-confirmed" | "trusted-led" | "chatter-heavy" | "single-platform" | "mixed";
  reviewHint: string;
  candidateIds: string[];
  candidateTitles: string[];
  topTokens: string[];
  representativeEvidence: ScoutEvidenceRecord[];
  imageStatus: ScoutImageLeadStatus;
  imageLead?: ScoutImageLead;
};

export type BarcaScoutCalibrationPrompt = {
  id: string;
  kind:
    | "candidate-needs-trusted-confirmation"
    | "women-coverage-gap"
    | "single-platform-cluster"
    | "duplicate-theme-cluster"
    | "source-quality-gap"
    | "cluster-needs-trusted-check";
  priority: AssignmentPriority;
  title: string;
  summary: string;
  action: string;
  candidateIds: string[];
  clusterIds: string[];
  sourceIds: string[];
};

export type BarcaScoutSourceExpansionSuggestion = {
  id: string;
  title: string;
  summary: string;
  rationale: string;
  suggestedSourceFamilies: string[];
  exampleTargets: string[];
  relatedPromptIds: string[];
};

export type BarcaScoutQualitySummary = {
  headline: string;
  evidenceCount: number;
  sourceCount: number;
  healthySourceCount: number;
  candidateCount: number;
  clusterCount: number;
  crossPlatformClusterCount: number;
  trustedBackedCandidateCount: number;
  chatterHeavyCandidateCount: number;
  womenCoverageGapCount: number;
  weakSourceCount: number;
};

export type BarcaScoutCoverageTrack = {
  id: "men" | "women";
  label: string;
  candidateCount: number;
  officialEvidenceCount: number;
  trustedEvidenceCount: number;
  chatterEvidenceCount: number;
  note: string;
};

export type BarcaScoutCoverageSummary = {
  tracks: BarcaScoutCoverageTrack[];
  weakSpots: string[];
};

export type BarcaScoutImageSummary = {
  candidateLeadCount: number;
  clusterLeadCount: number;
  reviewNeededCount: number;
  replacementNeededCount: number;
  missingCount: number;
};

export type BarcaScoutFeedbackSummary = {
  entryCount: number;
  targetTypeCounts: Record<ScoutFeedbackTargetType, number>;
  verdictCounts: Partial<Record<ScoutFeedbackVerdict, number>>;
  recentEntries: ScoutFeedbackEntry[];
};

export type BarcaScoutArtifact = {
  schemaVersion: 1;
  generatedAt: string;
  sourceStatuses: BarcaScoutSourceStatus[];
  candidates: BarcaScoutCandidate[];
  themeClusters: BarcaScoutThemeCluster[];
  calibrationPrompts: BarcaScoutCalibrationPrompt[];
  sourceExpansionSuggestions: BarcaScoutSourceExpansionSuggestion[];
  qualitySummary: BarcaScoutQualitySummary;
  coverageSummary: BarcaScoutCoverageSummary;
  imageSummary: BarcaScoutImageSummary;
  feedbackSummary: BarcaScoutFeedbackSummary;
  sources: SourceRegistryRecord[];
};

export type RetryStateEntry = {
  count: number;
  lastFailureAt: string;
  reason: string;
};

export type RetryState = {
  schemaVersion: 1;
  updatedAt: string;
  retries: Record<string, RetryStateEntry>;
};

export type RunLogEntry = {
  runId: string;
  script: string;
  startedAt: string;
  finishedAt: string;
  status: "ok" | "error";
  details: string[];
  metadata?: Record<string, string | number | boolean>;
};

export type HealthcheckReport = {
  schemaVersion: 1;
  generatedAt: string;
  healthy: boolean;
  checks: Array<{
    name: string;
    ok: boolean;
    detail: string;
  }>;
  errors: string[];
  warnings: string[];
};

export type ValidationIssue = {
  severity: "error" | "warning";
  path: string;
  message: string;
};

export type DashboardSummary = {
  generatedAt: string;
  counts: {
    articles: number;
    dispatch: number;
    assignments: number;
    approvals: number;
    signals: number;
    drafts: number;
    openReviews: number;
    publishQueue: number;
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
  latestSignals: NewsSignalRecord[];
  upcomingPublishes: PublishQueueEntry[];
};

export type GeneratedSiteArticle = Omit<
  ArticleRecord,
  | "schemaVersion"
  | "kind"
  | "status"
  | "assignmentIds"
  | "approvalIds"
  | "createdAt"
  | "updatedAt"
  | "publishAt"
  | "publishedAt"
  | "distributionStatus"
  | "notes"
  | "latestDraftId"
  | "latestReviewId"
>;

export type GeneratedSiteDispatch = Omit<
  DispatchRecord,
  | "schemaVersion"
  | "kind"
  | "status"
  | "assignmentIds"
  | "approvalIds"
  | "createdAt"
  | "updatedAt"
  | "publishAt"
  | "publishedAt"
  | "distributionStatus"
  | "notes"
  | "latestDraftId"
  | "latestReviewId"
> & {
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

export type NewsroomData = {
  workflow: WorkflowConfig;
  articles: ArticleRecord[];
  dispatch: DispatchRecord[];
  assignments: AssignmentRecord[];
  approvals: ApprovalRecord[];
  frontPage: FrontPagePlan;
  editorialCalendar: EditorialCalendarState;
  sources: SourceRegistryRecord[];
  signals: NewsSignalRecord[];
  drafts: DraftArtifact[];
  reviews: ReviewArtifact[];
  publishQueue: PublishQueueState;
  reviewSummary: ReviewSummary;
  ingestionReport: IngestionReport;
  retryState: RetryState;
};
