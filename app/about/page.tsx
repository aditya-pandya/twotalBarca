import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, siteMeta } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "About totalBarça",
  description: "totalBarça is a minimal weekly dispatch for Barça supporters: five takes and one fixture context.",
  path: "/about",
});

const principles = [
  {
    title: "One issue a week",
    detail: "Mondays, after the weekend settles. No drip feed, no fake urgency, no filler between issues.",
  },
  {
    title: "Five takes, one fixture context",
    detail: "Each issue has exactly five opinionated topics, one last-result capsule, and one next-match capsule.",
  },
  {
    title: "Text does the work",
    detail: "The voice is dry, direct, and edited. If the point needs hype to survive, it does not belong here.",
  },
];

export default function AboutPage() {
  return (
    <div className="weekly-about-page">
      <section className="weekly-about-hero shell">
        <p className="weekly-dispatch-eyebrow">About totalBarça</p>
        <h1>About totalBarça</h1>
        <p>
          totalBarça is a weekly Barça dispatch: five arguments, one fixture context, and enough restraint to let the
          football speak first.
        </p>
      </section>

      <section className="weekly-about-grid shell" aria-label="Editorial principles">
        {principles.map((item) => (
          <article key={item.title}>
            <p className="weekly-dispatch-label">Principle</p>
            <h2>{item.title}</h2>
            <p>{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="weekly-about-contact shell">
        <div>
          <p className="weekly-dispatch-eyebrow">Contact</p>
          <h2>Corrections, tips, sharper evidence.</h2>
          <p>
            If something is stale, wrong, or worth adding to next week’s issue, send it to the desk. Useful evidence beats
            loud certainty.
          </p>
        </div>
        <div className="weekly-dispatch-actions">
          <Link href="/dispatch">Read the dispatch</Link>
          <a href={`mailto:${siteMeta.contactEmail}`}>{siteMeta.contactEmail}</a>
        </div>
      </section>
    </div>
  );
}
