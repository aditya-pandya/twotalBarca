import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { FallbackState } from "@/components/primitives";
import { WeeklyDispatchReader } from "@/components/weekly-dispatch-reader";
import {
  buildMetadata,
  dispatchIssues,
  getDispatchStories,
  getLatestDispatchIssue,
  matchContext,
  siteMeta,
} from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Home",
  description: "totalBarça is one weekly Barça dispatch: five opinionated topics plus minimal last-match and next-match context.",
  path: "/",
});

export default function HomePage() {
  const latestIssue = getLatestDispatchIssue();

  return (
    <>
      {latestIssue ? (
        <WeeklyDispatchReader
          archive={dispatchIssues}
          issue={latestIssue}
          recentMatch={matchContext.recent[0]}
          stories={getDispatchStories(latestIssue)}
          surface="home"
          upcomingMatch={matchContext.upcoming[0]}
        />
      ) : (
        <section className="section-block shell">
          <FallbackState
            actionHref="/about"
            actionLabel="About totalBarça"
            body="The weekly issue appears here when five takes and the match capsules clear the desk."
            title="Weekly Dispatch is updating"
          />
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${siteMeta.url}/#homepage`,
          url: siteMeta.url,
          name: siteMeta.name,
          description: siteMeta.description,
          isPartOf: { "@id": `${siteMeta.url}/#website` },
          about: { "@type": "SportsOrganization", name: "FC Barcelona" },
          hasPart: latestIssue
            ? [
                {
                  "@type": "CreativeWork",
                  headline: latestIssue.issueTitle,
                  url: `${siteMeta.url}/dispatch/${latestIssue.slug}`,
                },
              ]
            : [],
        }}
      />
    </>
  );
}
