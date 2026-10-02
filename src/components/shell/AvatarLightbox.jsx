import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import useLanguage from "../../hooks/useLanguage";
import useToggleSpring from "../../hooks/useToggleSpring";
import profile from "../../data/profile";
import { lockScroll, unlockScroll } from "../../lib/lenis";
import { CloseButton } from "./MenuOverlay";
import "./AvatarLightbox.css";

// Avatar tròn nhỏ ở header: bấm để phóng to ra giữa màn hình (lightbox).
// - Render qua portal ở cấp body, khoá cuộn khi mở (dùng chung bộ đếm khoá với menu/modal)
// - Đóng bằng: Esc, bấm nền tối, hoặc nút X; focus được trả lại nút avatar sau khi đóng
function AvatarLightbox() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const wasOpen = useRef(false);

  const backdropRef = useToggleSpring(open, { opacity: 0 }, { opacity: 1 }, { tension: 240, friction: 30 });
  const panelRef = useToggleSpring(
    open,
    { opacity: 0, y: 24, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1 },
    { tension: 230, friction: 24 }
  );

  useEffect(() => {
    if (!open) return undefined;
    lockScroll();
    wasOpen.current = true;
    const focusTimer = setTimeout(() => closeRef.current?.querySelector("button, [type=button]")?.focus?.(), 80);
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
        className="avatar-btn"
        aria-label={t("avatarZoom")}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <img
          src={profile.avatar}
          alt=""
          width="44"
          height="44"
          decoding="async"
        />
      </button>

      {createPortal(
        <div
          className="bl bl-portal avatar-root"
          style={{ pointerEvents: open ? "auto" : "none" }}
          inert={!open}
          aria-hidden={!open}
        >
          <div
            ref={backdropRef}
            className="avatar-backdrop"
            onClick={() => setOpen(false)}
          />

          <figure
            ref={panelRef}
            className="avatar-panel"
            role="dialog"
            aria-modal="true"
            aria-label={profile.fullName}
          >
            <img
              src={profile.avatar}
              alt={profile.fullName}
              decoding="async"
            />
            <figcaption>{profile.fullName}</figcaption>

            <span
              ref={closeRef}
              className="avatar-close"
            >
              <CloseButton
                className="avatar-close-btn"
                label={t("closeLabel")}
                onClick={() => setOpen(false)}
              />
            </span>
          </figure>
        </div>,
        document.body
      )}
    </>
  );
}

export default AvatarLightbox;
