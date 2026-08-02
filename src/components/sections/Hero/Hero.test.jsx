import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import Hero from "./Hero";
import profile from "../../../data/profile";

// Hero không còn dùng react-router (nút Liên hệ giờ là anchor "#contact"
// cuộn trong cùng trang, không điều hướng route) -> không cần MemoryRouter.
function renderHero() {
  return render(<Hero />);
}

describe("Hero", () => {
  it("hiển thị đúng tên, vai trò và quote từ data/profile.js", () => {
    renderHero();

    expect(screen.getByRole("heading", { level: 1, name: profile.fullName })).toBeInTheDocument();
    expect(screen.getByText(profile.role)).toBeInTheDocument();
    expect(screen.getByText(`“${profile.quote}”`)).toBeInTheDocument();
  });

  it("hiển thị đủ 3 nhãn Frontend/Backend/Mobile", () => {
    renderHero();

    ["Frontend", "Backend", "Mobile"].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("nút 'Liên Hệ Với Mình' cuộn thẳng tới section #contact", () => {
    renderHero();

    const contactLink = screen.getByText("Liên Hệ Với Mình").closest("a");
    expect(contactLink).toHaveAttribute("href", "#contact");
  });

  it("KHÔNG còn nút Download CV (đã bỏ theo yêu cầu, chỉ còn Contact Me)", () => {
    renderHero();

    expect(screen.queryByText(/Download CV/i)).not.toBeInTheDocument();
  });
});
