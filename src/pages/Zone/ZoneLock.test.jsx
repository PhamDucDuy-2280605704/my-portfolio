import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import ZoneLock from "./ZoneLock";

// Bọc có state để kiểm tra giá trị thực sự đổi khi bấm
function Harness({ initial = "0000", onSubmit = () => {}, disabled = false }) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <output data-testid="value">{value}</output>
      <ZoneLock
        value={value}
        onChange={setValue}
        onSubmit={onSubmit}
        disabled={disabled}
        hint="5704"
      />
    </>
  );
}

const dial = (i) => document.querySelectorAll(".zl-dial")[i];
const radio = (i, n) => dial(i).querySelectorAll("input")[n];

describe("ZoneLock", () => {
  it("có 4 bánh, mỗi bánh 10 chữ số, hiện gợi ý và bắt đầu ở 0000", () => {
    render(<Harness />);
    expect(document.querySelectorAll(".zl-dial")).toHaveLength(4);
    expect(dial(0).querySelectorAll("input")).toHaveLength(10);
    expect(screen.getByText("5704")).toBeInTheDocument();
    expect(screen.getByTestId("value")).toHaveTextContent("0000");
  });

  it("bấm vào mặt số sẽ đổi chữ số của đúng bánh đó", () => {
    render(<Harness />);
    fireEvent.click(radio(1, 7));
    fireEvent.click(radio(3, 2));
    expect(screen.getByTestId("value")).toHaveTextContent("0702");
  });

  it("gõ số trên bàn phím: đặt chữ số, Backspace về 0, Enter gửi form", () => {
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);
    fireEvent.keyDown(dial(0), { key: "9" });
    expect(screen.getByTestId("value")).toHaveTextContent("9000");
    fireEvent.keyDown(dial(0), { key: "Backspace" });
    expect(screen.getByTestId("value")).toHaveTextContent("0000");
    fireEvent.keyDown(dial(2), { key: "Enter" });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("lăn chuột xuống tăng 1, lên giảm 1 (vòng 0 → 9)", () => {
    render(<Harness />);
    fireEvent.wheel(dial(0), { deltaY: 100 });
    expect(screen.getByTestId("value")).toHaveTextContent("1000");
    // wheel bị giới hạn tần suất -> đợi qua khoảng throttle
    vi.spyOn(performance, "now").mockReturnValue(performance.now() + 1000);
    fireEvent.wheel(dial(0), { deltaY: -100 });
    fireEvent.wheel(dial(0), { deltaY: -100 });
    vi.restoreAllMocks();
    expect(screen.getByTestId("value").textContent).toMatch(/^[0-9]000$/);
  });

  it("khi bị khoá thì mọi radio đều bị vô hiệu", () => {
    render(<Harness disabled />);
    expect(
      [...document.querySelectorAll(".zl-radio")].every((r) => r.disabled),
    ).toBe(true);
  });

  it("giá trị lạ / thiếu ký tự được coi là 0", () => {
    render(<Harness initial="7x" />);
    expect(dial(0).querySelector("input:checked")).toHaveAttribute(
      "aria-label",
      "7",
    );
    expect(dial(1).querySelector("input:checked")).toHaveAttribute(
      "aria-label",
      "0",
    );
  });
});
