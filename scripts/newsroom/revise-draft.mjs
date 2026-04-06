import { reviseDraftArtifact } from "../../lib/newsroom.ts";
import { loadNewsroomData, runWithLoggedMutation, writeRecordJson, writeReviewSummary, writePublishQueue } from "../../lib/newsroom-io.ts";
import { fail, parseArgs } from "./_shared.mjs";

const args = parseArgs(process.argv.slice(2));
const draftId = args.draft;
const summary = args.summary;
const requestedBy = args["requested-by"] ?? "editor-in-chief";
const changes = args.changes ? String(args.changes).split("|").map((entry) => entry.trim()).filter(Boolean) : [];

if (!draftId || !summary) {
  fail("Usage: node scripts/newsroom/revise-draft.mjs --draft <draft-id|slug> --summary <summary> [--requested-by role] [--changes 'a|b']");
}

const rootDir = process.cwd();

const result = await runWithLoggedMutation(
  rootDir,
  "revise-draft",
  async () => {
    const data = await loadNewsroomData(rootDir);
    const currentDraft = data.drafts.find((draft) => draft.id === draftId || draft.slug === draftId);

    if (!currentDraft) {
      throw new Error(`Draft '${draftId}' not found.`);
    }

    const record =
      data.articles.find((entry) => entry.id === currentDraft.recordId) ??
      data.dispatch.find((entry) => entry.id === currentDraft.recordId);

    if (!record) {
      throw new Error(`Record '${currentDraft.recordId}' not found.`);
    }

    const { nextDraft, review } = reviseDraftArtifact({
      currentDraft,
      summary,
      requestedBy,
      changes,
    });

    await writeRecordJson(rootDir, "drafts", `${currentDraft.slug}.json`, {
      ...currentDraft,
      latest: false,
      status: "superseded",
      updatedAt: new Date().toISOString(),
    });
    await writeRecordJson(rootDir, "drafts", `${nextDraft.slug}.json`, nextDraft);
    await writeRecordJson(rootDir, "reviews", `${review.id}.json`, review);
    await writeRecordJson(rootDir, record.kind === "article" ? "content/articles" : "content/dispatch", `${record.slug}.json`, {
      ...record,
      latestDraftId: nextDraft.id,
      latestReviewId: review.id,
      updatedAt: new Date().toISOString(),
    });
    await writeReviewSummary(rootDir);
    await writePublishQueue(rootDir);

    return {
      nextDraftId: nextDraft.id,
      reviewId: review.id,
    };
  },
  (mutation) => mutation,
);

console.log(`Revised draft. New draft: ${result.nextDraftId}. Review artifact: ${result.reviewId}.`);
