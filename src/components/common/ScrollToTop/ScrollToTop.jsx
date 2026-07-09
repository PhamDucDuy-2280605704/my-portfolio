import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Tự động cuộn lên đầu trang mỗi khi chuyển route.
// Không có component này, React Router giữ nguyên vị trí cuộn cũ khi chuyển trang.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
