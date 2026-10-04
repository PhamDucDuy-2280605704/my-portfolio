import { useEffect, useState } from "react";

import useLanguage from "../../hooks/useLanguage";
import useUi from "../../hooks/useUi";
import { prefersReducedMotion } from "../../hooks/useSpring";
import landing from "../../data/landing";
import { lockScroll, unlockScroll } from "../../lib/lenis";
import "./Loader.css";

// Một vòng animation của 12 dot dài 2s -> giữ màn tối thiểu 2s để hiệu ứng chạy trọn 1 vòng.
const MIN_VISIBLE_MS = 2000;
const MAX_VISIBLE_MS = 3200;
const EXIT_MS = 850;
const DOTS = Array.from({ length: 12 }, (_, i) => i);

// Màn intro: vòng 12 dot xoay 3D (Uiverse) phủ toàn viewport rồi trượt lên để lộ hero.
// Khi đếm xong: ready = true (hero bắt đầu animate vào), mở khoá cuộn, kéo màn lên trong EXIT_MS.
//
//  - Sau sự kiện window "load" đếm MIN_VISIBLE_MS rồi kết thúc.
//  - Nếu "load" không tới, ép kết thúc ở MAX_VISIBLE_MS.
//  - prefers-reduced-motion -> rút còn ~200ms và bỏ hiệu ứng trượt.
function Loader() {
  const { setReady } = useUi();
  const { tr } = useLanguage();
  const [phase, setPhase] = useState("show"); // show | exit | gone

  useEffect(() => {
    window.scrollTo(0, 0);
    lockScroll();

    const reduced = prefersReducedMotion();
    const minVisible = reduced ? 200 : MIN_VISIBLE_MS;
    let ended = false;
    let locked = true;
    const timers = [];

    const end = () => {
      if (ended) return;
      ended = true;
      locked = false; // đã mở khoá ở đây -> cleanup bên dưới không mở khoá lần 2
      setReady(true);
      unlockScroll();
      setPhase("exit");
      timers.push(setTimeout(() => setPhase("gone"), reduced ? 0 : EXIT_MS));
    };

    const startCountdown = () => timers.push(setTimeout(end, minVisible));

    timers.push(setTimeout(end, MAX_VISIBLE_MS));
    if (document.readyState === "complete") startCountdown();
    else window.addEventListener("load", startCountdown, { once: true });

    return () => {
      window.removeEventListener("load", startCountdown);
      timers.forEach(clearTimeout);
      // StrictMode / unmount giữa chừng: trả lại khoá để không kẹt scroll
      if (locked) unlockScroll();
    };
  }, [setReady]);

  if (phase === "gone") return null;

  const label = tr(landing.loader.label);

  return (
    <div
      className={`loader${phase === "exit" ? " loader--exit" : ""}`}
      role="status"
      aria-label={label}
    >
      <div className="pl" aria-hidden="true">
        {DOTS.map((i) => (
          <div key={i} className="pl__dot" />
        ))}
        <div className="pl__text">{label}…</div>
      </div>
    </div>
  );
}

export default Loader;
