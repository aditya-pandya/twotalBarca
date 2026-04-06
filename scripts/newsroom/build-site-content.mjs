import { buildGeneratedSitePayload, writePublishQueue, writeReviewSummary } from "../../lib/newsroom-io.ts";
import { printIssues } from "./_shared.mjs";

const { issues, outputPath, payload } = await buildGeneratedSitePayload(process.cwd());
await writePublishQueue(process.cwd());
await writeReviewSummary(process.cwd());

const errors = issues.filter((issue) => issue.severity === "error");

console.log(`Wrote ${outputPath}`);
console.log(`Articles: ${payload.articles.length}`);
console.log(`Dispatch issues: ${payload.dispatchIssues.length}`);
console.log(`Front-page hero: ${payload.frontPagePlan.heroArticleSlug ?? "seeded fallback"}`);

if (issues.length > 0) {
  printIssues(issues);
}

if (errors.length > 0) {
  console.error(`Build completed with ${errors.length} validation error(s).`);
  process.exit(1);
}
