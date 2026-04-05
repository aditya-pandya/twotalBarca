import type { Metadata } from "next";
import { Eyebrow, FeaturedStoryCard, StoryCard } from "@/components/primitives";
import { buildMetadata, dispatchIssues, getDispatchLeadStory, getDispatchStories } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Dispatch",
  description:
    "The Weekly Dispatch archive for twotalBarça: must-reads, archive picks, watchlists, and the line of argument that survived the week.",
  path: "/dispatch",
});

export default function DispatchPage() {
  const latestIssue = dispatchIssues[0];
  const leadStory = latestIssue ? getDispatchLeadStory(latestIssue) : undefined;
  const issueStories = latestIssue ? getDispatchStories(latestIssue) : [];

  return (
    <>
      <section className="section-block shell">
        <div className="browse-hero">
          <Eyebrow>Dispatch</Eyebrow>
          <h1 className="page-title">Weekly Dispatch</h1>
          <p className="deck">A weekly issue, not an inbox landfill.</p>
          <p className="browse-inline-note">
            The Weekly Dispatch gathers the publication&apos;s most useful work into one careful package: one lead read,
            one archive return, and the line of argument that survived the week.
          </p>
          {latestIssue ? (
            <div className="browse-stat-grid">
              <article className="browse-stat-card">
                <span>Latest issue</span>
                <strong>No. {latestIssue.issueNumber}</strong>
              </article>
              <article className="browse-stat-card">
                <span>Published issues</span>
                <strong>{dispatchIssues.length}</strong>
              </article>
              <article className="browse-stat-card">
                <span>Items this week</span>
                <strong>{latestIssue.items.length}</strong>
              </article>
            </div>
          ) : null}
        </div>
      </section>

      {latestIssue ? (
        <>
          <section className="section-block shell">
            <div className="section-head">
              <h2>{latestIssue.issueTitle}</h2>
            </div>
            {leadStory ? <FeaturedStoryCard story={leadStory} /> : null}
            <div className="story-grid">
              {issueStories
                .filter((story) => story.slug !== leadStory?.slug)
                .map((story) => (
                  <StoryCard key={story.slug} story={story} />
                ))}
            </div>
          </section>

          <section className="section-block shell">
            <div className="section-head">
              <h2>Issue archive</h2>
            </div>
            <div className="story-grid">
              {dispatchIssues.map((issue) => (
                <article className="mission-card" key={issue.slug}>
                  <Eyebrow>Issue {issue.issueNumber}</Eyebrow>
                  <h3>{issue.issueTitle}</h3>
                  <p>{issue.editorsNote}</p>
                  <a className="editorial-link subtle" href={`/dispatch/${issue.slug}`}>
                    Open issue
                  </a>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </>
  );
}
