import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

import SplashScreen from "./SplashScreen";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("SplashScreen", () => {
  it("hiển thị tiêu đề chào mừng và tên đầy đủ từ data/profile.js", () => {
    render(<SplashScreen onFinish={() => {}} />);

    expect(screen.getByText("Chào Mừng")).toBeInTheDocument();
    expect(screen.getByText(/đến với thế giới của/)).toBeInTheDocument();
  });

  it("gọi onFinish sau khi DURATION (5s) + 500ms hiệu ứng mờ dần kết thúc", () => {
    const onFinish = vi.fn();
    render(<SplashScreen onFinish={onFinish} />);

    expect(onFinish).not.toHaveBeenCalled();

    // Chưa đủ thời gian -> chưa gọi onFinish.
    vi.advanceTimersByTime(5000);
    expect(onFinish).not.toHaveBeenCalled();

    // Đủ 5000ms + 500ms mờ dần -> onFinish được gọi đúng 1 lần.
    vi.advanceTimersByTime(500);
    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
