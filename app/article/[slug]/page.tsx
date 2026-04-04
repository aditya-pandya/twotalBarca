import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article-body";
import {
  Container,
  Deck,
  Eyebrow,
  Figure,
  MetaRow,
  PageTitle,
  Rule,
  Section,
} from "@/components/primitives";
import { StoryCard } from "@/components/story-card";
import { article } from "@/lib/site-data";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return [{ slug: article.slug }];
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug !== article.slug) {
    return {};
  }

  return {
    title: article.headline,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  if (slug !== article.slug) {
    notFound();
  }

  return (
    <>
      <Section>
        <Container narrow>
          <Eyebrow>
            {article.section} / {article.type}
          </Eyebrow>
          <PageTitle>{article.headline}</PageTitle>
          <Deck>{article.dek}</Deck>
          <MetaRow
            author={article.author}
            date={article.date}
            readingTime={article.readingTime}
            section={article.historicalEra}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <Figure
            title={article.headline}
            caption={article.heroCaption}
            credit={article.heroCredit}
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
          <ArticleBody paragraphs={article.body} pullQuote={article.pullQuote} />
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
            {article.timeline.map((item) => (
              <article key={item.year} className="timeline-card">
                <p className="timeline-year">{item.year}</p>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
          <Rule />
          <div className="topic-row">
            {article.topics.map((topic) => (
              <span key={topic} className="topic-chip">
                {topic}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="section-heading-row">
            <div>
              <Eyebrow>Continue reading</Eyebrow>
              <PageTitle>Related stories</PageTitle>
            </div>
          </div>
          <div className="related-grid">
            {article.related.map((story) => (
              <StoryCard key={story.slug} story={story} href="/article/the-weave-of-the-blau" />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
