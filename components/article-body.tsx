import { EditorialLink, PullQuote } from "@/components/primitives";

export function ArticleBody({
  paragraphs,
  pullQuote,
  quoteBy,
  heroCaption,
  heroCredit,
  conviction,
  fieldNote,
}: {
  paragraphs: string[];
  pullQuote: string;
  quoteBy: string;
  heroCaption: string;
  heroCredit: string;
  conviction: string;
  fieldNote: string;
}) {
  return (
    <div className="article-layout">
      <aside className="article-rail">
        <div className="article-rail-block">
          <p className="eyebrow">Field notes</p>
          <p>{fieldNote}</p>
        </div>
        <div className="article-rail-block">
          <p className="eyebrow">At stake</p>
          <p>{conviction}</p>
        </div>
        <EditorialLink href="/about" subtle>
          Our editorial standards
        </EditorialLink>
      </aside>
      <div className="article-prose editorial-prose">
        {paragraphs.slice(0, 2).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <figure className="article-insert">
          <div className="article-insert-art" aria-hidden="true">
            <div className="article-insert-weave" />
          </div>
          <figcaption>
            <span>{heroCaption}</span>
            <span>{heroCredit}</span>
          </figcaption>
        </figure>
        <PullQuote cite={quoteBy}>{pullQuote}</PullQuote>
        {paragraphs.slice(2).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
