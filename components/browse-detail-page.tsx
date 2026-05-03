import Link from "next/link";
import {
  BrowseLedgerGrid,
  BrowseRoutePanel,
  BrowseStatList,
  BrowseStoryRiver,
  type BrowseRouteItem,
} from "@/components/browse-route-primitives";
import { ReactionWidget } from "@/components/reaction-widget";
import { Eyebrow, FallbackState, FeaturedStoryCard, StoryCard } from "@/components/primitives";
import { getDispatchCoverImage, type Article, type DispatchIssue } from "@/lib/site-data";

export function BrowseDetailPage({
  eyebrow,
  title,
  deck,
  intro,
  stats,
  featuredStory,
  stories,
  asideTitle,
  asideItems,
}: {
  eyebrow: string;
  title: string;
  deck: string;
  intro: string;
  stats: Array<{ label: string; value: string }>;
  featuredStory?: Article;
  stories: Article[];
  asideTitle: string;
  asideItems: Array<{ eyebrow?: string; title: string; body: string; href?: string; label?: string }>;
}) {
  const secondaryStories = featuredStory ? stories.filter((story) => story.slug !== featuredStory.slug) : stories;
  const companionStories = secondaryStories.slice(0, 2);
  const riverStories = secondaryStories.slice(2);
  const routeItems: BrowseRouteItem[] = asideItems.slice(0, 3).map((item) => ({
    eyebrow: item.eyebrow,
    title: item.title,
    body: item.body,
    href: item.href,
  }));
  const storyCountLabel = `${stories.length} stor${stories.length === 1 ? "y" : "ies"}`;
  const noteCountLabel = `${asideItems.length} connected ${asideItems.length === 1 ? "note" : "notes"}`;

  return (
    <div className="browse-page">
      <section className="section-block shell">
        <div className="browse-hero browse-route-hero">
          <div className="browse-hero__main">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="page-title">{title}</h1>
            <p className="deck">{deck}</p>
            <p className="browse-inline-note">{intro}</p>
            <BrowseStatList
              ariaLabel={`${title} statistics`}
              stats={stats}
            />
          </div>
          <BrowseRoutePanel
            ariaLabel={`${title} related links`}
            intro={`${storyCountLabel} and ${noteCountLabel} keep this page tied into the wider publication.`}
            items={routeItems}
            label={asideTitle}
          />
        </div>
      </section>

      <section className="section-block shell">
        <div className="section-head">
          <h2>Lead story</h2>
        </div>
        <div className="browse-feature-grid">
          {featuredStory ? (
            <FeaturedStoryCard story={featuredStory} />
          ) : (
            <FallbackState
              title="No lead story is linked yet"
              body="Open the homepage for the latest published lead while this page gets its feature binding."
              actionLabel="Browse the homepage"
              actionHref="/"
            />
          )}
          <aside className="browse-feature-aside" aria-label={`${title} companion stories`}>
            <article className="browse-note-card">
              <p className="browse-note-card__label">Why it matters</p>
              <h3>{title} stays connected to the wider publication.</h3>
              <p>{intro}</p>
            </article>
            {companionStories.length > 0 ? (
              <div className="browse-mini-section">
                <p className="browse-note-card__label">Continue from here</p>
                <ul className="browse-mini-list">
                  {companionStories.map((story) => (
                    <li key={story.slug ?? story.headline}>
                      <p className="browse-mini-list__eyebrow">{story.section}</p>
                      <Link href={story.href ?? "#"}>{story.headline}</Link>
                      <p>{story.excerpt}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
        {riverStories.length > 0 ? <BrowseStoryRiver showSection stories={riverStories} /> : null}
      </section>

      <section className="section-block shell">
        <div className="section-head">
          <h2>{asideTitle}</h2>
        </div>
        {asideItems.length > 0 ? (
          <BrowseLedgerGrid
            items={asideItems.map((item) => ({
              eyebrow: item.eyebrow,
              title: item.title,
              body: item.body,
              href: item.href,
            }))}
          />
        ) : (
          <FallbackState
            title="No related notes are linked yet"
            body="This route will expand as more cross-references are published into the archive graph."
            actionLabel="Browse the archive"
            actionHref="/archive"
          />
        )}
      </section>
    </div>
  );
}

export function DispatchIssuePage({
  issue,
  leadStory,
  stories,
}: {
  issue: DispatchIssue;
  leadStory?: Article;
  stories: Article[];
}) {
  const nonLeadStories = leadStory ? stories.filter((story) => story.slug !== leadStory.slug) : stories;
  const coverImage = getDispatchCoverImage(issue, "issue");

  return (
    <div className="browse-page dispatch-issue-page">
      <section className="section-block shell">
        <div className="surface-hero__grid dispatch-issue-page__hero-grid">
          <div className="browse-hero surface-hero__copy dispatch-issue-page__hero-copy">
            <Eyebrow>Dispatch / Weekly issue</Eyebrow>
            <h1 className="page-title">{issue.issueTitle}</h1>
            <p className="deck">{issue.editorsNote}</p>
            <div className="browse-stat-grid">
              <article className="browse-stat-card">
                <span>Issue</span>
                <strong>{issue.issueNumber}</strong>
              </article>
              <article className="browse-stat-card">
                <span>Published</span>
                <strong>{issue.publishDate}</strong>
              </article>
              <article className="browse-stat-card">
                <span>Items in issue</span>
                <strong>{issue.items.length}</strong>
              </article>
            </div>
          </div>

          <aside className="surface-summary-card dispatch-issue-page__hero-summary">
            <p className="surface-summary-card__label">Issue spine</p>
            <p>
              The cover image should set the week's atmosphere before the lead story narrows it. Each issue keeps the
              strongest football questions under one roof without drifting into stale framing.
            </p>
            <ul className="surface-stat-list">
              {issue.items.slice(0, 3).map((item) => (
                <li key={item.headline}>
                  <strong>{item.itemType}:</strong> {item.headline}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <figure className="editorial-image-block editorial-image-block--hero editorial-image-block--cover">
          <img alt={coverImage.alt} className="editorial-image-block__image" src={coverImage.src} />
          <figcaption className="editorial-image-block__caption">
            <span>{coverImage.caption ?? issue.issueTitle}</span>
            <span>{coverImage.credit}</span>
          </figcaption>
          <span className="editorial-image-block__badge">Dispatch No. {issue.issueNumber}</span>
        </figure>
      </section>

      <section className="section-block shell">
        <div className="section-head">
          <h2>Lead read</h2>
        </div>
        {leadStory ? (
          <FeaturedStoryCard story={leadStory} />
        ) : (
          <FallbackState
            title="The lead story link is missing"
            body="The issue remains readable below while the lead feature mapping is repaired."
          />
        )}
      </section>

      <section className="section-block shell">
        <div className="section-head">
          <h2>Five points</h2>
        </div>
        <ol className="dispatch-points-list">
          {issue.items.map((item, index) => (
            <li className="dispatch-point-card mission-card" key={`${item.itemType}-${item.headline}`}>
              <div className="dispatch-point-card__head">
                <span className="dispatch-point-card__label">Point {index + 1}</span>
                <span className="dispatch-point-card__type">{item.itemType}</span>
              </div>
              <h3>{item.headline}</h3>
              <p>{item.summary}</p>
              <Link className="editorial-link subtle" href={item.link}>
                Read item
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-block shell">
        <ReactionWidget storageKey={`dispatch:${issue.slug}:issue`} title="How did this land?" />
      </section>

      {nonLeadStories.length > 0 ? (
        <section className="section-block shell">
          <div className="section-head">
            <h2>Related reads</h2>
          </div>
          <div className="story-grid">
            {nonLeadStories.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
