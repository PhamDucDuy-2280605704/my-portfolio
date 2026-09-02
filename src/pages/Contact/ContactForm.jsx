import { useState } from "react";
import { FaPaperPlane, FaCheckCircle } from "react-icons/fa";

import "./ContactForm.css";

import social from "../../data/social";
import useLanguage from "../../hooks/useLanguage";
import { playUiSound } from "../../utils/uiSound";

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
  const { t } = useLanguage();
  const [status, setStatus] = useState(STATUS.IDLE);

  async function handleSubmit(e) {
    e.preventDefault();
    playUiSound("action");

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
        <h3>{t("contactFormSuccessTitle")}</h3>
        <p>{t("contactFormSuccessBody")}</p>

        <button
          type="button"
          className="contact-form-reset"
          onClick={() => {
            playUiSound("action");
            setStatus(STATUS.IDLE);
          }}
        >
          {t("contactFormSendAnother")}
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
        <h3>{t("contactFormTitle")}</h3>
        <p>{t("contactFormSubtitle")}</p>
      </div>

      {/* Hidden field: đặt tiêu đề email rõ ràng thay vì Formspree tự đặt
          tiêu đề chung chung mặc định. */}
      <input
        type="hidden"
        name="_subject"
        value={t("contactFormSubjectValue")}
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
          <label htmlFor="name">{t("contactFormName")}</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder={t("contactFormNamePlaceholder")}
            required
          />
        </div>

        <div className="contact-form-field">
          <label htmlFor="email">{t("contactFormEmail")}</label>
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
        <label htmlFor="message">{t("contactFormMessage")}</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={t("contactFormMessagePlaceholder")}
          required
        />
      </div>

      {status === STATUS.ERROR && (
        <p
          className="contact-form-error"
          role="alert"
        >
          {t("contactFormError")}
        </p>
      )}

      <button
        type="submit"
        className="contact-form-submit"
        disabled={status === STATUS.SENDING}
      >
        {status === STATUS.SENDING ? t("contactFormSending") : (
          <>
            <FaPaperPlane /> {t("contactFormSubmit")}
          </>
        )}
      </button>

      <p className="contact-form-note">{t("contactFormNote")}</p>
    </form>
  );
}

export default ContactForm;
