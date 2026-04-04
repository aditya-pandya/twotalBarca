import { EditorialLink, PullQuote } from "@/components/primitives";

export function ArticleBody({
  paragraphs,
  pullQuote,
}: {
  paragraphs: string[];
  pullQuote: string;
}) {
  return (
    <div className="article-grid">
      <aside className="article-side-note">
        <p className="eyebrow">Context</p>
        <p>
          A historical piece in The Vault, built to test longform rhythm, captions, pull quotes, and
          structured editorial metadata.
        </p>
        <EditorialLink href="/about" subtle>
          Our editorial standards
        </EditorialLink>
      </aside>
      <div className="article-prose">
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
