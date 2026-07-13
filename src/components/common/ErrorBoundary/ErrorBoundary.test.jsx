import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

import ErrorBoundary from "./ErrorBoundary";

// Component "quả bom" — luôn throw lỗi khi render, dùng để giả lập 1 bug thật.
function Bomb() {
  throw new Error("Lỗi giả lập để test ErrorBoundary");
}

function SafeChild() {
  return <p>Nội dung bình thường</p>;
}

// React (và console.error mặc định) sẽ log rất nhiều dòng lỗi khi 1 component
// throw, kể cả khi ErrorBoundary đã bắt được — che tạm console.error trong
// lúc test để output gọn, không phải vì lỗi thật.
beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  console.error.mockRestore();
});

describe("ErrorBoundary", () => {
  it("render bình thường children nếu không có lỗi", () => {
    render(
      <ErrorBoundary>
        <SafeChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Nội dung bình thường")).toBeInTheDocument();
  });

  it("hiện màn hình lỗi thân thiện nếu component con throw lỗi, không để trắng trang", () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );

    expect(screen.getByText("😵 Đã có lỗi xảy ra")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tải Lại Trang" })).toBeInTheDocument();
  });
});
