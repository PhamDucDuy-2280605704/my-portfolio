import { useEffect } from "react";

import useSpring from "../../hooks/useSpring";

// Reveal khi cuộn tới ("Inview"): phần tử ẩn sẵn ở trạng thái `from` và chỉ hiện
// (spring tới `to`) đúng 1 LẦN, khi mép trên của nó đi vào ~10% đáy viewport,
// sau khoảng trễ `delay` (ms). Mặc định là "trồi lên + hiện dần" cho MỌI khối để
// cả trang đồng bộ; chỉ truyền from/to/config khi cần kiểu riêng (VD scale).
// enabled=false -> chờ (dùng cho các khối bị loader giữ lại).
const RISE_FROM = { opacity: 0, y: 32 };
const RISE_TO = { opacity: 1, y: 0 };
const RISE_CONFIG = { tension: 190, friction: 26 };

function Inview({
  from = RISE_FROM,
  to = RISE_TO,
  delay = 0,
  config = RISE_CONFIG,
  enabled = true,
  as: Tag = "div",
  className,
  children,
  ...rest
}) {
  const { ref, start } = useSpring(from, { config });

  useEffect(() => {
    if (!enabled) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      start(to, config, delay);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start(to, config, delay);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
    // from/to là object literal mới mỗi lần render -> chỉ phụ thuộc enabled
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return (
    <Tag
      ref={ref}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Inview;
