import { Eyebrow, FallbackState, FeaturedStoryCard, StoryCard } from "@/components/primitives";
import type { ArchiveCollection, Article, SectionRecord, Topic } from "@/lib/site-data";

export function SectionLandingPage({
  section,
  featuredStory,
  stories,
  topics,
  collections = [],
}: {
  section: SectionRecord;
  featuredStory?: Article;
  stories: Article[];
  topics: Topic[];
  collections?: ArchiveCollection[];
}) {
  const secondaryStories = featuredStory
    ? stories.filter((story) => story.slug !== featuredStory.slug)
    : stories;

  return (
    <>
      <section className="section-block shell">
        <div className="browse-hero">
          <Eyebrow>{section.eyebrow}</Eyebrow>
          <h1 className="page-title">{section.name}</h1>
          <p className="deck">{section.description}</p>
          <p className="browse-inline-note">{section.landingDek}</p>
          <div className="browse-stat-grid" aria-label={`${section.name} statistics`}>
            <article className="browse-stat-card">
              <span>Stories</span>
              <strong>{stories.length}</strong>
            </article>
            <article className="browse-stat-card">
              <span>Topics</span>
              <strong>{topics.length}</strong>
            </article>
            <article className="browse-stat-card">
              <span>Archive shelves</span>
              <strong>{collections.length}</strong>
            </article>
          </div>
        </div>
      </section>

      <section className="section-block shell">
        <div className="section-head">
          <h2>From this section</h2>
        </div>
        {featuredStory ? (
          <FeaturedStoryCard story={featuredStory} />
        ) : (
          <FallbackState
            title="This section is still taking shape"
            body="The section page is wired up, but the next feature has not been seeded yet."
            actionLabel="Open the archive"
            actionHref="/archive"
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
          <h2>Topic paths</h2>
        </div>
        <div className="story-grid">
          {topics.map((topic) => (
            <article className="mission-card" key={topic.slug}>
              <Eyebrow>Topic</Eyebrow>
              <h3>{topic.name}</h3>
              <p>{topic.description}</p>
              <a className="editorial-link subtle" href={`/topic/${topic.slug}`}>
                Browse topic
              </a>
            </article>
          ))}
        </div>
      </section>

      {collections.length > 0 ? (
        <section className="section-block shell">
          <div className="section-head">
            <h2>Related shelves</h2>
          </div>
          <div className="story-grid">
            {collections.map((collection) => (
              <article className="mission-card" key={collection.slug}>
                <Eyebrow>{collection.collectionType}</Eyebrow>
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
