import { NewsroomPanel, NewsroomShell } from "@/components/newsroom-ops";
import { loadNewsroomData } from "@/lib/newsroom-io";

export default async function NewsroomSignalsPage() {
  const data = await loadNewsroomData(process.cwd());

  return (
    <NewsroomShell
      title="Signals"
      dek="File-based source registries feed deterministic signal artifacts. Trigger cycles can then auto-create assignments without touching any outbound distribution channel."
    >
      <div className="newsroom-grid newsroom-grid--two">
        <NewsroomPanel title="Source Registry" eyebrow="Inputs">
          <div className="newsroom-list">
            {data.sources.map((source) => (
              <article className="newsroom-list__item newsroom-list__item--stack" key={source.id}>
                <div>
                  <strong>{source.name}</strong>
                  <p>{source.notes ?? "Operator-owned local source registry."}</p>
                </div>
                <div className="newsroom-meta">
                  <span>{source.type}</span>
                  <span>{source.cadence}</span>
                  <span>{source.pendingEvents.length} pending event(s)</span>
                </div>
              </article>
            ))}
          </div>
        </NewsroomPanel>

        <NewsroomPanel title="Generated Signals" eyebrow="Outputs">
          <div className="newsroom-list">
            {data.signals.map((signal) => (
              <article className="newsroom-list__item newsroom-list__item--stack" key={signal.id}>
                <div>
                  <strong>{signal.title}</strong>
                  <p>{signal.summary}</p>
                </div>
                <div className="newsroom-meta">
                  <span>{signal.signalType.replaceAll("_", " ")}</span>
                  <span>{signal.status}</span>
                  <span>{signal.assignmentId ?? "assignment suggestion only"}</span>
                </div>
              </article>
            ))}
          </div>
        </NewsroomPanel>
      </div>
    </NewsroomShell>
  );
}
