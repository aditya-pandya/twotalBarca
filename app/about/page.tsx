import { Eyebrow, SectionHeading } from "@/components/editorial-primitives";
import { aboutData, contributors } from "@/lib/site-data";

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="about-panel">
          <Eyebrow>About the publication</Eyebrow>
          <h1 className="page-title">The living archive, minus the museum voice.</h1>
          <p className="deck">{aboutData.intro}</p>
        </div>
      </section>

      <section className="section-block shell">
        <SectionHeading title="Why we publish" />
        <div className="about-grid">
          <article className="about-grid-card">
            <h3>Rhythm over chatter</h3>
            <p>{aboutData.why}</p>
          </article>
          <article className="about-grid-card">
            <h3>What we cover</h3>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              {aboutData.covers.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section-block shell">
        <SectionHeading title="Editorial standard" />
        <div className="story-grid">
          <article className="mission-card">
            <Eyebrow>Clarity</Eyebrow>
            <p>{aboutData.standard}</p>
          </article>
          <article className="mission-card">
            <Eyebrow>Memory</Eyebrow>
            <p>{aboutData.memory}</p>
          </article>
          <article className="mission-card">
            <Eyebrow>Dispatch</Eyebrow>
            <p>No rumors, no noise, no borrowed grandeur. Just Barça written with enough seriousness to be worth returning to.</p>
          </article>
        </div>
      </section>

      <section className="section-block shell">
        <SectionHeading title="Contributors" />
        <div className="story-grid">
          {contributors.map((person) => (
            <article className="story-card" key={person.name}>
              <Eyebrow>{person.role}</Eyebrow>
              <h3>{person.name}</h3>
              <p>{person.bio}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
