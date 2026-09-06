import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import BottomDock from "../components/layout/BottomDock/BottomDock";
import useLanguage from "../hooks/useLanguage";

// Layout dùng chung cho mọi trang (trừ NotFound và /zone).
// <Outlet /> là nơi React Router "chèn" component của route hiện tại vào giữa
// Navbar và Footer, nên mỗi page (Home, About, Skills...) không cần tự import
// Navbar/Footer nữa.
//
// <BottomDock /> là menu điều hướng chính (dock kính nổi, căn giữa dưới màn
// hình) — Navbar phía trên chỉ còn logo + mã hiệu + đồng hồ + nút đổi ngôn
// ngữ, không còn menu chữ, cũng không còn nút đổi sáng/tối (đã bỏ hẳn).
function MainLayout() {
  const { t } = useLanguage();

  return (
    <>
      {/* Skip-to-content: ẩn khi bình thường, chỉ hiện khi người dùng bàn phím
          nhấn Tab (focus vào link) — giúp họ nhảy thẳng tới nội dung chính
          mà không phải Tab qua hết Navbar mỗi lần chuyển trang. */}
      <a
        href="#main-content"
        className="skip-to-content"
      >
        {t("skipToContent")}
      </a>

      <Navbar />

      <main id="main-content">
        <Outlet />
      </main>

      <Footer />

      <BottomDock />
    </>
  );
}

export default MainLayout;