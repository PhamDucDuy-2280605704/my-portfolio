import { useEffect } from "react";
import { createPortal } from "react-dom";

import useLanguage from "../../hooks/useLanguage";
import useToggleSpring from "../../hooks/useToggleSpring";
import useUi from "../../hooks/useUi";
import landing from "../../data/landing";
import navSections from "../../data/navSections";
import profile from "../../data/profile";
import social from "../../data/social";
import { lockScroll, scrollToId, unlockScroll } from "../../lib/lenis";
import LangSwitch from "./LangSwitch";
import PillButton from "../ui/PillButton";
import { BrandMark, CloseIcon } from "../ui/Icons";
import useHoverSpring from "../../hooks/useHoverSpring";
import "./MenuOverlay.css";

// Các mục trong menu (bỏ "home"), delay vào = 120 + i*70 ms
const MENU_IDS = navSections.filter((s) => s.id !== "home").map((s) => s.id);

function MenuLink({ open, index, id, onGo }) {
  const { tr } = useLanguage();
  const section = navSections.find((s) => s.id === id);
  const ref = useToggleSpring(open, { opacity: 0, y: 28 }, { opacity: 1, y: 0 }, { tension: 200, friction: 26 }, 120 + index * 70);

  return (
    <a
      ref={ref}
      className="menu-link"
      href={`#${id}`}
      onClick={(e) => onGo(e, id)}
    >
      {tr(section.name)}
    </a>
  );
}

function CloseButton({ onClick, label, className }) {
  // Icon X xoay 0 -> 90deg khi hover
  const { ref, bind } = useHoverSpring({ rotate: 0 }, { rotate: 90 }, { tension: 300, friction: 18 });

  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      onClick={onClick}
      {...bind}
    >
      <span
        ref={ref}
        style={{ display: "inline-flex" }}
      >
        <CloseIcon />
      </span>
    </button>
  );
}

export { CloseButton };

// Menu toàn màn hình (mở từ burger). Render qua portal ở cấp body, luôn
// mounted: đóng = pointer-events none + inert, nên spring vào/ra mượt.
function MenuOverlay() {
  const { menuOpen, closeMenu, openContact } = useUi();
  const { tr, t } = useLanguage();

  const backdropRef = useToggleSpring(menuOpen, { opacity: 0 }, { opacity: 1 }, { tension: 260, friction: 30 });
  const panelRef = useToggleSpring(menuOpen, { opacity: 0, y: -24 }, { opacity: 1, y: 0 }, { tension: 220, friction: 28 });

  // Khoá cuộn khi mở + đóng bằng Esc
  useEffect(() => {
    if (!menuOpen) return undefined;
    lockScroll();
    const onKey = (e) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [menuOpen, closeMenu]);

  function go(e, id) {
    e.preventDefault();
    closeMenu();
    // Chờ khoá cuộn được gỡ (effect cleanup) rồi mới cuộn
    setTimeout(() => scrollToId(id), 60);
  }

  const socials = [
    { label: "GitHub", href: social.github },
    { label: "Facebook", href: social.facebook },
    { label: "Zalo", href: social.zalo },
    { label: "TikTok", href: social.tiktok },
  ];

  return createPortal(
    <div
      className="bl bl-portal menu-root"
      style={{ pointerEvents: menuOpen ? "auto" : "none" }}
      inert={!menuOpen}
      aria-hidden={!menuOpen}
    >
      <div
        ref={backdropRef}
        className="menu-backdrop"
        onClick={closeMenu}
      />

      <div
        ref={panelRef}
        className="menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="menu-top">
          <span className="menu-brand">
            <BrandMark className="menu-brand-mark" />
            {profile.fullName}
          </span>
          <CloseButton
            className="menu-close"
            label={t("closeLabel")}
            onClick={closeMenu}
          />
        </div>

        <nav
          className="menu-nav"
          aria-label="Menu"
        >
          {MENU_IDS.map((id, i) => (
            <MenuLink
              key={id}
              open={menuOpen}
              index={i}
              id={id}
              onGo={go}
            />
          ))}
        </nav>

        <div className="menu-bottom">
          <PillButton
            variant="light"
            onClick={() => {
              closeMenu();
              openContact();
            }}
          >
            {tr(landing.shell.contactCta)}
          </PillButton>

          <div className="menu-extras">
            <LangSwitch />
            <nav
              className="menu-social"
              aria-label="Social"
            >
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default MenuOverlay;
