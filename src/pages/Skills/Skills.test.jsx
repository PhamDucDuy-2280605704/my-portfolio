import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Skills from "./Skills";
import skills from "../../data/skills";

function renderSkills() {
  return render(
    <MemoryRouter>
      <Skills />
    </MemoryRouter>,
  );
}

describe("Skills page", () => {
  it("hiển thị đủ 4 nhóm kỹ năng: Giao Diện, Hệ Thống, Di Động, Công Cụ", () => {
    renderSkills();

    ["Giao Diện", "Hệ Thống", "Di Động", "Công Cụ"].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("hiển thị đủ mọi kỹ năng khai báo trong data/skills.js", () => {
    renderSkills();

    Object.values(skills)
      .flat()
      .forEach((skillName) => {
        expect(screen.getByText(skillName)).toBeInTheDocument();
      });
  });
});
