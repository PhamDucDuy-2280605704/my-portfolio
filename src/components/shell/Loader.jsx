import { useEffect, useState } from "react";

import useUi from "../../hooks/useUi";
import useLanguage from "../../hooks/useLanguage";
import landing from "../../data/landing";
import { lockScroll, unlockScroll } from "../../lib/lenis";
import "./UiverseLoader.css";

const MIN_VISIBLE_MS = 1400;
const MAX_VISIBLE_MS = 2600;
const EXIT_MS = 850;

// Màn intro: 12 dot xoay 3D (Uiverse) phủ toàn viewport, rồi trượt lên để lộ hero.
// Khi đếm xong: ready = true (hero bắt đầu animate vào), mở khoá cuộn,
// kéo màn lên trong EXIT_MS.
//
// Logic thời gian giống Loader cũ:
//  - Sau sự kiện window "load" đếm MIN_VISIBLE_MS rồi kết thúc.
//  - Nếu "load" không tới, ép kết thúc ở MAX_VISIBLE_MS.
//  - prefers-reduced-motion -> rút còn ~200ms và bỏ hiệu ứng trượt.
function UiverseLoader() {
  const { setReady } = useUi();
  const { tr } = useLanguage();
  const [phase, setPhase] = useState("show"); // show | exit | gone

  useEffect(() => {
    window.scrollTo(0, 0);
    lockScroll();

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      className={`uiverse-loader${phase === "exit" ? " uiverse-loader--exit" : ""}`}
      role="status"
      aria-label={tr(landing.loader.label)}
    >
      <div className="pl">
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__text">Loading…</div>
      </div>
    </div>
  );
}

export default UiverseLoader;