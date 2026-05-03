import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicScopeNotice } from "@/components/public-scope-notice";
import { buildMetadata, getPersonBySlug, getPersonSlugs } from "@/lib/site-data";

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
    description: `${person.name} is not in today's totalBarca edition. Start with the homepage, The Brief, or the Weekly Dispatch.`,
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

  return <PublicScopeNotice surface={person.name} />;
}
