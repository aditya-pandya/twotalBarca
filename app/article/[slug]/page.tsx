import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article-body";
import {
  Eyebrow,
  MetaRow,
} from "@/components/primitives";
import { getArticleBySlug, getArticleSlugs, getStoryHref } from "@/lib/site-data";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const currentArticle = getArticleBySlug(slug);

  if (!currentArticle) {
    return {};
  }

  return {
    title: currentArticle.headline,
    description: currentArticle.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const currentArticle = getArticleBySlug(slug);

  if (!currentArticle) {
    notFound();
  }

  const [featuredRelated, ...remainingRelated] = currentArticle.related;

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
            <MetaRow
              author={currentArticle.author}
              date={currentArticle.date}
              readingTime={currentArticle.readingTime}
              section={currentArticle.historicalEra}
            />
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
              <span>Author</span>
              <p>{currentArticle.author}</p>
            </div>
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
              <p>{currentArticle.historicalEra}</p>
            </div>
          </aside>

          <div className="article-main-column">
            <div className="article-intro">
              <p className="article-standfirst">{currentArticle.excerpt}</p>
            </div>
            <ArticleBody
              paragraphs={currentArticle.body}
              pullQuote={currentArticle.pullQuote}
              quoteBy={currentArticle.quoteBy}
              heroCaption={currentArticle.heroCaption}
              heroCredit={currentArticle.heroCredit}
              conviction={currentArticle.conviction}
            />
          </div>
        </div>
      </section>

      <section className="article-notes-shell">
        <div className="article-notes">
          <div className="article-notes-head">
            <div>
              <Eyebrow>Archive notes</Eyebrow>
              <h2>Three moments in the shirt&apos;s public life</h2>
            </div>
            <p>
              A factual layer grounds the essay in observable changes to silhouette, circulation, and public meaning.
            </p>
          </div>
          <div className="timeline-grid">
            {currentArticle.timeline.map((item) => (
              <article key={item.year} className="timeline-card">
                <p className="timeline-year">{item.year}</p>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
          <div className="topic-row">
            {currentArticle.topics.map((topic) => (
              <span key={topic} className="topic-chip">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="related-editorial-shell">
        <div className="related-editorial-head">
          <div>
            <Eyebrow>Related narratives</Eyebrow>
            <h2>Continue through the archive</h2>
          </div>
          <Link className="section-link" href="/">
            Back home
          </Link>
        </div>
        <div className="related-editorial-grid">
          {featuredRelated ? (
            <article className="related-feature">
              <Link href={getStoryHref(featuredRelated)} className="related-feature-visual">
                <div className="related-feature-copy">
                  <Eyebrow>{featuredRelated.section}</Eyebrow>
                  <h3>{featuredRelated.headline}</h3>
                  <p>{featuredRelated.excerpt}</p>
                </div>
              </Link>
            </article>
          ) : null}
          <div className="related-stack">
            {remainingRelated.map((story) => (
              <article key={story.slug} className="related-story-card">
                <Eyebrow>{story.section}</Eyebrow>
                <h3>
                  <Link href={getStoryHref(story)}>{story.headline}</Link>
                </h3>
                <p>{story.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
