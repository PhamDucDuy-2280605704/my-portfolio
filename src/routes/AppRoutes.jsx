import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ScrollToTop from "../components/common/ScrollToTop/ScrollToTop";
import PageLoader from "../components/common/PageLoader/PageLoader";

// Home tải ngay (không lazy) vì luôn là trang đầu tiên hầu hết người dùng thấy —
// lazy-load nó sẽ chỉ làm chậm lần tải đầu mà không tiết kiệm được gì.
import Home from "../pages/Home/Home";

// Các trang còn lại lazy-load: mỗi trang tách thành 1 file JS riêng, chỉ tải
// khi người dùng thực sự vào trang đó (React.lazy + import() động của Vite),
// giúp giảm đáng kể dung lượng JS cần tải ở lần vào trang đầu tiên.
const About = lazy(() => import("../pages/About/About"));
const Projects = lazy(() => import("../pages/Projects/Projects"));
const Skills = lazy(() => import("../pages/Skills/Skills"));
const Experience = lazy(() => import("../pages/Experience/Experience"));
const Journal = lazy(() => import("../pages/Journal/Journal"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

// Toàn bộ định tuyến (routing) của app.
// - Các route bên trong <Route element={<MainLayout />}> đều dùng chung layout
//   (Navbar + Footer bao quanh), MainLayout render nội dung riêng qua <Outlet />.
// - Route "*" (404) nằm NGOÀI MainLayout vì trang NotFound tự thiết kế riêng,
//   không cần Navbar/Footer bao quanh.
// - <ScrollToTop /> đặt ngay trong <BrowserRouter> để theo dõi mọi lần đổi route
//   và tự cuộn mượt lên đầu trang (xem thêm ScrollToTop.jsx).
// - <Suspense> bọc ngoài <Routes> để hiện <PageLoader /> trong lúc chờ file JS
//   của trang lazy tải xong (thường chỉ vài chục-trăm ms, gần như không thấy).
function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;