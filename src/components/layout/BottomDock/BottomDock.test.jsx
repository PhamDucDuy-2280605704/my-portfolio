import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";

import BottomDock from "./BottomDock";
import renderWithLanguage from "../../../test/renderWithLanguage";

// BottomDock không dùng react-router (link neo "#id" thuần, không phải
// route) -> không cần MemoryRouter khi test. Cần LanguageProvider vì
// BottomDock gọi useLanguage() để dịch tên/mô tả từng mục.
describe("BottomDock", () => {
  it("hiển thị đủ 7 mục điều hướng", () => {
    renderWithLanguage(<BottomDock />);

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
    renderWithLanguage(<BottomDock />);

    expect(screen.getByLabelText("Giới Thiệu")).toHaveAttribute("href", "#about");
    expect(screen.getByLabelText("Dự Án")).toHaveAttribute("href", "#projects");
    expect(screen.getByLabelText("Liên Hệ")).toHaveAttribute("href", "#contact");
  });
});
