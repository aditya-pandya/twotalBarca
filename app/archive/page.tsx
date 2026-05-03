import type { Metadata } from "next";
import { PublicScopeNotice } from "@/components/public-scope-notice";
import { buildMetadata } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Archive",
  description: "Archive is not in today's totalBarca edition. Start with the homepage, The Brief, or the Weekly Dispatch.",
  path: "/archive",
});

export default function ArchivePage() {
  return <PublicScopeNotice surface="Archive" />;
}
