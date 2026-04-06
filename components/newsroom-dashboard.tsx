import Link from "next/link";
import type { PropsWithChildren } from "react";

type MetricCardProps = {
  label: string;
  value: string | number;
  detail: string;
};

export function NewsroomShell({
  title,
  dek,
  children,
}: PropsWithChildren<{ title: string; dek: string }>) {
  return (
    <section className="newsroom-shell">
      <div className="newsroom-shell__hero">
        <p className="eyebrow">Internal Newsroom</p>
        <h1 className="page-title">{title}</h1>
        <p className="deck">{dek}</p>
        <div className="newsroom-shell__nav" aria-label="Newsroom navigation">
          <Link href="/newsroom">Overview</Link>
          <Link href="/newsroom/assignments">Assignments</Link>
          <Link href="/newsroom/signals">Signals</Link>
          <Link href="/newsroom/review">Review</Link>
          <Link href="/newsroom/publishing">Publishing</Link>
        </div>
      </div>
      <div className="newsroom-shell__body">{children}</div>
    </section>
  );
}

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <article className="newsroom-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

export function DashboardGrid({ children }: PropsWithChildren) {
  return <div className="newsroom-grid">{children}</div>;
}

export function QueueCard({
  title,
  eyebrow,
  children,
}: PropsWithChildren<{ title: string; eyebrow: string }>) {
  return (
    <article className="newsroom-queue-card">
      <div className="newsroom-queue-card__head">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <div className="newsroom-queue-card__body">{children}</div>
    </article>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="newsroom-empty">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
