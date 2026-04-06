import { buildSignalRecords } from "../../lib/newsroom.ts";
import { loadNewsroomData, runWithLoggedMutation, writeRecordJson, writeReviewSummary, writePublishQueue } from "../../lib/newsroom-io.ts";

const rootDir = process.cwd();

const result = await runWithLoggedMutation(
  rootDir,
  "ingest",
  async () => {
    const data = await loadNewsroomData(rootDir);
    const signals = buildSignalRecords(data.sources, data.signals);

    for (const signal of signals) {
      await writeRecordJson(rootDir, "generated/signals", `${signal.slug}.json`, signal);
    }

    await writeReviewSummary(rootDir);
    await writePublishQueue(rootDir);

    return {
      sources: data.sources.length,
      signals: signals.length,
      createdSignals: signals.filter((signal) => !data.signals.find((existing) => existing.id === signal.id)).length,
    };
  },
  (mutation) => mutation,
);

console.log(`Ingested ${result.sources} source(s) into ${result.signals} signal(s).`);
