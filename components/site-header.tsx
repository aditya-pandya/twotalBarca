"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const headerItems = [
  { href: "/#match-review", label: "Match Review" },
  { href: "/#cultural-heart", label: "Cultural Heart" },
  { href: "/#journalism", label: "Journalism" },
  { href: "/about", label: "Tickets" },
  { href: "/#archive", label: "Archive" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="editorial-header">
      <div className="header-row">
        <div className="header-branding">
          <Link className="wordmark" href="/">
            twotalBarça
          </Link>
          <nav className="nav-links" aria-label="Primary">
            {headerItems.map((item) => {
              const routePath = item.href.replace(/#.*$/, "");
              const isHashOnly = item.href.startsWith("/#");
              const isActive = isHashOnly
                ? false
                : routePath === "/"
                ? pathname === "/"
                : routePath.length > 1 && pathname.startsWith(routePath);

              return (
                <Link key={item.href} href={item.href} data-active={isActive ? "true" : undefined}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="header-actions">
          <button aria-label="Search" className="header-search" type="button">
            Search
          </button>
          <Link className="header-cta" href="/#dispatch">
            Subscribe
          </Link>
        </div>
      </div>
    </header>
  );
}
