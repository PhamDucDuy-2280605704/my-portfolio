import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./MainLayout";

// Trang con giả để kiểm tra <Outlet /> có render đúng nội dung route con không.
function FakePage() {
  return <p>Nội dung trang con</p>;
}

describe("MainLayout", () => {
  it("render Navbar, nội dung route con (qua Outlet), và Footer cùng lúc", () => {
    render(
      <MemoryRouter initialEntries={["/fake"]}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route
              path="/fake"
              element={<FakePage />}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    // Navbar: kiểm tra 1 mục menu bất kỳ có mặt
    expect(screen.getByText("Trang Chủ")).toBeInTheDocument();

    // Outlet: nội dung trang con phải render đúng vị trí
    expect(screen.getByText("Nội dung trang con")).toBeInTheDocument();

    // Footer
    expect(screen.getByText(/Bảo lưu mọi quyền/)).toBeInTheDocument();
  });

  it("có link 'Bỏ qua đến nội dung chính' trỏ tới #main-content (accessibility)", () => {
    render(
      <MemoryRouter initialEntries={["/fake"]}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route
              path="/fake"
              element={<FakePage />}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    const skipLink = screen.getByText("Bỏ qua đến nội dung chính");
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });
});
