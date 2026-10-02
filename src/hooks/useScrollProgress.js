import { useEffect, useRef } from "react";

// Gọi onProgress(p) mỗi khung hình khi cuộn, với p chạy 0 -> 1:
// 0 khi mép TRÊN phần tử chạm đáy viewport, 1 khi mép DƯỚI phần tử chạm đỉnh viewport.
// Dùng cho parallax gắn với tiến độ cuộn.
function useScrollProgress(ref, onProgress) {
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });

  useEffect(() => {
    let raf = 0;

    const calc = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      cb.current(p);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    calc();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref]);
}

export default useScrollProgress;
