import { article, getArticleBySlug, getArticleSlugs, getStoryHref, homeLead } from "@/lib/site-data";

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
});
