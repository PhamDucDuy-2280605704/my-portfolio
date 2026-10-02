import { useEffect, useState } from "react";

import useInViewOnce from "../../hooks/useInViewOnce";

// Ba kiểu reveal chữ dùng chung:
//  - StackedLines : mỗi dòng nằm trong hộp overflow:hidden, trượt lên (clip-mask).
//  - ClipWords    : từng TỪ trượt lên từ sau mặt nạ (tiêu đề hero, từ "ma").
//  - FadeWords    : từng từ mờ dần + nhích lên (đoạn thân bài).
//
// Muốn chạy lại khi nội dung đổi (carousel) -> đặt `key` khác từ bên ngoài,
// component sẽ mount lại và phát lại hiệu ứng.

function useRevealState(enabled) {
  const [ref, seen] = useInViewOnce(enabled);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!seen) return undefined;
    // 2 khung hình để trình duyệt kịp vẽ trạng thái ẩn trước khi chuyển
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [seen]);

  return [ref, shown];
}

export function StackedLines({
  lines,
  as: Tag = "span",
  className,
  stagger = 120,
  baseDelay = 0,
  duration = 950,
  enabled = true,
  ...rest
}) {
  const [ref, shown] = useRevealState(enabled);

  return (
    <Tag
      ref={ref}
      className={className}
      aria-label={lines.join(" ")}
      {...rest}
    >
      {lines.map((line, i) => (
        <span
          key={`${i}-${line}`}
          aria-hidden="true"
          className={`clip${shown ? " is-revealed" : ""}`}
        >
          <span
            className="clip-in"
            style={{ transitionDuration: `${duration}ms`, transitionDelay: `${baseDelay + i * stagger}ms` }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

export function ClipWords({
  text,
  as: Tag = "span",
  className,
  wordStagger = 140,
  baseDelay = 0,
  duration = 1100,
  enabled = true,
  ...rest
}) {
  const [ref, shown] = useRevealState(enabled);
  const words = text.split(" ");

  return (
    <Tag
      ref={ref}
      className={className}
      aria-label={text}
      {...rest}
    >
      {words.map((word, i) => (
        <span
          key={`${i}-${word}`}
          aria-hidden="true"
        >
          <span className={`clip-inline${shown ? " is-revealed" : ""}`}>
            <span
              className="clip-in"
              style={{ transitionDuration: `${duration}ms`, transitionDelay: `${baseDelay + i * wordStagger}ms` }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

export function FadeWords({
  text,
  as: Tag = "p",
  className,
  wordStagger = 28,
  baseDelay = 250,
  duration = 700,
  enabled = true,
  ...rest
}) {
  const [ref, shown] = useRevealState(enabled);
  const words = text.split(" ");

  return (
    <Tag
      ref={ref}
      className={className}
      aria-label={text}
      {...rest}
    >
      {words.map((word, i) => (
        <span
          key={`${i}-${word}`}
          aria-hidden="true"
        >
          <span
            className={`fade-word${shown ? " is-revealed" : ""}`}
            style={{ transitionDuration: `${duration}ms`, transitionDelay: `${baseDelay + i * wordStagger}ms` }}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
