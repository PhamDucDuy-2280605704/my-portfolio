import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";

import Inview from "./Inview";

// IntersectionObserver giả: lưu lại các instance để test tự "kích" việc phần tử vào viewport.
class MockObserver {
  static instances = [];
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.observe = vi.fn();
    this.disconnect = vi.fn();
    MockObserver.instances.push(this);
  }
  // Giả lập phần tử vào / chưa vào viewport
  trigger(isIntersecting) {
    this.callback([{ isIntersecting }]);
  }
}

const latestObserver = () => MockObserver.instances.at(-1);

describe("Inview", () => {
  beforeEach(() => {
    MockObserver.instances = [];
    // Bật prefers-reduced-motion để spring nhảy THẲNG tới đích (không phụ thuộc rAF)
    // -> kiểm tra được style ngay sau khi kích.
    vi.stubGlobal("matchMedia", (q) => ({
      matches: q.includes("prefers-reduced-motion"),
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("ẩn sẵn (mờ + lệch xuống) cho tới khi vào viewport, rồi hiện đúng 1 lần và ngừng quan sát", () => {
    vi.stubGlobal("IntersectionObserver", MockObserver);
    render(<Inview data-testid="box">nội dung</Inview>);
    const el = screen.getByTestId("box");

    // Trạng thái ban đầu: ẩn
    expect(el.style.opacity).toBe("0");
    expect(el.style.transform).toContain("translate3d(0px,32px,0)");
    expect(latestObserver().observe).toHaveBeenCalledWith(el);
    // Cùng cấu hình quan sát như useInViewOnce: lề đáy -10%
    expect(latestObserver().options).toEqual({ threshold: 0, rootMargin: "0px 0px -10% 0px" });

    // Chưa giao nhau -> vẫn ẩn
    act(() => latestObserver().trigger(false));
    expect(el.style.opacity).toBe("0");

    // Vào viewport -> hiện
    act(() => latestObserver().trigger(true));
    expect(el.style.opacity).toBe("1");
    expect(el.style.transform).toBe("none");
    expect(latestObserver().disconnect).toHaveBeenCalled();
  });

  it("enabled=false thì chưa quan sát; khi enabled=true mới bắt đầu quan sát và hiện", () => {
    vi.stubGlobal("IntersectionObserver", MockObserver);
    const { rerender } = render(
      <Inview data-testid="box" enabled={false}>
        nội dung
      </Inview>,
    );
    expect(MockObserver.instances.length).toBe(0);
    expect(screen.getByTestId("box").style.opacity).toBe("0");

    rerender(
      <Inview data-testid="box" enabled>
        nội dung
      </Inview>,
    );
    expect(MockObserver.instances.length).toBe(1);

    act(() => latestObserver().trigger(true));
    expect(screen.getByTestId("box").style.opacity).toBe("1");
  });

  it("delay: chỉ hiện sau khoảng trễ kể từ lúc vào viewport", () => {
    vi.useFakeTimers();
    vi.stubGlobal("IntersectionObserver", MockObserver);
    render(
      <Inview data-testid="box" delay={300}>
        nội dung
      </Inview>,
    );
    const el = screen.getByTestId("box");

    act(() => latestObserver().trigger(true));
    expect(el.style.opacity).toBe("0");

    act(() => vi.advanceTimersByTime(299));
    expect(el.style.opacity).toBe("0");

    act(() => vi.advanceTimersByTime(1));
    expect(el.style.opacity).toBe("1");
  });

  it("nhận from/to riêng và render đúng thẻ `as` + className", () => {
    vi.stubGlobal("IntersectionObserver", MockObserver);
    render(
      <Inview
        as="li"
        className="muc"
        from={{ opacity: 0, scale: 0.5 }}
        to={{ opacity: 1, scale: 1 }}
        data-testid="box"
      >
        nội dung
      </Inview>,
    );
    const el = screen.getByTestId("box");
    expect(el.tagName).toBe("LI");
    expect(el).toHaveClass("muc");
    expect(el.style.transform).toContain("scale(0.5)");

    act(() => latestObserver().trigger(true));
    expect(el.style.transform).toBe("none");
  });

  it("trình duyệt không hỗ trợ IntersectionObserver: hiện ngay, không treo ở trạng thái ẩn", () => {
    // Không stub IntersectionObserver -> jsdom không có
    render(<Inview data-testid="box">nội dung</Inview>);
    expect(screen.getByTestId("box").style.opacity).toBe("1");
  });
});
