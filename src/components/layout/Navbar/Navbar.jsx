import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import "./Navbar.css";

import logo from "../../../assets/images/logo.jpg";
import profile from "../../../data/profile";
import ThemeToggle from "../../common/ThemeToggle/ThemeToggle";
import { playUiSound } from "../../../utils/uiSound";

// Đồng hồ giờ:phút:giây kiểu HUD, luôn 2 chữ số (dùng lại ở góc phải Navbar).
function formatClock(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// Thanh điều hướng chung cho mọi trang, dựng theo phong cách HUD (bảng điều
// khiển kỹ thuật): 1 dải nhãn mã hiệu mỏng phía trên + thanh menu chính bên
// dưới. Vẫn giữ nguyên 3 phần logic gốc:
//   1. Logo (chỉ hiện ở trang Home, bấm vào phóng to xem toàn màn hình)
//   2. Menu ngang (desktop) — tự ẩn thành nút hamburger khi màn hình hẹp (≤1080px)
//   3. Menu full-screen (mobile) — hiện khi bấm nút hamburger
function Navbar() {
  // isZoomed: đang mở overlay phóng to logo hay không.
  const [isZoomed, setIsZoomed] = useState(false);
  // isMenuOpen: đang mở menu full-screen trên mobile hay không.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Đồng hồ hệ thống — đặt cố định ở góc phải Navbar (sticky) để luôn thấy
  // ngay, không phải cuộn xuống cuối trang mới thấy như bản Footer cũ.
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Biết đang ở trang nào để quyết định có hiện logo hay không, và để hiện
  // nhãn "mã hiệu" của khu vực đang xem (VD "SECTION 02 · GIỚI THIỆU").
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const menus = [
    { name: "Trang Chủ", path: "/", code: "SEC.01" },
    { name: "Giới Thiệu", path: "/about", code: "SEC.02" },
    { name: "Kỹ Năng", path: "/skills", code: "SEC.03" },
    { name: "Dự Án", path: "/projects", code: "SEC.04" },
    { name: "Kinh Nghiệm", path: "/experience", code: "SEC.05" },
    { name: "Nhật Ký", path: "/journal", code: "SEC.06" },
    { name: "Liên Hệ", path: "/contact", code: "SEC.07" },
  ];

  const activeItem = menus.find((item) => item.path === pathname) || menus[0];

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
        {/* Logo: chỉ hiện ở trang Home (class "logo-hidden" ẩn nhưng vẫn giữ
            chỗ bằng visibility:hidden, để menu bên cạnh không bị lệch vị trí
            khi chuyển qua lại giữa Home và các trang khác). */}
        <button
          type="button"
          className={`logo ${isHome ? "" : "logo-hidden"}`}
          onClick={() => {
            if (!isHome) return;
            playUiSound("card");
            setIsZoomed(true);
          }}
          tabIndex={isHome ? 0 : -1}
          aria-hidden={!isHome}
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
            bám sát trái, cả nhóm bên phải luôn bám sát phải, không bị
            justify-content:space-between dàn cách đều sai lệch khi thêm/bớt
            phần tử bên trong. */}
        <div className="navbar-right">

          {/* Menu ngang — ẩn qua CSS (display:none) khi màn hình ≤1080px */}
          <ul className="menu">
            {menus.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() =>
                    playUiSound(item.path === pathname ? "navActive" : "nav")
                  }
                >
                  {item.name}
                </NavLink>
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

      {/* Menu full-screen cho mobile, đóng lại ngay khi bấm 1 mục để điều hướng */}
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
            {menus.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => {
                    playUiSound(item.path === pathname ? "navActive" : "nav");
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="mobile-menu-code hud-readout">{item.code}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Overlay phóng to logo — chỉ có thể mở khi đang ở Home (isHome) */}
      {isZoomed && isHome && (
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
