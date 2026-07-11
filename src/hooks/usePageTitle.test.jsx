import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import usePageTitle from "./usePageTitle";

// Component nhỏ chỉ để "mượn" chỗ gọi hook (hook không thể gọi trực tiếp ngoài component).
function TestComponent({ title }) {
  usePageTitle(title);
  return null;
}

describe("usePageTitle", () => {
  it("đặt document.title theo giá trị truyền vào", () => {
    render(<TestComponent title="Kỹ Năng | Phạm Đức Duy" />);

    expect(document.title).toBe("Kỹ Năng | Phạm Đức Duy");
  });

  it("khôi phục lại tiêu đề trước đó khi component unmount", () => {
    document.title = "Tiêu đề ban đầu";

    const { unmount } = render(<TestComponent title="Trang tạm thời" />);
    expect(document.title).toBe("Trang tạm thời");

    unmount();
    expect(document.title).toBe("Tiêu đề ban đầu");
  });

  it("cập nhật lại document.title khi prop title thay đổi", () => {
    const { rerender } = render(<TestComponent title="Trang A" />);
    expect(document.title).toBe("Trang A");

    rerender(<TestComponent title="Trang B" />);
    expect(document.title).toBe("Trang B");
  });
});
