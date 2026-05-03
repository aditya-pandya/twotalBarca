import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article-body";
import { JsonLd } from "@/components/json-ld";
import { Eyebrow, FallbackState, MetaRow } from "@/components/primitives";
import {
  buildMetadata,
  getArticleBySlug,
  getArticleCompanionCopy,
  getArticleSlugs,
  getStoryHref,
  getTopicLabel,
  siteMeta,
} from "@/lib/site-data";
import { buildArticleSchema } from "@/lib/schema";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getArticleSlugs().map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const currentArticle = getArticleBySlug(slug);

  if (!currentArticle) {
    return {};
  }

  return buildMetadata({
    title: currentArticle.seoTitle ?? currentArticle.headline,
    description: currentArticle.metaDescription ?? currentArticle.excerpt,
    path: `/article/${currentArticle.slug}`,
    type: "article",
    publishedTime: new Date(currentArticle.date).toISOString(),
    authors: [siteMeta.editorialByline],
    section: currentArticle.section,
    tags: currentArticle.topics,
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const currentArticle = getArticleBySlug(slug);

  if (!currentArticle) {
    notFound();
  }

  const [featuredRelated, ...remainingRelated] = currentArticle.related;
  const companionCopy = getArticleCompanionCopy(currentArticle);

  return (
    <>
      <section className="article-hero-shell">
        <div className="article-hero">
          <div className="article-hero-band" aria-hidden="true">
            <span className="article-hero-stripe navy" />
            <span className="article-hero-stripe garnet" />
            <span className="article-hero-stripe navy slim" />
            <span className="article-hero-stripe garnet slim" />
          </div>
          <div className="article-hero-copy">
            <Eyebrow>
              {currentArticle.section} / {currentArticle.type}
            </Eyebrow>
            <h1 className="article-title">{currentArticle.headline}</h1>
            <p className="article-dek">{currentArticle.dek}</p>
            <MetaRow date={currentArticle.date} readingTime={currentArticle.readTime} section={currentArticle.historicalEra} />
          </div>
          <aside className="article-hero-summary">
            <p className="article-summary-label">Article ledger</p>
            <p>{currentArticle.excerpt}</p>
            <div className="article-summary-divider" aria-hidden="true" />
            <p>{currentArticle.ritual}</p>
          </aside>
        </div>
      </section>

      <section className="article-main-shell">
        <div className="article-main">
          <aside className="article-meta-rail">
            <div className="article-meta-card">
              <span>Published</span>
              <p>{currentArticle.date}</p>
            </div>
            <div className="article-meta-card">
              <span>Reading time</span>
              <p>{currentArticle.readTime}</p>
            </div>
            <div className="article-meta-card">
              <span>Filed under</span>
              <p>{currentArticle.historicalEra ?? currentArticle.section}</p>
            </div>
          </aside>

          <div className="article-main-column">
            <div className="article-intro">
              <p className="article-standfirst">{currentArticle.excerpt}</p>
            </div>
            <figure className="article-hero-media">
              <img
                alt={currentArticle.heroImage.alt}
                className="article-hero-media__image"
                src={currentArticle.heroImage.src}
              />
              <figcaption className="article-hero-media__caption">
                <span>{currentArticle.heroCaption}</span>
                <span>{currentArticle.heroCredit}</span>
              </figcaption>
            </figure>
            <ArticleBody
              conviction={currentArticle.conviction}
              convictionLabel={companionCopy.convictionLabel}
              fieldNote={currentArticle.ritual}
              fieldNoteLabel={companionCopy.fieldNoteLabel}
              paragraphs={currentArticle.body}
              pullQuote={currentArticle.pullQuote}
            />
          </div>
        </div>
      </section>

      <section className="article-notes-shell">
        <div className="article-notes">
          <div className="article-notes-head">
            <div>
              <Eyebrow>{companionCopy.notebookEyebrow}</Eyebrow>
              <h2>{companionCopy.notebookTitle}</h2>
            </div>
            <p>{companionCopy.notebookDescription}</p>
          </div>
          <div className="timeline-grid">
            {currentArticle.timeline.map((item) => (
              <article key={`${item.year}-${item.note}`} className="timeline-card">
                <p className="timeline-year">{item.year}</p>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
          <div className="topic-row">
            {currentArticle.topicSlugs.map((topic) => (
              <Link href={`/topic/${topic}`} key={topic} className="topic-chip">
                {getTopicLabel(topic)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="related-editorial-shell">
        <div className="related-editorial-head">
          <div>
            <Eyebrow>Related narratives</Eyebrow>
            <h2>Continue reading</h2>
          </div>
          <Link className="section-link" href="/">
            Back home
          </Link>
        </div>
        {featuredRelated ? (
          <div className="related-editorial-grid">
            <article className="related-feature">
              <Link href={getStoryHref(featuredRelated)} className="related-feature-visual">
                {featuredRelated.image ? (
                  <img
                    alt={featuredRelated.image.alt}
                    className="related-feature-visual__image"
                    loading="lazy"
                    src={featuredRelated.image.src}
                  />
                ) : null}
                <div className="related-feature-copy">
                  <Eyebrow>{featuredRelated.section}</Eyebrow>
                  <h3>{featuredRelated.headline}</h3>
                  <p>{featuredRelated.excerpt}</p>
                </div>
              </Link>
            </article>
            <div className="related-stack">
              {remainingRelated.length > 0 ? (
                remainingRelated.map((story) => (
                  <article key={story.slug} className="related-story-card">
                    {story.image ? (
                      <img
                        alt={story.image.alt}
                        className="related-story-card__image"
                        loading="lazy"
                        src={story.image.src}
                      />
                    ) : null}
                    <Eyebrow>{story.section}</Eyebrow>
                    <h3>
                      <Link href={getStoryHref(story)}>{story.headline}</Link>
                    </h3>
                    <p>{story.excerpt}</p>
                  </article>
                ))
              ) : (
                <FallbackState
                  title="Related reading list is updating"
                  body="This reading list can keep growing as more related work is published."
                  actionLabel="Back home"
                  actionHref="/"
                />
              )}
            </div>
          </div>
        ) : (
          <FallbackState
            title="No related reads were found"
            body="More related reading will appear here as the archive expands."
            actionLabel="Browse archive"
            actionHref="/archive"
          />
        )}
      </section>

      <JsonLd data={buildArticleSchema(currentArticle)} />
    </>
  );
}
