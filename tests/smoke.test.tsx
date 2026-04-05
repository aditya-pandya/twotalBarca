import { render, screen } from "@testing-library/react";
import AboutPage from "@/app/about/page";
import { metadata as siteMetadata } from "@/app/layout";
import ArticlePage from "@/app/article/[slug]/page";
import { generateMetadata as generateArticleMetadata } from "@/app/article/[slug]/page";
import HomePage from "@/app/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { aboutData, footerLinkGroups, navItems, siteMeta } from "@/lib/site-data";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("UI smoke tests", () => {
  it("renders the homepage lead story and key anchored sections", () => {
    const { container } = render(<HomePage />);

    expect(screen.getByRole("heading", { name: "The Last of the Catalan Romantics" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The Weekly Dispatch" })).toBeInTheDocument();
    expect(container.querySelector("#brief")).toBeInTheDocument();
    expect(container.querySelector("#match-notes")).toBeInTheDocument();
    expect(container.querySelector("#analysis")).toBeInTheDocument();
    expect(container.querySelector("#archive")).toBeInTheDocument();
    expect(container.querySelector("#dispatch")).toBeInTheDocument();
  });

  it("keeps homepage hash navigation targets mounted", () => {
    const { container } = render(<HomePage />);

    navItems
      .filter((item) => item.href.startsWith("/#"))
      .forEach((item) => {
        const anchor = item.href.replace("/#", "");
        expect(container.querySelector(`#${anchor}`)).toBeInTheDocument();
      });
  });

  it("renders the site header actions and primary navigation", () => {
    render(<SiteHeader />);

    const subscribeLink = screen.getByRole("link", { name: "Subscribe" });
    const searchButton = screen.getByRole("button", { name: "Search" });

    navItems.forEach((item) => {
      expect(screen.getByRole("link", { name: item.label })).toHaveAttribute("href", item.href);
    });
    expect(subscribeLink).toHaveAttribute("href", "/#dispatch");
    expect(searchButton).toBeInTheDocument();
  });

  it("renders the about page smoke content", () => {
    const { container } = render(<AboutPage />);

    expect(
      screen.getByRole("heading", {
        name: "twotalBarça is a publication about FC Barcelona in the present tense and the long tense.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mission" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What we cover" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Editorial principles" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contributors" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "In the club's long memory" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contact and dispatch" })).toBeInTheDocument();
    expect(screen.getByText("Join the weekly dispatch")).toBeInTheDocument();
    ["mission", "coverage", "principles", "contributors", "archive", "contact"].forEach((anchor) => {
      expect(container.querySelector(`#${anchor}`)).toBeInTheDocument();
    });
  });

  it("renders the seeded article page", async () => {
    render(await ArticlePage({ params: Promise.resolve({ slug: "the-weave-of-the-blau" }) }));

    expect(screen.getByRole("heading", { name: "The Weave of the Blau" })).toBeInTheDocument();
    expect(screen.getByText("Three moments in the shirt's public life")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back home" })).toHaveAttribute("href", "/");
  });

  it("renders a footer with real publication links", () => {
    render(<SiteFooter />);

    footerLinkGroups.forEach((group) => {
      expect(screen.getByRole("heading", { name: group.title })).toBeInTheDocument();
      group.links.forEach((link) => {
        expect(screen.getByRole("link", { name: link.label })).toHaveAttribute("href", link.href);
      });
    });

    siteMeta.footerMeta.socialLinks.forEach((link) => {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute("href", link.href);
    });
  });

  it("exports practical site-level metadata", () => {
    expect(siteMetadata.alternates?.canonical).toBe("/");
    expect(siteMetadata.applicationName).toBe("twotalBarça");
    expect(siteMetadata.openGraph).toMatchObject({
      type: "website",
      siteName: "twotalBarça",
    });
    expect(siteMetadata.twitter).toMatchObject({
      card: "summary_large_image",
    });
  });

  it("keeps about-page linked footer anchors resolvable", () => {
    const { container } = render(<AboutPage />);

    footerLinkGroups
      .flatMap((group) => group.links)
      .filter((link) => link.href.startsWith("/about#"))
      .forEach((link) => {
        const anchor = link.href.replace("/about#", "");
        expect(container.querySelector(`#${anchor}`)).toBeInTheDocument();
      });
    expect(screen.getByRole("link", { name: aboutData.contact.primaryCtaLabel })).toHaveAttribute(
      "href",
      aboutData.contact.primaryCtaHref,
    );
  });

  it("builds article metadata from the seeded article", async () => {
    const metadata = await generateArticleMetadata({
      params: Promise.resolve({ slug: "the-weave-of-the-blau" }),
    });

    expect(metadata.alternates?.canonical).toBe("/article/the-weave-of-the-blau");
    expect(metadata.description).toContain("shirt as material memory");
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      section: "Archive",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
    });
  });
});
