import { buildDashboard } from "../../lib/newsroom-io.ts";

const summary = await buildDashboard(process.cwd());

console.log("twotalBarca newsroom dashboard");
console.log("");
console.log(`Articles: ${summary.counts.articles}`);
console.log(`Dispatch issues: ${summary.counts.dispatch}`);
console.log(`Assignments: ${summary.counts.assignments}`);
console.log(`Approvals: ${summary.counts.approvals}`);
console.log(`Signals: ${summary.counts.signals}`);
console.log(`Drafts: ${summary.counts.drafts}`);
console.log(`Open reviews: ${summary.counts.openReviews}`);
console.log(`Publish queue: ${summary.counts.publishQueue}`);
console.log("");
console.log("Status counts:");

for (const [status, count] of Object.entries(summary.byStatus)) {
  console.log(`- ${status}: ${count}`);
}

console.log("");
console.log(`Published articles: ${summary.published.articleSlugs.join(", ") || "none"}`);
console.log(`Published dispatch: ${summary.published.dispatchSlugs.join(", ") || "none"}`);
console.log(`Front-page hero: ${summary.frontPage.heroArticleSlug ?? "seeded fallback"}`);
console.log(`Featured dispatch: ${summary.frontPage.featuredDispatchSlug ?? "seeded fallback"}`);
console.log(`Latest signals: ${summary.latestSignals.map((signal) => signal.slug).join(", ") || "none"}`);
console.log(`Upcoming publishes: ${summary.upcomingPublishes.map((entry) => entry.slug).join(", ") || "none"}`);

if (summary.pendingApproval.length > 0) {
  console.log(`Pending approval coverage: ${summary.pendingApproval.join(", ")}`);
}
