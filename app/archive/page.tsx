import type { Metadata } from "next";
import { Eyebrow, FeaturedStoryCard, StoryCard } from "@/components/primitives";
import {
  archiveCollections,
  buildMetadata,
  getArchiveCollectionStories,
  getFeaturedArticleForRecord,
  seasons,
  topics,
} from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Archive",
  description:
    "The twotalBarça archive: historical essays, season routes, vault shelves, and usable memory rather than ceremonial nostalgia.",
  path: "/archive",
});

export default function ArchivePage() {
  const featuredArchiveStory = getFeaturedArticleForRecord({
    featuredArticleSlug: "the-weave-of-the-blau",
  });

  return (
    <>
      <section className="section-block shell">
        <div className="browse-hero">
          <Eyebrow>Archive</Eyebrow>
          <h1 className="page-title">The archive keeps the present honest.</h1>
          <p className="deck">
            twotalBarça treats archive work as a live editorial surface rather than a nostalgia annex.
          </p>
          <p className="browse-inline-note">
            Older shirts, older grounds, and older standards stay close to the front page because memory is one of the
            club&apos;s active conditions.
          </p>
          <div className="browse-stat-grid">
            <article className="browse-stat-card">
              <span>Shelves</span>
              <strong>{archiveCollections.length}</strong>
            </article>
            <article className="browse-stat-card">
              <span>Season routes</span>
              <strong>{seasons.length}</strong>
            </article>
            <article className="browse-stat-card">
              <span>History topics</span>
              <strong>{topics.filter((topic) => topic.slug.includes("history") || topic.slug.includes("stadium")).length}</strong>
            </article>
          </div>
        </div>
      </section>

      <section className="section-block shell">
        <div className="section-head">
          <h2>Lead archive essay</h2>
        </div>
        {featuredArchiveStory ? <FeaturedStoryCard story={featuredArchiveStory} /> : null}
      </section>

      <section className="section-block shell">
        <div className="section-head">
          <h2>Curated shelves</h2>
        </div>
        <div className="story-grid">
          {archiveCollections.map((collection) => (
            <article className="mission-card" key={collection.slug}>
              <Eyebrow>{collection.collectionType}</Eyebrow>
              <h3>{collection.title}</h3>
              <p>{collection.description}</p>
              <div className="story-grid">
                {getArchiveCollectionStories(collection).map((story) => (
                  <StoryCard compact key={story.slug} story={story} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block shell">
        <div className="section-head">
          <h2>Browse by season</h2>
        </div>
        <div className="story-grid">
          {seasons.map((season) => (
            <article className="mission-card" key={season.slug}>
              <Eyebrow>Season</Eyebrow>
              <h3>{season.label}</h3>
              <p>{season.summary}</p>
              <a className="editorial-link subtle" href={`/season/${season.slug}`}>
                Open season page
              </a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
