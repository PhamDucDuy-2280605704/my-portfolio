import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Button from "./Button";

describe("Button", () => {
  it("hiển thị đúng nội dung children", () => {
    render(<Button>Liên Hệ Với Mình</Button>);

    expect(screen.getByText("Liên Hệ Với Mình")).toBeInTheDocument();
  });

  it("mặc định dùng variant primary khi không truyền prop", () => {
    render(<Button>Tải CV</Button>);

    expect(screen.getByRole("button")).toHaveClass("btn-primary");
  });

  it("áp dụng đúng class khi truyền variant='outline'", () => {
    render(<Button variant="outline">Xem thêm</Button>);

    expect(screen.getByRole("button")).toHaveClass("btn-outline");
  });

  it("gọi onClick khi người dùng bấm vào nút", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Bấm vào đây</Button>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("dùng type='button' mặc định (không submit form ngoài ý muốn)", () => {
    render(<Button>Mặc định</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });
});
