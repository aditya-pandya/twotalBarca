import type { Metadata } from "next";
import { PublicScopeNotice } from "@/components/public-scope-notice";
import { buildMetadata } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Match Notes",
  description: "Match Notes is not in today's totalBarca edition. Start with the homepage, The Brief, or the Weekly Dispatch.",
  path: "/match-notes",
  section: "Match Notes",
});

export default function MatchNotesPage() {
  return <PublicScopeNotice surface="Match Notes" />;
}
