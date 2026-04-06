import path from "node:path";
import { writeFile } from "node:fs/promises";
import { loadNewsroomData, stringifyStableJson } from "../../lib/newsroom-io.ts";
import { assertTransitionAllowed } from "../../lib/newsroom.ts";

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const entry = argv[index];

    if (!entry.startsWith("--")) {
      continue;
    }

    const key = entry.slice(2);
    const value = argv[index + 1];

    if (!value || value.startsWith("--")) {
      args[key] = "true";
      continue;
    }

    args[key] = value;
    index += 1;
  }

  return args;
}

const args = parseArgs(process.argv.slice(2));
const kind = args.kind;
const slug = args.slug;
const targetStatus = args.to;
const publishedAt = args["published-at"];
const publishAt = args["publish-at"];

if (!["article", "dispatch"].includes(kind) || !slug || !targetStatus) {
  console.error("Usage: npm run newsroom:workflow -- --kind article|dispatch --slug <slug> --to <status> [--publish-at ISO] [--published-at ISO]");
  process.exit(1);
}

const rootDir = process.cwd();
const data = await loadNewsroomData(rootDir);
const collection = kind === "article" ? data.articles : data.dispatch;
const record = collection.find((entry) => entry.slug === slug || entry.id === slug);

if (!record) {
  console.error(`No ${kind} record found for '${slug}'.`);
  process.exit(1);
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

const relativeFile = kind === "article" ? `newsroom/content/articles/${record.slug}.json` : `newsroom/content/dispatch/${record.slug}.json`;
await writeFile(path.join(rootDir, relativeFile), stringifyStableJson(nextRecord), "utf8");

console.log(`Updated ${kind} ${record.slug}: ${record.status} -> ${targetStatus}`);
