import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Navbar from "./Navbar";

// Site giờ là 1 trang chủ duy nhất (không còn route riêng cho từng mục) ->
// Navbar không dùng react-router nữa, không cần bọc MemoryRouter khi test.
describe("Navbar", () => {
  it("hiển thị đủ 7 mục menu", () => {
    render(<Navbar />);

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
      // getAllByText vì menu desktop + menu mobile cùng render nhãn này trong DOM
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    });
  });

  it("mỗi mục menu là 1 link neo (#id) trỏ đúng section tương ứng", () => {
    render(<Navbar />);

    expect(screen.getAllByText("Giới Thiệu")[0].closest("a")).toHaveAttribute("href", "#about");
    expect(screen.getAllByText("Dự Án")[0].closest("a")).toHaveAttribute("href", "#projects");
  });

  it("logo luôn hiển thị (site chỉ còn 1 trang duy nhất)", () => {
    const { container } = render(<Navbar />);

    expect(container.querySelector(".logo")).toBeInTheDocument();
  });

  it("bấm nút hamburger sẽ mở menu full-screen trên mobile", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    // Menu mobile chưa hiện lúc đầu
    expect(screen.queryByLabelText("Đóng menu")).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Mở menu"));

    // Sau khi bấm, nút "Đóng menu" (chỉ có trong menu mobile) phải xuất hiện
    expect(screen.getByLabelText("Đóng menu")).toBeInTheDocument();
  });

  it("bấm vào logo sẽ mở overlay phóng to, bấm nút Đóng sẽ tắt overlay", async () => {
    const user = userEvent.setup();
    const { container } = render(<Navbar />);

    expect(container.querySelector(".logo-overlay")).not.toBeInTheDocument();

    await user.click(container.querySelector(".logo"));
    expect(container.querySelector(".logo-overlay")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Đóng"));
    expect(container.querySelector(".logo-overlay")).not.toBeInTheDocument();
  });

  it("nhấn phím Esc sẽ đóng overlay phóng to logo đang mở", async () => {
    const user = userEvent.setup();
    const { container } = render(<Navbar />);

    await user.click(container.querySelector(".logo"));
    expect(container.querySelector(".logo-overlay")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(container.querySelector(".logo-overlay")).not.toBeInTheDocument();
  });
});
