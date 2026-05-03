import Link from "next/link";
import type { Story } from "@/lib/site-data";

export type BrowseStat = {
  label: string;
  value: string;
};

export type BrowseRouteItem = {
  eyebrow?: string;
  title: string;
  body: string;
  href?: string;
  meta?: string;
};

export function BrowseStatList({
  stats,
  ariaLabel,
}: {
  stats: BrowseStat[];
  ariaLabel: string;
}) {
  return (
    <dl className="browse-stat-grid" aria-label={ariaLabel}>
      {stats.map((item) => (
        <div className="browse-stat-card" key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function BrowseRoutePanel({
  label,
  intro,
  items,
  ariaLabel,
}: {
  label: string;
  intro?: string;
  items: BrowseRouteItem[];
  ariaLabel: string;
}) {
  return (
    <aside className="browse-route-panel" aria-label={ariaLabel}>
      <p className="browse-route-panel__label">{label}</p>
      {intro ? <p className="browse-route-panel__intro">{intro}</p> : null}
      <ul className="browse-route-list">
        {items.map((item) => (
          <li key={`${item.title}-${item.href ?? item.body}`}>
            {item.eyebrow ? <p className="browse-route-panel__eyebrow">{item.eyebrow}</p> : null}
            <h3>
              {item.href ? (
                <Link className="browse-route-panel__link" href={item.href}>
                  {item.title}
                </Link>
              ) : (
                item.title
              )}
            </h3>
            <p className="browse-route-panel__body">{item.body}</p>
            {item.meta ? <p className="browse-route-panel__meta">{item.meta}</p> : null}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function BrowseStoryRiver({
  stories,
  showSection = false,
  className = "",
}: {
  stories: Story[];
  showSection?: boolean;
  className?: string;
}) {
  return (
    <div className={`browse-story-river ${className}`.trim()}>
      {stories.map((story) => (
        <article className="browse-story-river__item" key={story.slug ?? story.headline}>
          <div className="browse-story-river__meta">
            {showSection ? <span>{story.section}</span> : null}
            {story.date ? <span>{story.date}</span> : null}
            {story.readingTime ? <span>{story.readingTime}</span> : null}
          </div>
          <h3>
            <Link href={story.href ?? "#"}>{story.headline}</Link>
          </h3>
          {story.dek ? <p className="browse-story-river__dek">{story.dek}</p> : null}
          <p>{story.excerpt}</p>
        </article>
      ))}
    </div>
  );
}

export function BrowseLedgerGrid({
  items,
  className = "",
}: {
  items: BrowseRouteItem[];
  className?: string;
}) {
  return (
    <div className={`browse-ledger-grid ${className}`.trim()}>
      {items.map((item) => (
        <article className="browse-ledger-card" key={`${item.title}-${item.href ?? item.body}`}>
          {item.eyebrow ? <p className="browse-ledger-card__eyebrow">{item.eyebrow}</p> : null}
          <h3>
            {item.href ? (
              <Link className="browse-ledger-card__link" href={item.href}>
                {item.title}
              </Link>
            ) : (
              item.title
            )}
          </h3>
          <p>{item.body}</p>
          {item.meta ? <p className="browse-ledger-card__meta">{item.meta}</p> : null}
        </article>
      ))}
    </div>
  );
}
