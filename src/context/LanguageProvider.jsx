import { useEffect, useMemo, useState } from "react";

import LanguageContext from "./LanguageContext";

const STORAGE_KEY = "site-language";
const SUPPORTED = ["vi", "en"];
const DEFAULT_LANG = "vi";

function readInitialLang() {
  if (typeof window === "undefined") return DEFAULT_LANG;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED.includes(saved)) return saved;
  } catch {
    // localStorage có thể bị chặn (chế độ ẩn danh nghiêm ngặt) -> bỏ qua
  }

  return DEFAULT_LANG;
}

// Bọc toàn bộ app (đặt ở App.jsx) — cung cấp { lang, setLang } cho mọi
// component con qua LanguageContext. Ngôn ngữ mặc định là tiếng Việt, ghi
// nhớ lựa chọn của người dùng qua localStorage nên lần sau quay lại site
// vẫn giữ đúng ngôn ngữ đã chọn.
function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // bỏ qua nếu không lưu được
    }
  }, [lang]);

  function setLang(next) {
    if (SUPPORTED.includes(next)) setLangState(next);
  }

  const value = useMemo(() => ({ lang, setLang }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export default LanguageProvider;
