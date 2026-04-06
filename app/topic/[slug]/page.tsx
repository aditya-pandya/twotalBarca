import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrowseDetailPage } from "@/components/browse-detail-page";
import {
  buildMetadata,
  getArticlesByTopic,
  getSectionHref,
  getTopicBySlug,
  getTopicSlugs,
  people,
  sections,
} from "@/lib/site-data";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getTopicSlugs().map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    return {};
  }

  return buildMetadata({
    title: topic.name,
    description: topic.description,
    path: `/topic/${topic.slug}`,
    tags: [topic.name],
  });
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const stories = getArticlesByTopic(topic.slug);
  const featuredStory = stories.find((story) => story.slug === topic.featuredArticleSlug) ?? stories[0];
  const relatedPeople = people.filter((person) => stories.some((story) => story.personSlugs.includes(person.slug)));
  const relatedSections = sections.filter((section) => stories.some((story) => story.sectionSlug === section.slug));

  return (
    <BrowseDetailPage
      asideItems={[
        ...relatedSections.map((section) => ({
          eyebrow: "Section",
          title: section.name,
          body: section.description,
          href: getSectionHref(section.slug),
          label: "Browse section",
        })),
        ...relatedPeople.map((person) => ({
          eyebrow: person.personType,
          title: person.name,
          body: person.shortBio,
          href: `/person/${person.slug}`,
          label: "Open person page",
        })),
      ]}
      asideTitle="Connected pages"
      deck={topic.description}
      eyebrow="Topic"
      featuredStory={featuredStory}
      intro="Topic pages keep recurring arguments attached to the wider publication instead of flattening them into dead-end tags."
      stats={[
        { label: "Stories", value: String(stories.length) },
        { label: "People", value: String(relatedPeople.length) },
        { label: "Sections", value: String(relatedSections.length) },
      ]}
      stories={stories}
      title={topic.name}
    />
  );
}
