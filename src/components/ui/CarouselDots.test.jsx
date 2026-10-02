import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import CarouselDots from "./CarouselDots";

describe("CarouselDots", () => {
  it("đánh dấu chấm đang chọn bằng aria-current và gọi onSelect khi bấm", () => {
    const onSelect = vi.fn();
    render(<CarouselDots count={3} active={1} onSelect={onSelect} label="dots" />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    expect(buttons[1]).toHaveAttribute("aria-current", "true");
    expect(buttons[0]).not.toHaveAttribute("aria-current");

    fireEvent.click(buttons[2]);
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});
