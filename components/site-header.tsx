import Link from "next/link";
import { navItems } from "@/lib/site-data";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="wordmark" aria-label="twotalBarca home">
          <span>twotal</span>
          <span>Barca</span>
        </Link>
        <nav className="primary-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/about" className="dispatch-cta">
          Weekly Dispatch
        </Link>
      </div>
    </header>
  );
}
