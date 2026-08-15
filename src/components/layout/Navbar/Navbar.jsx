import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import "./Navbar.css";

import logo from "../../../assets/images/logo.jpg";
import profile from "../../../data/profile";
import navSections from "../../../data/navSections";
import ThemeToggle from "../../common/ThemeToggle/ThemeToggle";
import useActiveSection from "../../../hooks/useActiveSection";
import { playUiSound } from "../../../utils/uiSound";

// Đồng hồ giờ:phút:giây kiểu HUD, luôn 2 chữ số (dùng lại ở góc phải Navbar).
function formatClock(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

const SECTION_IDS = navSections.map((s) => s.id);

// Navbar giờ CHỈ còn: dải mã hiệu (tên + mục đang xem + đồng hồ), logo, và
// nút chuyển theme — menu điều hướng đã chuyển hẳn xuống <BottomDock />
// (dock nổi kính, căn giữa dưới màn hình) nên không còn menu chữ ở góc
// phải, cũng không cần hamburger/menu full-screen cho mobile nữa (dock dưới
// đã tự hoạt động tốt ở mọi kích thước màn hình).
function Navbar() {
  // isZoomed: đang mở overlay phóng to logo hay không.
  const [isZoomed, setIsZoomed] = useState(false);
  // Đồng hồ hệ thống — đặt cố định ở góc phải Navbar (sticky) để luôn thấy ngay.
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Section nào đang hiện rõ nhất trong khung nhìn -> dùng để hiện nhãn
  // "SEC.0x · TÊN MỤC" ở dải meta phía trên (BottomDock tự dùng hook này
  // riêng để tô sáng icon active, 2 nơi tự đồng bộ theo cùng 1 nguồn).
  const activeId = useActiveSection(SECTION_IDS);
  const activeItem = navSections.find((s) => s.id === activeId) || navSections[0];

  // Khi overlay phóng to logo đang mở: khoá cuộn trang nền + cho phép Esc để đóng.
  useEffect(() => {
    if (!isZoomed) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsZoomed(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isZoomed]);

  return (
    <>
      {/* Dải nhãn mã hiệu mỏng phía trên navbar chính — chỉ trang trí, mô
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
          {/* Ký hiệu biohazard mini — cùng "chữ ký" thị giác với màn hình
              intro, lặp lại ở đây để hệ thống HUD cảm giác xuyên suốt cả
              site chứ không chỉ xuất hiện đúng lúc mở đầu. Đây là ký hiệu
              nguy hại sinh học quốc tế (không phải logo riêng của ai). */}
          <svg
            className="navbar-biohazard"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <mask id="navbar-biohazard-mask">
              <rect
                width="32"
                height="32"
                fill="black"
              />
              {[-90, 30, 150].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const cx = 16 + Math.cos(rad) * 6.6;
                const cy = 16 + Math.sin(rad) * 6.6;
                return (
                  <circle
                    key={deg}
                    cx={cx}
                    cy={cy}
                    r="6.4"
                    fill="white"
                  />
                );
              })}
              <circle
                cx="16"
                cy="16"
                r="3.1"
                fill="black"
              />
            </mask>
            <rect
              width="32"
              height="32"
              fill="currentColor"
              mask="url(#navbar-biohazard-mask)"
            />
          </svg>
          {formatClock(now)}
        </span>
      </div>

      <nav className="navbar">
        {/* Logo — bấm vào mở overlay phóng to */}
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

        <ThemeToggle />
      </nav>

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
