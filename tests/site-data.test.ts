import {
  article,
  aboutData,
  footerLinkGroups,
  getArticleBySlug,
  getArticleSlugs,
  getStoryHref,
  homeLead,
  homePageData,
  navItems,
  siteMeta,
} from "@/lib/site-data";

describe("site data helpers", () => {
  it("returns the seeded article slug list", () => {
    expect(getArticleSlugs()).toContain("the-weave-of-the-blau");
  });

  it("finds the seeded article by slug", () => {
    expect(getArticleBySlug("the-weave-of-the-blau")).toMatchObject({
      headline: article.headline,
      section: article.section,
    });
  });

  it("returns undefined for unknown slugs", () => {
    expect(getArticleBySlug("missing-story")).toBeUndefined();
  });

  it("uses story href when present and fallback when absent", () => {
    expect(getStoryHref(homeLead)).toBe("/article/the-weave-of-the-blau");
    expect(getStoryHref({ href: undefined }, "/fallback")).toBe("/fallback");
  });

  it("keeps shared header nav hrefs stable", () => {
    expect(navItems.map((item) => item.href)).toEqual([
      "/#brief",
      "/#match-notes",
      "/#analysis",
      "/#archive",
      "/about",
    ]);
  });

  it("keeps shared footer groups publication-native and real", () => {
    expect(footerLinkGroups.map((group) => group.title)).toEqual([
      "Read",
      "Publication",
      "Dispatch",
    ]);
    expect(footerLinkGroups.flatMap((group) => group.links.map((link) => link.href))).toEqual([
      "/#brief",
      "/#analysis",
      "/#archive",
      "/about",
      "/about#principles",
      "/about#contributors",
      "/#dispatch",
      "/about#coverage",
      "/about#contact",
    ]);
  });

  it("keeps shared about and footer copy aligned with site-level metadata", () => {
    expect(aboutData.contact.secondaryValue).toBe(siteMeta.contactEmail);
    expect(siteMeta.footerMeta.socialLinks.map((link) => link.href)).toEqual([
      "/about",
      "/#dispatch",
      "/#archive",
    ]);
    expect(siteMeta.footerMeta.legalNotice).toContain("FC Barcelona writing with memory");
  });

  it("exports homepage content through shared typed data", () => {
    expect(homePageData.hero.headline).toBe("The Last of the Catalan Romantics");
    expect(homePageData.vault.items).toHaveLength(3);
    expect(homePageData.newsletter.heading).toBe("The Weekly Dispatch");
  });
});
