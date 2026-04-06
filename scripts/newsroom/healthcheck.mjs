import { writeHealthcheck } from "../../lib/newsroom-io.ts";

const { summary, outputPath } = await writeHealthcheck(process.cwd());

console.log(`Wrote ${outputPath}`);
console.log(`Healthy: ${summary.healthy ? "yes" : "no"}`);

for (const check of summary.checks) {
  console.log(`- ${check.name}: ${check.ok ? "ok" : "fail"} - ${check.detail}`);
}

if (!summary.healthy) {
  process.exit(1);
}
