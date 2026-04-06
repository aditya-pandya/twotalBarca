import { validateLoadedNewsroom } from "../../lib/newsroom-io.ts";
import { printIssues } from "./_shared.mjs";

const { data, issues } = await validateLoadedNewsroom(process.cwd());
const errors = issues.filter((issue) => issue.severity === "error");
const warnings = issues.filter((issue) => issue.severity === "warning");

console.log(
  `Validated newsroom: ${data.articles.length} articles, ${data.dispatch.length} dispatch issues, ${data.assignments.length} assignments, ${data.approvals.length} approvals, ${data.sources.length} sources, ${data.signals.length} signals, ${data.drafts.length} drafts.`,
);

if (issues.length === 0) {
  console.log("No validation issues found.");
  process.exit(0);
}

printIssues(issues);

if (warnings.length > 0) {
  console.log(`Warnings: ${warnings.length}`);
}

if (errors.length > 0) {
  console.error(`Errors: ${errors.length}`);
  process.exit(1);
}
