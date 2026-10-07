import { useEffect } from "react";

import useInViewOnce from "../../hooks/useInViewOnce";
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
  // Theo dõi phần tử vào viewport bằng hook dùng chung (dùng chung ref với spring).
  // `seen` chuyển true đúng 1 lần; nếu trình duyệt không có IntersectionObserver
  // thì hook coi như đã thấy ngay khi enabled -> khối không bị kẹt ở trạng thái ẩn.
  const [, seen] = useInViewOnce(enabled, { ref });

  useEffect(() => {
    if (seen) start(to, config, delay);
    // from/to/config là object literal mới mỗi lần render -> chỉ chạy khi `seen` đổi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen]);

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
