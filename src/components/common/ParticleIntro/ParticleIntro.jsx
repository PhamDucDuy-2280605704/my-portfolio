import { useEffect, useRef, useState, useCallback } from "react";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

import "./ParticleIntro.css";

import profile from "../../../data/profile";

// Intro kiểu "báo động sinh học" — lấy cảm hứng từ tinh thần thẩm mỹ dòng
// game kinh dị sinh tồn Resident Evil / các tập đoàn dược-sinh học hư cấu
// kiểu Umbrella: báo động (tông cyan), ký hiệu nguy hại sinh học (biohazard — ký hiệu
// quốc tế, không phải logo riêng của hãng nào), terminal an ninh, hồ sơ mật
// đóng dấu DUYỆT. KHÔNG dùng logo, wordmark hay tên thương hiệu thật của bất
// kỳ hãng nào — chỉ mượn KHÔNG KHÍ. Các bước:
//   1. SCAN      — còi báo động chớp cyan 2 nhịp, khung quét 4 góc dò từ mép
//      vào, log terminal "đang chặn tín hiệu".
//   2. WARP      — tàn lửa cyan/xanh biển bay vào tâm màn hình theo hiệu ứng warp.
//   3. ASSEMBLE  — tàn lửa ráp thành ký hiệu biohazard + tên bạn, nhiễu sóng
//      (glitch) nhẹ đúng lúc vừa ráp xong.
//   4. HOLD      — chữ THẬT (DOM, sắc nét) đè lên đúng chỗ vừa ráp + terminal
//      log ACCESS GRANTED / USER / ROLE / STATUS: CLEARED.
//   5. DOSSIER   — "hồ sơ mật" mở rộng dạng file kẹp giấy (vai trò, địa
//      điểm, trạng thái, trích dẫn cá nhân) + con dấu cyan "ĐÃ DUYỆT" đóng
//      xuống kèm tiếng thịch, tiếng máy chữ lách cách mỗi khi 1 dòng hiện ra.
//   6. FADE      — toàn màn hình mờ dần về đen, gọi onFinish().
//
// KHÔNG bắt buộc phải bấm gì để bắt đầu (tự chạy ngay) — nhưng bấm vào BẤT
// KỲ đâu trên màn hình (hoặc nút "Bỏ qua") sẽ bỏ qua toàn bộ, vào thẳng
// trang chủ ngay lập tức. Không bấm gì = xem trọn vẹn hết intro.
//
// Hợp đồng props: onFinish() gọi 1 lần khi chạy xong (hoặc khi bị bỏ qua)
// -> App.jsx set isLoading=false. Xem lại: remount bằng key={introKey} ở App.jsx.

const PARTICLE_COUNT = 340;
const SCAN_DURATION = 750; // ms — còi báo động + khung quét
const WARP_DURATION = 1200; // ms
const ASSEMBLE_DURATION = 1300; // ms
const HOLD_DURATION = 2100; // ms
const DOSSIER_DURATION = 5200; // ms
const FADE_DURATION = 650; // ms

// Tông cyan báo động — khớp --color-primary (#22d3ee) của toàn site — hạt
// sáng bay vào rồi nguội dần thành xanh biển đậm.
const EMBER_A = [34, 211, 238]; // cyan sáng, khớp --color-primary
const EMBER_B = [14, 116, 144]; // xanh biển đậm, "tín hiệu nguội"

const PHASE_ORDER = ["scan", "warp", "assemble", "hold", "dossier", "fade"];

// Log terminal chạy nhanh lúc còi báo động/quét — thuần hiệu ứng, tăng cảm
// giác "hệ thống an ninh đang chặn/giải mã tín hiệu", không phải log thật.
const BOOT_LINES = [
  "SIGNAL INTERCEPTED...",
  "DECRYPTING PERSONNEL ARCHIVE...",
  "BIOHAZARD PROTOCOL: STANDBY...",
  "HANDSHAKE OK",
];

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Vẽ ký hiệu biohazard (3 vòng tròn lớn xếp 120°, khoét lỗ tâm) + tên + vai
// trò lên canvas ẩn, rồi lấy mẫu toạ độ các điểm không-trong-suốt để làm
// đích cho hạt bay tới. Đây LÀ ký hiệu nguy hại sinh học quốc tế (chuẩn ISO
// 7010 / công cộng), không phải tài sản riêng của bất kỳ studio/hãng nào.
function sampleDossierPoints(line1, line2, width, height, count) {
  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const ctx = off.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fff";

  // --- Ký hiệu biohazard, đặt hơi lệch trên tâm để chừa chỗ cho tên bên dưới
  const symR = Math.max(34, Math.min(width, height) * 0.075);
  const symCx = width / 2;
  const symCy = height / 2 - symR * 2.05;
  const offset = symR * 0.98;

  ctx.globalCompositeOperation = "source-over";
  [-90, 30, 150].forEach((deg) => {
    const rad = (deg * Math.PI) / 180;
    ctx.beginPath();
    ctx.arc(symCx + Math.cos(rad) * offset, symCy + Math.sin(rad) * offset, symR, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(symCx, symCy, symR * 0.46, 0, Math.PI * 2);
  ctx.fill();
  // 3 lỗ nhỏ giữa các cánh để tách rõ 3 vòng, đúng tinh thần ký hiệu gốc
  [-90, 30, 150].forEach((deg) => {
    const rad = (deg * Math.PI) / 180;
    ctx.beginPath();
    ctx.arc(symCx + Math.cos(rad) * offset * 1.55, symCy + Math.sin(rad) * offset * 1.55, symR * 0.62, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalCompositeOperation = "source-over";

  // --- Tên + vai trò, bên dưới ký hiệu
  const nameSize = Math.max(26, Math.min(width * 0.068, 78));
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${nameSize}px "Courier New", monospace`;
  const nameY = height / 2 + nameSize * 0.55;
  ctx.fillText(line1, width / 2, nameY);

  if (line2) {
    const subSize = Math.max(11, nameSize * 0.22);
    ctx.font = `600 ${subSize}px "Courier New", monospace`;
    ctx.fillText(line2, width / 2, nameY + nameSize * 0.62);
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
// bộ tiếng còi/tĩnh điện/máy chữ được tạo bằng oscillator/noise buffer ngay
// trong trình duyệt, không cần asset ngoài, không phát sinh HTTP request. =====

function playBeep(audioCtx, { freq = 880, duration = 0.08, type = "triangle", gain = 0.09 } = {}) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  const t0 = audioCtx.currentTime;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gainNode.gain.setValueAtTime(0.0001, t0);
  gainNode.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

// Còi báo động 2 nhịp lên/xuống (sóng vuông, thô hơn triangle) — mở đầu pha
// "scan", kiểu còi an ninh khẩn cấp thay vì tiếng chuông xác nhận êm dịu.
function playAlarm(audioCtx) {
  if (!audioCtx) return;
  [0, 260].forEach((delay) => {
    setTimeout(() => {
      playBeep(audioCtx, { freq: 880, duration: 0.14, gain: 0.075, type: "square" });
      setTimeout(() => playBeep(audioCtx, { freq: 660, duration: 0.16, gain: 0.075, type: "square" }), 130);
    }, delay);
  });
}

// Tiếng "khoá hồ sơ" khi chữ vừa ráp xong — 2 nốt trầm xuống, dứt khoát hơn
// tiếng chuông xác nhận thông thường.
function playLockChime(audioCtx) {
  if (!audioCtx) return;
  playBeep(audioCtx, { freq: 520, duration: 0.12, gain: 0.085, type: "sawtooth" });
  setTimeout(() => playBeep(audioCtx, { freq: 340, duration: 0.2, gain: 0.09, type: "sawtooth" }), 90);
}

// Tiếng lách cách máy chữ — cực ngắn, dùng cho mỗi dòng hồ sơ hiện ra.
function playTypewriterClack(audioCtx, gain = 0.05) {
  if (!audioCtx) return;
  const bufferSize = Math.floor(audioCtx.sampleRate * 0.02);
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(gain, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.02);
  noise.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  noise.start();
  playBeep(audioCtx, { freq: 2200, duration: 0.015, gain: gain * 0.6, type: "square" });
}

// Tiếng "thịch" đóng dấu — 1 nốt trầm ngắn kèm tiếng vỡ nhỏ.
function playStampThud(audioCtx) {
  if (!audioCtx) return;
  playBeep(audioCtx, { freq: 90, duration: 0.16, gain: 0.13, type: "sine" });
  playBeep(audioCtx, { freq: 1400, duration: 0.03, gain: 0.05, type: "square" });
}

function playStaticBurst(audioCtx, duration = 0.22, gain = 0.038) {
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

function ParticleIntro({ onFinish }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const startRef = useRef(null);
  const targetsRef = useRef([]);
  const glitchTickRef = useRef(0);
  const progressBarRef = useRef(null);
  const audioCtxRef = useRef(null);
  const mutedRef = useRef(false);
  const finishedRef = useRef(false);

  // uiPhase: scan -> warp -> assemble -> hold -> dossier -> fade
  const [uiPhase, setUiPhase] = useState("scan");
  const [muted, setMuted] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [hexTag, setHexTag] = useState(randomHex(8));
  const [bootLineCount, setBootLineCount] = useState(0);
  const [alarmFlash, setAlarmFlash] = useState(false);
  const [stamped, setStamped] = useState(false);
  const [caseId, setCaseId] = useState(() => String(Math.floor(Math.random() * 900000) + 100000));

  const phaseIndex = PHASE_ORDER.indexOf(uiPhase);

  const totalDuration =
    SCAN_DURATION + WARP_DURATION + ASSEMBLE_DURATION + HOLD_DURATION + DOSSIER_DURATION;

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

  const clack = useCallback((gain) => {
    if (mutedRef.current) return;
    playTypewriterClack(audioCtxRef.current, gain);
  }, []);

  // Gọi onFinish đúng 1 lần — dùng chung cho cả "chạy hết tự nhiên" lẫn
  // "bấm để bỏ qua", tránh gọi trùng khi cả overlay lẫn nút Skip cùng bắt sự kiện click.
  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish && onFinish();
  }, [onFinish]);

  // Bấm vào BẤT KỲ đâu trên overlay (hoặc nút "Bỏ qua") -> vào thẳng trang
  // chủ ngay, không cần xem hết. Không bấm gì -> intro tự chạy trọn vẹn.
  const handleSkip = useCallback(
    (e) => {
      e && e.stopPropagation && e.stopPropagation();
      finish();
    },
    [finish]
  );

  // Mở AudioContext ngay khi component mount — nhiều trình duyệt tạo nó ở
  // trạng thái "suspended" cho tới cử chỉ người dùng đầu tiên, nên còi báo
  // động ở đầu intro có thể im lặng nếu người dùng chưa từng tương tác với
  // trang lần nào — đây là giới hạn trình duyệt, không phải lỗi.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) {
      try {
        audioCtxRef.current = new Ctx();
      } catch {
        audioCtxRef.current = null;
      }
    }

    const resume = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume().catch(() => {});
      }
    };
    window.addEventListener("pointerdown", resume);
    window.addEventListener("keydown", resume);

    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
  }, []);

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

  // Timers riêng đổi phase UI (frame / HUD / terminal) — chạy ngay khi mount.
  useEffect(() => {
    const timers = [];

    // Còi báo động chớp 2 nhịp ngay lúc mở màn. setState hoãn sang tick kế
    // tiếp (setTimeout 0) để tránh cascading render ngay trong thân effect.
    timers.push(setTimeout(() => setAlarmFlash(true), 0));
    playAlarm(mutedRef.current ? null : audioCtxRef.current);
    timers.push(setTimeout(() => setAlarmFlash(false), SCAN_DURATION - 80));

    timers.push(setTimeout(() => setUiPhase("warp"), SCAN_DURATION));

    timers.push(
      setTimeout(() => {
        setUiPhase("assemble");
        beep({ freq: 500, duration: 0.11, gain: 0.07, type: "sawtooth" });
      }, SCAN_DURATION + WARP_DURATION)
    );

    timers.push(
      setTimeout(() => {
        setUiPhase("hold");
        playLockChime(mutedRef.current ? null : audioCtxRef.current);
      }, SCAN_DURATION + WARP_DURATION + ASSEMBLE_DURATION)
    );

    // Bước sang "dossier": tĩnh điện ngắn, rồi 1 tiếng lách cách máy chữ mỗi
    // khi 1 dòng hồ sơ hiện ra (khớp delay-1/2/3 trong CSS), cuối cùng là
    // tiếng đóng dấu "thịch".
    timers.push(
      setTimeout(() => {
        setUiPhase("dossier");
        staticBurst(0.18, 0.045);

        [
          { delay: 350, gain: 0.05 },
          { delay: 750, gain: 0.05 },
          { delay: 1150, gain: 0.05 },
        ].forEach(({ delay, gain }) => {
          timers.push(setTimeout(() => clack(gain), delay));
        });

        timers.push(
          setTimeout(() => {
            setStamped(true);
            playStampThud(mutedRef.current ? null : audioCtxRef.current);
          }, 1650)
        );
      }, SCAN_DURATION + WARP_DURATION + ASSEMBLE_DURATION + HOLD_DURATION)
    );

    const hexTimer = setInterval(() => setHexTag(randomHex(8)), 140);

    // Case ID "chạy số" ngẫu nhiên trong lúc scan+warp, rồi ĐỨNG YÊN (khoá
    // lại) ngay khi bước vào assemble.
    const assembleStartsAt = SCAN_DURATION + WARP_DURATION;
    const caseIdTimer = setInterval(() => {
      setCaseId(String(Math.floor(Math.random() * 900000) + 100000));
    }, 70);
    timers.push(setTimeout(() => clearInterval(caseIdTimer), assembleStartsAt));

    // Log terminal chạy nhanh trong pha scan+warp, xong trước khi vào assemble.
    const bootWindow = SCAN_DURATION + WARP_DURATION;
    const stepTime = bootWindow / (BOOT_LINES.length + 1);
    BOOT_LINES.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setBootLineCount(i + 1);
          beep({ freq: 1000 + i * 70, duration: 0.035, gain: 0.045, type: "square" });
        }, stepTime * (i + 1))
      );
    });

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(hexTimer);
      clearInterval(caseIdTimer);
    };
  }, [beep, staticBurst, clack]);

  useEffect(() => {
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
    targetsRef.current = sampleDossierPoints(
      profile.fullName.toUpperCase(),
      profile.role.toUpperCase(),
      cw,
      ch,
      PARTICLE_COUNT
    );

    if (reducedMotion) {
      queueMicrotask(() => setUiPhase("hold"));
      if (progressBarRef.current) progressBarRef.current.style.width = "60%";
      playLockChime(mutedRef.current ? null : audioCtxRef.current);

      const dossierTimer = setTimeout(() => {
        setUiPhase("dossier");
        if (!mutedRef.current) {
          staticBurst(0.18, 0.045);
          setTimeout(() => setStamped(true), 900);
        } else {
          setStamped(true);
        }
        if (progressBarRef.current) progressBarRef.current.style.width = "100%";
      }, 2400);

      const finishTimer = setTimeout(() => {
        setUiPhase("fade");
        finish();
      }, 2400 + 3600);

      return () => {
        clearTimeout(dossierTimer);
        clearTimeout(finishTimer);
      };
    }

    const cx = cw / 2;
    const cy = ch / 2;
    const warpStart = SCAN_DURATION;
    const assembleStart = SCAN_DURATION + WARP_DURATION;
    const holdStart = assembleStart + ASSEMBLE_DURATION;
    const dossierStart = holdStart + HOLD_DURATION;

    function draw(ts) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;

      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = "#07070a";
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

        const [r1, g1, b1] = EMBER_A;
        const [r2, g2, b2] = EMBER_B;
        const r = Math.round(r1 * (1 - p.mix) + r2 * p.mix);
        const g = Math.round(g1 * (1 - p.mix) + g2 * p.mix);
        const b = Math.round(b1 * (1 - p.mix) + b2 * p.mix);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.shadowColor = `rgb(${r}, ${g}, ${b})`;
        ctx.shadowBlur = assembleEase > 0.6 ? 7 : 2;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
      ctx.shadowBlur = 0;

      if (elapsed > assembleStart + ASSEMBLE_DURATION * 0.75 && elapsed < holdStart + 200) {
        glitchTickRef.current += 1;
        if (glitchTickRef.current % 16 === 0) {
          const bandH = 3 + Math.random() * 7;
          const bandY = Math.random() * ch;
          const shift = (Math.random() - 0.5) * 14;
          const slice = ctx.getImageData(0, bandY, cw, bandH);
          ctx.putImageData(slice, shift, bandY);
        }
      }

      if (elapsed > holdStart) {
        const glowSpan = elapsed > dossierStart ? DOSSIER_DURATION : HOLD_DURATION;
        const glowElapsed = elapsed > dossierStart ? elapsed - dossierStart : elapsed - holdStart;
        const glowT = Math.min(1, glowElapsed / glowSpan);
        const pulse = 0.5 + 0.5 * Math.sin(glowT * Math.PI * 2 * 0.5);
        const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 300);
        grad.addColorStop(0, `rgba(${EMBER_A[0]}, ${EMBER_A[1]}, ${EMBER_A[2]}, ${0.045 + pulse * 0.025})`);
        grad.addColorStop(1, "rgba(34, 211, 238, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);
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
            finish();
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
      targetsRef.current = sampleDossierPoints(
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

  // Dọn dẹp: đóng AudioContext khi component unmount hẳn.
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const showCrispText = uiPhase === "hold";
  const showDossier = uiPhase === "dossier" || uiPhase === "fade";

  return (
    <div className="re-intro" style={{ opacity: overlayOpacity }}>
      {/* Toàn bộ nội dung trực quan bên dưới thuần trang trí -> ẩn khỏi
          trình đọc màn hình. Nút "Bỏ qua" thật (không aria-hidden) nằm
          riêng ngay dưới đây mới là điều khiển có thể tiếp cận được. */}
      <div className="re-intro-visuals" aria-hidden="true" onClick={handleSkip}>
        <canvas ref={canvasRef} className="re-intro-canvas" />

        <div className="re-intro-grid" />
        <div className="re-intro-scanlines" />
        <div className="re-intro-vignette" />
        <div className="re-intro-glitch" />
        <div className="re-intro-grain" />

        {/* Chớp báo động cyan toàn màn hình, 2 nhịp ngay lúc mở màn */}
        <div className={`re-intro-alarmflash ${alarmFlash ? "is-on" : ""}`} />

        {/* Sọc cảnh báo (hazard tape) trên/dưới màn hình */}
        <div className="re-intro-hazardbar top" />
        <div className="re-intro-hazardbar bottom" />

        {/* 1 nhịp quét sáng dọc màn hình, chỉ chạy trong pha scan */}
        {uiPhase === "scan" && <div className="re-intro-scanbeam" />}

        {/* Chấm cyan nhỏ kiểu "đang bị giám sát" */}
        <div className="re-intro-rec">
          <span className="rec-dot" />
          REC
        </div>

        {/* Log terminal chạy nhanh lúc còi báo động/quét */}
        {bootLineCount > 0 && (uiPhase === "scan" || uiPhase === "warp") && (
          <div className="re-intro-bootlog">
            {BOOT_LINES.slice(0, bootLineCount).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        )}

        {/* Nhịp "chụp" cyan nhanh đúng lúc chữ vừa khoá lại xong */}
        {uiPhase === "hold" && <div className="re-intro-flash" />}

        {/* Khung quét 4 góc + cross-line, kiểu reticle an ninh */}
        <div className={`re-intro-frame phase-${uiPhase}`}>
          <span className="corner tl" />
          <span className="corner tr" />
          <span className="corner bl" />
          <span className="corner br" />
          <span className="cross-h" />
          <span className="cross-v" />
        </div>

        {/* HUD 3 góc */}
        <div className="re-intro-hud hud-tl">
          <div className="hud-label">T-SCAN</div>
          <div className="hud-value">{hexTag}</div>
        </div>
        <div className="re-intro-hud hud-tr">
          <div className="hud-label">THREAT LV</div>
          <div className="hud-value">{uiPhase.toUpperCase()}</div>
          <span className="re-intro-radar" aria-hidden="true" />
        </div>
        <div className="re-intro-hud hud-bl">
          <div className="hud-label">FILE NO.</div>
          <div className="hud-value">#{caseId}</div>
        </div>

        {/* 4 status dot: sáng dần theo tiến độ intro (SCAN/LOCK/PURGE/FILE) */}
        <div className="re-intro-status">
          <div className="status-row">
            <span className={`status-dot ${phaseIndex >= 1 ? "" : "off"}`} />
            <span className="status-label">SCAN</span>
          </div>
          <div className="status-row">
            <span className={`status-dot ${phaseIndex >= 2 ? "" : "off"}`} />
            <span className="status-label">LOCK</span>
          </div>
          <div className="status-row">
            <span className={`status-dot ${phaseIndex >= 3 ? "" : "off"}`} />
            <span className="status-label">PURGE</span>
          </div>
          <div className="status-row">
            <span className={`status-dot ${phaseIndex >= 4 ? "" : "off"}`} />
            <span className="status-label">FILE</span>
          </div>
          <div className="status-footnote">CONTAINMENT: AES-256</div>
        </div>

        {/* Progress bar tổng thời lượng intro */}
        <div className="re-intro-progress">
          <div className="progress-bar" ref={progressBarRef} />
        </div>

        {/* Chữ THẬT, sắc nét — đè lên đúng vị trí pixel vừa ráp */}
        {showCrispText && (
          <div className="re-intro-name-wrap">
            <p className="intro-caption">SUBJECT IDENTIFIED</p>
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
          <div className="re-intro-terminal">
            <p className="term-line term-access">&gt; ACCESS GRANTED</p>
            <p className="term-line term-info delay-1">&gt; USER: {profile.fullName}</p>
            <p className="term-line term-info delay-2">&gt; ROLE: {profile.role}</p>
            <p className="term-line term-prompt delay-3">
              &gt; STATUS: CLEARED_<span className="cursor-blink" />
            </p>
          </div>
        )}

        {/* ===== DOSSIER — hồ sơ mật dạng file kẹp giấy ===== */}
        {showDossier && (
          <div className="re-intro-dossier">
            <span className="dossier-rivet tl" />
            <span className="dossier-rivet tr" />
            <span className="dossier-rivet bl" />
            <span className="dossier-rivet br" />
            <div className="dossier-hazardstrip" />

            <p className="dossier-tag hud-readout">
              FILE.{caseId} // HỒ SƠ MẬT — NHÂN SỰ
            </p>

            <h2 className="dossier-name">{profile.fullName}</h2>

            <div className="dossier-rows">
              <div className="dossier-row delay-1">
                <span>VAI TRÒ</span>
                <strong>{profile.role}</strong>
              </div>

              <div className="dossier-row delay-2">
                <span>ĐỊA ĐIỂM</span>
                <strong>{profile.location}</strong>
              </div>

              <div className="dossier-row delay-3">
                <span>TRẠNG THÁI</span>
                <strong className="dossier-ready">
                  <i className="dossier-ready-dot" />
                  SẴN SÀNG TRIỂN KHAI
                </strong>
              </div>
            </div>

            <p className="dossier-quote delay-4">&ldquo;{profile.quote}&rdquo;</p>

            {/* Con dấu cyan "ĐÃ DUYỆT" đóng xuống chéo góc, kèm tiếng thịch */}
            <div className={`dossier-stamp ${stamped ? "is-stamped" : ""}`}>ĐÃ DUYỆT</div>
          </div>
        )}
      </div>

      {/* Nút bật/tắt âm thanh — điều khiển thật, có thể tiếp cận (không aria-hidden) */}
      <button
        type="button"
        className="re-intro-mute"
        onClick={(e) => {
          e.stopPropagation();
          setMuted((m) => !m);
        }}
        aria-label={muted ? "Bật âm thanh" : "Tắt âm thanh"}
      >
        {muted ? <HiSpeakerXMark /> : <HiSpeakerWave />}
      </button>

      {/* Nút "Bỏ qua" thật — điều khiển có thể tiếp cận (bàn phím/trình đọc
          màn hình), tương đương việc bấm vào bất kỳ đâu trên overlay. */}
      <button type="button" className="re-intro-skip" onClick={handleSkip}>
        Bỏ qua intro <span className="re-intro-skip-arrow">→</span>
      </button>
    </div>
  );
}

export default ParticleIntro;
