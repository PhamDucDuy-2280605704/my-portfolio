import { useContext } from "react";

import LanguageContext from "../context/LanguageContext";
import uiText from "../i18n/uiText";

// Lấy 1 giá trị song ngữ dạng { vi: "...", en: "..." } theo đúng ngôn ngữ
// hiện tại. Nếu value là chuỗi thường (chưa kịp song ngữ hoá) thì trả
// nguyên chuỗi đó — tránh vỡ giao diện nếu có chỗ nào quên bọc song ngữ.
function resolve(value, lang) {
  if (value == null) return value;
  if (typeof value === "string") return value;
  return value[lang] ?? value.vi ?? value.en ?? "";
}

// Hook chính cho toàn bộ tính năng đa ngôn ngữ:
//  - lang / setLang: ngôn ngữ hiện tại ("vi" | "en") + hàm đổi ngôn ngữ.
//  - t(key): lấy chuỗi giao diện tĩnh (nút, tiêu đề, nhãn...) từ từ điển
//    dùng chung src/i18n/uiText.js.
//  - tr(value): lấy đúng bản dịch từ 1 field dữ liệu song ngữ trong
//    src/data/*.js (dạng { vi, en }), dùng cho nội dung như bio, mô tả dự
//    án... thay vì phải khai lại trong từ điển uiText.
function useLanguage() {
  const ctx = useContext(LanguageContext);

  if (!ctx) {
    throw new Error("useLanguage phải được dùng bên trong <LanguageProvider>");
  }

  const { lang, setLang } = ctx;

  function t(key) {
    const entry = uiText[key];
    if (!entry) return key;
    return entry[lang] ?? entry.vi ?? key;
  }

  function tr(value) {
    return resolve(value, lang);
  }

  return { lang, setLang, t, tr };
}

export default useLanguage;
