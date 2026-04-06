import { writeReviewSummary } from "../../lib/newsroom-io.ts";

const { summary, outputPath } = await writeReviewSummary(process.cwd());

console.log(`Wrote ${outputPath}`);
console.log(`Pending approvals: ${summary.pendingApprovals.length}`);
console.log(`Blocked records: ${summary.blockedRecords.length}`);
console.log(`Ready to schedule: ${summary.readyToSchedule.join(", ") || "none"}`);
