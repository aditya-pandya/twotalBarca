import { loadBarcaScoutArtifact, loadScoutFeedbackEntries, runWithLoggedMutation, writeNewsroomJson } from "../../lib/newsroom-io.ts";
import { buildScoutArtifact, runScoutDiscovery } from "./scout-barca-lib.mjs";

const rootDir = process.cwd();

export async function executeBarcaScout({ now = new Date().toISOString() } = {}) {
  const [results, previousArtifact, operatorFeedback] = await Promise.all([
    runScoutDiscovery({ now }),
    loadBarcaScoutArtifact(rootDir),
    loadScoutFeedbackEntries(rootDir),
  ]);
  const artifact = buildScoutArtifact(results, now, { previousArtifact, operatorFeedback });

  await Promise.all([
    writeNewsroomJson(rootDir, "generated/barca-live-source.json", artifact),
    writeNewsroomJson(rootDir, "generated/barca-scout-report.json", artifact),
  ]);

  return artifact;
}

const result = await runWithLoggedMutation(
  rootDir,
  "scout-barca",
  async () => {
    const artifact = await executeBarcaScout();

    return {
      sourceCount: artifact.sourceStatuses.length,
      healthySourceCount: artifact.sourceStatuses.filter((status) => status.ok).length,
      candidateCount: artifact.candidates.length,
      topCandidate: artifact.candidates[0]?.id ?? "none",
    };
  },
  (mutation) => mutation,
);

console.log(`Scouted ${result.candidateCount} Barca live candidate(s) from ${result.healthySourceCount}/${result.sourceCount} healthy source(s).`);
console.log(`Top candidate: ${result.topCandidate}`);
