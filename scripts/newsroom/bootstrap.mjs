import { mkdir, access } from "node:fs/promises";
import path from "node:path";
import { buildGeneratedSitePayload } from "../../lib/newsroom-io.ts";

const rootDir = process.cwd();
const directories = [
  "newsroom/config",
  "newsroom/content/articles",
  "newsroom/content/dispatch",
  "newsroom/state",
  "newsroom/assignments",
  "newsroom/approvals",
  "newsroom/generated",
];

for (const relativeDir of directories) {
  await mkdir(path.join(rootDir, relativeDir), { recursive: true });
}

try {
  await access(path.join(rootDir, "newsroom/config/workflow.json"));
} catch {
  console.error("Missing newsroom/config/workflow.json. Bootstrap expects the newsroom contracts to be committed.");
  process.exit(1);
}

const { issues, outputPath, payload } = await buildGeneratedSitePayload(rootDir);
const errors = issues.filter((issue) => issue.severity === "error");

console.log(`Newsroom bootstrap complete. Output: ${outputPath}`);
console.log(`Published articles: ${payload.articles.length}`);
console.log(`Published dispatch issues: ${payload.dispatchIssues.length}`);

if (errors.length > 0) {
  console.error(`Validation errors: ${errors.length}`);
  process.exit(1);
}
