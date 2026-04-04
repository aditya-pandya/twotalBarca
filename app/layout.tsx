import type { Metadata } from "next";
import { EditorialFooter } from "@/components/editorial-footer";
import { EditorialHeader } from "@/components/editorial-header";
import { siteMeta } from "@/lib/site-data";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteMeta.name,
    template: `%s | ${siteMeta.name}`,
  },
  description: siteMeta.description,
  metadataBase: new URL("https://twotalbarca.vercel.app"),
  openGraph: {
    title: siteMeta.name,
    description: siteMeta.description,
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="site-frame">
          <EditorialHeader />
          <main>{children}</main>
          <EditorialFooter />
        </div>
      </body>
    </html>
  );
}
