import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";

// Layout dùng chung cho mọi trang (trừ NotFound).
// <Outlet /> là nơi React Router "chèn" component của route hiện tại vào giữa
// Navbar và Footer, nên mỗi page (Home, About, Skills...) không cần tự import
// Navbar/Footer nữa.
function MainLayout() {
  return (
    <>
      {/* Skip-to-content: ẩn khi bình thường, chỉ hiện khi người dùng bàn phím
          nhấn Tab (focus vào link) — giúp họ nhảy thẳng tới nội dung chính
          mà không phải Tab qua hết 7 mục menu mỗi lần chuyển trang. */}
      <a
        href="#main-content"
        className="skip-to-content"
      >
        Bỏ qua đến nội dung chính
      </a>

      <Navbar />

      <main id="main-content">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default MainLayout;