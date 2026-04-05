import { render, screen } from "@testing-library/react";
import AboutPage, { metadata as aboutMetadata } from "@/app/about/page";
import AnalysisPage, { metadata as analysisMetadata } from "@/app/analysis/page";
import ArchivePage, { metadata as archiveMetadata } from "@/app/archive/page";
import ArticlePage, { generateMetadata as generateArticleMetadata } from "@/app/article/[slug]/page";
import CulturePage, { metadata as cultureMetadata } from "@/app/culture/page";
import DispatchIssuePage, {
  generateMetadata as generateDispatchIssueMetadata,
  generateStaticParams as generateDispatchIssueStaticParams,
} from "@/app/dispatch/[slug]/page";
import DispatchPage, { metadata as dispatchMetadata } from "@/app/dispatch/page";
import { metadata as siteMetadata } from "@/app/layout";
import MatchNotesPage, { metadata as matchNotesMetadata } from "@/app/match-notes/page";
import HomePage from "@/app/page";
import PersonPage, { generateMetadata as generatePersonMetadata } from "@/app/person/[slug]/page";
import SeasonPage, { generateMetadata as generateSeasonMetadata } from "@/app/season/[slug]/page";
import SectionPage, {
  generateMetadata as generateSectionMetadata,
  generateStaticParams as generateSectionStaticParams,
} from "@/app/section/[slug]/page";
import TopicPage, {
  generateMetadata as generateTopicMetadata,
  generateStaticParams as generateTopicStaticParams,
} from "@/app/topic/[slug]/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { aboutData, footerLinkGroups, navItems } from "@/lib/site-data";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  notFound: () => {
    throw new Error("notFound");
  },
}));

describe("UI smoke tests", () => {
  it("renders the homepage lead story and browse links", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "The Last of the Catalan Romantics" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The Weekly Dispatch" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read Analysis" })).toHaveAttribute("href", "/analysis");
    expect(screen.getByRole("link", { name: "Enter Archive" })).toHaveAttribute("href", "/archive");
    expect(screen.getAllByRole("link", { name: "Browse dispatch archive" })[0]).toHaveAttribute("href", "/dispatch");
  });

  it("renders the site header and footer with live navigation", () => {
    render(
      <>
        <SiteHeader />
        <SiteFooter />
      </>,
    );

    navItems.forEach((item) => {
      expect(
        screen
          .getAllByRole("link", { name: item.label })
          .some((link) => link.getAttribute("href") === item.href),
      ).toBe(true);
    });

    footerLinkGroups.forEach((group) => {
      expect(screen.getByRole("heading", { name: group.title })).toBeInTheDocument();
    });
  });

  it("renders the about page anchors, contributors, and contact surfaces", () => {
    const { container } = render(<AboutPage />);

    expect(
      screen.getByRole("heading", {
        name: "twotalBarça is a publication about FC Barcelona in the present tense and the long tense.",
      }),
    ).toBeInTheDocument();
    ["mission", "standards", "coverage", "principles", "archive", "contributors", "browse", "contact"].forEach(
      (anchor) => {
        expect(container.querySelector(`#${anchor}`)).toBeInTheDocument();
      },
    );
    expect(screen.getByRole("link", { name: aboutData.contact.primaryCtaLabel })).toHaveAttribute("href", "/dispatch");
  });

  it("renders the article route and each new browse surface", async () => {
    const articlePage = await ArticlePage({ params: Promise.resolve({ slug: "the-weave-of-the-blau" }) });
    const dispatchIssuePage = await DispatchIssuePage({ params: Promise.resolve({ slug: "week-in-blaugrana-12" }) });
    const analysisSectionPage = await SectionPage({ params: Promise.resolve({ slug: "analysis" }) });
    const cultureSectionPage = await SectionPage({ params: Promise.resolve({ slug: "culture" }) });
    const matchNotesSectionPage = await SectionPage({ params: Promise.resolve({ slug: "match-notes" }) });
    const topicPage = await TopicPage({ params: Promise.resolve({ slug: "identity" }) });
    const seasonPage = await SeasonPage({ params: Promise.resolve({ slug: "2025-26" }) });
    const personPage = await PersonPage({ params: Promise.resolve({ slug: "maury-vidal" }) });

    render(
      <>
        {articlePage}
        <ArchivePage />
        <DispatchPage />
        {dispatchIssuePage}
        {analysisSectionPage}
        {cultureSectionPage}
        {matchNotesSectionPage}
        {topicPage}
        {seasonPage}
        {personPage}
      </>,
    );

    expect(screen.getAllByRole("heading", { name: "The Weave of the Blau" }).length).toBeGreaterThan(0);
    expect(screen.getByText("Three moments in the shirt's public life")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The archive keeps the present honest." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Weekly Dispatch" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "The Week in Blaugrana, No. 12" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Analysis" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "Identity" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("heading", { name: "2025-26" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("heading", { name: "Maury Vidal" }).length).toBeGreaterThan(0);
  });

  it("exports practical metadata for site-level and route-level surfaces", async () => {
    const articleMetadata = await generateArticleMetadata({
      params: Promise.resolve({ slug: "the-weave-of-the-blau" }),
    });
    const dispatchIssueMetadata = await generateDispatchIssueMetadata({
      params: Promise.resolve({ slug: "week-in-blaugrana-12" }),
    });
    const sectionMetadata = await generateSectionMetadata({
      params: Promise.resolve({ slug: "analysis" }),
    });
    const topicMetadata = await generateTopicMetadata({
      params: Promise.resolve({ slug: "identity" }),
    });
    const seasonMetadata = await generateSeasonMetadata({
      params: Promise.resolve({ slug: "2025-26" }),
    });
    const personMetadata = await generatePersonMetadata({
      params: Promise.resolve({ slug: "maury-vidal" }),
    });

    expect(siteMetadata.alternates?.canonical).toBe("/");
    expect(aboutMetadata.alternates?.canonical).toBe("/about");
    expect(analysisMetadata.alternates?.canonical).toBe("/analysis");
    expect(archiveMetadata.alternates?.canonical).toBe("/archive");
    expect(cultureMetadata.alternates?.canonical).toBe("/culture");
    expect(dispatchMetadata.alternates?.canonical).toBe("/dispatch");
    expect(matchNotesMetadata.alternates?.canonical).toBe("/match-notes");
    expect(articleMetadata.alternates?.canonical).toBe("/article/the-weave-of-the-blau");
    expect(dispatchIssueMetadata.alternates?.canonical).toBe("/dispatch/week-in-blaugrana-12");
    expect(sectionMetadata.alternates?.canonical).toBe("/section/analysis");
    expect(topicMetadata.alternates?.canonical).toBe("/topic/identity");
    expect(seasonMetadata.alternates?.canonical).toBe("/season/2025-26");
    expect(personMetadata.alternates?.canonical).toBe("/person/maury-vidal");
    expect(articleMetadata.openGraph).toMatchObject({
      type: "article",
      section: "Archive",
    });
  });

  it("generates static params for the new browse surfaces", () => {
    expect(generateSectionStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "match-notes" },
        { slug: "analysis" },
        { slug: "culture" },
        { slug: "archive" },
        { slug: "dispatch" },
      ]),
    );
    expect(generateTopicStaticParams()).toEqual(expect.arrayContaining([{ slug: "identity" }]));
    expect(generateDispatchIssueStaticParams()).toEqual(expect.arrayContaining([{ slug: "week-in-blaugrana-12" }]));
  });

  it("keeps footer about-page anchors resolvable", () => {
    const { container } = render(<AboutPage />);

    footerLinkGroups
      .flatMap((group) => group.links)
      .filter((link) => link.href.startsWith("/about#"))
      .forEach((link) => {
        const anchor = link.href.replace("/about#", "");
        expect(container.querySelector(`#${anchor}`)).toBeInTheDocument();
      });
  });
});
