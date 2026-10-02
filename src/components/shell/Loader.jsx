import { useEffect, useState } from "react";

import useUi from "../../hooks/useUi";
import useSpring, { prefersReducedMotion } from "../../hooks/useSpring";
import useLanguage from "../../hooks/useLanguage";
import landing from "../../data/landing";
import profile from "../../data/profile";
import { lockScroll, unlockScroll } from "../../lib/lenis";
import { BrandMark } from "../ui/Icons";
import "./Loader.css";

const MIN_VISIBLE_MS = 1400;
const MAX_VISIBLE_MS = 2600;
const EXIT_MS = 850;

// Màn intro: tấm màn navy phủ toàn viewport (wordmark + thanh tiến độ), rồi
// trượt lên để lộ hero. Khi đếm xong: ready = true (hero bắt đầu animate vào),
// mở khoá cuộn, kéo màn lên trong EXIT_MS.
//
// Logic thời gian: sau sự kiện window "load" đếm MIN_VISIBLE_MS rồi kết thúc;
// nếu "load" không tới, ép kết thúc ở MAX_VISIBLE_MS. prefers-reduced-motion
// -> rút còn ~200ms và bỏ hiệu ứng trượt.
function Loader() {
  const { setReady } = useUi();
  const { tr } = useLanguage();
  const [phase, setPhase] = useState("show"); // show | exit | gone
  const { ref: markRef, start } = useSpring({ opacity: 0, y: 16 }, { config: { tension: 200, friction: 22 } });

  useEffect(() => {
    start({ opacity: 1, y: 0 });
  }, [start]);

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
      locked = false;
      setReady(true);
      unlockScroll();
      setPhase("exit");
      timers.push(setTimeout(() => setPhase("gone"), reduced ? 0 : EXIT_MS));
    };

    const startCountdown = () => timers.push(setTimeout(end, minVisible));

    // Nếu "load" không tới thì ép kết thúc ở MAX_VISIBLE_MS
    timers.push(setTimeout(end, MAX_VISIBLE_MS));

    if (document.readyState === "complete") startCountdown();
    else window.addEventListener("load", startCountdown, { once: true });

    return () => {
      window.removeEventListener("load", startCountdown);
      timers.forEach(clearTimeout);
      // StrictMode/unmount giữa chừng: trả lại khoá để không kẹt scroll
      if (locked) unlockScroll();
    };
  }, [setReady]);

  if (phase === "gone") return null;

  return (
    <div
      className={`loader${phase === "exit" ? " loader--exit" : ""}`}
      role="status"
      aria-label={tr(landing.loader.label)}
    >
      <div
        ref={markRef}
        className="loader-brand"
      >
        <BrandMark className="loader-mark" />
        <span>{profile.fullName}</span>
      </div>

      <div className="loader-track">
        <div
          className="loader-fill"
          style={{ animationDuration: `${(prefersReducedMotion() ? 200 : MIN_VISIBLE_MS) - 120}ms` }}
        />
      </div>
    </div>
  );
}

export default Loader;
