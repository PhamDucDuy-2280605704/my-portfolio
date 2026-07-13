import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import PageLoader from "./PageLoader";

describe("PageLoader", () => {
  it("hiện với role='status' để trình đọc màn hình nhận biết đang tải", () => {
    render(<PageLoader />);

    expect(screen.getByRole("status", { name: "Đang tải trang" })).toBeInTheDocument();
  });
});
