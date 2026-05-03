import Link from "next/link";

export function PublicScopeNotice({ surface }: { surface: string }) {
  return (
    <div className="browse-page">
      <section className="section-block shell">
        <article className="public-scope-notice">
          <p className="eyebrow">Elsewhere</p>
          <h1>{surface} is not in today's edition.</h1>
          <p>
            If you want the live totalBarca read, start with the homepage, The Brief, or the Weekly Dispatch. Those are
            the pieces carrying the current Barça line.
          </p>
          <div className="public-scope-notice__actions">
            <Link className="editorial-link" href="/">
              Back to totalBarca
            </Link>
            <Link className="editorial-link subtle" href="/brief">
              Open The Brief
            </Link>
            <Link className="editorial-link subtle" href="/dispatch">
              Open Dispatch
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
