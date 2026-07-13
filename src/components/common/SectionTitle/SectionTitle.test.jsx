import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import SectionTitle from "./SectionTitle";

describe("SectionTitle", () => {
  it("hiển thị đúng title và subtitle được truyền vào", () => {
    render(
      <SectionTitle
        subtitle="Kết Nối Với Mình"
        title="Liên Hệ"
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Liên Hệ" })).toBeInTheDocument();
    expect(screen.getByText("Kết Nối Với Mình")).toBeInTheDocument();
  });

  it("luôn render vạch chia trang trí kiểu line-dot-line (section-title-divider)", () => {
    const { container } = render(
      <SectionTitle
        subtitle="Test"
        title="Test Title"
      />,
    );

    expect(container.querySelector(".section-title-divider")).toBeInTheDocument();
    expect(container.querySelector(".section-title-divider-dot")).toBeInTheDocument();
  });
});
