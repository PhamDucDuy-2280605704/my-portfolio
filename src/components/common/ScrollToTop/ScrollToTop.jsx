import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Tự động cuộn mượt lên đầu trang mỗi khi chuyển route.
// Không có component này, React Router giữ nguyên vị trí cuộn cũ khi chuyển trang.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
