import { useEffect, useState } from "react";
import useUi from "../../hooks/useUi";
import { lockScroll, unlockScroll } from "../../lib/lenis";
import "./UiverseLoader.css";

const MIN_VISIBLE_MS = 1400;
const MAX_VISIBLE_MS = 2600;
const EXIT_MS = 850;

function UiverseLoader() {
  const { setReady } = useUi();
  const [phase, setPhase] = useState("show");

  useEffect(() => {
    window.scrollTo(0, 0);
    lockScroll();

    let ended = false;
    const timers = [];

    const end = () => {
      if (ended) return;
      ended = true;
      setReady(true);
      unlockScroll();
      setPhase("exit");
      timers.push(setTimeout(() => setPhase("gone"), EXIT_MS));
    };

    timers.push(setTimeout(end, MIN_VISIBLE_MS));
    timers.push(setTimeout(end, MAX_VISIBLE_MS));

    if (document.readyState === "complete") {
      timers.push(setTimeout(end, MIN_VISIBLE_MS));
    } else {
      window.addEventListener("load", () => timers.push(setTimeout(end, MIN_VISIBLE_MS)), { once: true });
    }

    return () => {
      timers.forEach(clearTimeout);
      unlockScroll();
    };
  }, [setReady]);

  if (phase === "gone") return null;

  return (
    <div className={`bl uiverse-loader ${phase === "exit" ? "uiverse-loader--exit" : ""}`}>
      <div className="pl">
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__text">Loading…</div>
      </div>
    </div>
  );
}

export default UiverseLoader;