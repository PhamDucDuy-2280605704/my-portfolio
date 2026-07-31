import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Footer from "./Footer";

describe("Footer", () => {
  it("hiển thị đúng mã hệ thống và năm bản quyền", () => {
    // Footer dùng useLocation() (hiện route hiện tại dạng "SRC /path") ->
    // bắt buộc phải bọc trong Router khi test, nếu không sẽ throw lỗi
    // "useLocation() may be used only in the context of a <Router>".
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText(/OPSEC_ADMIN/)).toBeInTheDocument();
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });
});
