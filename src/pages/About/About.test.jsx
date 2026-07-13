import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import About from "./About";
import profile from "../../data/profile";

function renderAbout() {
  return render(
    <MemoryRouter>
      <About />
    </MemoryRouter>,
  );
}

describe("About page", () => {
  it("hiển thị đủ các đoạn bio từ data/profile.js", () => {
    renderAbout();

    profile.bio.forEach((paragraph) => {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    });
  });

  it("hiển thị thông tin chi tiết: ngày sinh, email, địa chỉ", () => {
    renderAbout();

    expect(screen.getByText(profile.birthday)).toBeInTheDocument();
    expect(screen.getByText(profile.email)).toBeInTheDocument();
    expect(screen.getByText(profile.location)).toBeInTheDocument();
  });

  it("bấm nút 'Xem CV' sẽ mở modal xem PDF ngay trong trang (không mở tab mới)", async () => {
    const user = userEvent.setup();
    renderAbout();

    // Modal chưa mở lúc đầu.
    expect(screen.queryByTitle(`CV - ${profile.fullName}`)).not.toBeInTheDocument();

    await user.click(screen.getByText("Xem CV"));

    const iframe = screen.getByTitle(`CV - ${profile.fullName}`);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", profile.resume);
  });

  it("bấm nút Đóng sẽ tắt modal xem CV", async () => {
    const user = userEvent.setup();
    renderAbout();

    await user.click(screen.getByText("Xem CV"));
    expect(screen.getByTitle(`CV - ${profile.fullName}`)).toBeInTheDocument();

    await user.click(screen.getByLabelText("Đóng"));
    expect(screen.queryByTitle(`CV - ${profile.fullName}`)).not.toBeInTheDocument();
  });
});
