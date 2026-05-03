import Link from "next/link";
import type { PropsWithChildren, ReactNode } from "react";
import type { Story } from "@/lib/site-data";

export function Section({
  children,
  className = "",
  tone = "default",
}: PropsWithChildren<{ className?: string; tone?: "default" | "tinted" | "ink" }>) {
  return (
    <section className={`section section-${tone} ${className}`.trim()}>{children}</section>
  );
}

export function Container({
  children,
  narrow = false,
  className = "",
}: PropsWithChildren<{ narrow?: boolean; className?: string }>) {
  return (
    <div className={`${narrow ? "container container-narrow" : "container"} ${className}`.trim()}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: PropsWithChildren) {
  return <p className="eyebrow">{children}</p>;
}

export function DisplayTitle({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <h1 className={`display-title ${className}`.trim()}>{children}</h1>;
}

export function PageTitle({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <h2 className={`page-title ${className}`.trim()}>{children}</h2>;
}

export function Deck({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <p className={`deck ${className}`.trim()}>{children}</p>;
}

export function SectionHeading({
  title,
  linkLabel,
  linkHref,
}: {
  title: string;
  linkLabel?: string;
  linkHref?: string;
}) {
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

export function Rule() {
  return <div className="editorial-rule" aria-hidden="true" />;
}

export function FallbackState({
  title,
  body,
  actionLabel,
  actionHref,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <article className="fallback-state" aria-live="polite">
      <Eyebrow>More to explore</Eyebrow>
      <h3>{title}</h3>
      <p>{body}</p>
      {actionLabel && actionHref ? <EditorialLink href={actionHref}>{actionLabel}</EditorialLink> : null}
    </article>
  );
}

export function MetaRow({
  date,
  readingTime,
  section,
}: {
  date?: string;
  readingTime?: string;
  section?: string;
}) {
  const items = [date, readingTime, section].filter(Boolean);

  return (
    <div className="meta-row" aria-label="Article metadata">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

export function EditorialLink({
  href,
  children,
  subtle = false,
}: PropsWithChildren<{ href: string; subtle?: boolean }>) {
  return (
    <Link className={subtle ? "editorial-link subtle" : "editorial-link"} href={href}>
      {children}
    </Link>
  );
}

export function Figure({
  title,
  caption,
  credit,
  children,
}: {
  title: string;
  caption: string;
  credit: string;
  children?: ReactNode;
}) {
  return (
    <figure className="figure">
      <div className="figure-art" role="img" aria-label={title}>
        {children}
      </div>
      <figcaption className="figure-caption">
        <span>{caption}</span>
        <span>{credit}</span>
      </figcaption>
    </figure>
  );
}

export function PullQuote({
  children,
  cite,
}: PropsWithChildren<{ cite?: string }>) {
  return (
    <figure className="pull-quote">
      <blockquote>{children}</blockquote>
      {cite ? <figcaption>{cite}</figcaption> : null}
    </figure>
  );
}

function StoryMedia({ story, variant }: { story: Story; variant: "story" | "feature" }) {
  if (!story.image) {
    return null;
  }

  return (
    <div className={variant === "feature" ? "featured-story-card__media" : "story-card__media"}>
      <img
        alt={story.image.alt}
        className={variant === "feature" ? "featured-story-card__image" : "story-card__image"}
        loading="lazy"
        src={story.image.src}
      />
    </div>
  );
}

export function StoryCard({
  story,
  href,
  compact = false,
  meta,
}: {
  story: Story;
  href?: string;
  compact?: boolean;
  meta?: string;
}) {
  const resolvedHref = href ?? story.href ?? "#";

  return (
    <article className={compact ? "story-card compact" : "story-card"}>
      <StoryMedia story={story} variant="story" />
      <Eyebrow>{story.section}</Eyebrow>
      <h3>
        <Link href={resolvedHref}>{story.headline}</Link>
      </h3>
      <p>{story.excerpt}</p>
      {meta ? <div className="card-meta">{meta}</div> : null}
      {!meta ? (
        <EditorialLink href={resolvedHref} subtle>
          Read more
        </EditorialLink>
      ) : null}
    </article>
  );
}

export function FeaturedStoryCard({ story, href }: { story: Story; href?: string }) {
  const resolvedHref = href ?? story.href ?? "#";

  return (
    <article className="featured-story-card">
      <StoryMedia story={story} variant="feature" />
      <div className="story-kicker">
        <Eyebrow>{story.section}</Eyebrow>
        <MetaRow date={story.date} readingTime={story.readingTime} />
      </div>
      <PageTitle className="feature-title">{story.headline}</PageTitle>
      {story.dek ? <Deck>{story.dek}</Deck> : null}
      <p className="story-excerpt">{story.excerpt}</p>
      <EditorialLink href={resolvedHref}>Read the feature</EditorialLink>
    </article>
  );
}
