import { useEffect, useRef, useState } from "react";

// Trả về [ref, seen]: seen chuyển true đúng 1 lần, ngay lần đầu phần tử vào
// viewport (chỉ quan sát khi enabled = true — dùng để chờ loader xong).
//
// Mặc định hook tự tạo ref để gắn vào phần tử. Nếu phần tử ĐÃ có ref khác (VD ref
// của useSpring trong Inview) thì truyền vào options.ref để dùng chung 1 ref,
// khỏi phải gắn 2 ref lên cùng 1 phần tử.
function useInViewOnce(enabled = true, options = {}) {
  const ownRef = useRef(null);
  const ref = options.ref ?? ownRef;
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
  }, [enabled, seen, threshold, rootMargin, ref]);

  // Môi trường không có IntersectionObserver (test/trình duyệt cũ): coi như đã thấy
  const unsupported = typeof IntersectionObserver === "undefined";
  return [ref, seen || (unsupported && enabled)];
}

export default useInViewOnce;
