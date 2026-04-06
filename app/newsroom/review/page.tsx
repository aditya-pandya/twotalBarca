import { NewsroomPanel, NewsroomShell } from "@/components/newsroom-ops";
import { buildReviewSummary } from "@/lib/newsroom";
import { loadNewsroomData } from "@/lib/newsroom-io";

export default async function NewsroomReviewPage() {
  const data = await loadNewsroomData(process.cwd());
  const summary = buildReviewSummary(data);

  return (
    <NewsroomShell
      title="Review Queue"
      dek="Reviewer-facing diagnostics explain why a record is blocked, which approvals are still missing, and which change requests remain open."
    >
      <div className="newsroom-grid newsroom-grid--two">
        <NewsroomPanel title="Pending Approvals" eyebrow="Coverage">
          <div className="newsroom-list">
            {summary.pendingApprovals.map((item) => (
              <article className="newsroom-list__item newsroom-list__item--stack" key={item.slug}>
                <div>
                  <strong>{item.slug}</strong>
                  <p>{item.diagnostics.join(" • ")}</p>
                </div>
                <div className="newsroom-meta">
                  <span>{item.kind}</span>
                  <span>{item.status}</span>
                  <span>{item.missingApprovals.join(", ")}</span>
                </div>
              </article>
            ))}
          </div>
        </NewsroomPanel>

        <NewsroomPanel title="Blocked Records" eyebrow="Action Required">
          <div className="newsroom-list">
            {summary.blockedRecords.map((item) => (
              <article className="newsroom-list__item newsroom-list__item--stack" key={item.slug}>
                <div>
                  <strong>{item.slug}</strong>
                  <p>{item.openReviews.join(" • ") || item.diagnostics.join(" • ")}</p>
                </div>
                <div className="newsroom-meta">
                  <span>{item.blockedApprovals.join(", ") || "review hold"}</span>
                  <span>{item.latestDraftId ?? "no draft"}</span>
                </div>
              </article>
            ))}
          </div>
        </NewsroomPanel>
      </div>
    </NewsroomShell>
  );
}
