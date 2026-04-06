import { loadNewsroomData } from "@/lib/newsroom-io";

export async function getNewsroomDashboardData(rootDir = process.cwd()) {
  const data = await loadNewsroomData(rootDir);

  return {
    summary: {
      articles: data.articles.length,
      dispatch: data.dispatch.length,
      assignments: data.assignments.length,
      approvals: data.approvals.length,
      sources: data.sources.length,
      signals: data.signals.length,
      drafts: data.drafts.length,
      reviews: data.reviews.length,
      queue: data.publishQueue.items.length,
    },
    assignments: [...data.assignments].sort((left, right) => Date.parse(left.deadline) - Date.parse(right.deadline)),
    signals: [...data.signals].sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt)),
    reviews: [...data.reviewSummary.openReviews],
    approvals: [...data.reviewSummary.pendingApprovals],
    queue: [...data.publishQueue.items].sort((left, right) => Date.parse(left.publishAt) - Date.parse(right.publishAt)),
    ingestion: data.ingestionReport,
    retries: data.retryState.retries,
  };
}
