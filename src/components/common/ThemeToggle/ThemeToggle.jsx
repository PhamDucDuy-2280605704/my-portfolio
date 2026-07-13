import { IoMoon, IoSunny } from "react-icons/io5";

import "./ThemeToggle.css";

import useTheme from "../../../hooks/useTheme";

// Nút bấm chuyển đổi theme sáng/tối, đặt trong Navbar (hiện ở mọi kích thước
// màn hình, không ẩn theo breakpoint như .menu/.menu-toggle).
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      title={isDark ? "Giao diện sáng" : "Giao diện tối"}
    >
      {isDark ? <IoSunny /> : <IoMoon />}
    </button>
  );
}

export default ThemeToggle;
