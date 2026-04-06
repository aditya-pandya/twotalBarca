import { runWithLoggedMutation, writeRecordJson } from "../../lib/newsroom-io.ts";
import { slugify } from "../../lib/newsroom.ts";
import { fail, parseArgs } from "./_shared.mjs";

const args = parseArgs(process.argv.slice(2));
const title = args.title;
const owner = args.owner;
const approver = args.approver;
const kind = args.kind;
const deadline = args.deadline;

if (!title || !owner || !approver || !deadline || !["article", "dispatch", "frontpage", "distribution"].includes(kind)) {
  fail(
    "Usage: npm run newsroom:assignment -- --title <title> --owner <owner> --approver <approver> --kind article|dispatch|frontpage|distribution --deadline <ISO|date> [--priority high]",
  );
}

const rootDir = process.cwd();
const now = new Date().toISOString();
const slug = slugify(title);
const id = `assignment-${slug}`;
const priority = ["low", "medium", "high", "critical"].includes(args.priority) ? args.priority : "medium";

const result = await runWithLoggedMutation(
  rootDir,
  "create-assignment",
  async () => {
    const record = {
      id,
      slug,
      title,
      kind,
      status: "open",
      priority,
      owner,
      approver,
      brief: args.brief ?? `Assignment created for ${title}.`,
      deadline,
      dependencies: args.dependencies ? String(args.dependencies).split(",").map((item) => item.trim()).filter(Boolean) : [],
      deliverables: args.deliverables ? String(args.deliverables).split(",").map((item) => item.trim()).filter(Boolean) : [],
      createdAt: now,
      updatedAt: now,
      sourceSignalId: args["signal-id"] ?? undefined,
      recordKind: ["article", "dispatch"].includes(kind) ? kind : undefined,
      targetSlug: args["target-slug"] ?? slug,
    };

    const outputPath = await writeRecordJson(rootDir, "assignments", `${slug}.json`, record);
    return { outputPath, id };
  },
  (mutation) => mutation,
);

console.log(`Created assignment: ${result.outputPath}`);
