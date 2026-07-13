import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import CornerFlourish from "./CornerFlourish";

describe("CornerFlourish", () => {
  it("render đúng 1 SVG trang trí, ẩn khỏi trình đọc màn hình (aria-hidden)", () => {
    const { container } = render(<CornerFlourish />);

    const svg = container.querySelector("svg.corner-flourish-svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
