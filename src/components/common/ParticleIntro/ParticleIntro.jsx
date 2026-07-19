import { useEffect, useRef, useState, useCallback } from "react";

import "./ParticleIntro.css";

import profile from "../../../data/profile";

// Intro dạng "hacker HUD / glitch" (cảm hứng từ mảng hacking-vision trong
// game & phim hành động — KHÔNG dùng logo/asset của bất kỳ game cụ thể nào):
//   1. SCAN    — 4 góc reticle quét từ mép màn hình vào giữa, HUD phụ hiện lên.
//   2. WARP    — các khối pixel vuông (thay vì hạt tròn) bay vào theo hiệu ứng warp.
//   3. ASSEMBLE— pixel ráp lại thành tên bạn kèm 1-2 nhịp "glitch" (giật khung).
//   4. HOLD    — khung reticle khoá lại quanh tên, dòng terminal gõ chữ dần:
//                ACCESS GRANTED / USER: ... / ROLE: ...
//   5. FADE    — toàn màn hình mờ dần, gọi onFinish().
//
// Hợp đồng props giữ nguyên: onFinish() gọi 1 lần khi chạy xong -> App.jsx
// set isLoading = false. Xem lại intro: remount bằng key={introKey} ở App.jsx.

const PARTICLE_COUNT = 220;
const SCAN_DURATION = 750; // ms
const WARP_DURATION = 1300; // ms
const ASSEMBLE_DURATION = 1200; // ms
const HOLD_DURATION = 1600; // ms
const FADE_DURATION = 600; // ms

const HACK_GREEN = [56, 248, 197]; // cyan-green chính, kiểu "digital ops"
const HACK_MAGENTA = [255, 62, 122]; // glitch tách kênh màu

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function sampleTextPoints(line1, line2, width, height, count) {
  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const ctx = off.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const nameSize = Math.max(28, Math.min(width * 0.07, 82));
  ctx.font = `700 ${nameSize}px "JetBrains Mono", "Courier New", monospace`;
  const nameY = height / 2 - nameSize * 0.32;
  ctx.fillText(line1, width / 2, nameY);

  if (line2) {
    const subSize = Math.max(11, nameSize * 0.2);
    ctx.font = `600 ${subSize}px "JetBrains Mono", "Courier New", monospace`;
    ctx.fillText(line2, width / 2, nameY + nameSize * 0.58);
  }

  const { data } = ctx.getImageData(0, 0, width, height);
  const candidates = [];
  const step = 2;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(y * width + x) * 4 + 3] > 120) candidates.push({ x, y });
    }
  }
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push(candidates.length ? candidates[i % candidates.length] : { x: width / 2, y: height / 2 });
  }
  return points;
}

// Vài dòng "mã băm" giả để trang trí góc màn hình — thuần trang trí, không
// phải dữ liệu thật.
function randomHex(len) {
  const chars = "0123456789ABCDEF";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function ParticleIntro({ onFinish }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const startRef = useRef(null);
  const targetsRef = useRef([]);
  const glitchTickRef = useRef(0);

  const [uiPhase, setUiPhase] = useState("scan"); // scan -> warp -> assemble -> hold -> fade
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [hexTag, setHexTag] = useState(randomHex(8));

  const totalDuration = SCAN_DURATION + WARP_DURATION + ASSEMBLE_DURATION + HOLD_DURATION;

  const initParticles = useCallback(() => {
    const arr = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push({
        angle: Math.random() * Math.PI * 2,
        radius: 6 + Math.random() * 40,
        z: 0.15 + Math.random() * 1,
        speed: 0.6 + Math.random() * 0.9,
        mix: Math.random() > 0.82 ? 1 : 0, // phần lớn xanh cyan, rải rác vài khối magenta
        size: 2 + Math.random() * 2.2,
      });
    }
    particlesRef.current = arr;
  }, []);

  // Timers riêng để đổi phase UI (HUD / reticle / terminal text) đồng bộ với canvas.
  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setUiPhase("warp"), SCAN_DURATION));
    timers.push(setTimeout(() => setUiPhase("assemble"), SCAN_DURATION + WARP_DURATION));
    timers.push(
      setTimeout(() => setUiPhase("hold"), SCAN_DURATION + WARP_DURATION + ASSEMBLE_DURATION)
    );
    const hexTimer = setInterval(() => setHexTag(randomHex(8)), 120);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(hexTimer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d");
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    canvas.width = cw * devicePixelRatio;
    canvas.height = ch * devicePixelRatio;
    canvas.style.width = cw + "px";
    canvas.style.height = ch + "px";
    ctx.scale(devicePixelRatio, devicePixelRatio);

    initParticles();
    targetsRef.current = sampleTextPoints(
      profile.fullName.toUpperCase(),
      profile.role.toUpperCase(),
      cw,
      ch,
      PARTICLE_COUNT
    );

    if (reducedMotion) {
      setUiPhase("hold");
      const finishTimer = setTimeout(() => {
        setUiPhase("fade");
        onFinish && onFinish();
      }, 900);
      return () => clearTimeout(finishTimer);
    }

    const cx = cw / 2;
    const cy = ch / 2;
    const warpStart = SCAN_DURATION;
    const assembleStart = SCAN_DURATION + WARP_DURATION;
    const holdStart = assembleStart + ASSEMBLE_DURATION;

    function draw(ts) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;

      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = "#020604";
      ctx.fillRect(0, 0, cw, ch);

      const particles = particlesRef.current;
      const targets = targetsRef.current;

      let assembleT = 0;
      if (elapsed > assembleStart) {
        assembleT = Math.min(1, (elapsed - assembleStart) / ASSEMBLE_DURATION);
      }
      const assembleEase = easeInOutCubic(assembleT);
      const warpProgress = Math.min(1, Math.max(0, elapsed - warpStart) / WARP_DURATION);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.z -= 0.012 * p.speed * (1 + warpProgress * 2.2);
        if (p.z < 0.05) p.z = 1 + Math.random() * 0.4;
        const persp = 1 / p.z;
        const wx = cx + Math.cos(p.angle) * p.radius * persp;
        const wy = cy + Math.sin(p.angle) * p.radius * persp;

        const target = targets[i];
        const x = assembleEase > 0 ? wx + (target.x - wx) * assembleEase : wx;
        const y = assembleEase > 0 ? wy + (target.y - wy) * assembleEase : wy;

        const size = assembleEase > 0 ? 2 + assembleEase * 1.4 : Math.min(4.2, p.size * persp);
        const alpha = assembleEase > 0 ? 0.6 + assembleEase * 0.4 : Math.min(0.9, persp * 0.32);

        const [r, g, b] = p.mix ? HACK_MAGENTA : HACK_GREEN;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.shadowColor = `rgb(${r}, ${g}, ${b})`;
        ctx.shadowBlur = assembleEase > 0.6 ? 7 : 3;
        // Khối vuông thay vì hình tròn -> cảm giác "pixel dữ liệu" thay vì hạt bụi.
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
      ctx.shadowBlur = 0;

      // Nhịp "glitch": trong lúc chữ vừa ráp xong, xẹt vài dải ngang lệch trục X.
      if (elapsed > assembleStart && elapsed < holdStart + 250) {
        glitchTickRef.current += 1;
        if (glitchTickRef.current % 9 === 0) {
          const bandH = 3 + Math.random() * 10;
          const bandY = Math.random() * ch;
          const shift = (Math.random() - 0.5) * 18;
          const slice = ctx.getImageData(0, bandY, cw, bandH);
          ctx.putImageData(slice, shift, bandY);
        }
      }

      // Vòng sáng nhẹ quanh chữ khi giữ (hold).
      if (elapsed > holdStart) {
        const holdT = Math.min(1, (elapsed - holdStart) / HOLD_DURATION);
        const pulse = 0.5 + 0.5 * Math.sin(holdT * Math.PI * 2 * 0.7);
        const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 260);
        grad.addColorStop(0, `rgba(${HACK_GREEN[0]}, ${HACK_GREEN[1]}, ${HACK_GREEN[2]}, ${0.04 + pulse * 0.03})`);
        grad.addColorStop(1, "rgba(56, 248, 197, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);
      }

      if (elapsed < totalDuration) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        setUiPhase("fade");
        const fadeStart = performance.now();
        function fade(fts) {
          const t = Math.min(1, (fts - fadeStart) / FADE_DURATION);
          setOverlayOpacity(1 - easeOutCubic(t));
          if (t < 1) {
            rafRef.current = requestAnimationFrame(fade);
          } else {
            onFinish && onFinish();
          }
        }
        rafRef.current = requestAnimationFrame(fade);
      }
    }

    rafRef.current = requestAnimationFrame(draw);

    function handleResize() {
      cancelAnimationFrame(rafRef.current);
      startRef.current = null;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(devicePixelRatio, devicePixelRatio);
      targetsRef.current = sampleTextPoints(
        profile.fullName.toUpperCase(),
        profile.role.toUpperCase(),
        w,
        h,
        PARTICLE_COUNT
      );
      rafRef.current = requestAnimationFrame(draw);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="particle-intro" style={{ opacity: overlayOpacity }}>
      <canvas ref={canvasRef} className="particle-intro-canvas" />

      {/* Lớp scanline + vignette kiểu màn hình CRT/HUD */}
      <div className="particle-intro-scanlines" />
      <div className="particle-intro-vignette" />

      {/* Reticle 4 góc — quét vào rồi khoá lại quanh chữ */}
      <div className={`particle-intro-reticle phase-${uiPhase}`}>
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
      </div>

      {/* HUD góc trên trái/phải: mã hex giả, thuần trang trí */}
      <div className="particle-intro-hud hud-tl">
        <span>SYS://SCAN_{hexTag}</span>
      </div>
      <div className="particle-intro-hud hud-tr">
        <span>NODE.{uiPhase.toUpperCase()}</span>
      </div>

      {/* Terminal text — chỉ hiện khi vào phase "hold" */}
      {(uiPhase === "hold" || uiPhase === "fade") && (
        <div className="particle-intro-terminal">
          <p className="term-line term-access">&gt; ACCESS GRANTED</p>
          <p className="term-line term-delay-1">&gt; USER: {profile.fullName}</p>
          <p className="term-line term-delay-2">&gt; ROLE: {profile.role}</p>
        </div>
      )}
    </div>
  );
}

export default ParticleIntro;
