import "./Footer.css";

// Chân trang dạng thanh trạng thái kỹ thuật (system status bar), đồng bộ
// phong cách HUD của Navbar. Đồng hồ hệ thống đã chuyển lên góc phải Navbar
// (sticky, luôn thấy ngay) nên Footer chỉ còn giữ mã hiệu + trạng thái trang.
//
// Site giờ chỉ còn 1 trang duy nhất (xem Home.jsx) nên không cần useLocation
// nữa — route luôn là "/", hiển thị pathname động không còn ý nghĩa gì.
function Footer() {
  return (
    <footer className="site-footer">
      <span className="site-footer-item hud-readout">
        OPSEC_ADMIN &middot; ©2026
      </span>

      <span className="site-footer-item site-footer-route hud-readout">
        SRC /home &middot; 7 SECTIONS
      </span>

      <span className="site-footer-item hud-readout">
        TAP // v2.0
      </span>
    </footer>
  );
}

export default Footer;
