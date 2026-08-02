import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import Footer from "./Footer";

// Footer không còn dùng react-router (site giờ chỉ 1 trang, không cần biết
// route hiện tại) -> không cần bọc MemoryRouter khi test.
describe("Footer", () => {
  it("hiển thị đúng mã hệ thống và năm bản quyền", () => {
    render(<Footer />);

    expect(screen.getByText(/OPSEC_ADMIN/)).toBeInTheDocument();
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });
});
