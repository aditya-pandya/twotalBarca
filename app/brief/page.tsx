import type { Metadata } from "next";
import Link from "next/link";
import { FallbackState, StoryCard } from "@/components/primitives";
import { ReactionWidget } from "@/components/reaction-widget";
import { buildMetadata, getLatestBriefArticle, getLatestDispatchIssue, matchContext, siteMeta } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "The Brief",
  description: "The totalBarca Brief appears only when the desk has a current five-point file worth publishing.",
  path: "/brief",
});

export default function BriefPage() {
  const brief = getLatestBriefArticle();
  const latestDispatch = getLatestDispatchIssue();
  const latestDispatchHref = latestDispatch ? `/dispatch/${latestDispatch.slug}` : "/dispatch";

  if (!brief) {
    return (
      <div className="browse-page brief-page">
        <section className="section-block shell">
          <div className="brief-hero browse-hero surface-hero__copy brief-page__hero-copy">
            <p className="eyebrow">The Brief</p>
            <h1 className="page-title">The Brief</h1>
            <p className="deck">Five points when the week is ready, not before.</p>
            <p className="browse-inline-note">
              The last brief was removed because it no longer matched the current Barça picture. This slot stays quiet until
              the desk has a live five-point file worth keeping.
            </p>
          </div>
        </section>

        <section className="section-block shell">
          <FallbackState
            title="The Brief is updating"
            body="The previous edition was pulled instead of leaving an old matchweek on the site. The next brief appears here once it reflects current Barça developments."
            actionLabel={latestDispatch ? "Open Dispatch" : "Back home"}
            actionHref={latestDispatch ? latestDispatchHref : "/"}
          />
        </section>
      </div>
    );
  }

  return (
    <div className="browse-page brief-page">
      <section className="section-block shell">
        <div className="surface-hero__grid brief-page__hero-grid">
          <div className="brief-hero browse-hero surface-hero__copy brief-page__hero-copy">
            <p className="eyebrow">The Brief / Five points</p>
            <h1 className="page-title">{brief.headline}</h1>
            <p className="deck">{brief.dek}</p>
            <div className="brief-hero__meta card-meta">
              <span>{brief.date}</span>
              <span>{brief.readTime}</span>
              <span>{siteMeta.name}</span>
            </div>
            <p className="browse-inline-note">Published only when the desk has a live five-point file worth keeping.</p>
          </div>
        </div>

        <figure className="editorial-image-block editorial-image-block--hero">
          <img alt={brief.heroImage.alt} className="editorial-image-block__image" src={brief.heroImage.src} />
          <figcaption className="editorial-image-block__caption">
            <span>{brief.heroCaption}</span>
            <span>{brief.heroCredit}</span>
          </figcaption>
        </figure>
      </section>

      {matchContext.recent.length > 0 || matchContext.upcoming.length > 0 ? (
        <section className="section-block shell">
          <div className="brief-context-grid">
            <article className="mission-card">
              <p className="eyebrow">Recent context</p>
              <ul className="brief-context-list">
                {matchContext.recent.map((item) => (
                  <li key={item.label}>
                    <strong>{item.label}</strong> — {item.detail}
                  </li>
                ))}
              </ul>
            </article>
            <article className="mission-card">
              <p className="eyebrow">Upcoming</p>
              <ul className="brief-context-list">
                {matchContext.upcoming.map((item) => (
                  <li key={item.label}>
                    <strong>{item.label}</strong> — {item.detail}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      ) : null}

      <section className="section-block shell">
        <div className="section-head">
          <h2>Five points</h2>
        </div>
        <ol className="brief-points-list">
          {brief.body.map((point, index) => (
            <li className="brief-point-card" key={point}>
              <span className="brief-point-card__index">0{index + 1}</span>
              <p>{point}</p>
            </li>
          ))}
        </ol>
      </section>

      {brief.related.length > 0 ? (
        <section className="section-block shell">
          <div className="section-head">
            <h2>Keep reading</h2>
          </div>
          <div className="story-grid">
            {brief.related.map((story) => (
              <StoryCard key={story.slug ?? story.headline} story={story} />
            ))}
            <article className="mission-card brief-next-link">
              <p className="eyebrow">Next read</p>
              <h3>Then read the weekly issue.</h3>
              <p>The Dispatch keeps the argument under one roof once the fixtures start crowding each other again.</p>
              <Link className="editorial-link" href={latestDispatchHref}>
                Read Dispatch No. {latestDispatch?.issueNumber ?? "latest"}
              </Link>
            </article>
          </div>
        </section>
      ) : null}

      <section className="section-block shell">
        <ReactionWidget storageKey="brief:latest" title="How did this land?" />
      </section>
    </div>
  );
}
