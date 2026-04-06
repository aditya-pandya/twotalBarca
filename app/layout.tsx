import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteMeta } from "@/lib/site-data";
import { buildSiteSchemas } from "@/lib/schema";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteMeta.name,
    template: `%s | ${siteMeta.name}`,
  },
  metadataBase: new URL(siteMeta.url),
  applicationName: siteMeta.name,
  description: siteMeta.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteMeta.name,
    description: siteMeta.description,
    type: "website",
    url: siteMeta.url,
    siteName: siteMeta.name,
    locale: siteMeta.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.name,
    description: siteMeta.description,
  },
  category: "sports",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <JsonLd data={buildSiteSchemas()} />
        <div className="site-frame">
          <SiteHeader />
          <main className="site-main" id="main-content">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
