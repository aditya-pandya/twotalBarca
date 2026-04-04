import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article-body";
import {
  Container,
  Deck,
  Eyebrow,
  FeaturedStoryCard,
  Figure,
  MetaRow,
  PageTitle,
  Rule,
  Section,
  SectionHeading,
  StoryCard,
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
      <Section>
        <Container narrow>
          <Eyebrow>
            {currentArticle.section} / {currentArticle.type}
          </Eyebrow>
          <PageTitle>{currentArticle.headline}</PageTitle>
          <Deck>{currentArticle.dek}</Deck>
          <MetaRow
            author={currentArticle.author}
            date={currentArticle.date}
            readingTime={currentArticle.readingTime}
            section={currentArticle.historicalEra}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <Figure
            title={currentArticle.headline}
            caption={currentArticle.heroCaption}
            credit={currentArticle.heroCredit}
          >
            <div className="hero-art">
              <span className="hero-art-stripe navy" />
              <span className="hero-art-stripe garnet" />
              <span className="hero-art-disc" />
            </div>
          </Figure>
        </Container>
      </Section>

      <Section>
        <Container narrow>
          <ArticleBody paragraphs={currentArticle.body} pullQuote={currentArticle.pullQuote} />
        </Container>
      </Section>

      <Section tone="tinted">
        <Container>
          <div className="timeline-header">
            <div>
              <Eyebrow>Archive notes</Eyebrow>
              <PageTitle>Three moments in the shirt&apos;s public life</PageTitle>
            </div>
            <p className="story-excerpt">
              A simple factual module keeps the historical essay grounded in objects, eras, and observable change.
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
          <Rule />
          <div className="topic-row">
            {currentArticle.topics.map((topic) => (
              <span key={topic} className="topic-chip">
                {topic}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading title="Related stories" linkLabel="Back home" linkHref="/" />
          <div className="related-grid">
            {featuredRelated ? (
              <FeaturedStoryCard story={featuredRelated} href={getStoryHref(featuredRelated)} />
            ) : null}
            {remainingRelated.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
