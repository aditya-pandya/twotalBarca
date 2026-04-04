import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="eyebrow">twotalBarca</p>
          <p className="footer-note">
            An article-first Barca publication about football, memory, and the pressure of the present.
          </p>
        </div>
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/article/the-weave-of-the-blau">Article</Link>
          <Link href="/about">About</Link>
        </div>
      </div>
    </footer>
  );
}
