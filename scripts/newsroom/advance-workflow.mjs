import { loadNewsroomData, runWithLoggedMutation, writeRecordJson, writePublishQueue, writeReviewSummary } from "../../lib/newsroom-io.ts";
import { assertTransitionAllowed, getPublishDiagnostics } from "../../lib/newsroom.ts";
import { fail, parseArgs } from "./_shared.mjs";

const args = parseArgs(process.argv.slice(2));
const kind = args.kind;
const slug = args.slug;
const targetStatus = args.to;
const publishedAt = args["published-at"];
const publishAt = args["publish-at"];

if (!["article", "dispatch"].includes(kind) || !slug || !targetStatus) {
  fail(
    "Usage: npm run newsroom:workflow -- --kind article|dispatch --slug <slug> --to <status> [--publish-at ISO] [--published-at ISO]",
  );
}

const rootDir = process.cwd();

const result = await runWithLoggedMutation(
  rootDir,
  "advance-workflow",
  async () => {
    const data = await loadNewsroomData(rootDir);
    const collection = kind === "article" ? data.articles : data.dispatch;
    const record = collection.find((entry) => entry.slug === slug || entry.id === slug);

    if (!record) {
      throw new Error(`No ${kind} record found for '${slug}'.`);
    }

    const nextRecord = {
      ...record,
      publishAt: publishAt ?? record.publishAt,
      publishedAt: publishedAt ?? record.publishedAt,
    };

    assertTransitionAllowed({
      record: nextRecord,
      kind,
      targetStatus,
      approvals: data.approvals,
      workflow: data.workflow,
    });

    nextRecord.status = targetStatus;
    nextRecord.updatedAt = new Date().toISOString();

    if (targetStatus === "published" && !nextRecord.publishedAt) {
      nextRecord.publishedAt = nextRecord.publishAt ?? new Date().toISOString();
    }

    if (targetStatus === "scheduled") {
      const diagnostics = getPublishDiagnostics(nextRecord, kind, data);

      if (diagnostics.length > 0) {
        throw new Error(`Cannot schedule ${record.slug}: ${diagnostics.join("; ")}`);
      }
    }

    const outputPath = await writeRecordJson(
      rootDir,
      kind === "article" ? "content/articles" : "content/dispatch",
      `${record.slug}.json`,
      nextRecord,
    );

    await writePublishQueue(rootDir);
    await writeReviewSummary(rootDir);

    return { outputPath, from: record.status, to: targetStatus, slug: record.slug };
  },
  (mutation) => mutation,
);

console.log(`Updated ${kind} ${result.slug}: ${result.from} -> ${result.to}`);
