import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ThemeToggle from "./ThemeToggle";

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

describe("ThemeToggle", () => {
  it("mặc định (dark) hiện nhãn 'Chuyển sang giao diện sáng'", () => {
    render(<ThemeToggle />);

    expect(screen.getByLabelText("Chuyển sang giao diện sáng")).toBeInTheDocument();
  });

  it("bấm vào sẽ đổi thuộc tính data-theme trên <html> và đổi nhãn nút", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(screen.getByLabelText("Chuyển sang giao diện tối")).toBeInTheDocument();
  });
});
