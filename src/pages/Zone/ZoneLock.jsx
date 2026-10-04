import { useEffect, useRef, useState } from "react";

import "./ZoneLock.css";

const DIGITS = Array.from({ length: 10 }, (_, n) => n);
const DIAL_COUNT = 4;
const STEP_DEG = 36; // 360° / 10 mặt
const WHEEL_THROTTLE_MS = 140;

// Số nấc quay NGẮN NHẤT từ chữ số a sang b (trong khoảng -5..+4) — vòng 9 -> 0 chỉ quay 1 nấc
// thay vì tua ngược cả vòng.
const shortestDelta = (a, b) => ((b - a + 15) % 10) - 5;

// Chuỗi người dùng nhập -> mảng 4 chữ số (thiếu/sai ký tự thì coi là 0)
function toDigits(value) {
  return Array.from({ length: DIAL_COUNT }, (_, i) => {
    const n = Number(value?.[i]);
    return Number.isInteger(n) && n >= 0 && n <= 9 ? n : 0;
  });
}

// Một bánh xoay 3D: 10 mặt xếp thành khối trụ, quay quanh trục X.
// Bấm vào mặt bất kỳ, lăn chuột, hoặc dùng bàn phím (↑↓←→ hay gõ thẳng số) để chọn chữ số.
function Dial({
  index,
  digit,
  disabled,
  onSelect,
  onType,
  onBackspace,
  onSubmit,
}) {
  const rootRef = useRef(null);
  const lastWheel = useRef(0);
  // Góc quay lưu cộng dồn để luôn xoay đường ngắn nhất (state phái sinh từ `digit`)
  const [spin, setSpin] = useState({ digit, deg: digit * STEP_DEG });
  let deg = spin.deg;
  if (spin.digit !== digit) {
    deg = spin.deg + shortestDelta(spin.digit, digit) * STEP_DEG;
    setSpin({ digit, deg });
  }

  // Lăn chuột đổi số — phải là listener không-passive để chặn cuộn trang
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      if (disabled) return;
      e.preventDefault();
      const now = performance.now();
      if (now - lastWheel.current < WHEEL_THROTTLE_MS) return;
      lastWheel.current = now;
      onSelect(index, (digit + (e.deltaY > 0 ? 1 : 9)) % 10);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [disabled, digit, index, onSelect]);

  function handleKeyDown(e) {
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      onType(index, Number(e.key));
    } else if (e.key === "Backspace") {
      e.preventDefault();
      onBackspace(index);
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div
      ref={rootRef}
      className="zl-dial"
      role="radiogroup"
      aria-label={`Chữ số ${index + 1}`}
      onKeyDown={handleKeyDown}
    >
      <div className="zl-drum" style={{ transform: `rotateX(${deg}deg)` }}>
        {DIGITS.map((n) => (
          <div
            key={n}
            className={`zl-face${n === digit ? " is-active" : ""}`}
            style={{ "--n": n }}
          >
            <input
              type="radio"
              name={`zone-dial-${index}`}
              className="zl-radio"
              checked={n === digit}
              disabled={disabled}
              aria-label={String(n)}
              onChange={() => onSelect(index, n)}
            />
            <span aria-hidden="true">{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Khoá số 3D (4 bánh) thay cho ô nhập mật khẩu.
//   value     : chuỗi 4 chữ số hiện tại ("0000" khi mới vào / sau khi nhập sai)
//   onChange  : (chuỗi mới) => void
//   onSubmit  : gọi khi nhấn Enter trong khoá (nút "Truy cập" cũng submit form cha)
//   hint      : dòng gợi ý hiển thị dưới khoá
//   focusKey  : tăng giá trị này để kéo focus về bánh đầu (VD sau mỗi lần nhập sai)
function ZoneLock({
  value,
  onChange,
  onSubmit,
  disabled = false,
  hint,
  focusKey = 0,
}) {
  const digits = toDigits(value);
  const dialsRef = useRef(null);

  const focusDial = (i) =>
    dialsRef.current?.children[i]
      ?.querySelector("input:checked")
      ?.focus({ preventScroll: true });

  // Vào trang / hết khoá tạm / sau mỗi lần nhập sai: focus bánh đầu để gõ được ngay
  useEffect(() => {
    if (!disabled) focusDial(0);
  }, [disabled, focusKey]);

  function select(i, n) {
    const next = [...digits];
    next[i] = n;
    onChange(next.join(""));
  }

  return (
    <div className="zl" data-disabled={disabled || undefined}>
      <div ref={dialsRef} className="zl-dials">
        {digits.map((digit, i) => (
          <Dial
            key={i}
            index={i}
            digit={digit}
            disabled={disabled}
            onSelect={select}
            onType={(idx, n) => {
              select(idx, n);
              // Gõ số xong tự nhảy sang bánh kế tiếp. Làm ĐỒNG BỘ (radio đang chọn của bánh kế đã có
              // sẵn trong DOM) để gõ nhanh nhiều phím liên tiếp vẫn vào đúng bánh.
              focusDial(Math.min(idx + 1, DIAL_COUNT - 1));
            }}
            onBackspace={(idx) => {
              select(idx, 0);
              focusDial(Math.max(idx - 1, 0));
            }}
            onSubmit={onSubmit}
          />
        ))}
      </div>

      {hint && (
        <p className="zl-hint">
          Gợi ý <strong>{hint}</strong>
        </p>
      )}
    </div>
  );
}

export default ZoneLock;
