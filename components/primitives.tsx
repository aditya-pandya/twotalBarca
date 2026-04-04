import Link from "next/link";
import type { PropsWithChildren, ReactNode } from "react";

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

export function Rule() {
  return <div className="editorial-rule" aria-hidden="true" />;
}

export function MetaRow({
  author,
  date,
  readingTime,
  section,
}: {
  author?: string;
  date?: string;
  readingTime?: string;
  section?: string;
}) {
  const items = [author, date, readingTime, section].filter(Boolean);

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

export function PullQuote({ children }: PropsWithChildren) {
  return <blockquote className="pull-quote">{children}</blockquote>;
}
