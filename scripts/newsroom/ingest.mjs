import { buildSignalRecords } from "../../lib/newsroom.ts";
import { deleteRecordJson, loadNewsroomData, refreshGeneratedNewsroomState, runWithLoggedMutation, writeRecordJson } from "../../lib/newsroom-io.ts";

const rootDir = process.cwd();

const result = await runWithLoggedMutation(
  rootDir,
  "ingest",
  async () => {
    const data = await loadNewsroomData(rootDir);
    const signals = buildSignalRecords(data.sources, data.signals);
    const nextSignalSlugs = new Set(signals.map((signal) => signal.slug));

    for (const signal of signals) {
      await writeRecordJson(rootDir, "generated/signals", `${signal.slug}.json`, signal);
    }

    for (const staleSignal of data.signals.filter((signal) => !nextSignalSlugs.has(signal.slug))) {
      await deleteRecordJson(rootDir, "generated/signals", `${staleSignal.slug}.json`);
    }

    await refreshGeneratedNewsroomState(rootDir);

    return {
      sources: data.sources.length,
      signals: signals.length,
      createdSignals: signals.filter((signal) => !data.signals.find((existing) => existing.id === signal.id)).length,
      removedSignals: data.signals.filter((signal) => !nextSignalSlugs.has(signal.slug)).length,
    };
  },
  (mutation) => mutation,
);

console.log(`Ingested ${result.sources} source(s) into ${result.signals} signal(s).`);
