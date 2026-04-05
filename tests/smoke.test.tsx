import { render, screen } from "@testing-library/react";
import AboutPage from "@/app/about/page";
import ArticlePage from "@/app/article/[slug]/page";
import HomePage from "@/app/page";
import { SiteHeader } from "@/components/site-header";
import { navItems } from "@/lib/site-data";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("UI smoke tests", () => {
  it("renders the homepage lead story and key anchored sections", () => {
    const { container } = render(<HomePage />);

    expect(screen.getByRole("heading", { name: "The Last of the Catalan Romantics" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The Weekly Dispatch" })).toBeInTheDocument();
    expect(container.querySelector("#match-review")).toBeInTheDocument();
    expect(container.querySelector("#cultural-heart")).toBeInTheDocument();
    expect(container.querySelector("#archive")).toBeInTheDocument();
    expect(container.querySelector("#journalism")).toBeInTheDocument();
    expect(container.querySelector("#dispatch")).toBeInTheDocument();
  });

  it("renders the site header actions and primary navigation", () => {
    render(<SiteHeader />);

    const subscribeLink = screen.getByRole("link", { name: "Subscribe" });
    const searchButton = screen.getByRole("button", { name: "Search" });

    navItems.forEach((item) => {
      expect(screen.getByRole("link", { name: item.label })).toHaveAttribute("href", item.href);
    });
    expect(subscribeLink).toHaveAttribute("href", "/#dispatch");
    expect(searchButton).toBeInTheDocument();
  });

  it("renders the about page smoke content", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { name: "The living archive, minus the museum voice." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Why we publish" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contributors" })).toBeInTheDocument();
  });

  it("renders the seeded article page", async () => {
    render(await ArticlePage({ params: Promise.resolve({ slug: "the-weave-of-the-blau" }) }));

    expect(screen.getByRole("heading", { name: "The Weave of the Blau" })).toBeInTheDocument();
    expect(screen.getByText("Three moments in the shirt's public life")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back home" })).toHaveAttribute("href", "/");
  });
});
