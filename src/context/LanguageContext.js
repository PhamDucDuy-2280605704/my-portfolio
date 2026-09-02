import { createContext } from "react";

// Context thuần lưu { lang, setLang } — xem LanguageProvider ở
// LanguageProvider.jsx và cách dùng ở hooks/useLanguage.js.
// Tách riêng file context (không kèm logic) để component nào cũng import
// được mà không gây cảnh báo "Fast Refresh" của Vite (quy tắc: file có
// export component thì chỉ nên export component).
const LanguageContext = createContext(null);

export default LanguageContext;
