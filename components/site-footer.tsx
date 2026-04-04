import Link from "next/link";
import { siteMeta } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div>
          <div className="wordmark">twotal<span>Barça</span></div>
          <p>{siteMeta.description}</p>
        </div>
        <div>
          <h4>Sections</h4>
          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/#brief">The Brief</Link>
            <Link href="/#analysis">Analysis</Link>
            <Link href="/#archive">Archive</Link>
          </div>
        </div>
        <div>
          <h4>Publication</h4>
          <div className="footer-links">
            <Link href="/about">About</Link>
            <Link href="/#dispatch">Weekly Dispatch</Link>
            <span>Més que un club.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
