import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionLandingPage } from "@/components/section-landing-page";
import {
  archiveCollections,
  buildMetadata,
  getArticlesBySection,
  getFeaturedArticleForRecord,
  getSectionBySlug,
  getSectionSlugs,
  topics,
} from "@/lib/site-data";

type SectionPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getSectionSlugs().map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const section = getSectionBySlug(slug);

  if (!section) {
    return {};
  }

  return buildMetadata({
    title: section.name,
    description: section.description,
    path: `/section/${section.slug}`,
    section: section.name,
  });
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { slug } = await params;
  const section = getSectionBySlug(slug);

  if (!section) {
    notFound();
  }

  const stories = getArticlesBySection(section.slug);
  const featuredStory = getFeaturedArticleForRecord(section);
  const relatedTopics = topics.filter((topic) => stories.some((story) => story.topicSlugs.includes(topic.slug)));
  const relatedCollections = archiveCollections.filter((collection) =>
    collection.itemSlugs.some((itemSlug) => stories.some((story) => story.slug === itemSlug)),
  );

  return (
    <SectionLandingPage
      collections={relatedCollections}
      featuredStory={featuredStory}
      section={section}
      stories={stories}
      topics={relatedTopics}
    />
  );
}
