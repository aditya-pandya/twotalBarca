import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata, homePageData } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Home",
  description:
    "A curated front page of Barca essays, match notes, tactical analysis, archive work, and the weekly dispatch.",
  path: "/",
});

export default function HomePage() {
  const {
    hero,
    tickerItems,
    analysisFeature,
    cultureStories,
    briefDispatches,
    vault,
    reflections,
    newsletter,
  } = homePageData;

  return (
    <>
      <section className="home-hero home-shell">
        <div className="home-hero__copy">
          <div className="home-hero__meta">
            <span>{hero.section}</span>
            <span className="home-hero__line" aria-hidden="true" />
            <span>{hero.readingTime}</span>
          </div>
          <h1 className="home-hero__title">{hero.headline}</h1>
          <p className="home-hero__dek">{hero.dek}</p>
          <div className="home-hero__byline">
            <span>By {hero.author}</span>
            <Link href={hero.href ?? "/"}>Read the Story</Link>
          </div>
        </div>
        <div className="home-hero__image">
          <img alt={hero.image.alt} src={hero.image.src} />
        </div>
      </section>

      <section className="home-ticker" id="match-notes" aria-label="Publication ticker">
        <div className="home-ticker__track">
          {[0, 1].map((index) => (
            <div className="home-ticker__group" key={index}>
              {tickerItems.map((item) => (
                <Link className="home-ticker__item" href={item.href ?? "/"} key={`${index}-${item.label}`}>
                  <span className="home-ticker__dot" aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="home-bento home-shell" id="analysis">
        <article className="home-analysis-card">
          <div>
            <span className="home-kicker home-kicker--rose">{analysisFeature.kicker}</span>
            <h2>{analysisFeature.headline}</h2>
            <p>{analysisFeature.body}</p>
          </div>
          <div className="home-analysis-card__image">
            <img alt={analysisFeature.image.alt} src={analysisFeature.image.src} />
          </div>
          <Link className="home-inline-link" href={analysisFeature.href}>
            {analysisFeature.ctaLabel}
          </Link>
        </article>

        <div className="home-culture-column">
          <span className="home-kicker home-kicker--gold">Culture</span>
          <div className="home-culture-column__stack">
            {cultureStories.map((story) => (
              <article key={story.slug}>
                <h3>
                  <Link href={story.href ?? "#"}>{story.headline}</Link>
                </h3>
                <p>{story.excerpt}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="home-brief-column" id="brief">
          <Link className="home-kicker" href="/dispatch">
            The Brief
          </Link>
          <div className="home-brief-column__stack">
            {briefDispatches.map((item) => (
              <article
                className={item.featured ? "home-dispatch-card is-featured" : "home-dispatch-card"}
                key={item.stamp}
              >
                <span>{item.stamp}</span>
                <p>
                  <Link href={item.href}>{item.body}</Link>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-vault" id="archive">
        <div className="home-vault__inner home-shell">
          <div className="home-vault__heading">
            <div>
              <span className="home-kicker home-kicker--gold">{vault.kicker}</span>
              <h2>{vault.heading}</h2>
            </div>
            <Link className="home-inline-link home-inline-link--light" href={vault.ctaHref}>
              {vault.ctaLabel}
            </Link>
          </div>
          <div className="home-vault__grid">
            {vault.items.map((item) => (
              <Link className="home-vault-card" href={item.href} key={item.issue}>
                <div className="home-vault-card__image">
                  <img alt={item.title} src={item.image} />
                </div>
                <span>{item.issue}</span>
                <h3>{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-reflections home-shell" id="reflections">
        <div className="home-reflections__quotes">
          <span className="home-kicker home-kicker--rose">Reflections</span>
          <div className="home-reflections__stack">
            {reflections.map((item) => (
              <blockquote className="home-quote" key={item.byline}>
                <p>"{item.quote}"</p>
                <cite>- {item.byline}</cite>
              </blockquote>
            ))}
          </div>
        </div>

        <div className="home-newsletter">
          <div id="dispatch" />
          <h2>{newsletter.heading}</h2>
          <p>{newsletter.body}</p>
          <form>
            <label className="sr-only" htmlFor="dispatch-email">
              {newsletter.inputLabel}
            </label>
            <div className="home-newsletter__field">
              <input
                id="dispatch-email"
                name="email"
                placeholder={newsletter.inputPlaceholder}
                type="email"
              />
            </div>
            <Link className="header-cta" href="/dispatch">
              {newsletter.buttonLabel}
            </Link>
            <p className="home-newsletter__note">{newsletter.privacyNote}</p>
          </form>
          <Link className="home-inline-link" href="/dispatch">
            Browse dispatch archive
          </Link>
        </div>
      </section>
    </>
  );
}
