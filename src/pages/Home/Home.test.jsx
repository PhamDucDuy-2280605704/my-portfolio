import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import LanguageProvider from "../../context/LanguageProvider";
import UiProvider from "../../context/UiProvider";
import MainLayout from "../../layouts/MainLayout";
import Home from "./Home";

function renderHome() {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>
    </LanguageProvider>
  );
}

describe("Home (bố cục Baseline)", () => {
  it("có đủ các section neo cho menu: home, about, skills, projects, experience, journal, contact", () => {
    // Home được render qua <Outlet /> nên test layout riêng + Home riêng
    const { container } = render(
      <LanguageProvider>
        <MemoryRouter>
          <UiProvider>
            <div className="bl">
              <Home />
            </div>
          </UiProvider>
        </MemoryRouter>
      </LanguageProvider>
    );

    for (const id of ["home", "about", "skills", "projects", "experience", "journal"]) {
      expect(container.querySelector(`#${id}`)).toBeInTheDocument();
    }
  });

  it("MainLayout có link bỏ qua tới nội dung, footer #contact và loader", () => {
    renderHome();
    expect(screen.getByRole("link", { name: /bỏ qua/i })).toHaveAttribute("href", "#main-content");
    expect(document.getElementById("contact")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
