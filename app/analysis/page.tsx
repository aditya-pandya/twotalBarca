import type { Metadata } from "next";
import { PublicScopeNotice } from "@/components/public-scope-notice";
import { buildMetadata } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Analysis",
  description: "Analysis is not in today's totalBarca edition. Start with the homepage, The Brief, or the Weekly Dispatch.",
  path: "/analysis",
  section: "Analysis",
});

export default function AnalysisPage() {
  return <PublicScopeNotice surface="Analysis" />;
}
