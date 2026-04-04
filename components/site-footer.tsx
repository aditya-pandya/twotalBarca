import Link from "next/link";

const footerColumns = [
  {
    title: "The Club",
    links: [
      { href: "/about", label: "Editorial Policy" },
      { href: "/#dispatch", label: "Membership" },
      { href: "/about", label: "Board of Review" },
    ],
  },
  {
    title: "Journalism",
    links: [
      { href: "/#cultural-heart", label: "Match Analysis" },
      { href: "/#archive", label: "The Vault" },
      { href: "/#journalism", label: "Dispatch" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/about", label: "Privacy" },
      { href: "/about", label: "Terms of Service" },
      { href: "/about", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Link className="wordmark footer-wordmark" href="/">
            twotalBarça
          </Link>
          <p className="footer-description">
            The Cultural Monolith of FC Barcelona. An editorial pursuit of the soul
            behind the score.
          </p>
          <div className="footer-socials" aria-label="Social links">
            <Link href="/about">Journal</Link>
            <Link href="/#dispatch">Dispatch</Link>
            <Link href="/#archive">Archive</Link>
          </div>
        </div>

        {footerColumns.map((column) => (
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
          <p>© 2024 twotalBarça. The Cultural Monolith of FC Barcelona.</p>
        </div>
      </div>
    </footer>
  );
}
