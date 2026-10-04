import useLanguage from "../../hooks/useLanguage";
import landing from "../../data/landing";
import { playUiSound } from "../../utils/uiSound";
import "./LangSwitch.css";

// Chuyển ngôn ngữ vi/en — 2 nút dạng segmented, nút đang chọn có aria-pressed.
function LangSwitch() {
  const { lang, setLang, tr } = useLanguage();

  return (
    <div
      className="lang-switch"
      role="group"
      aria-label={tr(landing.shell.langLabel)}
    >
      {["vi", "en"].map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => {
            playUiSound("action");
            setLang(code);
          }}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default LangSwitch;
