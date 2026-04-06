import Link from "next/link";
import { siteMeta } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Link className="wordmark footer-wordmark" href="/">
            twotalBarça
          </Link>
          <p className="footer-description">{siteMeta.tagline}</p>
          <div className="footer-socials" aria-label="Social links">
            {siteMeta.footerMeta.socialLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {siteMeta.footer.map((column) => (
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

        <div className="footer-legal">
          <p className="footer-legal__line">Publication routes stay explicit: Brief, Match Notes, Analysis, Dispatch, Archive.</p>
          <p>{siteMeta.footerMeta.legalNotice}</p>
        </div>
      </div>
    </footer>
  );
}
