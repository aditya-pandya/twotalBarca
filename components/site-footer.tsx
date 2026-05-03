import Link from "next/link";
import { footerLinkGroups, siteMeta } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-grid footer-grid--compact">
        <div>
          <Link aria-label={`${siteMeta.name} footer home`} className="wordmark footer-wordmark" href="/">
            {siteMeta.name}
          </Link>
          <p className="footer-description">{siteMeta.tagline}</p>
          <p className="footer-legal-note">{siteMeta.footerMeta.legalNotice}</p>
        </div>

        {footerLinkGroups.map((column) => (
          <div key={column.title}>
            <h4>{column.title}</h4>
            <div className="footer-links">
              {column.links.map((link) => (
                <Link href={link.href} key={link.label}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
