import {
  aboutData,
  archiveCollections,
  collections,
  dispatchIssues,
  footerLinkGroups,
  getArchiveArticles,
  getArchiveCollectionStories,
  getArticleBySlug,
  getArticleSlugs,
  getArticlesByPerson,
  getArticlesBySeason,
  getArticlesByTopic,
  getCollectionArticles,
  getDispatchItemsAsStories,
  getLatestDispatchIssue,
  getPersonBySlug,
  getPersonSlugs,
  getSeasonBySlug,
  getSeasonSlugs,
  getSectionBySlug,
  getSectionSlugs,
  getStoryHref,
  getTopicBySlug,
  getTopicSlugs,
  homePageData,
  navItems,
  siteMeta,
} from "@/lib/site-data";

describe("site data helpers", () => {
  it("returns seeded route slugs across article, section, topic, season, and person surfaces", () => {
    expect(getArticleSlugs()).toContain("the-weave-of-the-blau");
    expect(getSectionSlugs()).toEqual(
      expect.arrayContaining(["brief", "match-notes", "analysis", "culture", "archive"]),
    );
    expect(getSectionSlugs()).not.toContain("dispatch");
    expect(getTopicSlugs()).toContain("identity");
    expect(getSeasonSlugs()).toContain("2025-26");
    expect(getPersonSlugs()).toContain("maury-vidal");
  });

  it("finds seeded records and returns undefined for unknown values", () => {
    expect(getArticleBySlug("the-weave-of-the-blau")?.headline).toBe("The Weave of the Blau");
    expect(getSectionBySlug("analysis")?.name).toBe("Analysis");
    expect(getTopicBySlug("identity")?.name).toBe("Identity");
    expect(getSeasonBySlug("2025-26")?.label).toBe("2025-26");
    expect(getPersonBySlug("gavi")?.name).toBe("Gavi");
    expect(getArticleBySlug("missing-story")).toBeUndefined();
    expect(getTopicBySlug("missing-topic")).toBeUndefined();
    expect(getSeasonBySlug("missing-season")).toBeUndefined();
    expect(getPersonBySlug("missing-person")).toBeUndefined();
  });

  it("uses story href when present and fallback when absent", () => {
    expect(getStoryHref(homePageData.hero)).toBe("/article/the-last-of-the-catalan-romantics");
    expect(getStoryHref({ href: undefined }, "/fallback")).toBe("/fallback");
  });

  it("keeps shared header and footer links pointed at live publication surfaces", () => {
    expect(navItems.map((item) => item.href)).toEqual([
      "/section/brief",
      "/match-notes",
      "/analysis",
      "/culture",
      "/archive",
      "/about",
    ]);
    expect(navItems.map((item) => item.label)).toContain("Culture");
    expect(navItems.map((item) => item.label)).not.toContain("Weekly Dispatch");
    expect(footerLinkGroups.flatMap((group) => group.links).map((link) => link.href)).toContain(
      "/dispatch/week-in-blaugrana-12",
    );
    expect(siteMeta.footerMeta.socialLinks.map((link) => link.href)).toEqual(["/about", "/dispatch", "/archive"]);
  });

  it("exports homepage, about, archive, and dispatch content through shared typed data", () => {
    expect(homePageData.hero.headline).toBe("The Last of the Catalan Romantics");
    expect(homePageData.analysisFeature.href).toBe("/analysis");
    expect(homePageData.vault.ctaHref).toBe("/archive");
    expect(homePageData.newsletter.heading).toBe("The Weekly Dispatch");
    expect(homePageData.newsletter.ctaHref).toBe("/dispatch");
    expect(homePageData.missionPanel.primaryLinkHref).toBe("/about");
    expect(homePageData.missionPanel.secondaryLinkHref).toBe("/dispatch/week-in-blaugrana-12");
    expect(aboutData.contact.primaryCtaHref).toBe("/dispatch");
    expect(dispatchIssues[0].items.length).toBeGreaterThan(3);
    expect(getArchiveCollectionStories(archiveCollections[0]).length).toBeGreaterThan(1);
  });

  it("keeps article and taxonomy graphs aligned", () => {
    expect(getArticlesByTopic("identity").map((articleItem) => articleItem.slug)).toEqual(
      expect.arrayContaining([
        "the-weave-of-the-blau",
        "the-last-of-the-catalan-romantics",
        "gavis-return-changes-the-rhythm",
      ]),
    );
    expect(getArticlesBySeason("2025-26").length).toBeGreaterThan(0);
    expect(getArticlesByPerson("maury-vidal").length).toBeGreaterThan(0);
  });

  it("preserves shared collection and dispatch relationships", () => {
    expect(getArchiveArticles().map((articleItem) => articleItem.slug)).toEqual(
      expect.arrayContaining(["the-weave-of-the-blau", "home-and-the-sacred"]),
    );
    expect(getCollectionArticles(collections[0]).map((articleItem) => articleItem.slug)).toEqual(
      collections[0].itemArticleSlugs,
    );

    const latestIssue = getLatestDispatchIssue();
    expect(latestIssue.slug).toBe(dispatchIssues[0].slug);
    expect(getDispatchItemsAsStories(latestIssue).map((story) => story.href)).toEqual(
      latestIssue.items.map((item) => item.link),
    );
  });
});
