import { useCallback, useLayoutEffect, useRef, useState } from "react";

// Spring tối giản theo mô hình { tension, friction } của react-spring:
//   v += (-tension * (x - target) - friction * v) * dt;  x += v * dt
// Giá trị được ghi THẲNG vào style của phần tử (không setState) nên không
// gây re-render ở mỗi khung hình.
//
// Các thuộc tính hỗ trợ: opacity, x, y, scale, scaleX, rotate.
// Mặc định x/y tính bằng px; đổi đơn vị qua options.units (VD { x: "%" }).

const REST_VELOCITY = 0.01;
const REST_DISTANCE = 0.001;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function composeTransform(v, units) {
  const x = v.x ?? 0;
  const y = v.y ?? 0;
  const parts = [];

  if (x || y) parts.push(`translate3d(${x}${units.x ?? "px"},${y}${units.y ?? "px"},0)`);
  if (v.rotate) parts.push(`rotate(${v.rotate}deg)`);
  if (v.scale !== undefined && v.scale !== 1) parts.push(`scale(${v.scale})`);
  if (v.scaleX !== undefined && v.scaleX !== 1) parts.push(`scaleX(${v.scaleX})`);

  return parts.join(" ") || "none";
}

export function useSpring(initial, options = {}) {
  const ref = useRef(null);
  // Trạng thái động học nằm trong 1 object ổn định (tạo 1 lần), được cập nhật
  // trực tiếp trong rAF — không đi qua React state nên không gây re-render.
  const [store] = useState(() => ({
    vals: { ...initial },
    vel: {},
    target: { ...initial },
    raf: 0,
    last: 0,
    timer: 0,
    config: options.config ?? { tension: 200, friction: 26 },
    units: options.units ?? {},
  }));

  const apply = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { vals, units } = store;

    if (vals.opacity !== undefined) el.style.opacity = String(vals.opacity);
    el.style.transform = composeTransform(vals, units);
  }, [store]);

  const tick = useCallback(
    function step(now) {
      const s = store;
      const dt = Math.min((now - s.last) / 1000, 1 / 30);
      s.last = now;
      let moving = false;

      for (const key in s.target) {
        const target = s.target[key];
        let x = s.vals[key];
        let v = s.vel[key] ?? 0;

        // Chia nhỏ bước tích phân để ổn định với tension lớn
        const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
          v += (-s.config.tension * (x - target) - s.config.friction * v) * h;
          x += v * h;
        }

        const settled =
          Math.abs(v) < REST_VELOCITY && Math.abs(x - target) < REST_DISTANCE * Math.max(1, Math.abs(target));
        if (settled) {
          x = target;
          v = 0;
        } else {
          moving = true;
        }

        s.vals[key] = x;
        s.vel[key] = v;
      }

      apply();
      s.raf = moving ? requestAnimationFrame(step) : 0;
    },
    [apply, store]
  );

  const start = useCallback(
    (to, config, delay = 0) => {
      const s = store;
      clearTimeout(s.timer);

      const go = () => {
        if (config) s.config = config;
        s.target = { ...s.target, ...to };

        if (prefersReducedMotion()) {
          Object.assign(s.vals, to);
          s.vel = {};
          apply();
          return;
        }

        if (!s.raf) {
          s.last = performance.now();
          s.raf = requestAnimationFrame(tick);
        }
      };

      if (delay > 0) s.timer = setTimeout(go, delay);
      else go();
    },
    [apply, tick, store]
  );

  useLayoutEffect(() => {
    apply();
    const s = store;
    return () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      clearTimeout(s.timer);
    };
  }, [apply, store]);

  return { ref, start };
}

export default useSpring;
