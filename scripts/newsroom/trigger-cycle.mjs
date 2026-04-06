import { buildAssignmentFromSignal } from "../../lib/newsroom.ts";
import { loadNewsroomData, runWithLoggedMutation, writeRecordJson, writeReviewSummary, writePublishQueue } from "../../lib/newsroom-io.ts";

const rootDir = process.cwd();

const result = await runWithLoggedMutation(
  rootDir,
  "trigger-cycle",
  async () => {
    const data = await loadNewsroomData(rootDir);
    const assignmentsToCreate = data.signals.filter((signal) => !signal.assignmentId);
    let created = 0;

    for (const signal of assignmentsToCreate) {
      const assignment = buildAssignmentFromSignal(signal, data.assignments);
      await writeRecordJson(rootDir, "assignments", `${assignment.slug}.json`, assignment);
      await writeRecordJson(rootDir, "generated/signals", `${signal.slug}.json`, {
        ...signal,
        status: "converted",
        assignmentId: assignment.id,
      });
      created += 1;
    }

    await writeReviewSummary(rootDir);
    await writePublishQueue(rootDir);

    return {
      created,
      totalSignals: data.signals.length,
    };
  },
  (mutation) => mutation,
);

console.log(`Processed trigger cycle. Created ${result.created} assignment(s).`);
