import Link from "next/link";
import { Eyebrow, SectionHeading } from "@/components/primitives";
import { aboutData, contributors } from "@/lib/site-data";

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="about-panel">
          <Eyebrow>{aboutData.intro.eyebrow}</Eyebrow>
          <h1 className="page-title">{aboutData.intro.title}</h1>
          <p className="deck">{aboutData.intro.dek}</p>
          <p className="about-intro-body">{aboutData.intro.body}</p>
        </div>
      </section>

      <section className="section-block shell" id="mission">
        <SectionHeading title={aboutData.mission.title} />
        <div className="about-grid">
          <article className="about-grid-card about-grid-card--wide">
            <p>{aboutData.mission.body}</p>
          </article>
          <article className="about-grid-card">
            <Eyebrow>{aboutData.mission.companion.eyebrow}</Eyebrow>
            <p>{aboutData.mission.companion.body}</p>
          </article>
        </div>
      </section>

      <section className="section-block shell" id="coverage">
        <SectionHeading title={aboutData.coverageTitle} />
        <div className="story-grid">
          {aboutData.coverage.map((item) => (
            <article className="mission-card" key={item.title}>
              <Eyebrow>{aboutData.coverageEyebrow}</Eyebrow>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block shell" id="principles">
        <SectionHeading title={aboutData.principlesTitle} />
        <div className="story-grid">
          {aboutData.principles.map((principle) => (
            <article className="mission-card" key={principle.title}>
              <Eyebrow>{aboutData.principlesEyebrow}</Eyebrow>
              <h3>{principle.title}</h3>
              <p>{principle.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block shell" id="contributors">
        <SectionHeading title={aboutData.contributorsTitle} />
        <div className="story-grid">
          {contributors.map((person) => (
            <article className="mission-card contributor-card" key={person.name}>
              <Eyebrow>{person.role}</Eyebrow>
              <h3>{person.name}</h3>
              <p className="contributor-specialty">{person.specialty}</p>
              <p>{person.bio}</p>
              <p className="contributor-trust">{person.trust}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block shell" id="archive">
        <SectionHeading title={aboutData.archiveTitle} />
        <div className="story-grid">
          {aboutData.archiveEvidence.map((item) => (
            <article className="mission-card" key={item.title}>
              <Eyebrow>{item.label}</Eyebrow>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block shell" id="contact">
        <SectionHeading title={aboutData.contact.title} />
        <div className="about-grid">
          <article className="about-grid-card about-grid-card--wide">
            <p>{aboutData.contact.body}</p>
          </article>
          <article className="about-grid-card about-contact-card">
            <Link className="header-cta about-contact-cta" href={aboutData.contact.primaryCtaHref}>
              {aboutData.contact.primaryCtaLabel}
            </Link>
            <p>
              <strong>{aboutData.contact.secondaryLabel}:</strong> {aboutData.contact.secondaryValue}
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
