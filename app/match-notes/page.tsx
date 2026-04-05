import type { Metadata } from "next";
import SectionPage from "@/app/section/[slug]/page";
import { buildMetadata } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Match Notes",
  description: "Immediate football readings that still hold once first adrenaline clears.",
  path: "/match-notes",
  section: "Match Notes",
});

export default function MatchNotesPage() {
  return <SectionPage params={Promise.resolve({ slug: "match-notes" })} />;
}
