import { describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

import ContactForm from "./ContactForm";

// Dọn sạch thẻ <script> Tally sau mỗi test, vì ContactForm tự thêm nó vào
// document.body (nằm ngoài phạm vi mà cleanup() của Testing Library quản lý),
// nếu không các test sau sẽ thấy "script đã tồn tại" một cách sai lệch.
afterEach(() => {
  document
    .querySelectorAll(`script[src="https://tally.so/widgets/embed.js"]`)
    .forEach((el) => el.remove());
  delete window.Tally;
});

describe("ContactForm (Tally embed)", () => {
  it("hiện tiêu đề và mô tả tiếng Việt phía trên iframe", () => {
    render(<ContactForm />);

    expect(screen.getByText("Gửi Tin Nhắn Trực Tiếp")).toBeInTheDocument();
    expect(
      screen.getByText("Điền vài thông tin bên dưới, mình sẽ đọc và phản hồi sớm nhất có thể."),
    ).toBeInTheDocument();
  });

  it("render đúng 1 iframe với data-tally-src trỏ tới đúng form Tally", () => {
    const { container } = render(<ContactForm />);

    const iframe = container.querySelector("iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe.getAttribute("data-tally-src")).toContain("https://tally.so/embed/b5y9DZ");
    expect(iframe).toHaveAttribute("title", "Form Liên Hệ");
  });

  it("tự thêm script embed.js của Tally vào trang khi mount lần đầu", () => {
    render(<ContactForm />);

    const script = document.querySelector('script[src="https://tally.so/widgets/embed.js"]');
    expect(script).not.toBeNull();
  });

  it("không thêm script trùng lặp nếu mount lần thứ 2 (script đã có sẵn)", () => {
    const { unmount } = render(<ContactForm />);
    unmount();

    render(<ContactForm />);

    const scripts = document.querySelectorAll('script[src="https://tally.so/widgets/embed.js"]');
    expect(scripts.length).toBe(1);
  });

  it("nếu window.Tally đã tồn tại sẵn (mount lần 2), gọi ngay Tally.loadEmbeds()", () => {
    let loadEmbedsCalled = false;
    window.Tally = { loadEmbeds: () => { loadEmbedsCalled = true; } };

    render(<ContactForm />);

    expect(loadEmbedsCalled).toBe(true);
  });
});
