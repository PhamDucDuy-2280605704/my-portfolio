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
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default MainLayout;