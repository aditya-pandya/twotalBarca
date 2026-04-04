import { Deck, EditorialLink, Eyebrow, MetaRow, PageTitle } from "@/components/primitives";
import type { Story } from "@/lib/site-data";

export function FeaturedStoryCard({ story, href }: { story: Story; href: string }) {
  return (
    <article className="featured-story-card">
      <div className="story-kicker">
        <Eyebrow>{story.section}</Eyebrow>
        <MetaRow author={story.author} date={story.date} readingTime={story.readingTime} />
      </div>
      <PageTitle className="feature-title">{story.headline}</PageTitle>
      {story.dek ? <Deck>{story.dek}</Deck> : null}
      <p className="story-excerpt">{story.excerpt}</p>
      <EditorialLink href={href}>Read the feature</EditorialLink>
    </article>
  );
}

export function StoryCard({
  story,
  href,
  compact = false,
}: {
  story: Story;
  href: string;
  compact?: boolean;
}) {
  return (
    <article className={compact ? "story-card compact" : "story-card"}>
      <Eyebrow>{story.section}</Eyebrow>
      <h3>{story.headline}</h3>
      <p>{story.excerpt}</p>
      <EditorialLink href={href} subtle>
        Read more
      </EditorialLink>
    </article>
  );
}
