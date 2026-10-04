import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import LanguageProvider from "../../context/LanguageProvider";
import ImageLightbox from "./ImageLightbox";

function setup() {
  return render(
    <LanguageProvider>
      <ImageLightbox src="/x.jpg" alt="x" caption="x" label="Phóng to ảnh" />
    </LanguageProvider>,
  );
}

describe("ImageLightbox", () => {
  it("mở khi bấm avatar, đóng bằng Esc và khoá/mở khoá cuộn trang", () => {
    setup();
    const dialog = () => document.querySelector(".lightbox-root");
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
    fireEvent.click(document.querySelector(".lightbox-backdrop"));
    expect(document.querySelector(".lightbox-root")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
