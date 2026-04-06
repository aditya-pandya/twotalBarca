import { NewsroomPanel, NewsroomShell } from "@/components/newsroom-ops";
import { buildPublishQueue } from "@/lib/newsroom";
import { loadNewsroomData } from "@/lib/newsroom-io";

export default async function NewsroomPublishingPage() {
  const data = await loadNewsroomData(process.cwd());
  const queue = buildPublishQueue(data);

  return (
    <NewsroomShell
      title="Publishing"
      dek="The local queue promotes scheduled records into published state once approvals, drafts, and review diagnostics are all clean."
    >
      <NewsroomPanel title="Publish Queue" eyebrow="Local Runner">
        <div className="newsroom-list">
          {queue.map((entry) => (
            <article className="newsroom-list__item newsroom-list__item--stack" key={entry.id}>
              <div>
                <strong>{entry.slug}</strong>
                <p>{entry.diagnostics.join(" • ") || "Ready for publish cycle."}</p>
              </div>
              <div className="newsroom-meta">
                <span>{entry.status}</span>
                <span>{entry.publishAt}</span>
                <span>retry {entry.retryCount}/{entry.maxRetries}</span>
              </div>
            </article>
          ))}
        </div>
      </NewsroomPanel>
    </NewsroomShell>
  );
}
