import { useState } from "react";
import { FaPaperPlane, FaCheckCircle } from "react-icons/fa";

import "./ContactForm.css";

import social from "../../data/social";

// Trạng thái gửi form: idle (chưa gửi) -> sending (đang gửi) -> success | error.
const STATUS = {
  IDLE: "idle",
  SENDING: "sending",
  SUCCESS: "success",
  ERROR: "error",
};

// Form liên hệ gửi thẳng qua Formspree (https://formspree.io) — dịch vụ nhận
// submit form từ site tĩnh (không cần tự viết backend) rồi chuyển tiếp về email.
// Endpoint thật lấy từ social.formspree (data/social.js).
function ContactForm() {
  const [status, setStatus] = useState(STATUS.IDLE);

  async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);

    // Honeypot chống spam: trường "_gotcha" ẩn khỏi mắt người dùng thật (CSS
    // display:none) nhưng bot điền form tự động thường điền vào MỌI input nó
    // thấy trong DOM, kể cả trường ẩn. Nếu có giá trị -> chắc chắn là bot,
    // Formspree sẽ tự động huỷ submit này (không tính vào số lượt gửi free).
    if (data.get("_gotcha")) {
      form.reset();
      return;
    }

    setStatus(STATUS.SENDING);

    try {
      const response = await fetch(social.formspree, {
        method: "POST",
        body: data,
        // Header Accept báo cho Formspree trả JSON thay vì redirect sang trang khác,
        // để mình tự hiện thông báo thành công ngay trên trang mà không rời trang.
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus(STATUS.SUCCESS);
        form.reset();
      } else {
        setStatus(STATUS.ERROR);
      }
    } catch {
      setStatus(STATUS.ERROR);
    }
  }

  // Sau khi gửi thành công, hiện thông báo cảm ơn thay vì để form trống trơ.
  if (status === STATUS.SUCCESS) {
    return (
      <div
        className="contact-form-success"
        role="status"
        aria-live="polite"
      >
        <FaCheckCircle />
        <h3>Đã gửi thành công!</h3>
        <p>Cảm ơn bạn đã nhắn tin, mình sẽ phản hồi sớm nhất có thể.</p>

        <button
          type="button"
          className="contact-form-reset"
          onClick={() => setStatus(STATUS.IDLE)}
        >
          Gửi tin nhắn khác
        </button>
      </div>
    );
  }

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
    >
      <div className="contact-form-header">
        <h3>Gửi Tin Nhắn Trực Tiếp</h3>
        <p>Điền vài thông tin bên dưới, mình sẽ đọc và phản hồi sớm nhất có thể.</p>
      </div>

      {/* Hidden field: đặt tiêu đề email rõ ràng thay vì Formspree tự đặt
          tiêu đề chung chung mặc định. */}
      <input
        type="hidden"
        name="_subject"
        value="📬 Tin nhắn mới từ Portfolio"
      />

      {/* Honeypot chống spam bot — xem giải thích ở handleSubmit(). Ẩn hoàn
          toàn khỏi người dùng thật bằng CSS (không dùng type="hidden" vì
          Formspree khuyến nghị dùng input text ẩn qua CSS để bot khó nhận
          diện và bỏ qua hơn so với type="hidden"). */}
      <input
        type="text"
        name="_gotcha"
        className="contact-form-honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="contact-form-row">
        <div className="contact-form-field">
          <label htmlFor="name">Họ tên</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Tên của bạn"
            required
          />
        </div>

        <div className="contact-form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="ban@email.com"
            required
          />
        </div>
      </div>

      <div className="contact-form-field">
        <label htmlFor="message">Lời nhắn</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Bạn muốn trao đổi điều gì?"
          required
        />
      </div>

      {status === STATUS.ERROR && (
        <p
          className="contact-form-error"
          role="alert"
        >
          Gửi thất bại — có thể do mất kết nối mạng. Bạn thử lại hoặc liên hệ qua các kênh phía trên nhé.
        </p>
      )}

      <button
        type="submit"
        className="contact-form-submit"
        disabled={status === STATUS.SENDING}
      >
        {status === STATUS.SENDING ? "Đang gửi..." : (
          <>
            <FaPaperPlane /> Gửi Tin Nhắn
          </>
        )}
      </button>

      <p className="contact-form-note">
        ✉️ Tin nhắn được gửi thẳng đến email của mình qua Formspree — không lưu trữ hay chia sẻ cho bên thứ ba nào khác.
      </p>
    </form>
  );
}

export default ContactForm;
