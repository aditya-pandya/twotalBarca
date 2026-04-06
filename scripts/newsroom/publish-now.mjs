import { buildGeneratedSitePayload, loadNewsroomData, runWithLoggedMutation, writePublishQueue, writeRecordJson, writeReviewSummary } from "../../lib/newsroom-io.ts";
import { getPublishDiagnostics, getRecordCollection } from "../../lib/newsroom.ts";
import { fail, parseArgs } from "./_shared.mjs";

const args = parseArgs(process.argv.slice(2));
const kind = args.kind;
const slug = args.slug;
const unpublish = args.unpublish === "true";
const confirm = args.confirm;

if (!["article", "dispatch"].includes(kind) || !slug) {
  fail("Usage: node scripts/newsroom/publish-now.mjs --kind article|dispatch --slug <slug> [--unpublish --confirm UNPUBLISH]");
}

if (unpublish && confirm !== "UNPUBLISH") {
  fail("Unpublish is guarded. Re-run with --unpublish --confirm UNPUBLISH");
}

const rootDir = process.cwd();

const result = await runWithLoggedMutation(
  rootDir,
  "publish-now",
  async () => {
    const data = await loadNewsroomData(rootDir);
    const collection = getRecordCollection(data, kind);
    const record = collection.find((entry) => entry.slug === slug || entry.id === slug);

    if (!record) {
      throw new Error(`No ${kind} record found for '${slug}'.`);
    }

    const now = new Date().toISOString();

    if (unpublish) {
      await writeRecordJson(rootDir, kind === "article" ? "content/articles" : "content/dispatch", `${record.slug}.json`, {
        ...record,
        status: "scheduled",
        publishedAt: undefined,
        updatedAt: now,
        notes: `${record.notes ? `${record.notes} ` : ""}Manual unpublish guard executed locally only.`,
      });
      await writePublishQueue(rootDir, now);
      await writeReviewSummary(rootDir, now);
      await buildGeneratedSitePayload(rootDir, now);
      return { action: "unpublished", slug: record.slug };
    }

    const diagnostics = getPublishDiagnostics(record, kind, data);

    if (diagnostics.length > 0) {
      throw new Error(`Cannot publish ${record.slug}: ${diagnostics.join("; ")}`);
    }

    await writeRecordJson(rootDir, kind === "article" ? "content/articles" : "content/dispatch", `${record.slug}.json`, {
      ...record,
      status: "published",
      publishedAt: now,
      updatedAt: now,
    });
    await writePublishQueue(rootDir, now);
    await writeReviewSummary(rootDir, now);
    await buildGeneratedSitePayload(rootDir, now);

    return { action: "published", slug: record.slug };
  },
  (mutation) => mutation,
);

console.log(`${result.action}: ${result.slug}`);
