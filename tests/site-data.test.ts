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
    expect(getLatestDispatchIssue()?.slug).toBe("weekly-dispatch-may-4-2026");
    expect(getLatestDispatchIssue()?.items).toHaveLength(5);
    expect(dispatchIssues).toHaveLength(1);
  });

  it("keeps the public match context tied to the current May 2-10 match window", () => {
    expect(matchContext.recent).toEqual([
      {
        label: "Osasuna 1-2 Barcelona",
        detail: "May 2, La Liga — a practical away win before Madrid week.",
      },
    ]);
    expect(matchContext.upcoming).toEqual([
      {
        label: "Barcelona vs Real Madrid",
        detail: "May 10, La Liga, 7:00 PM.",
      },
    ]);
  });
});
