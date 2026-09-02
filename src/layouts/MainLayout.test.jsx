import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./MainLayout";
import renderWithLanguage from "../test/renderWithLanguage";

// Trang con giả để kiểm tra <Outlet /> có render đúng nội dung route con không.
function FakePage() {
  return <p>Nội dung trang con</p>;
}

describe("MainLayout", () => {
  it("render Navbar, nội dung route con (qua Outlet), và Footer cùng lúc", () => {
    renderWithLanguage(
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

    // BottomDock (menu điều hướng chính giờ nằm ở đây): kiểm tra 1 mục bất kỳ có mặt
    expect(screen.getByLabelText("Trang Chủ")).toBeInTheDocument();

    // Outlet: nội dung trang con phải render đúng vị trí
    expect(screen.getByText("Nội dung trang con")).toBeInTheDocument();

    // Footer
    expect(screen.getByText(/OPSEC_ADMIN/)).toBeInTheDocument();
  });

  it("có link 'Bỏ qua đến nội dung chính' trỏ tới #main-content (accessibility)", () => {
    renderWithLanguage(
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
