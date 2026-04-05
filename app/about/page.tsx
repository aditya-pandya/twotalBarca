import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, SectionHeading } from "@/components/primitives";
import { aboutData, buildMetadata, contributors, footerLinkGroups, seasons } from "@/lib/site-data";

const publicationSurfaces = [
  { title: "Match Notes", body: "Immediate football observations that still survive the next morning.", href: "/match-notes" },
  { title: "Analysis", body: "Structure, spacing, and the tactical reasons a pattern kept holding.", href: "/analysis" },
  { title: "Culture", body: "Barça as place, ritual, public language, and Catalan civic argument.", href: "/culture" },
  { title: "Weekly Dispatch", body: "A careful issue archive with lead reads, archive returns, and the line of argument that survived the week.", href: "/dispatch" },
  { title: "Archive", body: "Older pressure that still sharpens how the present club is judged.", href: "/archive" },
];

export const metadata: Metadata = buildMetadata({
  title: "About twotalBarça",
  description:
    "Mission, editorial standards, coverage map, contributor notes, archive credibility, and dispatch contact for twotalBarça.",
  path: "/about",
});

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

      <section className="section-block shell" id="standards">
        <SectionHeading title={aboutData.standardsTitle} />
        <div className="story-grid">
          {aboutData.standards.map((item) => (
            <article className="mission-card" key={item.title}>
              <Eyebrow>{aboutData.standardsEyebrow}</Eyebrow>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
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
          {seasons.map((season) => (
            <article className="mission-card" key={season.slug}>
              <Eyebrow>Season surface</Eyebrow>
              <h3>{season.label}</h3>
              <p>{season.summary}</p>
              <Link className="section-link" href={`/season/${season.slug}`}>
                Open season
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block shell" id="contributors">
        <SectionHeading title={aboutData.contributorsTitle} />
        <div className="story-grid">
          {contributors.map((person) => (
            <article className="mission-card contributor-card" key={person.slug}>
              <Eyebrow>{person.role}</Eyebrow>
              <h3>
                <Link href={`/person/${person.slug}`}>{person.name}</Link>
              </h3>
              <p className="contributor-specialty">{person.specialty}</p>
              <p>{person.fullBio}</p>
              <p className="contributor-trust">{person.trust}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block shell" id="browse">
        <SectionHeading title="Browse the publication" />
        <div className="story-grid">
          {publicationSurfaces.map((surface) => (
            <article className="mission-card browse-link-card" key={surface.title}>
              <Eyebrow>Publication route</Eyebrow>
              <h3>
                <Link href={surface.href}>{surface.title}</Link>
              </h3>
              <p>{surface.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block shell" id="contact">
        <SectionHeading title={aboutData.contact.title} />
        <div className="about-grid">
          <article className="about-grid-card about-grid-card--wide">
            <p>{aboutData.contact.body}</p>
            <p className="about-intro-body">
              The footer anchors are real publication wayfinding too:{" "}
              {footerLinkGroups
                .flatMap((group) => group.links)
                .filter((link) => link.href.startsWith("/about#"))
                .map((link) => link.label)
                .join(", ")}
              .
            </p>
          </article>
          <article className="about-grid-card about-contact-card">
            <Link className="header-cta about-contact-cta" href={aboutData.contact.primaryCtaHref}>
              {aboutData.contact.primaryCtaLabel}
            </Link>
            <p>
              <strong>{aboutData.contact.secondaryLabel}:</strong> {aboutData.contact.secondaryValue}
            </p>
            <Link className="section-link" href="/dispatch">
              Browse dispatch archive
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}
