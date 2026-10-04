import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import Background from "./Background";

describe("Background", () => {
  it("không dùng class ngắn (tl/tr/bl/br) cho 4 góc khung — .bl là class gốc của trang chủ", () => {
    const { container } = render(<Background />);
    const corners = container.querySelectorAll(".app-viewport-corner");
    expect(corners).toHaveLength(4);

    // Lỗi cũ: góc dưới-trái mang class "bl" nên dính `.bl { min-height: 100vh; ... }`
    // và biến thành 1 dải đen cao cả màn hình ở mép trái.
    for (const el of corners) {
      for (const bad of ["tl", "tr", "bl", "br"]) expect(el).not.toHaveClass(bad);
    }
    expect(container.querySelector(".bl")).not.toBeInTheDocument();
  });
});
