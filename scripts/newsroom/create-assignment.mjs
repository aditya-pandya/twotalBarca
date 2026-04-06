import { writeRecordJson } from "../../lib/newsroom-io.ts";

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

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const args = parseArgs(process.argv.slice(2));
const title = args.title;
const owner = args.owner;
const approver = args.approver;
const kind = args.kind;
const deadline = args.deadline;

if (!title || !owner || !approver || !deadline || !["article", "dispatch", "frontpage", "distribution"].includes(kind)) {
  console.error("Usage: npm run newsroom:assignment -- --title <title> --owner <owner> --approver <approver> --kind article|dispatch|frontpage|distribution --deadline <ISO|date> [--priority high]");
  process.exit(1);
}

const now = new Date().toISOString();
const slug = slugify(title);
const id = `assignment-${slug}`;
const priority = ["low", "medium", "high", "critical"].includes(args.priority) ? args.priority : "medium";
const brief = args.brief ?? `Assignment created for ${title}.`;
const record = {
  id,
  slug,
  title,
  kind,
  status: "open",
  priority,
  owner,
  approver,
  brief,
  deadline,
  dependencies: args.dependencies ? String(args.dependencies).split(",").map((item) => item.trim()).filter(Boolean) : [],
  deliverables: args.deliverables ? String(args.deliverables).split(",").map((item) => item.trim()).filter(Boolean) : [],
  createdAt: now,
  updatedAt: now,
};

const outputPath = await writeRecordJson(process.cwd(), "assignments", `${slug}.json`, record);
console.log(`Created assignment: ${outputPath}`);
