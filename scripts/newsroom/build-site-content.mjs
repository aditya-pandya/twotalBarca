import { buildGeneratedSitePayload } from "../../lib/newsroom-io.ts";

const { issues, outputPath, payload } = await buildGeneratedSitePayload(process.cwd());
const errors = issues.filter((issue) => issue.severity === "error");

console.log(`Wrote ${outputPath}`);
console.log(`Articles: ${payload.articles.length}`);
console.log(`Dispatch issues: ${payload.dispatchIssues.length}`);
console.log(`Front-page hero: ${payload.frontPagePlan.heroArticleSlug ?? "fallback to seeded content"}`);

if (issues.length > 0) {
  for (const issue of issues) {
    console.log(`${issue.severity.toUpperCase()}: ${issue.path} - ${issue.message}`);
  }
}

if (errors.length > 0) {
  console.error(`Build completed with ${errors.length} validation error(s).`);
  process.exit(1);
}
