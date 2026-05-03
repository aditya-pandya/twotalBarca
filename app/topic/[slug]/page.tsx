import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicScopeNotice } from "@/components/public-scope-notice";
import { buildMetadata, getTopicBySlug, getTopicSlugs } from "@/lib/site-data";

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
    description: `${topic.name} is not in today's totalBarca edition. Start with the homepage, The Brief, or the Weekly Dispatch.`,
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

  return <PublicScopeNotice surface={topic.name} />;
}
