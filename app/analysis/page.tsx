import type { Metadata } from "next";
import SectionPage from "@/app/section/[slug]/page";
import { buildMetadata } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Analysis",
  description: "Structure, spacing, and tactical logic from the publication's analysis desk.",
  path: "/analysis",
  section: "Analysis",
});

export default function AnalysisPage() {
  return <SectionPage params={Promise.resolve({ slug: "analysis" })} />;
}
