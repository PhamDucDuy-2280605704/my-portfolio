import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Contact from "./Contact";
import social from "../../data/social";

function renderContact() {
  return render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>,
  );
}

describe("Contact page", () => {
  it("hiển thị đủ 6 kênh liên hệ", () => {
    renderContact();

    // Dùng getByRole("heading") vì mỗi tên kênh còn là <h3>, tránh trùng với
    // label "Email" trong ContactForm (input Email của form liên hệ).
    ["Email", "GitHub", "Facebook", "Zalo", "Discord", "TikTok"].forEach((name) => {
      expect(screen.getByRole("heading", { level: 3, name })).toBeInTheDocument();
    });
  });

  it("link Discord trỏ đúng tới social.discord", () => {
    renderContact();

    const discordCard = screen.getByRole("heading", { level: 3, name: "Discord" }).closest("a");
    expect(discordCard).toHaveAttribute("href", social.discord);
  });

  it("link TikTok trỏ đúng tới social.tiktok", () => {
    renderContact();

    const tiktokCard = screen.getByRole("heading", { level: 3, name: "TikTok" }).closest("a");
    expect(tiktokCard).toHaveAttribute("href", social.tiktok);
  });

  it("mỗi link kênh liên hệ đều mở tab mới (target=_blank, rel=noreferrer)", () => {
    renderContact();

    const emailCard = screen.getByRole("heading", { level: 3, name: "Email" }).closest("a");
    expect(emailCard).toHaveAttribute("target", "_blank");
    expect(emailCard).toHaveAttribute("rel", "noreferrer");
  });

  it("hiện form liên hệ với đủ 3 trường: Họ tên, Email, Lời nhắn", () => {
    renderContact();

    expect(screen.getByLabelText("Họ tên")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Lời nhắn")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Gửi Tin Nhắn/ })).toBeInTheDocument();
  });
});
