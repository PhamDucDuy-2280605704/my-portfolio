import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";

import Sidebar from "./Sidebar";
import profile from "../../../data/profile";
import renderWithLanguage from "../../../test/renderWithLanguage";

// Sidebar không dùng react-router (toàn bộ link đều là neo "#id" thuần)
// -> không cần MemoryRouter khi test. Cần LanguageProvider vì Sidebar gọi
// useLanguage() để dịch tên/mô tả từng mục.
describe("Sidebar", () => {
  it("hiển thị đủ 7 mục điều hướng section", () => {
    renderWithLanguage(<Sidebar />);

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
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it("mỗi mục là 1 link neo (#id) trỏ đúng section tương ứng", () => {
    renderWithLanguage(<Sidebar />);

    expect(screen.getByLabelText("Giới Thiệu")).toHaveAttribute("href", "#about");
    expect(screen.getByLabelText("Dự Án")).toHaveAttribute("href", "#projects");
    expect(screen.getByLabelText("Liên Hệ")).toHaveAttribute("href", "#contact");
  });

  it("monogram góc trên trỏ về #home và hiện đúng chữ viết tắt tên", () => {
    renderWithLanguage(<Sidebar />);

    const monogram = screen.getByLabelText(profile.fullName);
    expect(monogram).toHaveAttribute("href", "#home");
    expect(monogram.textContent.length).toBeGreaterThan(0);
  });

  it("có nút chuyển ngôn ngữ", () => {
    renderWithLanguage(<Sidebar />);

    expect(screen.getByLabelText("Đổi sang tiếng Anh")).toBeInTheDocument();
  });

  it("nút tải CV trỏ đúng tới file resume và có thuộc tính download", () => {
    renderWithLanguage(<Sidebar />);

    const cvLink = screen.getByLabelText("Tải CV");
    expect(cvLink).toHaveAttribute("href", profile.resume);
    expect(cvLink).toHaveAttribute("download");
  });
});
