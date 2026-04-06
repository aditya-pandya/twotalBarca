import { NewsroomPanel, NewsroomShell } from "@/components/newsroom-ops";
import { loadNewsroomData } from "@/lib/newsroom-io";

export default async function NewsroomAssignmentsPage() {
  const data = await loadNewsroomData(process.cwd());

  return (
    <NewsroomShell
      title="Assignments"
      dek="Signals become assignments, assignments become drafts, and each record keeps a visible link to its latest artifact."
    >
      <div className="newsroom-grid newsroom-grid--two">
        <NewsroomPanel title="Assignment Queue" eyebrow="Desk">
          <div className="newsroom-list">
            {data.assignments.map((assignment) => (
              <article className="newsroom-list__item newsroom-list__item--stack" key={assignment.id}>
                <div>
                  <strong>{assignment.title}</strong>
                  <p>{assignment.brief}</p>
                </div>
                <div className="newsroom-meta">
                  <span>{assignment.status}</span>
                  <span>{assignment.owner}</span>
                  <span>{assignment.deadline}</span>
                </div>
              </article>
            ))}
          </div>
        </NewsroomPanel>

        <NewsroomPanel title="Draft Bindings" eyebrow="Artifacts">
          <div className="newsroom-list">
            {data.drafts.map((draft) => (
              <article className="newsroom-list__item newsroom-list__item--stack" key={draft.id}>
                <div>
                  <strong>{draft.title}</strong>
                  <p>{draft.notes.join(" ")}</p>
                </div>
                <div className="newsroom-meta">
                  <span>v{draft.version}</span>
                  <span>{draft.recordKind}</span>
                  <span>{draft.status}</span>
                </div>
              </article>
            ))}
          </div>
        </NewsroomPanel>
      </div>
    </NewsroomShell>
  );
}
