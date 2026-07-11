import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import NotFound from "./NotFound";

describe("NotFound page", () => {
  it("hiển thị mã lỗi 404 và thông báo", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Không tìm thấy trang")).toBeInTheDocument();
  });

  it("có nút dẫn về Trang Chủ ('/')", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    const homeLink = screen.getByRole("link", { name: /Về Trang Chủ/ });
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
