import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import LanguageProvider from "../../context/LanguageProvider";
import Zone from "./Zone";

function setup() {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <Zone />
      </MemoryRouter>
    </LanguageProvider>
  );
}

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});

describe("Zone", () => {
  it("chưa mở khoá thì hiện ô nhập mật khẩu và lối thoát, chưa lộ ghi chú", () => {
    setup();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(document.querySelectorAll(".zl-dial")).toHaveLength(4);
    expect(document.querySelector(".zl-hint")).toHaveTextContent("5704");
    expect(screen.getByRole("link", { name: /rời khỏi zone/i })).toHaveAttribute("href", "/");
    expect(document.querySelector(".zone-entry")).not.toBeInTheDocument();
  });

  it("dùng khung chung .hud-panel và không còn khung / class cũ gây đường kẻ lạ", () => {
    setup();
    const pda = document.querySelector(".zone-pda");
    expect(pda).toHaveClass("hud-panel", "hud-bracket");
    // Class "bl" chỉ dành cho gốc landing — nếu lọt vào đây sẽ kéo min-height:100vh (lỗi đường kẻ dọc trước đây)
    expect(document.querySelector(".zone-page .bl")).not.toBeInTheDocument();
    expect(document.querySelector(".hud-frame")).not.toBeInTheDocument();
  });
});
