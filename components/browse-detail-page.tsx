import { Eyebrow, FallbackState, FeaturedStoryCard, StoryCard } from "@/components/primitives";
import type { Article, DispatchIssue, Person, Season, Story, Topic } from "@/lib/site-data";

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

  return (
    <>
      <section className="section-block shell">
        <div className="browse-hero">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="page-title">{title}</h1>
          <p className="deck">{deck}</p>
          <p className="browse-inline-note">{intro}</p>
          <div className="browse-stat-grid">
            {stats.map((item) => (
              <article className="browse-stat-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block shell">
        <div className="section-head">
          <h2>Filed here</h2>
        </div>
        {featuredStory ? (
          <FeaturedStoryCard story={featuredStory} />
        ) : (
          <FallbackState
            title="No featured story is seeded yet"
            body="The route is live and the metadata is in place, but the next lead still needs to be filed."
            actionLabel="Browse the homepage"
            actionHref="/"
          />
        )}
        {secondaryStories.length > 0 ? (
          <div className="story-grid">
            {secondaryStories.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="section-block shell">
        <div className="section-head">
          <h2>{asideTitle}</h2>
        </div>
        {asideItems.length > 0 ? (
          <div className="story-grid">
            {asideItems.map((item) => (
              <article className="mission-card" key={`${item.title}-${item.body}`}>
                {item.eyebrow ? <Eyebrow>{item.eyebrow}</Eyebrow> : null}
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                {item.href && item.label ? (
                  <a className="editorial-link subtle" href={item.href}>
                    {item.label}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <FallbackState
            title="Related material is still being filed"
            body="This page already resolves, but its secondary shelf can expand as more routes and cross-links are seeded."
            actionLabel="Browse the archive"
            actionHref="/archive"
          />
        )}
      </section>
    </>
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

  return (
    <>
      <section className="section-block shell">
        <div className="browse-hero">
          <Eyebrow>Dispatch / Weekly issue</Eyebrow>
          <h1 className="page-title">{issue.issueTitle}</h1>
          <p className="deck">{issue.editorsNote}</p>
          <div className="browse-stat-grid">
            <article className="browse-stat-card">
              <span>Issue no.</span>
              <strong>{issue.issueNumber}</strong>
            </article>
            <article className="browse-stat-card">
              <span>Published</span>
              <strong>{issue.publishDate}</strong>
            </article>
            <article className="browse-stat-card">
              <span>Curated entries</span>
              <strong>{issue.items.length}</strong>
            </article>
          </div>
        </div>
      </section>

      <section className="section-block shell">
        <div className="section-head">
          <h2>Lead read</h2>
        </div>
        {leadStory ? (
          <FeaturedStoryCard story={leadStory} />
        ) : (
          <FallbackState
            title="The lead story was not found"
            body="This issue is still readable below, but the lead feature needs a valid article seed."
          />
        )}
      </section>

      <section className="section-block shell">
        <div className="section-head">
          <h2>Inside the issue</h2>
        </div>
        <div className="story-grid">
          {issue.items.map((item) => (
            <article className="mission-card" key={`${item.itemType}-${item.headline}`}>
              <Eyebrow>{item.itemType}</Eyebrow>
              <h3>{item.headline}</h3>
              <p>{item.summary}</p>
              <a className="editorial-link subtle" href={item.link}>
                Open item
              </a>
            </article>
          ))}
        </div>
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
    </>
  );
}
