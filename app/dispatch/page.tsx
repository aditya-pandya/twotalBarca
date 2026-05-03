import type { Metadata } from "next";
import { FallbackState } from "@/components/primitives";
import { WeeklyDispatchReader } from "@/components/weekly-dispatch-reader";
import {
  buildMetadata,
  dispatchIssues,
  getDispatchStories,
  getLatestDispatchIssue,
  matchContext,
} from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Dispatch",
  description: "The weekly totalBarça issue: five opinionated topics, one last-match capsule, and one next-match capsule.",
  path: "/dispatch",
});

export default function DispatchPage() {
  const latestIssue = getLatestDispatchIssue();

  if (!latestIssue) {
    return (
      <section className="section-block shell">
        <FallbackState
          actionHref="/"
          actionLabel="Back home"
          body="The dispatch returns when the next five-topic issue is ready."
          title="No dispatch issue is published yet"
        />
      </section>
    );
  }

  return (
    <WeeklyDispatchReader
      archive={dispatchIssues}
      issue={latestIssue}
      recentMatch={matchContext.recent[0]}
      stories={getDispatchStories(latestIssue)}
      surface="dispatch"
      upcomingMatch={matchContext.upcoming[0]}
    />
  );
}
