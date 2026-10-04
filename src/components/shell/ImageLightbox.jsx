import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import useLanguage from "../../hooks/useLanguage";
import useToggleSpring from "../../hooks/useToggleSpring";
import { lockScroll, unlockScroll } from "../../lib/lenis";
import { CloseButton } from "./MenuOverlay";
import "./ImageLightbox.css";

// Ảnh nhỏ bấm để phóng to ra giữa màn hình (lightbox) — dùng cho avatar và logo ở header.
//   src / alt   : ảnh hiển thị (cả bản thu nhỏ lẫn bản phóng to)
//   caption     : chú thích dưới ảnh phóng to
//   label       : nhãn đọc màn hình cho nút mở (VD "Phóng to ảnh đại diện")
//   className   : class của nút mở (quyết định hình dạng bản thu nhỏ: tròn, chữ nhật...)
//   wide        : ảnh ngang (logo) -> cho khung phóng to rộng hơn
// - Render qua portal ở cấp body, khoá cuộn khi mở (dùng chung bộ đếm khoá với menu/modal)
// - Đóng bằng: Esc, bấm nền tối, hoặc nút X; focus được trả lại nút mở sau khi đóng
function ImageLightbox({
  src,
  alt = "",
  caption,
  label,
  className = "",
  wide = false,
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const wasOpen = useRef(false);

  const backdropRef = useToggleSpring(
    open,
    { opacity: 0 },
    { opacity: 1 },
    { tension: 240, friction: 30 },
  );
  const panelRef = useToggleSpring(
    open,
    { opacity: 0, y: 24, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1 },
    { tension: 230, friction: 24 },
  );

  useEffect(() => {
    if (!open) return undefined;
    lockScroll();
    wasOpen.current = true;
    const focusTimer = setTimeout(
      () => closeRef.current?.querySelector("button, [type=button]")?.focus?.(),
      80,
    );
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [open]);

  // Đóng xong thì trả focus về nút avatar (hỗ trợ bàn phím)
  useEffect(() => {
    if (!open && wasOpen.current) {
      wasOpen.current = false;
      triggerRef.current?.focus();
    }
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`zoom-trigger ${className}`.trim()}
        aria-label={label}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <img src={src} alt="" decoding="async" />
      </button>

      {createPortal(
        <div
          className="bl bl-portal lightbox-root"
          style={{ pointerEvents: open ? "auto" : "none" }}
          inert={!open}
          aria-hidden={!open}
        >
          <div
            ref={backdropRef}
            className="lightbox-backdrop"
            onClick={() => setOpen(false)}
          />

          <figure
            ref={panelRef}
            className={`lightbox-panel${wide ? " lightbox-panel--wide" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label={caption || alt}
          >
            <img src={src} alt={alt} decoding="async" />
            {caption && <figcaption>{caption}</figcaption>}

            <span ref={closeRef} className="lightbox-close">
              <CloseButton
                className="lightbox-close-btn"
                label={t("closeLabel")}
                onClick={() => setOpen(false)}
              />
            </span>
          </figure>
        </div>,
        document.body,
      )}
    </>
  );
}

export default ImageLightbox;
