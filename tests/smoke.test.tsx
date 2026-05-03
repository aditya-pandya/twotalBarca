import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import AnalysisPage from "@/app/analysis/page";
import AboutPage from "@/app/about/page";
import ArticlePage from "@/app/article/[slug]/page";
import DispatchIssuePageRoute, {
  generateMetadata as generateDispatchIssueMetadata,
} from "@/app/dispatch/[slug]/page";
import DispatchPage, { metadata as dispatchMetadata } from "@/app/dispatch/page";
import RootLayout, { metadata as siteMetadata } from "@/app/layout";
import HomePage, { metadata as homeMetadata } from "@/app/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { footerLinkGroups, navItems, siteMeta } from "@/lib/site-data";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  notFound: () => {
    throw new Error("notFound");
  },
  redirect: (href: string) => {
    throw new Error(`redirect:${href}`);
  },
}));

describe("public weekly dispatch smoke tests", () => {
  it("renders the homepage as the weekly dispatch reader", () => {
    render(<HomePage />);

    expect(screen.getByRole("region", { name: "Weekly Dispatch reader" })).toBeInTheDocument();
    expect(screen.getAllByText(/Take 01/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Take 05/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Match context/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Last result/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Next match/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("That’s the week.").length).toBeGreaterThan(0);
    expect(screen.queryByText("The Brief")).not.toBeInTheDocument();
  });

  it("renders header and footer with only Home, Dispatch, and About", () => {
    render(
      <>
        <SiteHeader />
        <SiteFooter />
      </>,
    );

    const primaryNav = screen.getByRole("navigation", { name: "Primary" });
    const footer = screen.getByRole("contentinfo");

    expect(screen.getByRole("link", { name: siteMeta.name })).toHaveAttribute("href", "/");
    expect(within(primaryNav).queryByRole("link", { name: "The Brief" })).not.toBeInTheDocument();

    navItems.forEach((item) => {
      expect(within(primaryNav).getByRole("link", { name: item.label })).toHaveAttribute("href", item.href);
    });

    footerLinkGroups.forEach((group) => {
      const groupHeading = within(footer).getByRole("heading", { name: group.title });
      const groupContainer = groupHeading.parentElement;
      expect(groupContainer).not.toBeNull();
      expect(within(groupContainer as HTMLElement).queryByRole("link", { name: "The Brief" })).not.toBeInTheDocument();
      group.links.forEach((link) => {
        expect(within(groupContainer as HTMLElement).getByRole("link", { name: link.label })).toHaveAttribute(
          "href",
          link.href,
        );
      });
    });
  });

  it("renders the about page without promoting The Brief", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { name: "About totalBarça" })).toBeInTheDocument();
    expect(screen.getByText(/mondays, after the weekend settles/i)).toBeInTheDocument();
    expect(screen.getByText(/five takes, one fixture context/i)).toBeInTheDocument();
    expect(screen.queryByText("The Brief")).not.toBeInTheDocument();
  });

  it("renders the dispatch index with the current public issue reader", () => {
    render(<DispatchPage />);

    expect(screen.getByRole("region", { name: "Weekly Dispatch reader" })).toBeInTheDocument();
    expect(screen.getAllByText(/Take 01/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Take 05/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("That’s the week.").length).toBeGreaterThan(0);
    expect(screen.queryByText(/How did this land\?/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Lead read" })).not.toBeInTheDocument();
  });

  it("keeps the mobile dispatch dock compact while preserving accessible section buttons", () => {
    render(<DispatchPage />);

    const dock = screen.getByRole("navigation", { name: "Mobile issue navigation" });

    expect(within(dock).getByRole("button", { name: "Previous" })).toBeInTheDocument();
    expect(within(dock).getByRole("button", { name: "Next" })).toBeInTheDocument();
    expect(within(dock).getByRole("button", { name: "Card 1" })).toHaveAttribute("aria-current", "step");
    expect(within(dock).getByRole("button", { name: "Card 7" })).toBeInTheDocument();
    expect(within(dock).getByRole("button", { name: "Card 8" })).toBeInTheDocument();
    expect(within(dock).queryByText("Cover")).not.toBeInTheDocument();
    expect(within(dock).queryByText("Match")).not.toBeInTheDocument();
    expect(within(dock).queryByText("End")).not.toBeInTheDocument();
    expect(within(dock).queryByText("Start")).not.toBeInTheDocument();
    expect(within(dock).queryByText("Fixture")).not.toBeInTheDocument();
    expect(within(dock).queryByText("Close")).not.toBeInTheDocument();
  });

  it("keeps touch swipes mouse-only at the pointer layer while preserving dock tap targets", () => {
    const { container } = render(<DispatchPage />);
    const track = container.querySelector(".comm-mobile-track") as HTMLDivElement | null;

    expect(track).not.toBeNull();

    const setPointerCapture = vi.fn();
    Object.defineProperty(track!, "setPointerCapture", {
      value: setPointerCapture,
      configurable: true,
    });

    fireEvent.pointerDown(track!, { pointerId: 1, pointerType: "touch", clientX: 16 });

    expect(setPointerCapture).not.toHaveBeenCalled();
    expect(track!.style.scrollSnapType).toBe("");

    const dock = screen.getByRole("navigation", { name: "Mobile issue navigation" });
    const previous = within(dock).getByRole("button", { name: "Previous" });
    const next = within(dock).getByRole("button", { name: "Next" });
    const firstPip = within(dock).getByRole("button", { name: "Card 1" });

    expect(previous).toHaveStyle({ width: "44px", height: "44px", minWidth: "44px", minHeight: "44px" });
    expect(next).toHaveStyle({ width: "44px", height: "44px", minWidth: "44px", minHeight: "44px" });
    expect(firstPip).toHaveClass("comm-pip");
    expect(firstPip.childElementCount).toBe(0);
    expect(firstPip).toHaveStyle({ width: "18px" });
  });

  it("supports the touch swipe fallback while preserving next-button and pip navigation", () => {
    const { container } = render(<DispatchPage />);
    const track = container.querySelector(".comm-mobile-track") as HTMLDivElement | null;

    expect(track).not.toBeNull();

    Object.defineProperties(track!, {
      clientWidth: { value: 320, configurable: true },
      scrollLeft: { value: 0, writable: true, configurable: true },
      scrollTo: {
        value: ({ left }: { left: number }) => {
          track!.scrollLeft = left;
        },
        configurable: true,
      },
    });

    const dock = screen.getByRole("navigation", { name: "Mobile issue navigation" });
    const next = within(dock).getByRole("button", { name: "Next" });
    const firstPip = within(dock).getByRole("button", { name: "Card 1" });
    const secondPip = within(dock).getByRole("button", { name: "Card 2" });

    fireEvent.touchStart(track!, {
      touches: [{ clientX: 280, clientY: 40 }],
      changedTouches: [{ clientX: 280, clientY: 40 }],
    });
    fireEvent.touchEnd(track!, {
      changedTouches: [{ clientX: 20, clientY: 44 }],
    });

    expect(secondPip).toHaveAttribute("aria-current", "step");
    expect(firstPip).not.toHaveAttribute("aria-current", "step");

    fireEvent.click(next);
    expect(within(dock).getByRole("button", { name: "Card 3" })).toHaveAttribute("aria-current", "step");

    fireEvent.click(firstPip);
    expect(firstPip).toHaveAttribute("aria-current", "step");
  });

  it("keeps compact pip styling in CSS and removes the legacy settle helpers and inner pip markup", () => {
    const readerSource = readFileSync(join(process.cwd(), "components/weekly-dispatch-reader.tsx"), "utf8");
    const globalStyles = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

    expect(readerSource).not.toContain("settleTimerRef");
    expect(readerSource).not.toContain("settleToNearestCard");
    expect(readerSource).toContain("touchRef");
    expect(readerSource).toContain("onTouchStart={onTouchStart}");
    expect(readerSource).toContain("onTouchEnd={onTouchEnd}");
    expect(readerSource).toContain("onTouchCancel={onTouchCancel}");
    expect(globalStyles).not.toContain(".comm-pip-dot");
    expect(globalStyles).not.toContain("touch-action: pan-y");
    expect(globalStyles).toMatch(/\.comm-pip-pill\s*\{[^}]*gap:\s*8px;[^}]*padding:\s*8px 14px;[^}]*\}/s);
    expect(globalStyles).toMatch(/\.comm-pip\s*\{[^}]*height:\s*6px;[^}]*border-radius:\s*3px;[^}]*\}/s);
  });

  it("renders the dispatch issue route with the same reader shell", async () => {
    const page = await DispatchIssuePageRoute({ params: Promise.resolve({ slug: "weekly-dispatch-april-10-2026" }) });

    render(page);

    expect(screen.getByRole("region", { name: "Weekly Dispatch reader" })).toBeInTheDocument();
    expect(screen.getAllByText(/Take 01/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Take 05/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("That’s the week.").length).toBeGreaterThan(0);
  });

  it("keeps stale dispatch issue routes off the public site", async () => {
    await expect(
      DispatchIssuePageRoute({ params: Promise.resolve({ slug: "week-in-blaugrana-1" }) }),
    ).rejects.toThrow("notFound");
  });

  it("keeps article pages visual while hiding author names in the UI", async () => {
    const page = await ArticlePage({ params: Promise.resolve({ slug: "the-weave-of-the-blau" }) });

    render(page);

    expect(screen.getAllByRole("img", { name: /signed fc barcelona shirt displayed with boots and a ballon d'or replica/i }).length).toBeGreaterThan(0);
    expect(screen.queryByText("Clara Montfort")).not.toBeInTheDocument();
  });

  it("keeps planning dispatch slugs off the public issue route", async () => {
    await expect(
      DispatchIssuePageRoute({ params: Promise.resolve({ slug: "week-in-blaugrana-14-planning" }) }),
    ).rejects.toThrow("notFound");
  });

  it("renders hidden modules as concise off-surface notices", () => {
    render(<AnalysisPage />);
    expect(screen.getByRole("heading", { name: "Analysis is not in today's edition." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to totalBarca" })).toHaveAttribute("href", "/");
  });

  it("exports public metadata for the active surfaces", async () => {
    const dispatchIssueMetadata = await generateDispatchIssueMetadata({
      params: Promise.resolve({ slug: "weekly-dispatch-april-10-2026" }),
    });

    expect(siteMetadata.title).toMatchObject({ default: "totalBarça" });
    expect(homeMetadata.alternates?.canonical).toBe("/");
    expect(dispatchMetadata.alternates?.canonical).toBe("/dispatch");
    expect(dispatchIssueMetadata.alternates?.canonical).toBe("/dispatch/weekly-dispatch-april-10-2026");
  });

  it("keeps the shell skip link and JSON-LD scripts", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <div>Page body</div>
      </RootLayout>,
    );

    expect(markup).toContain('href="#main-content"');
    expect(markup).toContain('id="main-content"');
    expect(markup).toContain('"@type":"WebSite"');
    expect(markup).toContain('"@type":"Organization"');
  });
});
