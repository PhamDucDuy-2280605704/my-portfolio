import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import useTheme from "./useTheme";

// Component nhỏ để "mượn" chỗ gọi hook + có nút bấm test toggleTheme.
function TestComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Theme hiện tại: {theme}
    </button>
  );
}

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

describe("useTheme", () => {
  it("mặc định là 'dark' khi chưa có gì trong localStorage và trình duyệt không khai báo prefers-color-scheme", () => {
    render(<TestComponent />);

    expect(screen.getByText(/Theme hiện tại: dark/)).toBeInTheDocument();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("đọc theme đã lưu trong localStorage nếu có từ trước", () => {
    window.localStorage.setItem("theme", "light");

    render(<TestComponent />);

    expect(screen.getByText(/Theme hiện tại: light/)).toBeInTheDocument();
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("bấm toggle sẽ đổi qua lại giữa dark/light và lưu vào localStorage", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    expect(screen.getByText(/Theme hiện tại: dark/)).toBeInTheDocument();

    await user.click(screen.getByRole("button"));
    expect(screen.getByText(/Theme hiện tại: light/)).toBeInTheDocument();
    expect(window.localStorage.getItem("theme")).toBe("light");

    await user.click(screen.getByRole("button"));
    expect(screen.getByText(/Theme hiện tại: dark/)).toBeInTheDocument();
    expect(window.localStorage.getItem("theme")).toBe("dark");
  });
});
