import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Navbar from "./Navbar";

// Helper: render Navbar tại 1 đường dẫn (route) cụ thể để test hành vi phụ thuộc route
// (VD: logo chỉ hiện ở "/").
function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>,
  );
}

describe("Navbar", () => {
  it("hiển thị đủ 7 mục menu", () => {
    renderAt("/");

    const expectedLabels = [
      "Trang Chủ",
      "Giới Thiệu",
      "Kỹ Năng",
      "Dự Án",
      "Kinh Nghiệm",
      "Nhật Ký",
      "Liên Hệ",
    ];

    expectedLabels.forEach((label) => {
      // getAllByText vì menu desktop dùng chung nhãn (không nhân bản trong DOM ở test này)
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    });
  });

  it("logo KHÔNG bị ẩn (không có class logo-hidden) khi đang ở trang Home", () => {
    const { container } = renderAt("/");

    expect(container.querySelector(".logo")).not.toHaveClass("logo-hidden");
  });

  it("logo BỊ ẩn (có class logo-hidden) khi ở các trang khác", () => {
    const { container } = renderAt("/about");

    expect(container.querySelector(".logo")).toHaveClass("logo-hidden");
  });

  it("bấm nút hamburger sẽ mở menu full-screen trên mobile", async () => {
    const user = userEvent.setup();
    renderAt("/");

    // Menu mobile chưa hiện lúc đầu
    expect(screen.queryByLabelText("Đóng menu")).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Mở menu"));

    // Sau khi bấm, nút "Đóng menu" (chỉ có trong menu mobile) phải xuất hiện
    expect(screen.getByLabelText("Đóng menu")).toBeInTheDocument();
  });
});
