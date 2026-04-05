import type { Metadata } from "next";
import SectionPage from "@/app/section/[slug]/page";
import { buildMetadata } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Culture",
  description: "Barça as place, ritual, public language, and Catalan civic argument.",
  path: "/culture",
  section: "Culture",
});

export default function CulturePage() {
  return <SectionPage params={Promise.resolve({ slug: "culture" })} />;
}
