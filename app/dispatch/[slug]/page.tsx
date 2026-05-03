import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WeeklyDispatchReader } from "@/components/weekly-dispatch-reader";
import {
  buildMetadata,
  dispatchIssues,
  getDispatchBySlug,
  getDispatchSlugs,
  getDispatchStories,
  matchContext,
} from "@/lib/site-data";

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

  return (
    <WeeklyDispatchReader
      archive={dispatchIssues}
      issue={issue}
      recentMatch={matchContext.recent[0]}
      stories={getDispatchStories(issue)}
      surface="issue"
      upcomingMatch={matchContext.upcoming[0]}
    />
  );
}
