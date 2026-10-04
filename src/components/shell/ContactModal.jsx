import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import useLanguage from "../../hooks/useLanguage";
import useToggleSpring from "../../hooks/useToggleSpring";
import useUi from "../../hooks/useUi";
import landing from "../../data/landing";
import social from "../../data/social";
import { lockScroll, unlockScroll } from "../../lib/lenis";
import { playUiSound } from "../../utils/uiSound";
import Eyebrow from "../ui/Eyebrow";
import { CheckIcon } from "../ui/Icons";
import { StackedLines } from "../motion/Reveal";
import { CloseButton } from "./MenuOverlay";
import "./ContactModal.css";

// Trạng thái gửi form: idle -> sending -> success | error
const STATUS = {
  IDLE: "idle",
  SENDING: "sending",
  SUCCESS: "success",
  ERROR: "error",
};

// Modal liên hệ (portal ở cấp body, khoá cuộn khi mở). Form gửi THẬT qua
// Formspree (endpoint ở data/social.js) bằng fetch + Accept: application/json
// nên không rời trang. Giữ nguyên honeypot chống spam của form cũ.
function ContactModal() {
  const { contactOpen, contactOpenCount, closeContact } = useUi();
  const { t, tr } = useLanguage();
  const [status, setStatus] = useState(STATUS.IDLE);
  const nameRef = useRef(null);
  const formRef = useRef(null);

  const backdropRef = useToggleSpring(
    contactOpen,
    { opacity: 0 },
    { opacity: 1 },
    { tension: 240, friction: 30 },
  );
  const panelRef = useToggleSpring(
    contactOpen,
    { opacity: 0, y: 28, scale: 0.96 },
    { opacity: 1, y: 0, scale: 1 },
    { tension: 240, friction: 26 },
  );

  // Mở: khoá cuộn, đếm lượt mở (để phát lại reveal tiêu đề), focus ô tên sau ~120ms,
  // Esc đóng. Đóng: trả khoá, reset form sau ~350ms (chờ animation đóng xong).
  useEffect(() => {
    if (!contactOpen) return undefined;

    lockScroll();
    const focusTimer = setTimeout(() => nameRef.current?.focus(), 120);
    const onKey = (e) => e.key === "Escape" && closeContact();
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [contactOpen, closeContact]);

  useEffect(() => {
    if (contactOpen) return undefined;
    const id = setTimeout(() => {
      setStatus(STATUS.IDLE);
      formRef.current?.reset();
    }, 350);
    return () => clearTimeout(id);
  }, [contactOpen]);

  async function handleSubmit(e) {
    e.preventDefault();
    playUiSound("action");

    const form = e.target;
    const data = new FormData(form);

    // Honeypot: trường ẩn "_gotcha" — bot điền, người thật không thấy.
    if (data.get("_gotcha")) {
      form.reset();
      return;
    }

    setStatus(STATUS.SENDING);
    try {
      const response = await fetch(social.formspree, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      setStatus(response.ok ? STATUS.SUCCESS : STATUS.ERROR);
      if (response.ok) form.reset();
    } catch {
      setStatus(STATUS.ERROR);
    }
  }

  return createPortal(
    <div
      className="bl bl-portal modal-root"
      style={{ pointerEvents: contactOpen ? "auto" : "none" }}
      inert={!contactOpen}
      aria-hidden={!contactOpen}
    >
      <div
        ref={backdropRef}
        className="modal-backdrop"
        onClick={closeContact}
      />

      <div
        ref={panelRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <div className="modal-head">
          <div>
            <Eyebrow>{tr(landing.modal.eyebrow)}</Eyebrow>
            <StackedLines
              key={contactOpenCount}
              as="h2"
              id="contact-modal-title"
              className="modal-title"
              lines={tr(landing.modal.title)}
              stagger={90}
              duration={800}
              enabled={contactOpen}
            />
          </div>
          <CloseButton
            className="modal-close"
            label={t("closeLabel")}
            onClick={closeContact}
          />
        </div>

        {status === STATUS.SUCCESS ? (
          <div className="modal-success" role="status" aria-live="polite">
            <span className="modal-success-icon">
              <CheckIcon />
            </span>
            <h3>{t("contactFormSuccessTitle")}</h3>
            <p>{t("contactFormSuccessBody")}</p>
            <button
              type="button"
              className="pill pill--solid"
              onClick={closeContact}
            >
              {tr(landing.modal.done)}
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            className="modal-form"
            onSubmit={handleSubmit}
            noValidate={false}
          >
            <input
              type="hidden"
              name="_subject"
              value={t("contactFormSubjectValue")}
            />
            <input
              type="text"
              name="_gotcha"
              className="modal-honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <label className="modal-field">
              <span>{t("contactFormName")}</span>
              <input
                ref={nameRef}
                name="name"
                type="text"
                placeholder={t("contactFormNamePlaceholder")}
                required
              />
            </label>

            <label className="modal-field">
              <span>{t("contactFormEmail")}</span>
              <input
                name="email"
                type="email"
                placeholder="ban@email.com"
                required
              />
            </label>

            <label className="modal-field">
              <span>{t("contactFormMessage")}</span>
              <textarea
                name="message"
                rows={3}
                placeholder={t("contactFormMessagePlaceholder")}
                required
              />
            </label>

            {status === STATUS.ERROR && (
              <p className="modal-error" role="alert">
                {t("contactFormError")}
              </p>
            )}

            <button
              type="submit"
              className="pill pill--solid modal-submit"
              disabled={status === STATUS.SENDING}
            >
              {status === STATUS.SENDING
                ? t("contactFormSending")
                : t("contactFormSubmit")}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default ContactModal;
