import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import LanguageProvider from "../../context/LanguageProvider";
import AvatarLightbox from "./AvatarLightbox";

function setup() {
  return render(
    <LanguageProvider>
      <AvatarLightbox />
    </LanguageProvider>
  );
}

describe("AvatarLightbox", () => {
  it("mở khi bấm avatar, đóng bằng Esc và khoá/mở khoá cuộn trang", () => {
    setup();
    const dialog = () => document.querySelector(".avatar-root");
    expect(dialog()).toHaveAttribute("aria-hidden", "true");

    fireEvent.click(screen.getByRole("button", { name: /phóng to/i }));
    expect(dialog()).toHaveAttribute("aria-hidden", "false");
    expect(document.documentElement).toHaveClass("is-scroll-locked");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(dialog()).toHaveAttribute("aria-hidden", "true");
    expect(document.documentElement).not.toHaveClass("is-scroll-locked");
  });

  it("đóng khi bấm vào nền tối", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /phóng to/i }));
    fireEvent.click(document.querySelector(".avatar-backdrop"));
    expect(document.querySelector(".avatar-root")).toHaveAttribute("aria-hidden", "true");
  });
});
