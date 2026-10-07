import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LanguageProvider from "../../context/LanguageProvider";
import UiProvider from "../../context/UiProvider";
import useUi from "../../hooks/useUi";
import social from "../../data/social";
import ContactModal from "./ContactModal";

// Nút phụ để mở modal (ngoài đời nút "Liên hệ" ở Header/Footer gọi openContact).
function OpenButton() {
  const { openContact } = useUi();
  return (
    <button type="button" onClick={openContact}>
      mở liên hệ
    </button>
  );
}

// Mở modal và CHỜ modal tự focus ô tên (sau ~120ms) rồi mới trả về — nếu gõ
// ngay thì focus bị kéo về ô tên giữa chừng làm chữ nhảy sai ô (người dùng thật
// không gõ nhanh đến mức đó).
async function setup() {
  render(
    <LanguageProvider>
      <UiProvider>
        <OpenButton />
        <ContactModal />
      </UiProvider>
    </LanguageProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "mở liên hệ" }));
  await waitFor(() =>
    expect(screen.getByPlaceholderText("Tên của bạn")).toHaveFocus(),
  );
}

const modalRoot = () => document.querySelector(".modal-root");
const honeypot = () => document.querySelector('input[name="_gotcha"]');

// Điền 3 ô bắt buộc rồi bấm "Gửi Tin Nhắn"
async function fillAndSubmit(user) {
  await user.type(screen.getByPlaceholderText("Tên của bạn"), "Nguyễn Văn A");
  await user.type(screen.getByPlaceholderText("ban@email.com"), "a@example.com");
  await user.type(screen.getByPlaceholderText("Bạn muốn trao đổi điều gì?"), "Chào Duy!");
  await user.click(screen.getByRole("button", { name: "Gửi Tin Nhắn" }));
}

describe("ContactModal", () => {
  let fetchMock;

  beforeEach(() => {
    // Giả lập fetch để KHÔNG gọi Formspree thật khi chạy test
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("mở khi gọi openContact và đóng bằng phím Esc", async () => {
    await setup();
    expect(modalRoot()).toHaveAttribute("aria-hidden", "false");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(modalRoot()).toHaveAttribute("aria-hidden", "true");
  });

  it("gửi thành công: POST đúng endpoint Formspree kèm dữ liệu, rồi hiện thông báo thành công", async () => {
    fetchMock.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    await setup();

    await fillAndSubmit(user);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(social.formspree);
    expect(options.method).toBe("POST");
    expect(options.headers).toEqual({ Accept: "application/json" });
    // Dữ liệu gửi đi là FormData chứa đúng nội dung người dùng nhập
    expect(options.body.get("name")).toBe("Nguyễn Văn A");
    expect(options.body.get("email")).toBe("a@example.com");
    expect(options.body.get("message")).toBe("Chào Duy!");

    expect(await screen.findByText("Đã gửi thành công!")).toBeInTheDocument();
  });

  it("Formspree trả lỗi (response.ok = false): hiện thông báo lỗi, giữ nguyên form để thử lại", async () => {
    fetchMock.mockResolvedValue({ ok: false });
    const user = userEvent.setup();
    await setup();

    await fillAndSubmit(user);

    expect(await screen.findByRole("alert")).toHaveTextContent(/Gửi thất bại/);
    expect(screen.queryByText("Đã gửi thành công!")).not.toBeInTheDocument();
    // Nội dung đã nhập không bị mất
    expect(screen.getByPlaceholderText("Tên của bạn")).toHaveValue("Nguyễn Văn A");
  });

  it("mất mạng (fetch bị reject): hiện thông báo lỗi", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    const user = userEvent.setup();
    await setup();

    await fillAndSubmit(user);

    expect(await screen.findByRole("alert")).toHaveTextContent(/Gửi thất bại/);
  });

  it("đang gửi: nút đổi chữ và bị vô hiệu hoá để không gửi trùng", async () => {
    // Promise treo — giữ form ở trạng thái "đang gửi"
    fetchMock.mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    await setup();

    await fillAndSubmit(user);

    const sending = await screen.findByRole("button", { name: "Đang gửi..." });
    expect(sending).toBeDisabled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("honeypot bị điền (bot): không gọi Formspree và không hiện thành công", async () => {
    const user = userEvent.setup();
    await setup();

    await user.type(screen.getByPlaceholderText("Tên của bạn"), "Bot");
    await user.type(screen.getByPlaceholderText("ban@email.com"), "bot@example.com");
    await user.type(screen.getByPlaceholderText("Bạn muốn trao đổi điều gì?"), "spam");
    // Ô ẩn người thật không thấy — bot mới điền
    fireEvent.change(honeypot(), { target: { value: "http://spam.example" } });
    await user.click(screen.getByRole("button", { name: "Gửi Tin Nhắn" }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByText("Đã gửi thành công!")).not.toBeInTheDocument();
  });
});
