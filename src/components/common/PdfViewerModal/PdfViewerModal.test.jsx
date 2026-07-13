import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PdfViewerModal from "./PdfViewerModal";

describe("PdfViewerModal", () => {
  it("hiện iframe với đúng src và title được truyền vào", () => {
    render(
      <PdfViewerModal
        src="/fake.pdf"
        title="CV thử nghiệm"
        onClose={() => {}}
      />,
    );

    const iframe = screen.getByTitle("CV thử nghiệm");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", "/fake.pdf");
  });

  it("gọi onClose khi bấm nút Đóng", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <PdfViewerModal
        src="/fake.pdf"
        title="CV thử nghiệm"
        onClose={onClose}
      />,
    );

    await user.click(screen.getByLabelText("Đóng"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("gọi onClose khi bấm ra ngoài panel (nền overlay)", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    const { container } = render(
      <PdfViewerModal
        src="/fake.pdf"
        title="CV thử nghiệm"
        onClose={onClose}
      />,
    );

    await user.click(container.querySelector(".pdf-modal"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("KHÔNG gọi onClose khi bấm bên trong panel (không lan ra nền)", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <PdfViewerModal
        src="/fake.pdf"
        title="CV thử nghiệm"
        onClose={onClose}
      />,
    );

    await user.click(screen.getByText("CV thử nghiệm"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("gọi onClose khi nhấn phím Esc", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <PdfViewerModal
        src="/fake.pdf"
        title="CV thử nghiệm"
        onClose={onClose}
      />,
    );

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
