import { useEffect, useRef, useState, useCallback } from "react";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

import "./ParticleIntro.css";

import profile from "../../../data/profile";

// Intro kiểu "briefing nhập vai" — lấy cảm hứng từ màn hình khởi động chiến
// dịch của Tom Clancy's Ghost Recon: Wildlands (không sao chép nội dung/hình
// ảnh cụ thể nào, chỉ mượn tinh thần: quét dữ liệu -> khoá hồ sơ -> hiện
// briefing kèm hiệu ứng âm thanh máy (không có giọng đọc)). Các bước:
//   0. GATE      — màn chờ, phải bấm mới bắt đầu (bắt buộc để trình duyệt
//      cho phép phát âm thanh; đồng thời hợp lý về mặt nội dung: "nhấn để
//      khởi tạo hồ sơ").
//   1. SCAN      — frame 4 góc quét từ mép màn hình vào, cross-line xuất hiện.
//   2. WARP      — khối pixel lạnh bay vào theo hiệu ứng warp.
//   3. ASSEMBLE  — pixel ráp thành hình tên bạn, 1 nhịp glitch nhẹ khi vừa xong.
//   4. HOLD      — chữ THẬT (DOM, sắc nét) đè lên đúng chỗ vừa ráp + terminal
//      log ACCESS GRANTED / USER / ROLE / STATUS.
//   5. BRIEF     — "hồ sơ nhân sự" mở rộng (vai trò, địa điểm, trạng thái,
//      quote cá nhân) + chuỗi bíp máy quét nhẹ mỗi khi 1 dòng hồ sơ hiện ra.
//   6. FADE      — toàn màn hình mờ dần, gọi onFinish().
//
// Hợp đồng props: onFinish() gọi 1 lần khi chạy xong -> App.jsx set isLoading=false.
// Xem lại: remount bằng key={introKey} ở App.jsx (chỉ có ở trang chủ).

const PARTICLE_COUNT = 340;
const SCAN_DURATION = 700; // ms
const WARP_DURATION = 1250; // ms
const ASSEMBLE_DURATION = 1350; // ms
const HOLD_DURATION = 2200; // ms
const BRIEF_DURATION = 5200; // ms — đủ để đọc hết hồ sơ + nghe chuỗi bíp
const FADE_DURATION = 650; // ms

// Tông cyan đồng bộ với --color-primary (#22d3ee) / bản đậm hơn của nó,
// khớp với CSS mới (rgba(var(--color-primary-rgb), *))
const COLD_A = [34, 211, 238];
const COLD_B = [14, 165, 190];

const PHASE_ORDER = ["gate", "scan", "warp", "assemble", "hold", "brief", "fade"];

// Vài dòng "log khởi động" chạy nhanh lúc quét — thuần hiệu ứng, tăng cảm
// giác "hệ thống đang truy cập", không phải log thật.
const BOOT_LINES = [
  "INIT KERNEL...",
  "MOUNTING SECURE_FS...",
  "DECRYPTING PROFILE...",
  "HANDSHAKE OK",
];

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

  const nameSize = Math.max(28, Math.min(width * 0.075, 88));
  ctx.font = `700 ${nameSize}px "Courier New", monospace`;
  const nameY = height / 2 - nameSize * 0.34;
  ctx.fillText(line1, width / 2, nameY);

  if (line2) {
    const subSize = Math.max(11, nameSize * 0.2);
    ctx.font = `600 ${subSize}px "Courier New", monospace`;
    ctx.fillText(line2, width / 2, nameY + nameSize * 0.6);
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

function randomHex(len) {
  const chars = "0123456789ABCDEF";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// ===== Âm thanh tổng hợp bằng Web Audio API — KHÔNG dùng file audio, toàn
// bộ tiếng bíp/tĩnh điện được tạo bằng oscillator/noise buffer ngay trong
// trình duyệt, nên không cần asset ngoài và không phát sinh HTTP request. =====

// 1 tiếng bíp ngắn kiểu máy quét, dao động tần số freq trong duration giây.
function playBeep(audioCtx, { freq = 880, duration = 0.08, type = "sine", gain = 0.05 } = {}) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(gain, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// 1 chuỗi bíp lên tông (2 nốt) — dùng cho khoảnh khắc "ACCESS GRANTED".
function playConfirmChime(audioCtx) {
  if (!audioCtx) return;
  playBeep(audioCtx, { freq: 520, duration: 0.09, gain: 0.045 });
  setTimeout(() => playBeep(audioCtx, { freq: 780, duration: 0.14, gain: 0.05 }), 90);
}

// Tiếng "tĩnh điện radio" ngắn — noise buffer, dùng lúc quét/mở hồ sơ.
function playStaticBurst(audioCtx, duration = 0.22, gain = 0.02) {
  if (!audioCtx) return;
  const bufferSize = Math.floor(audioCtx.sampleRate * duration);
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.7;
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(gain, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  noise.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  noise.start();
}

// (Đã bỏ phần đọc bằng giọng tổng hợp theo yêu cầu — giờ chỉ còn hiệu ứng
// âm thanh: bíp máy quét + tĩnh điện radio, không có giọng đọc.)

function ParticleIntro({ onFinish }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const startRef = useRef(null);
  const targetsRef = useRef([]);
  const glitchTickRef = useRef(0);
  const progressBarRef = useRef(null);
  const audioCtxRef = useRef(null);
  const briefTriggeredRef = useRef(false);
  const mutedRef = useRef(false);

  // uiPhase: gate -> scan -> warp -> assemble -> hold -> brief -> fade
  const [uiPhase, setUiPhase] = useState("gate");
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [hexTag, setHexTag] = useState(randomHex(8));
  const [bootLineCount, setBootLineCount] = useState(0);
  const [caseId, setCaseId] = useState(() => String(Math.floor(Math.random() * 900000) + 100000));

  const phaseIndex = PHASE_ORDER.indexOf(uiPhase);

  const totalDuration =
    SCAN_DURATION + WARP_DURATION + ASSEMBLE_DURATION + HOLD_DURATION + BRIEF_DURATION;

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const beep = useCallback((options) => {
    if (mutedRef.current) return;
    playBeep(audioCtxRef.current, options);
  }, []);

  const staticBurst = useCallback((duration, gain) => {
    if (mutedRef.current) return;
    playStaticBurst(audioCtxRef.current, duration, gain);
  }, []);

  // Bấm "NHẤN ĐỂ KHỞI TẠO" ở màn gate: mở AudioContext (bắt buộc phải có cử
  // chỉ người dùng thì trình duyệt mới cho phát âm thanh) rồi bắt đầu chuỗi
  // hiệu ứng thật sự.
  const handleStart = useCallback(() => {
    if (started) return;

    if (typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext)) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      try {
        audioCtxRef.current = new Ctx();
      } catch {
        audioCtxRef.current = null;
      }
    }

    if (!mutedRef.current) staticBurst(0.18, 0.025);

    setStarted(true);
    setUiPhase("scan");
  }, [started, staticBurst]);

  const initParticles = useCallback(() => {
    const arr = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push({
        angle: Math.random() * Math.PI * 2,
        radius: 6 + Math.random() * 40,
        z: 0.15 + Math.random() * 1,
        speed: 0.6 + Math.random() * 0.9,
        mix: Math.random(),
        size: 1.8 + Math.random() * 2,
      });
    }
    particlesRef.current = arr;
  }, []);

  // Timers riêng đổi phase UI (frame / HUD / terminal) đồng bộ với canvas —
  // chỉ chạy SAU khi người dùng bấm bắt đầu ở màn gate.
  useEffect(() => {
    if (!started) return undefined;

    const timers = [];

    timers.push(setTimeout(() => setUiPhase("warp"), SCAN_DURATION));

    timers.push(
      setTimeout(() => {
        setUiPhase("assemble");
        beep({ freq: 620, duration: 0.1, gain: 0.04 });
      }, SCAN_DURATION + WARP_DURATION)
    );

    timers.push(
      setTimeout(() => {
        setUiPhase("hold");
        playConfirmChime(audioCtxRef.current && !mutedRef.current ? audioCtxRef.current : null);
      }, SCAN_DURATION + WARP_DURATION + ASSEMBLE_DURATION)
    );

    // Bước sang "brief": phát tiếng tĩnh điện ngắn, rồi 1 tiếng bíp nhỏ mỗi
    // khi 1 dòng hồ sơ hiện ra (khớp với delay-1/2/3/4 trong CSS) — thay cho
    // giọng đọc, giữ cảm giác "máy đang xử lý dữ liệu" thuần bằng âm thanh.
    timers.push(
      setTimeout(() => {
        setUiPhase("brief");
        staticBurst(0.16, 0.02);

        [
          { delay: 400, freq: 720 },
          { delay: 800, freq: 780 },
          { delay: 1200, freq: 840 },
          { delay: 1600, freq: 900 },
        ].forEach(({ delay, freq }) => {
          timers.push(
            setTimeout(() => beep({ freq, duration: 0.05, gain: 0.03 }), delay)
          );
        });
      }, SCAN_DURATION + WARP_DURATION + ASSEMBLE_DURATION + HOLD_DURATION)
    );

    const hexTimer = setInterval(() => setHexTag(randomHex(8)), 140);

    // Case ID "chạy số" ngẫu nhiên (như khoá vân tay) trong lúc scan+warp,
    // rồi ĐỨNG YÊN (khoá lại) ngay khi bước vào assemble — tạo cảm giác
    // "đã xác định xong hồ sơ".
    const assembleStartsAt = SCAN_DURATION + WARP_DURATION;
    const caseIdTimer = setInterval(() => {
      setCaseId(String(Math.floor(Math.random() * 900000) + 100000));
    }, 70);
    timers.push(setTimeout(() => clearInterval(caseIdTimer), assembleStartsAt));

    // Boot log chạy nhanh trong pha scan+warp, xong trước khi vào assemble.
    const bootWindow = SCAN_DURATION + WARP_DURATION;
    const stepTime = bootWindow / (BOOT_LINES.length + 1);
    BOOT_LINES.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setBootLineCount(i + 1);
          beep({ freq: 1100 + i * 60, duration: 0.03, gain: 0.02 });
        }, stepTime * (i + 1))
      );
    });

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(hexTimer);
      clearInterval(caseIdTimer);
    };
  }, [started, beep, staticBurst]);

  useEffect(() => {
    if (!started) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

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
      if (progressBarRef.current) progressBarRef.current.style.width = "60%";
      playConfirmChime(mutedRef.current ? null : audioCtxRef.current);

      // Không có hiệu ứng bay, nhưng vẫn giữ đủ lâu để đọc rõ tên + vai trò
      // + terminal log, rồi mới sang phần hồ sơ mở rộng (brief).
      const briefTimer = setTimeout(() => {
        setUiPhase("brief");
        if (!mutedRef.current) {
          staticBurst(0.16, 0.02);
          [720, 780, 840, 900].forEach((freq, i) => {
            setTimeout(() => beep({ freq, duration: 0.05, gain: 0.03 }), i * 260);
          });
        }
        if (progressBarRef.current) progressBarRef.current.style.width = "100%";
      }, 2400);

      const finishTimer = setTimeout(() => {
        setUiPhase("fade");
        onFinish && onFinish();
      }, 2400 + 3600);

      return () => {
        clearTimeout(briefTimer);
        clearTimeout(finishTimer);
      };
    }

    const cx = cw / 2;
    const cy = ch / 2;
    const warpStart = SCAN_DURATION;
    const assembleStart = SCAN_DURATION + WARP_DURATION;
    const holdStart = assembleStart + ASSEMBLE_DURATION;
    const briefStart = holdStart + HOLD_DURATION;

    function draw(ts) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;

      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = "#05090c";
      ctx.fillRect(0, 0, cw, ch);

      const particles = particlesRef.current;
      const targets = targetsRef.current;

      let assembleT = 0;
      if (elapsed > assembleStart) {
        assembleT = Math.min(1, (elapsed - assembleStart) / ASSEMBLE_DURATION);
      }
      const assembleEase = easeInOutCubic(assembleT);

      let warpProgress = 0;
      if (elapsed > warpStart) {
        warpProgress = Math.min(1, (elapsed - warpStart) / WARP_DURATION);
      }

      // Sau khi đã ráp xong tên (bước sang hold/brief), pixel mờ dần để
      // nhường chỗ cho chữ thật (DOM) sắc nét đè lên trên.
      let particleFade = 1;
      if (elapsed > holdStart) {
        particleFade = Math.max(0, 1 - (elapsed - holdStart) / 500);
      }

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

        const size = assembleEase > 0 ? 2.1 + assembleEase * 1.5 : Math.min(4.2, p.size * persp);
        const alpha =
          (assembleEase > 0 ? 0.55 + assembleEase * 0.4 : Math.min(0.85, persp * 0.3)) * particleFade;

        const [r1, g1, b1] = COLD_A;
        const [r2, g2, b2] = COLD_B;
        const r = Math.round(r1 * (1 - p.mix) + r2 * p.mix);
        const g = Math.round(g1 * (1 - p.mix) + g2 * p.mix);
        const b = Math.round(b1 * (1 - p.mix) + b2 * p.mix);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.shadowColor = `rgb(${r}, ${g}, ${b})`;
        ctx.shadowBlur = assembleEase > 0.6 ? 6 : 2;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
      ctx.shadowBlur = 0;

      // 1 nhịp glitch duy nhất ngay khi vừa ráp xong — không lặp lại liên tục.
      if (elapsed > assembleStart + ASSEMBLE_DURATION * 0.75 && elapsed < holdStart + 200) {
        glitchTickRef.current += 1;
        if (glitchTickRef.current % 16 === 0) {
          const bandH = 3 + Math.random() * 7;
          const bandY = Math.random() * ch;
          const shift = (Math.random() - 0.5) * 12;
          const slice = ctx.getImageData(0, bandY, cw, bandH);
          ctx.putImageData(slice, shift, bandY);
        }
      }

      if (elapsed > holdStart) {
        const glowSpan = elapsed > briefStart ? BRIEF_DURATION : HOLD_DURATION;
        const glowElapsed = elapsed > briefStart ? elapsed - briefStart : elapsed - holdStart;
        const glowT = Math.min(1, glowElapsed / glowSpan);
        const pulse = 0.5 + 0.5 * Math.sin(glowT * Math.PI * 2 * 0.55);
        const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 280);
        grad.addColorStop(0, `rgba(${COLD_A[0]}, ${COLD_A[1]}, ${COLD_A[2]}, ${0.05 + pulse * 0.025})`);
        grad.addColorStop(1, "rgba(34, 211, 238, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);
      }

      // Chuyển sang phase "brief" đúng 1 lần khi vừa hết HOLD_DURATION.
      if (elapsed >= briefStart && !briefTriggeredRef.current) {
        briefTriggeredRef.current = true;
      }

      if (progressBarRef.current) {
        const pct = Math.min(100, (elapsed / totalDuration) * 100);
        progressBarRef.current.style.width = pct + "%";
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
  }, [started]);

  // Dọn dẹp: đóng AudioContext khi component unmount hẳn (VD người dùng
  // điều hướng sang trang khác giữa chừng lúc intro đang chạy).
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const showCrispText = uiPhase === "hold";
  const showBriefing = uiPhase === "brief" || uiPhase === "fade";

  return (
    <div
      className="particle-intro"
      style={{ opacity: overlayOpacity }}
      aria-hidden="true"
      role="presentation"
    >
      <canvas ref={canvasRef} className="particle-intro-canvas" />

      <div className="particle-intro-grid" />

      <div className="particle-intro-scanlines" />
      <div className="particle-intro-vignette" />
      <div className="particle-intro-glitch" />
      <div className="particle-intro-grain" />

      {/* Nút bật/tắt âm thanh — luôn hiện (kể cả ở màn gate), để người dùng
          toàn quyền kiểm soát, không ép nghe nếu không muốn. */}
      <button
        type="button"
        className="particle-intro-mute"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Bật âm thanh" : "Tắt âm thanh"}
      >
        {muted ? <HiSpeakerXMark /> : <HiSpeakerWave />}
      </button>

      {/* ===== Màn GATE — chờ người dùng bấm mới bắt đầu ===== */}
      {uiPhase === "gate" && (
        <div className="particle-intro-gate">
          <p className="gate-tag hud-readout">SYS.STANDBY // FILE.{caseId}</p>
          <h1 className="gate-title">Khởi Tạo Hồ Sơ</h1>
          <p className="gate-subtitle">
            Nhấn để quét và mở hồ sơ của {profile.fullName}
          </p>

          <button
            type="button"
            className="gate-button"
            onClick={handleStart}
          >
            <span className="gate-button-bracket">[</span>
            NHẤN ĐỂ BẮT ĐẦU
            <span className="gate-button-bracket">]</span>
          </button>
        </div>
      )}

      {started && (
        <>
          {/* 1 nhịp quét sáng dọc màn hình, chỉ chạy trong pha scan */}
          {uiPhase === "scan" && <div className="particle-intro-scanbeam" />}

          {/* Chấm đỏ nhỏ kiểu "đang bị giám sát" */}
          <div className="particle-intro-rec">
            <span className="rec-dot" />
            REC
          </div>

          {/* Boot log chạy nhanh lúc quét/warp */}
          {bootLineCount > 0 && (uiPhase === "scan" || uiPhase === "warp") && (
            <div className="particle-intro-bootlog">
              {BOOT_LINES.slice(0, bootLineCount).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          )}

          {/* Nhịp "chụp" trắng nhanh đúng lúc chữ vừa khoá lại xong */}
          {uiPhase === "hold" && <div className="particle-intro-flash" />}

          {/* Frame quét 4 góc + cross-line */}
          <div className={`particle-intro-frame phase-${uiPhase}`}>
            <span className="corner tl" />
            <span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" />
            <span className="cross-h" />
            <span className="cross-v" />
          </div>

          {/* HUD 3 góc */}
          <div className="particle-intro-hud hud-tl">
            <div className="hud-label">SYS.SCAN</div>
            <div className="hud-value">{hexTag}</div>
          </div>
          <div className="particle-intro-hud hud-tr">
            <div className="hud-label">NODE.STATE</div>
            <div className="hud-value">{uiPhase.toUpperCase()}</div>
            <span className="particle-intro-radar" aria-hidden="true" />
          </div>
          <div className="particle-intro-hud hud-bl">
            <div className="hud-label">CASE FILE</div>
            <div className="hud-value">#{caseId}</div>
          </div>

          {/* 4 status dot: sáng dần theo tiến độ intro (LINK/AUTH/SYNC/BRIEF) */}
          <div className="particle-intro-status">
            <div className="status-row">
              <span className={`status-dot ${phaseIndex >= 2 ? "" : "off"}`} />
              <span className="status-label">LINK</span>
            </div>
            <div className="status-row">
              <span className={`status-dot ${phaseIndex >= 3 ? "" : "off"}`} />
              <span className="status-label">AUTH</span>
            </div>
            <div className="status-row">
              <span className={`status-dot ${phaseIndex >= 4 ? "" : "off"}`} />
              <span className="status-label">SYNC</span>
            </div>
            <div className="status-row">
              <span className={`status-dot ${phaseIndex >= 5 ? "" : "off"}`} />
              <span className="status-label">BRIEF</span>
            </div>
            <div className="status-footnote">ENCRYPTION: AES-256</div>
          </div>

          {/* Progress bar tổng thời lượng intro */}
          <div className="particle-intro-progress">
            <div className="progress-bar" ref={progressBarRef} />
          </div>

          {/* Chữ THẬT, sắc nét — đè lên đúng vị trí pixel vừa ráp, đảm bảo luôn đọc rõ */}
          {showCrispText && (
            <div className="particle-intro-name-wrap">
              <p className="intro-caption">TARGET ACQUIRED</p>
              <h1 className="intro-name">{profile.fullName}</h1>
              <div className="intro-divider">
                <span />
                <i />
                <span />
              </div>
              <p className="intro-role">{profile.role}</p>
            </div>
          )}

          {/* Terminal log mở rộng */}
          {showCrispText && (
            <div className="particle-intro-terminal">
              <p className="term-line term-access">&gt; ACCESS GRANTED</p>
              <p className="term-line term-info delay-1">&gt; USER: {profile.fullName}</p>
              <p className="term-line term-info delay-2">&gt; ROLE: {profile.role}</p>
              <p className="term-line term-prompt delay-3">
                &gt; STATUS: ONLINE_<span className="cursor-blink" />
              </p>
            </div>
          )}

          {/* ===== BRIEF — hồ sơ nhân sự mở rộng (giới thiệu dài hơn + chuỗi bíp) ===== */}
          {showBriefing && (
            <div className="particle-intro-briefing">
              <span className="briefing-corner tl" />
              <span className="briefing-corner tr" />
              <span className="briefing-corner bl" />
              <span className="briefing-corner br" />

              <p className="briefing-tag hud-readout">
                FILE.{caseId} // HỒ SƠ NHÂN SỰ
              </p>

              <h2 className="briefing-name">{profile.fullName}</h2>

              <div className="briefing-rows">
                <div className="briefing-row delay-1">
                  <span>VAI TRÒ</span>
                  <strong>{profile.role}</strong>
                </div>

                <div className="briefing-row delay-2">
                  <span>ĐỊA ĐIỂM</span>
                  <strong>{profile.location}</strong>
                </div>

                <div className="briefing-row delay-3">
                  <span>TRẠNG THÁI</span>
                  <strong className="briefing-ready">
                    <i className="briefing-ready-dot" />
                    SẴN SÀNG TRIỂN KHAI
                  </strong>
                </div>
              </div>

              <p className="briefing-quote delay-4">&ldquo;{profile.quote}&rdquo;</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ParticleIntro;
