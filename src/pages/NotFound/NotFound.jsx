import { Link } from "react-router-dom";

import "./NotFound.css";

import Button from "../../components/common/Button/Button";
import usePageTitle from "../../hooks/usePageTitle";

// Trang 404 — khớp với route "*" trong AppRoutes.jsx.
// Cố ý KHÔNG dùng MainLayout (không có Navbar/Footer) để có toàn quyền tự thiết kế trang.
function NotFound() {
  usePageTitle("Không Tìm Thấy Trang | Phạm Đức Duy");

  return (
    <section className="notfound-page">

      <h1 className="notfound-code">404</h1>

      <h2>Không tìm thấy trang</h2>

      <p>Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.</p>

      <Link to="/">
        <Button variant="primary">Về Trang Chủ</Button>
      </Link>

    </section>
  );
}

export default NotFound;
