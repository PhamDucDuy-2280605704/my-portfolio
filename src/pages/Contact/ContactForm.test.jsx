import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactForm from "./ContactForm";

// Điền nhanh 3 trường bắt buộc rồi bấm nút Gửi.
async function fillAndSubmit(user) {
  await user.type(screen.getByLabelText("Họ tên"), "Nguyễn Văn A");
  await user.type(screen.getByLabelText("Email"), "test@example.com");
  await user.type(screen.getByLabelText("Lời nhắn"), "Xin chào, mình muốn trao đổi công việc.");
  await user.click(screen.getByRole("button", { name: /Gửi Tin Nhắn/ }));
}

describe("ContactForm", () => {
  beforeEach(() => {
    // Giả lập fetch toàn cục — test không được gọi ra Formspree thật.
    globalThis.fetch = vi.fn();
  });

  it("hiện thông báo thành công sau khi Formspree phản hồi ok", async () => {
    globalThis.fetch.mockResolvedValueOnce({ ok: true });
    const user = userEvent.setup();

    render(<ContactForm />);
    await fillAndSubmit(user);

    await waitFor(() => {
      expect(screen.getByText("Đã gửi thành công!")).toBeInTheDocument();
    });
  });

  it("hiện thông báo lỗi nếu Formspree trả về response không ok", async () => {
    globalThis.fetch.mockResolvedValueOnce({ ok: false });
    const user = userEvent.setup();

    render(<ContactForm />);
    await fillAndSubmit(user);

    await waitFor(() => {
      expect(screen.getByText(/Gửi thất bại/)).toBeInTheDocument();
    });
  });

  it("hiện thông báo lỗi nếu fetch bị reject (mất mạng...)", async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error("Network error"));
    const user = userEvent.setup();

    render(<ContactForm />);
    await fillAndSubmit(user);

    await waitFor(() => {
      expect(screen.getByText(/Gửi thất bại/)).toBeInTheDocument();
    });
  });

  it("bấm 'Gửi tin nhắn khác' sau khi thành công sẽ quay lại form trống", async () => {
    globalThis.fetch.mockResolvedValueOnce({ ok: true });
    const user = userEvent.setup();

    render(<ContactForm />);
    await fillAndSubmit(user);

    await waitFor(() => {
      expect(screen.getByText("Đã gửi thành công!")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Gửi tin nhắn khác"));

    expect(screen.getByLabelText("Họ tên")).toBeInTheDocument();
  });
});
