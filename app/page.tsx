import Link from "next/link";
import { Eyebrow, SectionHeading, StoryCard } from "@/components/primitives";
import {
  analysisLead,
  analysisSupport,
  briefItems,
  dispatch,
  homeLead,
  reflections,
  vaultFeature,
  vaultLinks,
} from "@/lib/site-data";

export default function HomePage() {
  return (
    <>
      <section className="hero-grid">
        <div>
          <Eyebrow>{homeLead.section} · {homeLead.type}</Eyebrow>
          <h1 className="display-title">{homeLead.headline}</h1>
          <p className="deck">{homeLead.dek}</p>
          <div className="meta-row">
            <span>By {homeLead.author}</span>
            <span>{homeLead.date}</span>
            <span>{homeLead.readingTime}</span>
          </div>
        </div>
        <Link className="feature-visual" href={homeLead.href}>
          <div className="visual-copy">
            <div>
              <small>Lead feature</small>
              <strong>{homeLead.excerpt}</strong>
            </div>
          </div>
        </Link>
      </section>

      <div className="match-strip" id="match-notes">
        <span>Next: Barça v Atlético · La Liga · Sunday</span>
        <span>Notebook: pressure shape, left-side release, Gavi minutes</span>
        <span>Archive signal: old standards still visible</span>
      </div>

      <section className="section-block shell" id="brief">
        <SectionHeading title="The Brief" linkLabel="All notes" linkHref="#" />
        <div className="brief-list">
          {briefItems.map((item) => (
            <article className="brief-item" key={item.headline}>
              <h3>{item.headline}</h3>
              <p>{item.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block shell" id="analysis">
        <SectionHeading title="Analysis" linkLabel="Tactical board" linkHref="#" />
        <div className="story-grid">
          <StoryCard
            story={analysisLead}
            href={analysisLead.href}
            meta={`${analysisLead.author} · Match analysis`}
          />
          {analysisSupport.map((item) => (
            <StoryCard key={item.slug} story={item} />
          ))}
        </div>
      </section>

      <section className="section-block shell">
        <SectionHeading title="Reflections" />
        <div className="story-grid">
          {reflections.map((item) => (
            <StoryCard key={item.slug} story={item} />
          ))}
          <article className="mission-card">
            <Eyebrow>Editorial stance</Eyebrow>
            <h3>Barça deserves writing that survives the match cycle.</h3>
            <p>
              The point is not to sound solemn. The point is to leave a trace: to explain what happened,
              what it meant, and what part of the club it touched.
            </p>
          </article>
        </div>
      </section>

      <section className="section-block shell" id="archive">
        <SectionHeading title="From the Archive" linkLabel="Enter the vault" linkHref="/article/the-weave-of-the-blau" />
        <div className="archive-grid">
          <article className="archive-card vault-visual">
            <div className="visual-copy">
              <div>
                <small>{vaultFeature.era} · Historical</small>
                <strong>{vaultFeature.headline}</strong>
              </div>
            </div>
          </article>
          <article className="archive-card">
            <Eyebrow>Vault feature</Eyebrow>
            <h3>{vaultFeature.headline}</h3>
            <p>{vaultFeature.dek}</p>
            <div className="card-meta">By {vaultFeature.author}</div>
            <div style={{ marginTop: "1rem", display: "grid", gap: "0.7rem" }}>
              {vaultLinks.map((item) => (
                <span key={item} className="muted">{item}</span>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section-block shell" id="dispatch">
        <SectionHeading title="Weekly Dispatch" />
        <div className="dispatch-card">
          <Eyebrow>Issue</Eyebrow>
          <h3>{dispatch.issue}</h3>
          <p>{dispatch.note}</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
            {dispatch.items.map((item) => (
              <span key={item} className="muted">{item}</span>
            ))}
          </div>
          <form style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.4rem" }}>
            <input
              aria-label="Email"
              placeholder="Your email address"
              style={{
                flex: "1 1 240px",
                minHeight: 48,
                borderRadius: 999,
                border: "1px solid var(--line-strong)",
                padding: "0 1rem",
                background: "rgba(255,255,255,0.75)",
              }}
            />
            <button className="header-cta" type="button">Join the review</button>
          </form>
        </div>
      </section>
    </>
  );
}
