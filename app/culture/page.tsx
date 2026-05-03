import type { Metadata } from "next";
import { PublicScopeNotice } from "@/components/public-scope-notice";
import { buildMetadata } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Culture",
  description: "Culture is not in today's totalBarca edition. Start with the homepage, The Brief, or the Weekly Dispatch.",
  path: "/culture",
  section: "Culture",
});

export default function CulturePage() {
  return <PublicScopeNotice surface="Culture" />;
}
