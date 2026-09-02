import "./LanguageToggle.css";

import useLanguage from "../../../hooks/useLanguage";
import { playUiSound } from "../../../utils/uiSound";

// Nút bấm chuyển đổi ngôn ngữ VI/EN, đặt cạnh ThemeToggle trong Navbar.
// Hiện chữ "VI"/"EN" (ngôn ngữ SẼ chuyển sang, không phải ngôn ngữ hiện tại)
// — giống cách nhiều site lớn làm, để người dùng hiểu ngay bấm vào sẽ đổi sang gì.
function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();
  const isVi = lang === "vi";

  return (
    <button
      type="button"
      className="language-toggle"
      onClick={() => {
        playUiSound("toggle");
        setLang(isVi ? "en" : "vi");
      }}
      aria-label={t("languageToggleLabel")}
      title={t("languageToggleLabel")}
    >
      {isVi ? "EN" : "VI"}
    </button>
  );
}

export default LanguageToggle;
