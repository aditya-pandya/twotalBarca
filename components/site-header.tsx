"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/site-data";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="editorial-header">
      <div className="shell header-row">
        <Link className="wordmark" href="/">
          twotal<span>Barça</span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href.replace(/#.*$/, ""))
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="header-cta" href="/#dispatch">
          Weekly Dispatch
        </Link>
      </div>
    </header>
  );
}
