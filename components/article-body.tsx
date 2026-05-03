import { EditorialLink, PullQuote } from "@/components/primitives";

export function ArticleBody({
  paragraphs,
  pullQuote,
  conviction,
  fieldNote,
  convictionLabel,
  fieldNoteLabel,
}: {
  paragraphs: string[];
  pullQuote: string;
  conviction: string;
  fieldNote: string;
  convictionLabel: string;
  fieldNoteLabel: string;
}) {
  return (
    <div className="article-layout">
      <aside className="article-rail">
        <div className="article-rail-block">
          <p className="eyebrow">{fieldNoteLabel}</p>
          <p>{fieldNote}</p>
        </div>
        <div className="article-rail-block">
          <p className="eyebrow">{convictionLabel}</p>
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
        <PullQuote>{pullQuote}</PullQuote>
        {paragraphs.slice(2).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
