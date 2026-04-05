import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrowseDetailPage } from "@/components/browse-detail-page";
import { buildMetadata, getArticlesBySeason, getSeasonBySlug, getSeasonSlugs, people } from "@/lib/site-data";

type SeasonPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getSeasonSlugs().map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: SeasonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const season = getSeasonBySlug(slug);

  if (!season) {
    return {};
  }

  return buildMetadata({
    title: `Season ${season.label}`,
    description: season.summary,
    path: `/season/${season.slug}`,
    tags: season.competitions,
  });
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { slug } = await params;
  const season = getSeasonBySlug(slug);

  if (!season) {
    notFound();
  }

  const stories = getArticlesBySeason(season.slug);
  const featuredStory = stories.find((story) => story.slug === season.keyStorySlugs[0]) ?? stories[0];
  const relatedPeople = people.filter((person) => person.relatedSeasons.includes(season.slug));

  return (
    <BrowseDetailPage
      asideItems={[
        {
          eyebrow: "Competitions",
          title: "Competition map",
          body: season.competitions.join(", "),
        },
        {
          eyebrow: "Managers",
          title: "Manager line",
          body: season.managers.join(", "),
        },
        ...relatedPeople.map((person) => ({
          eyebrow: person.personType,
          title: person.name,
          body: person.shortBio,
          href: `/person/${person.slug}`,
          label: "Open person page",
        })),
      ]}
      asideTitle="Season ledger"
      deck={season.summary}
      eyebrow="Season"
      featuredStory={featuredStory}
      intro="Season pages are for pressure, pattern, and historical weight, not fixture-dump bookkeeping."
      stats={[
        { label: "Stories", value: String(stories.length) },
        { label: "Competitions", value: String(season.competitions.length) },
        { label: "People", value: String(relatedPeople.length) },
      ]}
      stories={stories}
      title={season.label}
    />
  );
}
