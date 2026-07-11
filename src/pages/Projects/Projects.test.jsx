import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Projects from "./Projects";
import projects from "../../data/projects";

function renderProjects() {
  return render(
    <MemoryRouter>
      <Projects />
    </MemoryRouter>,
  );
}

describe("Projects page", () => {
  it("mặc định hiển thị tab 'Đã hoàn thành' và đúng dự án của nhóm đó", () => {
    renderProjects();

    expect(screen.getByRole("button", { name: /Đã hoàn thành/ })).toHaveClass("active");
    expect(screen.getByText("Portfolio Cá Nhân")).toBeInTheDocument();
    expect(screen.queryByText("Dự án mẫu 3")).not.toBeInTheDocument();
  });

  it("hiện đúng số lượng dự án trên mỗi tab", () => {
    renderProjects();

    expect(screen.getByRole("button", { name: /Đã hoàn thành/ })).toHaveTextContent(
      String(projects.completed.length),
    );
    expect(screen.getByRole("button", { name: /Đang phát triển/ })).toHaveTextContent(
      String(projects.inProgress.length),
    );
  });

  it("bấm sang tab 'Đang phát triển' thì chỉ hiện dự án của nhóm đó", async () => {
    const user = userEvent.setup();
    renderProjects();

    await user.click(screen.getByRole("button", { name: /Đang phát triển/ }));

    expect(screen.getByText("Dự án mẫu 3")).toBeInTheDocument();
    expect(screen.queryByText("Portfolio Cá Nhân")).not.toBeInTheDocument();
  });

  it("dự án chưa có demo/source thì hiện nhãn 'sắp có', không phải link bấm được", () => {
    renderProjects();

    // Portfolio Cá Nhân có đủ demo + source -> phải là link thật
    expect(screen.getByRole("link", { name: /Xem trực tiếp/ })).toHaveAttribute(
      "href",
      projects.completed[0].demo,
    );
    expect(screen.getByRole("link", { name: /Mã nguồn/ })).toHaveAttribute(
      "href",
      projects.completed[0].source,
    );
  });
});
