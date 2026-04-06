import { generateDraftArtifact } from "../../lib/newsroom.ts";
import { loadNewsroomData, runWithLoggedMutation, writeRecordJson, writeReviewSummary, writePublishQueue } from "../../lib/newsroom-io.ts";
import { fail, parseArgs } from "./_shared.mjs";

const args = parseArgs(process.argv.slice(2));
const assignmentId = args.assignment;
const slug = args.slug;

if (!assignmentId && !slug) {
  fail("Usage: node scripts/newsroom/generate-draft.mjs --assignment <assignment-id>|--slug <record-slug>");
}

const rootDir = process.cwd();

const result = await runWithLoggedMutation(
  rootDir,
  "generate-draft",
  async () => {
    const data = await loadNewsroomData(rootDir);
    const assignment =
      data.assignments.find((entry) => entry.id === assignmentId || entry.slug === assignmentId) ??
      data.assignments.find((entry) => entry.targetSlug === slug || entry.slug === slug);

    if (!assignment) {
      throw new Error(`Assignment not found for '${assignmentId ?? slug}'.`);
    }

    const record =
      data.articles.find((entry) => entry.slug === slug || entry.id === assignment.targetSlug || entry.id === assignmentId) ??
      data.dispatch.find((entry) => entry.slug === slug || entry.id === assignment.targetSlug || entry.id === assignmentId) ??
      data.articles.find((entry) => entry.assignmentIds.includes(assignment.id)) ??
      data.dispatch.find((entry) => entry.assignmentIds.includes(assignment.id));

    if (!record) {
      throw new Error(`No newsroom record found for assignment '${assignment.id}'.`);
    }

    const sourceSignals = data.signals.filter((signal) => signal.assignmentId === assignment.id || signal.id === assignment.sourceSignalId);
    const draft = generateDraftArtifact({
      assignment,
      record,
      existingDrafts: data.drafts,
      sourceSignals,
    });

    for (const existingDraft of data.drafts.filter((entry) => entry.recordId === record.id && entry.latest)) {
      await writeRecordJson(rootDir, "drafts", `${existingDraft.slug}.json`, {
        ...existingDraft,
        latest: false,
        status: existingDraft.status === "ready_for_review" ? "superseded" : existingDraft.status,
      });
    }

    await writeRecordJson(rootDir, "drafts", `${draft.slug}.json`, draft);
    await writeRecordJson(rootDir, record.kind === "article" ? "content/articles" : "content/dispatch", `${record.slug}.json`, {
      ...record,
      latestDraftId: draft.id,
      updatedAt: new Date().toISOString(),
    });
    await writeReviewSummary(rootDir);
    await writePublishQueue(rootDir);

    return {
      draftId: draft.id,
      slug: draft.slug,
      record: record.slug,
    };
  },
  (mutation) => mutation,
);

console.log(`Generated draft ${result.slug} for ${result.record}.`);
