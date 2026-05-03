"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { navItems, siteMeta } from "@/lib/site-data";

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileNavId = useId();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.removeProperty("overflow");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  function getIsActive(href: string) {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="editorial-header">
      <div className="header-row">
        <div className="header-branding">
          <Link className="wordmark" href="/">
            {siteMeta.name}
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
            aria-controls={mobileNavId}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            className="header-search header-menu-toggle"
            onClick={() => setIsMenuOpen((current) => !current)}
            type="button"
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div
        aria-hidden={!isMenuOpen}
        className="mobile-nav-shell"
        data-open={isMenuOpen ? "true" : undefined}
        id={mobileNavId}
      >
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
        </nav>
      </div>
    </header>
  );
}
