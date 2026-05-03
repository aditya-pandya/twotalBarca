import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicScopeNotice } from "@/components/public-scope-notice";
import { buildMetadata, getSectionBySlug, getSectionHref, getSectionSlugs } from "@/lib/site-data";

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
    description: `${section.name} is not in today's totalBarca edition. Start with the homepage, The Brief, or the Weekly Dispatch.`,
    path: getSectionHref(section.slug),
    section: section.name,
  });
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { slug } = await params;
  const section = getSectionBySlug(slug);

  if (!section) {
    notFound();
  }

  return <PublicScopeNotice surface={section.name} />;
}
