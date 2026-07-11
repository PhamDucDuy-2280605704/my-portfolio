import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock toàn bộ data/projects.js để giả lập trường hợp 1 nhóm chưa có dự án nào —
// tách file riêng (không chung với Projects.test.jsx) vì vi.mock áp dụng cho
// TOÀN BỘ file test, sẽ ảnh hưởng tới các test khác đang dùng dữ liệu thật.
vi.mock("../../data/projects", () => ({
  default: {
    completed: [],
    inProgress: [],
  },
}));

// Import Projects SAU khi đã mock, để component nhận đúng data giả.
const { default: Projects } = await import("./Projects");

describe("Projects page (dữ liệu rỗng)", () => {
  it("hiện trạng thái rỗng thay vì để trống trơn khi nhóm chưa có dự án nào", () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );

    expect(screen.getByText("Chưa có dự án nào ở mục này.")).toBeInTheDocument();
  });
});
