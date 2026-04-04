import Link from "next/link";

type StoryCardProps = {
  section: string;
  headline: string;
  excerpt: string;
  href?: string;
  meta?: string;
};

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function StoryCard({ section, headline, excerpt, href = "#", meta }: StoryCardProps) {
  return (
    <article className="story-card">
      <Eyebrow>{section}</Eyebrow>
      <h3>
        <Link href={href}>{headline}</Link>
      </h3>
      <p>{excerpt}</p>
      {meta ? <div className="card-meta">{meta}</div> : null}
    </article>
  );
}

export function SectionHeading({ title, linkLabel, linkHref }: { title: string; linkLabel?: string; linkHref?: string }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {linkLabel && linkHref ? (
        <Link className="section-link" href={linkHref}>
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
