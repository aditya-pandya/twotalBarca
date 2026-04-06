import Link from "next/link";
import type { ReactNode } from "react";

export function NewsroomShell({
  title,
  dek,
  children,
}: {
  title: string;
  dek: string;
  children: ReactNode;
}) {
  return (
    <section className="newsroom-shell shell">
      <div className="newsroom-hero">
        <div>
          <span className="eyebrow">Internal Newsroom</span>
          <h1 className="page-title newsroom-title">{title}</h1>
        </div>
        <p className="deck newsroom-dek">{dek}</p>
      </div>
      <nav className="newsroom-nav" aria-label="Newsroom sections">
        <Link href="/newsroom">Overview</Link>
        <Link href="/newsroom/assignments">Assignments</Link>
        <Link href="/newsroom/review">Review</Link>
        <Link href="/newsroom/publishing">Publishing</Link>
        <Link href="/newsroom/signals">Signals</Link>
      </nav>
      {children}
    </section>
  );
}

export function NewsroomMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <article className="newsroom-panel newsroom-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

export function NewsroomPanel({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section className="newsroom-panel">
      {eyebrow ? <span className="newsroom-panel__eyebrow">{eyebrow}</span> : null}
      <h2>{title}</h2>
      {children}
    </section>
  );
}
