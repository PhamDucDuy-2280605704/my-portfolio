import { useEffect, useRef, useState } from "react";

// Trả về [ref, seen]: seen chuyển true đúng 1 lần, ngay lần đầu phần tử vào
// viewport (chỉ quan sát khi enabled = true — dùng để chờ loader xong).
function useInViewOnce(enabled = true, options = {}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  // threshold 0 + lề đáy -10%: hiện khi cuộn tới, kể cả với khối cao hơn cả viewport
  const { threshold = 0, rootMargin = "0px 0px -10% 0px" } = options;

  useEffect(() => {
    if (!enabled || seen) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === "undefined") return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, seen, threshold, rootMargin]);

  // Môi trường không có IntersectionObserver (test/trình duyệt cũ): coi như đã thấy
  const unsupported = typeof IntersectionObserver === "undefined";
  return [ref, seen || (unsupported && enabled)];
}

export default useInViewOnce;
