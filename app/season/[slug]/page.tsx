import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicScopeNotice } from "@/components/public-scope-notice";
import { buildMetadata, getSeasonBySlug, getSeasonSlugs } from "@/lib/site-data";

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
    description: `Season ${season.label} is not in today's totalBarca edition. Start with the homepage, The Brief, or the Weekly Dispatch.`,
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

  return <PublicScopeNotice surface={`Season ${season.label}`} />;
}
