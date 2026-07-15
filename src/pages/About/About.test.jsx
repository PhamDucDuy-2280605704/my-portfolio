import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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

  it("nút 'Tải CV' trỏ đúng tới file resume và có thuộc tính download", () => {
    renderAbout();

    const cvLink = screen.getByText("Tải CV").closest("a");
    expect(cvLink).toHaveAttribute("href", profile.resume);
    expect(cvLink).toHaveAttribute("download");
  });
});
