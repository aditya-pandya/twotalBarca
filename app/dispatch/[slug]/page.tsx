import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DispatchIssuePage } from "@/components/browse-detail-page";
import { buildMetadata, getDispatchBySlug, getDispatchLeadStory, getDispatchSlugs, getDispatchStories } from "@/lib/site-data";

type DispatchIssuePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getDispatchSlugs().map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: DispatchIssuePageProps): Promise<Metadata> {
  const { slug } = await params;
  const issue = getDispatchBySlug(slug);

  if (!issue) {
    return {};
  }

  return buildMetadata({
    title: issue.issueTitle,
    description: issue.editorsNote,
    path: `/dispatch/${issue.slug}`,
  });
}

export default async function DispatchIssuePageRoute({ params }: DispatchIssuePageProps) {
  const { slug } = await params;
  const issue = getDispatchBySlug(slug);

  if (!issue) {
    notFound();
  }

  return <DispatchIssuePage issue={issue} leadStory={getDispatchLeadStory(issue)} stories={getDispatchStories(issue)} />;
}
