import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Navbar from "./Navbar";
import renderWithLanguage from "../../../test/renderWithLanguage";

// Navbar giờ không dùng react-router nữa (menu điều hướng đã chuyển hẳn
// xuống <BottomDock />, xem BottomDock.test.jsx) -> không cần MemoryRouter.
// Cần LanguageProvider vì Navbar gọi useLanguage() để dịch tên section active.
describe("Navbar", () => {
  it("hiển thị tên trong dải mã hiệu phía trên", () => {
    renderWithLanguage(<Navbar />);

    expect(screen.getByText("PHẠM ĐỨC DUY")).toBeInTheDocument();
  });

  it("logo luôn hiển thị", () => {
    const { container } = renderWithLanguage(<Navbar />);

    expect(container.querySelector(".logo")).toBeInTheDocument();
  });

  it("bấm vào logo sẽ mở overlay phóng to, bấm nút Đóng sẽ tắt overlay", async () => {
    const user = userEvent.setup();
    const { container } = renderWithLanguage(<Navbar />);

    expect(container.querySelector(".logo-overlay")).not.toBeInTheDocument();

    await user.click(container.querySelector(".logo"));
    expect(container.querySelector(".logo-overlay")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Đóng"));
    expect(container.querySelector(".logo-overlay")).not.toBeInTheDocument();
  });

  it("nhấn phím Esc sẽ đóng overlay phóng to logo đang mở", async () => {
    const user = userEvent.setup();
    const { container } = renderWithLanguage(<Navbar />);

    await user.click(container.querySelector(".logo"));
    expect(container.querySelector(".logo-overlay")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(container.querySelector(".logo-overlay")).not.toBeInTheDocument();
  });

  it("có nút chuyển ngôn ngữ (không còn nút chuyển theme)", () => {
    renderWithLanguage(<Navbar />);

    expect(screen.getByLabelText("Đổi sang tiếng Anh")).toBeInTheDocument();
    expect(screen.queryByLabelText(/Chuyển sang giao diện/)).not.toBeInTheDocument();
  });
});
