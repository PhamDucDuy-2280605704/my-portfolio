import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ScrollToTop from "../components/common/ScrollToTop/ScrollToTop";
import PageLoader from "../components/common/PageLoader/PageLoader";
import ReplayIntroButton from "../components/common/ReplayIntroButton/ReplayIntroButton";

// Home giờ là TRANG DUY NHẤT của site — chứa toàn bộ nội dung (Hero, Giới
// thiệu, Kỹ năng, Dự án, Kinh nghiệm, Nhật ký, Liên hệ) ghép thành 1 trang
// dài, cuộn từ trên xuống dưới (xem pages/Home/Home.jsx). Tải ngay, không
// lazy, vì luôn là thứ đầu tiên (và giờ là DUY NHẤT) người dùng thấy.
import Home from "../pages/Home/Home";

const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

// Các route cũ (/about, /skills, /projects...) từ thời site còn nhiều
// trang riêng — giữ lại dưới dạng REDIRECT sang đúng section tương ứng
// trên trang chủ (VD "/about" -> "/#about"), để link cũ đã chia sẻ/bookmark
// trước đây không bị chết, thay vì rơi thẳng vào trang 404.
const LEGACY_REDIRECTS = [
  ["/about", "#about"],
  ["/skills", "#skills"],
  ["/projects", "#projects"],
  ["/experience", "#experience"],
  ["/journal", "#journal"],
  ["/contact", "#contact"],
];

// Toàn bộ định tuyến (routing) của app.
// - <Route element={<MainLayout />}> bọc Home để có chung Navbar/Footer.
// - Route "*" (404) nằm NGOÀI MainLayout vì trang NotFound tự thiết kế riêng.
// - <ScrollToTop /> chỉ còn tác dụng khi thật sự đổi route (VD từ 1 link
//   redirect cũ) — bấm menu trong 1 trang giờ là cuộn neo (#id), không đổi
//   route nên không kích hoạt lại ScrollToTop.
// - <ReplayIntroButton /> tự dùng useLocation để CHỈ hiện ở "/".
function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ReplayIntroButton />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={<Home />}
            />
          </Route>

          {LEGACY_REDIRECTS.map(([from, toHash]) => (
            <Route
              key={from}
              path={from}
              element={
                <Navigate
                  to={`/${toHash}`}
                  replace
                />
              }
            />
          ))}

          {/* Bắt mọi đường dẫn không khớp -> trang 404 */}
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
