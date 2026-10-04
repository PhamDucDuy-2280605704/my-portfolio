import useLanguage from "../../hooks/useLanguage";
import useUi from "../../hooks/useUi";
import landing from "../../data/landing";
import profile from "../../data/profile";
import logo from "../../assets/images/logo.jpg";
import ImageLightbox from "./ImageLightbox";
import "./Header.css";

// Header trong suốt nằm trên hero:
//  - trái : logo + avatar (bấm vào từng cái để phóng to)
//  - phải : burger mở menu toàn màn hình (menu là nơi duy nhất chứa điều hướng + đổi ngôn ngữ)
function Header() {
  const { t, tr } = useLanguage();
  const { openMenu } = useUi();

  return (
    <header className="bl-header">
      <div className="bl-header-left">
        <ImageLightbox
          src={logo}
          alt="Fsociety"
          caption="Fsociety"
          label={t("logoZoom")}
          className="bl-logo"
          wide
        />
        <ImageLightbox
          src={profile.avatar}
          alt={profile.fullName}
          caption={profile.fullName}
          label={t("avatarZoom")}
          className="avatar-btn"
        />
      </div>

      <button
        type="button"
        className="bl-burger"
        aria-label={tr(landing.shell.menu)}
        onClick={openMenu}
      >
        <i />
        <i />
      </button>
    </header>
  );
}

export default Header;
