import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrowseDetailPage } from "@/components/browse-detail-page";
import { buildMetadata, getArticlesByPerson, getPersonBySlug, getPersonSlugs, getSeasonBySlug } from "@/lib/site-data";

type PersonPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPersonSlugs().map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const person = getPersonBySlug(slug);

  if (!person) {
    return {};
  }

  return buildMetadata({
    title: person.name,
    description: person.fullBio,
    path: `/person/${person.slug}`,
    type: "profile",
  });
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { slug } = await params;
  const person = getPersonBySlug(slug);

  if (!person) {
    notFound();
  }

  const stories = getArticlesByPerson(person.slug);
  const relatedSeasons = person.relatedSeasons
    .map((seasonSlug) => getSeasonBySlug(seasonSlug))
    .filter((season): season is NonNullable<ReturnType<typeof getSeasonBySlug>> => Boolean(season));

  return (
    <BrowseDetailPage
      asideItems={[
        {
          eyebrow: "Profile",
          title: person.role,
          body: person.fullBio,
        },
        ...relatedSeasons.map((season) => ({
          eyebrow: "Season",
          title: season.label,
          body: season.summary,
          href: `/season/${season.slug}`,
          label: "Open season page",
        })),
        ...person.notableQuotes.map((quote) => ({
          eyebrow: "Notable line",
          title: person.name,
          body: quote,
        })),
      ]}
      asideTitle="Profile notes"
      deck={person.shortBio}
      eyebrow={person.role}
      featuredStory={stories[0]}
      intro={person.bio ?? person.fullBio}
      stats={[
        { label: "Stories", value: String(stories.length) },
        { label: "Seasons", value: String(relatedSeasons.length) },
        { label: "Role", value: person.personType },
      ]}
      stories={stories}
      title={person.name}
    />
  );
}
