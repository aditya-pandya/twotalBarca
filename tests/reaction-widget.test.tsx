import { fireEvent, render, screen } from "@testing-library/react";
import { ReactionWidget } from "@/components/reaction-widget";

describe("ReactionWidget", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores and restores the selected reaction locally", () => {
    const { rerender } = render(<ReactionWidget storageKey="brief-latest" title="How did this land?" />);

    fireEvent.click(screen.getByRole("button", { name: "Sharp" }));

    expect(window.localStorage.getItem("totalbarca:reaction:brief-latest")).toBe("sharp");
    expect(screen.getByText("Saved on this device.")).toBeInTheDocument();

    rerender(<ReactionWidget storageKey="brief-latest" title="How did this land?" />);

    expect(screen.getByRole("button", { name: "Sharp" })).toHaveAttribute("aria-pressed", "true");
  });
});
