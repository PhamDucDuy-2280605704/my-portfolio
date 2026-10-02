import { useEffect } from "react";

import useSpring from "../../hooks/useSpring";

// Reveal khi vào viewport ("Inview"): phần tử bắt đầu ở trạng thái `from`
// (VD { opacity: 0, y: 28 }) rồi spring tới `to` đúng 1 LẦN, lần đầu nó vào
// viewport, sau khoảng trễ `delay` (ms). enabled=false -> chờ (dùng cho các
// khối bị loader giữ lại).
function Inview({
  from,
  to,
  delay = 0,
  config = { tension: 200, friction: 26 },
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
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
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
