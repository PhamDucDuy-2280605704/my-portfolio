import { describe, it, expect, vi, afterEach } from "vitest";
import { render, act } from "@testing-library/react";

import useSpring from "./useSpring";

function Box({ onReady }) {
  const { ref, start } = useSpring({ opacity: 0, y: 20 });
  onReady(start);
  return <div ref={ref} data-testid="box" />;
}

afterEach(() => vi.unstubAllGlobals());

describe("useSpring", () => {
  it("áp trạng thái ban đầu lên style của phần tử", () => {
    const { getByTestId } = render(<Box onReady={() => {}} />);
    const el = getByTestId("box");
    expect(el.style.opacity).toBe("0");
    expect(el.style.transform).toContain("translate3d(0px,20px,0)");
  });

  it("bỏ qua animation và nhảy thẳng tới đích khi bật prefers-reduced-motion", () => {
    // jsdom không có matchMedia -> dựng bản giả chỉ báo "reduce" là true
    vi.stubGlobal("matchMedia", (q) => ({
      matches: q.includes("prefers-reduced-motion"),
      addEventListener: () => {},
      removeEventListener: () => {},
    }));

    let start;
    const { getByTestId } = render(<Box onReady={(s) => (start = s)} />);
    act(() => start({ opacity: 1, y: 0 }));

    const el = getByTestId("box");
    expect(el.style.opacity).toBe("1");
    expect(el.style.transform).toBe("none");
  });
});
