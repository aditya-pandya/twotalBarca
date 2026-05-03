import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Newsreader, Roboto_Slab, Space_Grotesk } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteMeta } from "@/lib/site-data";
import { buildSiteSchemas } from "@/lib/schema";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  weight: ["100", "200", "300", "400"],
  display: "swap",
});

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
    <html className={`${newsreader.variable} ${spaceGrotesk.variable} ${archivo.variable} ${jetBrainsMono.variable} ${robotoSlab.variable}`} lang="en">
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
