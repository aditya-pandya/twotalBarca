import { assertTransitionAllowed, buildDashboardSummary, compileNewsroomSitePayload, validateNewsroomData } from "@/lib/newsroom";
import { loadNewsroomData } from "@/lib/newsroom-io";

describe("newsroom core", () => {
  it("validates the committed newsroom state without hard errors", async () => {
    const data = await loadNewsroomData(process.cwd());
    const issues = validateNewsroomData(data);
    const errors = issues.filter((issue) => issue.severity === "error");

    expect(errors).toHaveLength(0);
    expect(issues).toHaveLength(0);
  });

  it("compiles published newsroom records into a deterministic site payload", async () => {
    const data = await loadNewsroomData(process.cwd());
    const payload = compileNewsroomSitePayload(data);

    expect(payload.articles.map((article) => article.slug)).toContain("rest-defense-is-learning-to-breathe");
    expect(payload.dispatchIssues[0]?.slug).toBe("week-in-blaugrana-13");
    expect(payload.frontPagePlan.heroArticleSlug).toBe("rest-defense-is-learning-to-breathe");
    expect(payload.frontPagePlan.featuredDispatchSlug).toBe("week-in-blaugrana-13");
    expect(payload.frontPagePlan.isValid).toBe(true);
  });

  it("blocks unsafe transitions until approval coverage exists", async () => {
    const data = await loadNewsroomData(process.cwd());
    const record = data.articles.find((article) => article.slug === "montjuic-needs-a-louder-start");

    expect(record).toBeDefined();

    expect(() =>
      assertTransitionAllowed({
        record: record!,
        kind: "article",
        targetStatus: "approved",
        approvals: data.approvals,
        workflow: data.workflow,
      }),
    ).toThrow(/missing approvals/i);
  });

  it("summarizes dashboard state from real newsroom files", async () => {
    const data = await loadNewsroomData(process.cwd());
    const summary = buildDashboardSummary(data);

    expect(summary.counts.articles).toBeGreaterThanOrEqual(2);
    expect(summary.published.articleSlugs).toContain("rest-defense-is-learning-to-breathe");
    expect(summary.published.dispatchSlugs).toContain("week-in-blaugrana-13");
    expect(summary.frontPage.heroArticleSlug).toBe("rest-defense-is-learning-to-breathe");
  });
});
