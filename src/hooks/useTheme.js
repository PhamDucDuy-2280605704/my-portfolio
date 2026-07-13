import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

// Đọc theme đã chọn từ lần trước (localStorage). Nếu chưa từng chọn (lần đầu
// ghé site), dùng theo cài đặt hệ điều hành/trình duyệt (prefers-color-scheme);
// mặc định về "dark" nếu trình duyệt không hỗ trợ media query này.
function getInitialTheme() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;

  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
  return prefersLight ? "light" : "dark";
}

// Quản lý theme sáng/tối cho toàn site.
// Cách hoạt động: gán thuộc tính data-theme="light" | "dark" lên thẻ <html>,
// các biến màu trong styles/variables.css tự đổi theo thuộc tính đó — component
// nào cũng đã dùng var(--color-*) nên KHÔNG cần sửa gì thêm ở nơi khác.
function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);

    // Đồng bộ luôn màu thanh trạng thái/địa chỉ trên trình duyệt mobile
    // (meta theme-color) theo đúng theme đang chọn, không để cố định màu tối.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#0f172a" : "#f1f5f9");
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return { theme, toggleTheme };
}

export default useTheme;
