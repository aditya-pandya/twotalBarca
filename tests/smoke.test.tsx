import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import { SiteHeader } from "@/components/site-header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("UI smoke tests", () => {
  it("renders the homepage lead story", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "The Last of the Catalan Romantics" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The Weekly Dispatch" })).toBeInTheDocument();
  });

  it("renders the site header actions and primary navigation", () => {
    render(<SiteHeader />);

    const archiveLink = screen.getByRole("link", { name: "Archive" });
    const subscribeLink = screen.getByRole("link", { name: "Subscribe" });
    const searchButton = screen.getByRole("button", { name: "Search" });

    expect(archiveLink).toHaveAttribute("href", "/#archive");
    expect(subscribeLink).toHaveAttribute("href", "/#dispatch");
    expect(searchButton).toBeInTheDocument();
  });
});
