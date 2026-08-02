import { useEffect, useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import "./Navbar.css";

import logo from "../../../assets/images/logo.jpg";
import profile from "../../../data/profile";
import ThemeToggle from "../../common/ThemeToggle/ThemeToggle";
import useActiveSection from "../../../hooks/useActiveSection";
import { playUiSound } from "../../../utils/uiSound";

// Đồng hồ giờ:phút:giây kiểu HUD, luôn 2 chữ số (dùng lại ở góc phải Navbar).
function formatClock(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// Site giờ là 1 trang chủ duy nhất, cuộn dài từ trên xuống dưới (xem
// Home.jsx) — menu không còn điều hướng sang route khác nữa, mà là các thẻ
// <a href="#id"> nhảy thẳng tới section tương ứng. Trình duyệt tự cuộn mượt
// (scroll-behavior:smooth) và tự chừa đúng khoảng trống cho Navbar sticky
// (scroll-padding-top, khai báo trong styles/reset.css) — không cần
// scrollIntoView bằng tay.
const SECTIONS = [
  { id: "home", name: "Trang Chủ", code: "SEC.01" },
  { id: "about", name: "Giới Thiệu", code: "SEC.02" },
  { id: "skills", name: "Kỹ Năng", code: "SEC.03" },
  { id: "projects", name: "Dự Án", code: "SEC.04" },
  { id: "experience", name: "Kinh Nghiệm", code: "SEC.05" },
  { id: "journal", name: "Nhật Ký", code: "SEC.06" },
  { id: "contact", name: "Liên Hệ", code: "SEC.07" },
];

const SECTION_IDS = SECTIONS.map((s) => s.id);

// Thanh điều hướng chung, dựng theo phong cách HUD (bảng điều khiển kỹ
// thuật): 1 dải nhãn mã hiệu mỏng phía trên + thanh menu chính bên dưới.
//   1. Logo (bấm vào phóng to xem toàn màn hình)
//   2. Menu ngang (desktop) — tự ẩn thành nút hamburger khi màn hình hẹp (≤1080px)
//   3. Menu full-screen (mobile) — hiện khi bấm nút hamburger
function Navbar() {
  // isZoomed: đang mở overlay phóng to logo hay không.
  const [isZoomed, setIsZoomed] = useState(false);
  // isMenuOpen: đang mở menu full-screen trên mobile hay không.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Đồng hồ hệ thống — đặt cố định ở góc phải Navbar (sticky) để luôn thấy ngay.
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Section nào đang hiện rõ nhất trong khung nhìn -> dùng để highlight
  // menu item tương ứng + hiện nhãn "SEC.0x · TÊN MỤC" ở dải meta phía trên.
  const activeId = useActiveSection(SECTION_IDS);
  const activeItem = SECTIONS.find((s) => s.id === activeId) || SECTIONS[0];

  // Khi 1 trong 2 overlay (phóng to logo / menu mobile) đang mở:
  // - khoá cuộn trang nền (tránh cuộn nền trong khi xem overlay)
  // - cho phép nhấn phím Esc để đóng overlay
  useEffect(() => {
    if (!isZoomed && !isMenuOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsZoomed(false);
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Dọn dẹp: mở lại cuộn trang + gỡ listener khi overlay đóng hoặc unmount.
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isZoomed, isMenuOpen]);

  return (
    <>
      {/* Dải nhãn mã hiệu mỏng phía trên menu chính — chỉ trang trí, mô
          phỏng thanh trạng thái trên cùng của bảng điều khiển kỹ thuật. */}
      <div
        className="navbar-meta"
        aria-hidden="true"
      >
        <span className="navbar-meta-item">
          <i className="navbar-meta-dot" />
          {profile.fullName.toUpperCase()}
        </span>
        <span className="navbar-meta-item navbar-meta-item-center">
          {activeItem.code} &middot; {activeItem.name.toUpperCase()}
        </span>
        <span className="navbar-meta-item navbar-clock hud-readout">
          {formatClock(now)}
        </span>
      </div>

      <nav className="navbar">
        {/* Logo — bấm vào mở overlay phóng to (site giờ chỉ có 1 trang nên
            logo luôn hiện, không còn ẩn/hiện theo route như trước). */}
        <button
          type="button"
          className="logo"
          onClick={() => {
            playUiSound("card");
            setIsZoomed(true);
          }}
        >
          <span className="logo-frame">
            <img
              src={logo}
              alt={profile.fullName}
            />
          </span>
        </button>

        {/* Gom nhóm bên phải (menu + toggle theme + hamburger) vào 1 wrapper,
            để .navbar chỉ còn 2 "khối" chính (logo | navbar-right) — logo luôn
            bám sát trái, cả nhóm bên phải luôn bám sát phải. */}
        <div className="navbar-right">

          {/* Menu ngang — ẩn qua CSS (display:none) khi màn hình ≤1080px.
              Mỗi mục là 1 thẻ <a href="#id"> thật (không phải NavLink) —
              trình duyệt tự cuộn mượt tới đúng section, hoạt động cả khi
              JS chưa kịp chạy, và vẫn Ctrl/Cmd+click mở tab mới được. */}
          <ul className="menu">
            {SECTIONS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={activeId === item.id ? "active" : ""}
                  onClick={() =>
                    playUiSound(activeId === item.id ? "navActive" : "nav")
                  }
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          <ThemeToggle />

          {/* Nút hamburger — chỉ hiện qua CSS khi màn hình ≤1080px */}
          <button
            type="button"
            className="menu-toggle"
            onClick={() => {
              playUiSound("nav");
              setIsMenuOpen(true);
            }}
            aria-label="Mở menu"
          >
            <IoMenu />
          </button>

        </div>
      </nav>

      {/* Menu full-screen cho mobile, đóng lại ngay khi bấm 1 mục để cuộn tới đúng chỗ */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <button
            type="button"
            className="mobile-menu-close"
            onClick={() => {
              playUiSound("nav");
              setIsMenuOpen(false);
            }}
            aria-label="Đóng menu"
          >
            <IoClose />
          </button>

          <ul>
            {SECTIONS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={activeId === item.id ? "active" : ""}
                  onClick={() => {
                    playUiSound(activeId === item.id ? "navActive" : "nav");
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="mobile-menu-code hud-readout">{item.code}</span>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Overlay phóng to logo */}
      {isZoomed && (
        <div
          className="logo-overlay"
          onClick={() => setIsZoomed(false)}
        >
          <button
            type="button"
            className="logo-overlay-close"
            onClick={() => {
              playUiSound("card");
              setIsZoomed(false);
            }}
            aria-label="Đóng"
          >
            <IoClose />
          </button>

          <img
            src={logo}
            alt={profile.fullName}
            className="logo-overlay-image"
          />
        </div>
      )}
    </>
  );
}

export default Navbar;
