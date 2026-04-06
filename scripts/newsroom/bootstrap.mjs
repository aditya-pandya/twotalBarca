import { access } from "node:fs/promises";
import { buildGeneratedSitePayload, ensureNewsroomDirectories, writePublishQueue, writeReviewSummary } from "../../lib/newsroom-io.ts";

const rootDir = process.cwd();

await ensureNewsroomDirectories(rootDir);

try {
  await access("newsroom/config/workflow.json");
} catch {
  console.error("Missing newsroom/config/workflow.json. Bootstrap expects the newsroom contracts to be committed.");
  process.exit(1);
}

const { issues, outputPath, payload } = await buildGeneratedSitePayload(rootDir);
await writePublishQueue(rootDir);
await writeReviewSummary(rootDir);

const errors = issues.filter((issue) => issue.severity === "error");

console.log(`Newsroom bootstrap complete. Output: ${outputPath}`);
console.log(`Published articles: ${payload.articles.length}`);
console.log(`Published dispatch issues: ${payload.dispatchIssues.length}`);

if (errors.length > 0) {
  console.error(`Validation errors: ${errors.length}`);
  process.exit(1);
}
