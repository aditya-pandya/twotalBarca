"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/lib/site-data";

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function getIsActive(href: string) {
    const routePath = href.replace(/#.*$/, "");
    const isHashOnly = href.startsWith("/#");

    if (isHashOnly) {
      return pathname === "/";
    }

    return routePath === "/" ? pathname === "/" : routePath.length > 1 && pathname.startsWith(routePath);
  }

  return (
    <header className="editorial-header">
      <div className="header-row">
        <div className="header-branding">
          <Link className="wordmark" href="/">
            twotalBarça
          </Link>
          <nav className="nav-links" aria-label="Primary">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} data-active={getIsActive(item.href) ? "true" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="header-actions">
          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
            className="header-search header-menu-toggle"
            onClick={() => setIsMenuOpen((current) => !current)}
            type="button"
          >
            Menu
          </button>
          <Link className="header-cta" href="/dispatch">
            Subscribe
          </Link>
        </div>
      </div>

      <div className="mobile-nav-shell" data-open={isMenuOpen ? "true" : undefined} id="mobile-navigation">
        <nav aria-label="Mobile primary" className="mobile-nav-links">
          {navItems.map((item) => (
            <Link
              data-active={getIsActive(item.href) ? "true" : undefined}
              href={item.href}
              key={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link className="mobile-nav-dispatch" href="/dispatch" onClick={() => setIsMenuOpen(false)}>
            Open the latest dispatch
          </Link>
        </nav>
      </div>
    </header>
  );
}
