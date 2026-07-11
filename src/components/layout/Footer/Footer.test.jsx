import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import Footer from "./Footer";

describe("Footer", () => {
  it("hiển thị đúng nội dung bản quyền", () => {
    render(<Footer />);

    expect(screen.getByText(/Phạm Đức Duy/)).toBeInTheDocument();
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });
});
