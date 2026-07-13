import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import "./Navbar.css";

import logo from "../../../assets/images/logo.jpg";
import profile from "../../../data/profile";
import ThemeToggle from "../../common/ThemeToggle/ThemeToggle";

// Thanh điều hướng chung cho mọi trang. Gồm 3 phần:
//   1. Logo (chỉ hiện ở trang Home, bấm vào phóng to xem toàn màn hình)
//   2. Menu ngang (desktop) — tự ẩn thành nút hamburger khi màn hình hẹp (≤1080px)
//   3. Menu full-screen (mobile) — hiện khi bấm nút hamburger
function Navbar() {
  // isZoomed: đang mở overlay phóng to logo hay không.
  const [isZoomed, setIsZoomed] = useState(false);
  // isMenuOpen: đang mở menu full-screen trên mobile hay không.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Biết đang ở trang nào để quyết định có hiện logo hay không.
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const menus = [
    { name: "Trang Chủ", path: "/" },
    { name: "Giới Thiệu", path: "/about" },
    { name: "Kỹ Năng", path: "/skills" },
    { name: "Dự Án", path: "/projects" },
    { name: "Kinh Nghiệm", path: "/experience" },
    { name: "Nhật Ký", path: "/journal" },
    { name: "Liên Hệ", path: "/contact" },
  ];

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
      <nav className="navbar">
        {/* Logo: chỉ hiện ở trang Home (class "logo-hidden" ẩn nhưng vẫn giữ
            chỗ bằng visibility:hidden, để menu bên cạnh không bị lệch vị trí
            khi chuyển qua lại giữa Home và các trang khác). */}
        <button
          type="button"
          className={`logo ${isHome ? "" : "logo-hidden"}`}
          onClick={() => isHome && setIsZoomed(true)}
          tabIndex={isHome ? 0 : -1}
          aria-hidden={!isHome}
        >
          <img
            src={logo}
            alt={profile.fullName}
          />
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
                <NavLink to={item.path}>
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
            onClick={() => setIsMenuOpen(true)}
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
            onClick={() => setIsMenuOpen(false)}
            aria-label="Đóng menu"
          >
            <IoClose />
          </button>

          <ul>
            {menus.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                >
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
            onClick={() => setIsZoomed(false)}
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