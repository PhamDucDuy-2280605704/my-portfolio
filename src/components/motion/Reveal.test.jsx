import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import { ClipWords, StackedLines } from "./Reveal";

describe("Reveal", () => {
  it("ClipWords giữ nguyên văn bản cho trình đọc màn hình qua aria-label", () => {
    const { container } = render(<ClipWords text="Phạm Đức Duy" />);
    expect(container.firstChild).toHaveAttribute("aria-label", "Phạm Đức Duy");
    expect(container.querySelectorAll(".clip-in")).toHaveLength(3);
  });

  it("StackedLines tạo mỗi dòng 1 hộp clip với độ trễ tăng dần", () => {
    const { container } = render(<StackedLines lines={["A", "B", "C"]} stagger={100} baseDelay={50} />);
    const delays = [...container.querySelectorAll(".clip-in")].map((n) => n.style.transitionDelay);
    expect(delays).toEqual(["50ms", "150ms", "250ms"]);
  });
});
