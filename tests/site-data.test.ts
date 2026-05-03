import { dispatchIssues, footerLinkGroups, getLatestDispatchIssue, matchContext, navItems, siteMeta } from "@/lib/site-data";

describe("public site data", () => {
  it("limits public navigation to the weekly dispatch routes", () => {
    expect(siteMeta.name).toBe("totalBarça");
    expect(navItems).toEqual([
      { label: "Home", href: "/" },
      { label: "Dispatch", href: "/dispatch" },
      { label: "About", href: "/about" },
    ]);
    expect(footerLinkGroups).toEqual([
      {
        title: "Read totalBarça",
        links: [
          { label: "Home", href: "/" },
          { label: "Dispatch", href: "/dispatch" },
          { label: "About", href: "/about" },
        ],
      },
    ]);
  });

  it("describes totalBarça as a weekly five-take dispatch with fixture context", () => {
    expect(siteMeta.description).toMatch(/weekly dispatch/i);
    expect(siteMeta.description).toMatch(/five topics/i);
    expect(siteMeta.description).toMatch(/match context/i);
    expect(siteMeta.tagline).toMatch(/five takes/i);
    expect(siteMeta.tagline).toMatch(/match context/i);
  });

  it("keeps the latest public dispatch constrained to five takes", () => {
    expect(getLatestDispatchIssue()?.slug).toBe("weekly-dispatch-april-10-2026");
    expect(getLatestDispatchIssue()?.items).toHaveLength(5);
    expect(dispatchIssues).toHaveLength(1);
  });

  it("keeps the public match context tied to the current Apr. 10-14 match window", () => {
    expect(matchContext.recent).toEqual([
      {
        label: "Barcelona 0-2 Atlético Madrid",
        detail: "Apr 8, Champions League quarter-final first leg.",
      },
    ]);
    expect(matchContext.upcoming).toEqual([
      {
        label: "Barcelona vs Espanyol",
        detail: "Apr 11, La Liga, 4:30 PM.",
      },
    ]);
  });
});
