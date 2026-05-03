import { NewsroomMetric, NewsroomPanel, NewsroomShell } from "@/components/newsroom-ops";
import { loadBarcaScoutArtifact, loadNewsroomData } from "@/lib/newsroom-io";

function humanizeQualityLabel(label: string) {
  return label.replaceAll("-", " ");
}

function humanizeCalibrationLabel(label: string) {
  if (label === "well-backed") return "Ready to pitch";
  if (label === "needs-trusted-check") return "Needs a trusted pass";
  if (label === "single-platform") return "One lane only";
  if (label === "women-gap") return "Needs Femení depth";
  return humanizeQualityLabel(label);
}

function humanizeClusterHealthLabel(label: string) {
  if (label === "cross-platform-confirmed") return "Confirmed across lanes";
  if (label === "trusted-led") return "Trusted-led";
  if (label === "single-platform") return "Single-lane only";
  return humanizeQualityLabel(label);
}

function humanizeThemeToken(token: string) {
  if (token === "uwcl") return "UWCL";
  if (token === "femeni") return "Femení";
  return token.replaceAll("-", " ");
}

function candidateSignalLabel(signalIds: string[], candidateId: string) {
  return signalIds.find((signalId) => signalId.endsWith(candidateId)) ?? null;
}

export default async function NewsroomSignalsPage() {
  const [data, scout] = await Promise.all([loadNewsroomData(process.cwd()), loadBarcaScoutArtifact(process.cwd())]);

  const signals = data.signals ?? [];
  const activeSignals = data.ingestionReport?.activeSignals ?? [];
  const weakSources = scout.sourceStatuses.filter((status) => status.qualityLabel === "quiet" || status.repeatLowSignal);
  const imageLeadEntries = [
    ...scout.candidates
      .filter((candidate) => candidate.imageLead)
      .map((candidate) => ({
        id: `candidate-${candidate.id}`,
        title: candidate.title,
        status: candidate.imageStatus,
        note: candidate.calibration.note,
        imageLead: candidate.imageLead!,
      })),
    ...scout.themeClusters
      .filter((cluster) => cluster.imageLead)
      .map((cluster) => ({
        id: `cluster-${cluster.id}`,
        title: cluster.title,
        status: cluster.imageStatus,
        note: cluster.reviewHint,
        imageLead: cluster.imageLead!,
      })),
  ];

  return (
    <NewsroomShell
      title="Signals"
      dek="Calibration surface for the Barça scout: check what is actually corroborated, where chatter clusters overlap, and which source lanes need retuning before the next ingest cycle."
    >
      <div className="newsroom-grid newsroom-grid--metrics">
        <NewsroomMetric
          label="Healthy Sources"
          value={`${scout.qualitySummary.healthySourceCount}/${scout.qualitySummary.sourceCount}`}
          detail="Scout lanes that fetched cleanly in the latest run."
        />
        <NewsroomMetric
          label="Trusted-backed Themes"
          value={scout.qualitySummary.trustedBackedCandidateCount}
          detail="Candidates with official or trusted corroboration already attached."
        />
        <NewsroomMetric
          label="Cross-platform Clusters"
          value={scout.qualitySummary.crossPlatformClusterCount}
          detail="Recurring themes that now overlap across more than one lane."
        />
        <NewsroomMetric
          label="Calibration Queue"
          value={scout.calibrationPrompts.length}
          detail="Human review prompts waiting for the next desk pass."
        />
      </div>

      <div className="newsroom-grid newsroom-grid--two">
        <NewsroomPanel title="Scout Overview" eyebrow="Quality">
          <div className="newsroom-list">
            <article className="newsroom-list__item newsroom-list__item--stack">
              <div>
                <strong>Latest calibration read</strong>
                <p>{scout.qualitySummary.headline}</p>
              </div>
              <div className="newsroom-meta">
                <span>{scout.qualitySummary.candidateCount} candidate theme(s)</span>
                <span>{scout.qualitySummary.clusterCount} cluster(s)</span>
                <span>{scout.qualitySummary.weakSourceCount} weak source lane(s)</span>
                <span>{signals.length} generated signal(s)</span>
              </div>
            </article>
            {scout.coverageSummary.tracks.map((track) => (
              <article className="newsroom-list__item newsroom-list__item--stack" key={track.id}>
                <div>
                  <strong>{track.label} coverage</strong>
                  <p>{track.note}</p>
                </div>
                <div className="newsroom-meta">
                  <span>{track.candidateCount} candidate(s)</span>
                  <span>{track.officialEvidenceCount} official</span>
                  <span>{track.trustedEvidenceCount} trusted</span>
                  <span>{track.chatterEvidenceCount} chatter</span>
                </div>
              </article>
            ))}
            {(scout.coverageSummary.weakSpots ?? []).map((spot) => (
              <article className="newsroom-list__item newsroom-list__item--stack" key={spot}>
                <div>
                  <strong>Pipeline weak spot</strong>
                  <p>{spot}</p>
                </div>
              </article>
            ))}
          </div>
        </NewsroomPanel>

        <NewsroomPanel title="Top Candidates" eyebrow="What the desk can use now">
          <div className="newsroom-list">
            {scout.candidates.slice(0, 6).map((candidate) => {
              const generatedSignal = candidateSignalLabel(activeSignals, candidate.id);
              return (
                <article className="newsroom-list__item newsroom-list__item--stack" key={candidate.id}>
                  <div>
                    <strong>{candidate.title}</strong>
                    <p>{candidate.summary}</p>
                    <p>{candidate.calibration.note}</p>
                  </div>
                  <div className="newsroom-meta">
                    <span>{candidate.priorityScore} score</span>
                    <span>{humanizeCalibrationLabel(candidate.calibration.label)}</span>
                    <span>{candidate.calibration.officialEvidenceCount} official</span>
                    <span>{candidate.calibration.trustedEvidenceCount} trusted</span>
                    <span>{candidate.calibration.chatterEvidenceCount} chatter</span>
                    <span>{generatedSignal ?? "not yet ingested"}</span>
                  </div>
                  <div className="newsroom-chip-row">
                    {candidate.tags.slice(0, 6).map((tag) => (
                      <span className="newsroom-chip" key={`${candidate.id}-${tag}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </NewsroomPanel>
      </div>

      <div className="newsroom-grid newsroom-grid--two">
        <NewsroomPanel title="Theme Clusters" eyebrow="Similarity / overlap">
          <div className="newsroom-list">
            {scout.themeClusters.slice(0, 8).map((cluster) => (
              <article className="newsroom-list__item newsroom-list__item--stack" key={cluster.id}>
                <div>
                  <strong>{cluster.title}</strong>
                  <p>{cluster.theme}</p>
                  <p>{cluster.reviewHint}</p>
                </div>
                <div className="newsroom-meta">
                  <span>{humanizeClusterHealthLabel(cluster.healthLabel)}</span>
                  <span>{cluster.itemCount} evidence item(s)</span>
                  <span>{cluster.sourceFamilies.join(" / ")}</span>
                  <span>{cluster.candidateIds.length} candidate link(s)</span>
                </div>
                <div className="newsroom-chip-row">
                  {cluster.topTokens.slice(0, 5).map((token) => (
                    <span className="newsroom-chip" key={`${cluster.id}-${token}`}>
                      {token}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </NewsroomPanel>

        <NewsroomPanel title="Calibration Queue" eyebrow="Needs human review">
          <div className="newsroom-list">
            {scout.calibrationPrompts.map((prompt) => (
              <article className="newsroom-list__item newsroom-list__item--stack" key={prompt.id}>
                <div>
                  <strong>{prompt.title}</strong>
                  <p>{prompt.summary}</p>
                  <p>{prompt.action}</p>
                </div>
                <div className="newsroom-meta">
                  <span>{prompt.priority}</span>
                  <span>{prompt.kind.replaceAll("-", " ")}</span>
                  <span>{prompt.candidateIds.length} candidate(s)</span>
                  <span>{prompt.sourceIds.length} source(s)</span>
                </div>
              </article>
            ))}
          </div>
        </NewsroomPanel>
      </div>

      <div className="newsroom-grid newsroom-grid--two">
        <NewsroomPanel title="Source Expansion Suggestions" eyebrow="How to improve the loop">
          <div className="newsroom-list">
            {scout.sourceExpansionSuggestions.map((suggestion) => (
              <article className="newsroom-list__item newsroom-list__item--stack" key={suggestion.id}>
                <div>
                  <strong>{suggestion.title}</strong>
                  <p>{suggestion.summary}</p>
                  <p>{suggestion.rationale}</p>
                </div>
                <div className="newsroom-meta">
                  <span>{suggestion.suggestedSourceFamilies.join(" / ")}</span>
                  <span>{suggestion.relatedPromptIds.length} linked prompt(s)</span>
                </div>
                <div className="newsroom-chip-row">
                  {suggestion.exampleTargets.slice(0, 4).map((target) => (
                    <span className="newsroom-chip" key={`${suggestion.id}-${target}`}>
                      {target}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </NewsroomPanel>

        <NewsroomPanel title="Source Watchlist" eyebrow="What to retune or trust">
          <div className="newsroom-list">
            {(weakSources.length ? weakSources : scout.sourceStatuses.slice(0, 6)).map((status) => (
              <article className="newsroom-list__item newsroom-list__item--stack" key={status.source}>
                <div>
                  <strong>{status.label}</strong>
                  <p>{status.detail}</p>
                  {status.repeatLowSignal ? <p>This lane was quiet again; if it misses next run too, replace it.</p> : null}
                </div>
                <div className="newsroom-meta">
                  <span>{status.sourceRole}</span>
                  <span>{status.qualityLabel}</span>
                  <span>{status.contributionCount}/{status.itemCount} useful item(s)</span>
                  <span>{status.matchedCandidateIds.length} candidate match(es)</span>
                </div>
              </article>
            ))}
          </div>
        </NewsroomPanel>
      </div>

      <div className="newsroom-grid newsroom-grid--two">
        <NewsroomPanel title="Operator Feedback" eyebrow="Desk calibration">
          <div className="newsroom-list">
            {(scout.feedbackSummary.recentEntries ?? []).map((entry) => (
              <article className="newsroom-list__item newsroom-list__item--stack" key={entry.id}>
                <div>
                  <strong>{entry.targetLabel}</strong>
                  {entry.note ? <p>{entry.note}</p> : null}
                </div>
                <div className="newsroom-meta">
                  <span>{entry.targetType.replaceAll("-", " ")}</span>
                  <span>{entry.verdict.replaceAll("-", " ")}</span>
                  <span>{entry.createdAt}</span>
                </div>
              </article>
            ))}
          </div>
        </NewsroomPanel>

        <NewsroomPanel title="Image Leads" eyebrow="Visual verification">
          <div className="newsroom-list">
            <article className="newsroom-list__item newsroom-list__item--stack">
              <div>
                <strong>Image leads available</strong>
                <p>
                  {scout.imageSummary.candidateLeadCount} candidate lead(s), {scout.imageSummary.clusterLeadCount} cluster
                  lead(s), and {scout.imageSummary.reviewNeededCount} asset(s) waiting for review.
                </p>
              </div>
              <div className="newsroom-meta">
                <span>{scout.imageSummary.replacementNeededCount} replacement needed</span>
                <span>{scout.imageSummary.missingCount} missing</span>
              </div>
            </article>
            {imageLeadEntries.slice(0, 4).map((entry) => (
              <article className="newsroom-list__item newsroom-list__item--stack" key={entry.id}>
                <img alt={entry.imageLead.alt} src={entry.imageLead.src} />
                <div>
                  <strong>{entry.title}</strong>
                  <p>{humanizeQualityLabel(entry.status)}</p>
                  <p>{entry.note}</p>
                </div>
              </article>
            ))}
          </div>
        </NewsroomPanel>
      </div>
    </NewsroomShell>
  );
}
