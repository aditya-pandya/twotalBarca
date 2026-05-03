import Link from "next/link";
import { BrowseLedgerGrid, BrowseRoutePanel, BrowseStatList, BrowseStoryRiver } from "@/components/browse-route-primitives";
import { Eyebrow, FallbackState, FeaturedStoryCard } from "@/components/primitives";
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
  const companionStories = secondaryStories.slice(0, 2);
  const riverStories = secondaryStories.slice(2);
  const routeItems = [
    ...topics.slice(0, 2).map((topic) => ({
      eyebrow: "Topic",
      title: topic.name,
      body: topic.description,
      href: `/topic/${topic.slug}`,
      meta: `${stories.filter((story) => story.topicSlugs.includes(topic.slug)).length} linked stories`,
    })),
    collections.length > 0
      ? {
          eyebrow: "Archive shelf",
          title: collections[0].title,
          body: collections[0].description,
          href: "#section-shelves",
          meta: `${collections.length} related shelf${collections.length === 1 ? "" : "s"}`,
        }
      : {
          eyebrow: "Archive",
          title: "Open the archive index",
          body: "When the present argument needs older proof, the archive carries the longer memory through shelves, seasons, and topics.",
          href: "/archive",
        },
  ];

  return (
    <div className="browse-page section-page">
      <section className="section-block shell">
        <div className="browse-hero browse-route-hero">
          <div className="browse-hero__main">
            <Eyebrow>{section.eyebrow}</Eyebrow>
            <h1 className="page-title">{section.name}</h1>
            <p className="deck">{section.description}</p>
            <p className="browse-inline-note">{section.landingDek}</p>
            <BrowseStatList
              ariaLabel={`${section.name} statistics`}
              stats={[
                { label: "Stories", value: String(stories.length) },
                { label: "Topics", value: String(topics.length) },
                { label: "Archive shelves", value: String(collections.length) },
              ]}
            />
          </div>
          <BrowseRoutePanel
            ariaLabel={`${section.name} wayfinding`}
            intro="Start with the lead story, move through the active topics, then step into the archive when the present reading needs older proof."
            items={routeItems}
            label={`Within ${section.name}`}
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
              title="No lead report is linked yet"
              body="Open the archive while this section's next feature is being queued for publication."
              actionLabel="Open the archive"
              actionHref="/archive"
            />
          )}
          <aside className="browse-feature-aside" aria-label={`${section.name} companion stories`}>
            <article className="browse-note-card">
              <p className="browse-note-card__label">Section line</p>
              <h3>{section.landingDek}</h3>
              <p>
                This desk keeps its footing by publishing fewer pieces, sharper claims, and enough cross-reference
                that each new story arrives with context rather than noise.
              </p>
            </article>
            {companionStories.length > 0 ? (
              <div className="browse-mini-section">
                <p className="browse-note-card__label">Also reading now</p>
                <ul className="browse-mini-list">
                  {companionStories.map((story) => (
                    <li key={story.slug ?? story.headline}>
                      <p className="browse-mini-list__eyebrow">{story.readingTime ?? story.section}</p>
                      <Link href={story.href ?? "#"}>{story.headline}</Link>
                      <p>{story.excerpt}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
        {riverStories.length > 0 ? <BrowseStoryRiver stories={riverStories} /> : null}
      </section>

      <section className="section-block shell">
        <div className="section-head">
          <h2>Topics</h2>
        </div>
        <BrowseLedgerGrid
          items={topics.map((topic) => ({
            eyebrow: "Topic",
            title: topic.name,
            body: topic.description,
            href: `/topic/${topic.slug}`,
            meta: `${stories.filter((story) => story.topicSlugs.includes(topic.slug)).length} story threads`,
          }))}
        />
      </section>

      {collections.length > 0 ? (
        <section className="section-block browse-shelf-band" id="section-shelves">
          <div className="shell">
            <div className="section-head">
              <h2>Related shelves</h2>
            </div>
            <div className="browse-shelf-grid">
              {collections.map((collection) => (
                <article className="browse-shelf-card" key={collection.slug}>
                  <div className="browse-shelf-card__head">
                    <Eyebrow>{collection.collectionType}</Eyebrow>
                    <h3>{collection.title}</h3>
                    <p>{collection.description}</p>
                  </div>
                  <ul className="browse-shelf-list">
                    {stories
                      .filter((story) => collection.itemSlugs.includes(story.slug))
                      .slice(0, 3)
                      .map((story) => (
                        <li key={story.slug ?? story.headline}>
                          <p className="browse-shelf-list__meta">{story.section}</p>
                          <Link href={story.href ?? "#"}>{story.headline}</Link>
                          <p>{story.excerpt}</p>
                        </li>
                      ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
