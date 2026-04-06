import { loadNewsroomData, runWithLoggedMutation, writeRecordJson, writeReviewSummary, writePublishQueue } from "../../lib/newsroom-io.ts";
import { fail, parseArgs } from "./_shared.mjs";

const args = parseArgs(process.argv.slice(2));
const kind = args.kind;
const slug = args.slug;
const requestedBy = args["requested-by"] ?? "editor-in-chief";
const summary = args.summary ?? "Approval requested from newsroom review queue.";

if (!["article", "dispatch"].includes(kind) || !slug) {
  fail("Usage: node scripts/newsroom/request-approval.mjs --kind article|dispatch --slug <slug> [--requested-by role] [--summary text]");
}

const rootDir = process.cwd();

const result = await runWithLoggedMutation(
  rootDir,
  "request-approval",
  async () => {
    const data = await loadNewsroomData(rootDir);
    const record =
      (kind === "article" ? data.articles : data.dispatch).find((entry) => entry.slug === slug || entry.id === slug);

    if (!record) {
      throw new Error(`No ${kind} record found for '${slug}'.`);
    }

    if (!record.latestDraftId) {
      throw new Error(`Cannot request approval for ${record.slug} without a latest draft.`);
    }

    const review = {
      schemaVersion: 1,
      id: `review-approval-${record.slug}-${Date.now()}`,
      draftId: record.latestDraftId,
      recordKind: kind,
      recordId: record.id,
      kind: "approval_request",
      status: "open",
      summary,
      requestedBy,
      requestedAt: new Date().toISOString(),
      changes: [],
    };

    await writeRecordJson(rootDir, "reviews", `${review.id}.json`, review);
    await writeRecordJson(rootDir, kind === "article" ? "content/articles" : "content/dispatch", `${record.slug}.json`, {
      ...record,
      status: record.status === "copy_review" ? record.status : "copy_review",
      latestReviewId: review.id,
      updatedAt: new Date().toISOString(),
    });
    await writeReviewSummary(rootDir);
    await writePublishQueue(rootDir);

    return { reviewId: review.id, slug: record.slug };
  },
  (mutation) => mutation,
);

console.log(`Requested approval for ${result.slug}. Review artifact: ${result.reviewId}`);
