import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import { SiteHeader } from "@/components/site-header";
import { homeLead } from "@/lib/site-data";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("UI smoke tests", () => {
  it("renders the homepage lead story", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: homeLead.headline })).toBeInTheDocument();
    expect(screen.getByText(homeLead.dek ?? "")).toBeInTheDocument();
  });

  it("renders the site header with the home link marked active", () => {
    render(<SiteHeader />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    const dispatchLink = screen.getByRole("link", { name: "Weekly Dispatch" });

    expect(homeLink).toHaveAttribute("data-active", "true");
    expect(dispatchLink).toHaveAttribute("href", "/#dispatch");
  });
});
