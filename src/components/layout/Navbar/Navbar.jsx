import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import "./Navbar.css";

import logo from "../../../assets/images/logo.jpg";
import profile from "../../../data/profile";

function Navbar() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isZoomed, isMenuOpen]);

  return (
    <>
      <nav className="navbar">
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

        <ul className="menu">
          {menus.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path}>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Mở menu"
        >
          <IoMenu />
        </button>
      </nav>

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