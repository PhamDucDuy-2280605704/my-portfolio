import { useLocation } from "react-router-dom";

import "./Footer.css";

// Chân trang dạng thanh trạng thái kỹ thuật (system status bar), đồng bộ
// phong cách HUD của Navbar. Đồng hồ hệ thống đã chuyển lên góc phải Navbar
// (sticky, luôn thấy ngay) nên Footer chỉ còn giữ mã hiệu + route hiện tại.
function Footer() {
  const { pathname } = useLocation();

  return (
    <footer className="site-footer">
      <span className="site-footer-item hud-readout">
        OPSEC_ADMIN &middot; ©2026
      </span>

      <span className="site-footer-item site-footer-route hud-readout">
        SRC {pathname === "/" ? "/home" : pathname}
      </span>

      <span className="site-footer-item hud-readout">
        TAP // v2.0
      </span>
    </footer>
  );
}

export default Footer;
