import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Tự động cuộn mượt lên đầu trang mỗi khi chuyển route.
// Không có component này, React Router giữ nguyên vị trí cuộn cũ khi chuyển trang.
//
// Bỏ qua khi URL có hash (VD redirect từ link cũ "/about" -> "/#about") —
// lúc đó Home.jsx sẽ tự cuộn tới đúng section, cuộn lên đầu ở đây trước sẽ
// chỉ gây giật/cuộn ngược lại.
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
