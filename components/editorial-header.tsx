"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteMeta } from "@/lib/site-data";

export function EditorialHeader() {
  const pathname = usePathname();

  return (
    <header className="editorial-header">
      <div className="shell header-row">
        <Link className="wordmark" href="/">
          twotal<span>Barça</span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {siteMeta.nav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.replace(/#.*$/, ""));
            return (
              <Link key={item.label} href={item.href} data-active={active}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link className="header-cta" href="#dispatch">
          Weekly Dispatch
        </Link>
      </div>
    </header>
  );
}
