import useLanguage from "../../hooks/useLanguage";
import useUi from "../../hooks/useUi";
import landing from "../../data/landing";
import profile from "../../data/profile";
import logo from "../../assets/images/logo.jpg";
import { scrollToId } from "../../lib/lenis";
import { BrandMark } from "../ui/Icons";
import AvatarLightbox from "./AvatarLightbox";
import "./Header.css";

// Header trong suốt nằm trên hero:
//  - trái : logo + avatar (bấm avatar để phóng to)
//  - giữa : tên (ẩn trên mobile cho đỡ chật)
//  - phải : nút liên hệ + burger mở menu toàn màn hình
function Header() {
  const { tr } = useLanguage();
  const { openMenu, openContact } = useUi();

  function toTop(e) {
    e.preventDefault();
    scrollToId("home");
  }

  return (
    <header className="bl-header">
      <div className="bl-header-left">
        <a
          className="bl-logo"
          href="#home"
          onClick={toTop}
          aria-label={tr(landing.shell.backToTop)}
        >
          <img
            src={logo}
            alt="Fsociety"
            decoding="async"
          />
        </a>
        <AvatarLightbox />
      </div>

      <span className="bl-brand">
        <BrandMark className="bl-brand-mark" />
        <span>{profile.fullName}</span>
      </span>

      <div className="bl-header-actions">
        <button
          type="button"
          className="bl-header-cta"
          onClick={openContact}
        >
          {tr(landing.shell.contactCta)}
        </button>

        <button
          type="button"
          className="bl-burger"
          aria-label={tr(landing.shell.menu)}
          onClick={openMenu}
        >
          <i />
          <i />
        </button>
      </div>
    </header>
  );
}

export default Header;
