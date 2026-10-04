import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";

import LanguageProvider from "../../context/LanguageProvider";
import UiProvider from "../../context/UiProvider";
import Loader from "./Loader";

function setup() {
  return render(
    <LanguageProvider>
      <UiProvider>
        <Loader />
      </UiProvider>
    </LanguageProvider>
  );
}

afterEach(() => {
  vi.useRealTimers();
  document.documentElement.classList.remove("is-scroll-locked");
});

describe("Loader", () => {
  it("hiển thị vòng 12 dot cùng nhãn, khoá cuộn trong lúc tải", () => {
    setup();
    const status = screen.getByRole("status");
    expect(status.querySelectorAll(".pl__dot")).toHaveLength(12);
    expect(status.querySelector(".pl__text")).toHaveTextContent("…");
    expect(document.documentElement).toHaveClass("is-scroll-locked");
  });

  it("tự kết thúc: trượt lên, mở khoá cuộn rồi gỡ khỏi DOM", () => {
    vi.useFakeTimers();
    setup();

    // jsdom đã "complete" nên đếm MIN_VISIBLE_MS (2000ms) rồi kết thúc
    act(() => vi.advanceTimersByTime(2100));
    expect(screen.getByRole("status")).toHaveClass("loader--exit");
    expect(document.documentElement).not.toHaveClass("is-scroll-locked");

    act(() => vi.advanceTimersByTime(900)); // hết EXIT_MS
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
