import { useEffect, useState } from "react";

// Theo dõi section nào đang hiện rõ nhất trong khung nhìn (viewport) để
// Navbar biết mục nào cần highlight "active" khi người dùng CUỘN tay
// (không bấm menu) — vì giờ toàn bộ site nằm trên 1 trang dài, không còn
// route riêng cho từng mục để tự động biết "đang ở đâu" như trước.
//
// rootMargin trừ bớt phần trên bằng chiều cao Navbar (~122px) + 1 khoảng
// nhỏ, để section được tính là "đang xem" ngay khi nó vừa lướt qua khỏi
// Navbar, không phải đợi tới khi nằm giữa màn hình.
export default function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    // Một số môi trường (VD jsdom lúc chạy test) không có IntersectionObserver
    // -> bỏ qua êm, Navbar vẫn hoạt động bình thường, chỉ là không tự
    // highlight theo cuộn tay (bấm menu vẫn nhảy đúng chỗ như thường).
    if (typeof IntersectionObserver === "undefined") return undefined;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const visibleRatios = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleRatios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        // Chọn section có tỉ lệ hiện ra nhiều nhất trong vùng quan sát —
        // ổn định hơn nhiều so với "section đầu tiên intersecting" khi có
        // 2 section cùng lấp ló 1 phần ở mép trên/dưới màn hình.
        let bestId = null;
        let bestRatio = 0;
        visibleRatios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestId) setActiveId(bestId);
      },
      {
        rootMargin: "-130px 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(",")]);

  return activeId;
}
