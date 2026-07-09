import { useEffect } from "react";

// Đặt tiêu đề tab trình duyệt riêng cho từng trang, tự khôi phục tiêu đề gốc khi unmount.
function usePageTitle(title) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}

export default usePageTitle;
