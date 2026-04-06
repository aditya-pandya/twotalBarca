import { NewsroomMetric, NewsroomPanel, NewsroomShell } from "@/components/newsroom-ops";
import { buildDashboardSummary, buildPublishQueue, buildReviewSummary } from "@/lib/newsroom";
import { loadNewsroomData } from "@/lib/newsroom-io";

export default async function NewsroomPage() {
  const data = await loadNewsroomData(process.cwd());
  const dashboard = buildDashboardSummary(data);
  const reviewSummary = buildReviewSummary(data);
  const queue = buildPublishQueue(data);

  return (
    <NewsroomShell
      title="Newsroom Ops"
      dek="A local-first operator view across signals, active assignments, approvals, drafts, and scheduled publishing. Distribution stays deferred in this phase."
    >
      <div className="newsroom-grid newsroom-grid--metrics">
        <NewsroomMetric label="Signals" value={dashboard.counts.signals} detail="Fresh source events waiting for triage or already converted into work." />
        <NewsroomMetric label="Assignments" value={dashboard.counts.assignments} detail="Desk workload spanning published, active, and newly triggered work." />
        <NewsroomMetric label="Drafts" value={dashboard.counts.drafts} detail="Canonical draft artifacts bound back to newsroom records." />
        <NewsroomMetric label="Queue" value={dashboard.counts.publishQueue} detail="Scheduled or published records tracked through the local publish runner." />
      </div>

      <div className="newsroom-grid newsroom-grid--two">
        <NewsroomPanel title="Latest Signals" eyebrow="Triggers">
          <div className="newsroom-list">
            {dashboard.latestSignals.map((signal) => (
              <article className="newsroom-list__item" key={signal.id}>
                <div>
                  <strong>{signal.title}</strong>
                  <p>{signal.summary}</p>
                </div>
                <span>{signal.signalType.replaceAll("_", " ")}</span>
              </article>
            ))}
          </div>
        </NewsroomPanel>

        <NewsroomPanel title="Review State" eyebrow="Approvals">
          <div className="newsroom-note">
            <strong>{reviewSummary.pendingApprovals.length} pending approval items</strong>
            <p>{reviewSummary.blockedRecords.length} blocked or change-request records currently need desk attention.</p>
          </div>
          <div className="newsroom-chip-row">
            {reviewSummary.readyToSchedule.map((slug) => (
              <span className="newsroom-chip" key={slug}>
                {slug}
              </span>
            ))}
          </div>
        </NewsroomPanel>
      </div>

      <NewsroomPanel title="Publishing Outlook" eyebrow="Queue">
        <div className="newsroom-list">
          {queue.map((entry) => (
            <article className="newsroom-list__item" key={entry.id}>
              <div>
                <strong>{entry.slug}</strong>
                <p>{entry.diagnostics.join(" • ") || "Ready for local publish handoff."}</p>
              </div>
              <span>{entry.status}</span>
            </article>
          ))}
        </div>
      </NewsroomPanel>
    </NewsroomShell>
  );
}
