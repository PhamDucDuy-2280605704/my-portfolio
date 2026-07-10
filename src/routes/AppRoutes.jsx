import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ScrollToTop from "../components/common/ScrollToTop/ScrollToTop";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Projects from "../pages/Projects/Projects";
import Skills from "../pages/Skills/Skills";
import Experience from "../pages/Experience/Experience";
import Journal from "../pages/Journal/Journal";
import Contact from "../pages/Contact/Contact";
import NotFound from "../pages/NotFound/NotFound";

// Toàn bộ định tuyến (routing) của app.
// - Các route bên trong <Route element={<MainLayout />}> đều dùng chung layout
//   (Navbar + Footer bao quanh), MainLayout render nội dung riêng qua <Outlet />.
// - Route "*" (404) nằm NGOÀI MainLayout vì trang NotFound tự thiết kế riêng,
//   không cần Navbar/Footer bao quanh.
// - <ScrollToTop /> đặt ngay trong <BrowserRouter> để theo dõi mọi lần đổi route
//   và tự cuộn mượt lên đầu trang (xem thêm ScrollToTop.jsx).
function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Bắt mọi đường dẫn không khớp -> trang 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;