/* ParticleIntro.jsx - Cold & Dark - No Neon */
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import "./ParticleIntro.css";
import profile from "../../../data/profile";

// Dark, cold palette – no neon
const DARK_GRAY = [50, 60, 70];
const COLD_BLACK = [30, 40, 50];
const DIM_BLUE = [40, 60, 80];
const MUTED_PURPLE = [50, 40, 60];

const PARTICLE_COUNT = 420;
const SCAN_DURATION = 800;
const WARP_DURATION = 1400;
const ASSEMBLE_DURATION = 1800;
const HOLD_DURATION = 4000;
const FADE_DURATION = 800;

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

function sampleTextPoints(text, width, height, count) {
  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const ctx = off.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const fontSize = Math.max(36, Math.min(width * 0.08, 100));
  ctx.font = `700 ${fontSize}px "Courier New", monospace`;
  
  const lines = text.split('\n');
  const lineHeight = fontSize * 1.2;
  const totalHeight = lines.length * lineHeight;
  const startY = (height - totalHeight) / 2 + lineHeight / 2;
  
  lines.forEach((line, i) => {
    ctx.fillText(line.trim(), width / 2, startY + i * lineHeight);
  });

  const { data } = ctx.getImageData(0, 0, width, height);
  const candidates = [];
  const step = 2;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(y * width + x) * 4 + 3] > 120) {
        candidates.push({ x, y });
      }
    }
  }
  
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  
  const points = [];
  for (let i = 0; i < count; i++) {
    if (candidates.length > 0) {
      const idx = i % candidates.length;
      points.push({ 
        x: candidates[idx].x + (Math.random() - 0.5) * 1.5,
        y: candidates[idx].y + (Math.random() - 0.5) * 1.5
      });
    } else {
      points.push({ x: width / 2, y: height / 2 });
    }
  }
  return points;
}

function generateMatrixChars(width, height, count = 60) {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push({
      x: Math.random() * width,
      y: Math.random() * height,
      char: chars[Math.floor(Math.random() * chars.length)],
      speed: 0.3 + Math.random() * 1.0,
      opacity: 0.02 + Math.random() * 0.06,
      size: 10 + Math.random() * 10,
    });
  }
  return result;
}

function ParticleIntro({ onFinish }) {
  const canvasRef = useRef(null);
  const textCanvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const matrixRef = useRef([]);
  const startRef = useRef(null);
  const targetsRef = useRef([]);
  const glitchTickRef = useRef(0);
  const progressRef = useRef(0);

  const [uiPhase, setUiPhase] = useState("scan");
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [progress, setProgress] = useState(0);
  const [systemStatus, setSystemStatus] = useState("INITIALIZING");
  const [showSharpText, setShowSharpText] = useState(false);
  const [sharpTextOpacity, setSharpTextOpacity] = useState(0);

  const displayName = useMemo(() => {
    return `${profile.fullName.toUpperCase()}`;
  }, []);

  const displayRole = useMemo(() => {
    return `${profile.role.toUpperCase()}`;
  }, []);

  const totalDuration = SCAN_DURATION + WARP_DURATION + ASSEMBLE_DURATION + HOLD_DURATION;

  const initParticles = useCallback(() => {
    const arr = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const type = Math.random();
      let color;
      if (type < 0.5) color = DARK_GRAY;
      else if (type < 0.75) color = COLD_BLACK;
      else if (type < 0.9) color = DIM_BLUE;
      else color = MUTED_PURPLE;
      
      arr.push({
        angle: Math.random() * Math.PI * 2,
        radius: 5 + Math.random() * 45,
        z: 0.1 + Math.random() * 1.0,
        speed: 0.3 + Math.random() * 0.8,
        color: color,
        size: 0.8 + Math.random() * 2.0,
        delay: Math.random() * 0.5,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.025,
      });
    }
    particlesRef.current = arr;
    matrixRef.current = generateMatrixChars(window.innerWidth, window.innerHeight, 60);
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setUiPhase("warp"), SCAN_DURATION),
      setTimeout(() => setUiPhase("assemble"), SCAN_DURATION + WARP_DURATION),
      setTimeout(() => {
        setUiPhase("hold");
        setShowSharpText(true);
      }, SCAN_DURATION + WARP_DURATION + ASSEMBLE_DURATION),
    ];
    
    const statusTimer = setInterval(() => {
      const statuses = ["SCANNING", "DECRYPTING", "LOADING", "PROCESSING", "CONNECTING", "ANALYZING"];
      setSystemStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 700);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(statusTimer);
    };
  }, []);

  // Fade in sharp text
  useEffect(() => {
    if (showSharpText) {
      let startTime = null;
      const duration = 1000;
      
      const animateOpacity = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min(1, (timestamp - startTime) / duration);
        const eased = easeOutCubic(progress);
        setSharpTextOpacity(eased);
        
        if (progress < 1) {
          requestAnimationFrame(animateOpacity);
        }
      };
      
      requestAnimationFrame(animateOpacity);
    }
  }, [showSharpText]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const textCanvas = textCanvasRef.current;
    if (!canvas || !textCanvas) return;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    const textCtx = textCanvas.getContext("2d");
    let cw = window.innerWidth;
    let ch = window.innerHeight;
    
    function resizeCanvas() {
      cw = window.innerWidth;
      ch = window.innerHeight;
      
      canvas.width = cw * devicePixelRatio;
      canvas.height = ch * devicePixelRatio;
      canvas.style.width = cw + "px";
      canvas.style.height = ch + "px";
      ctx.scale(devicePixelRatio, devicePixelRatio);
      
      textCanvas.width = cw * devicePixelRatio;
      textCanvas.height = ch * devicePixelRatio;
      textCanvas.style.width = cw + "px";
      textCanvas.style.height = ch + "px";
      textCtx.scale(devicePixelRatio, devicePixelRatio);
    }
    resizeCanvas();

    initParticles();
    targetsRef.current = sampleTextPoints(displayName, cw, ch, PARTICLE_COUNT);

    if (reducedMotion) {
      setUiPhase("hold");
      setShowSharpText(true);
      setSharpTextOpacity(1);
      setTimeout(() => {
        setUiPhase("fade");
        onFinish?.();
      }, 2500);
      return;
    }

    const cx = cw / 2;
    const cy = ch / 2;
    const warpStart = SCAN_DURATION;
    const assembleStart = SCAN_DURATION + WARP_DURATION;
    const holdStart = assembleStart + ASSEMBLE_DURATION;
    const textFadeStart = holdStart + 400;

    // Draw sharp text on textCanvas
    function drawSharpText() {
      textCtx.clearRect(0, 0, cw, ch);
      
      if (sharpTextOpacity > 0) {
        const fontSize = Math.max(36, Math.min(cw * 0.08, 100));
        textCtx.textAlign = "center";
        textCtx.textBaseline = "middle";
        
        // Very subtle glow (cold, not neon)
        const glow = textCtx.createRadialGradient(cx, cy - fontSize * 0.2, 10, cx, cy, fontSize * 1.8);
        glow.addColorStop(0, `rgba(50, 70, 90, ${0.03 * sharpTextOpacity})`);
        glow.addColorStop(1, "rgba(50, 70, 90, 0)");
        textCtx.fillStyle = glow;
        textCtx.fillRect(0, 0, cw, ch);
        
        // Cold shadow
        textCtx.shadowColor = `rgba(50, 70, 90, ${0.08 * sharpTextOpacity})`;
        textCtx.shadowBlur = 10 * sharpTextOpacity;
        
        textCtx.font = `700 ${fontSize}px "Courier New", monospace`;
        textCtx.fillStyle = `rgba(130, 150, 170, ${sharpTextOpacity * 0.7})`;
        textCtx.fillText(displayName, cx, cy - fontSize * 0.25);
        
        const roleSize = Math.max(14, fontSize * 0.22);
        textCtx.font = `400 ${roleSize}px "Courier New", monospace`;
        textCtx.fillStyle = `rgba(90, 110, 130, ${0.4 * sharpTextOpacity})`;
        textCtx.shadowBlur = 4 * sharpTextOpacity;
        textCtx.fillText(displayRole, cx, cy + fontSize * 0.45);
        
        textCtx.shadowBlur = 0;
      }
    }

    function draw(ts) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;

      ctx.clearRect(0, 0, cw, ch);
      
      // Dark cold background
      ctx.fillStyle = "#07090e";
      ctx.fillRect(0, 0, cw, ch);

      // Matrix rain - very subtle
      const matrix = matrixRef.current;
      matrix.forEach(m => {
        m.y += m.speed * 0.5;
        if (m.y > ch) {
          m.y = -20;
          m.x = Math.random() * cw;
          m.char = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 36)];
        }
        ctx.fillStyle = `rgba(50, 70, 90, ${m.opacity * 0.12})`;
        ctx.font = `${m.size}px "Courier New", monospace`;
        ctx.fillText(m.char, m.x, m.y);
      });

      const particles = particlesRef.current;
      const targets = targetsRef.current;

      let assembleT = 0;
      if (elapsed > assembleStart) {
        assembleT = Math.min(1, (elapsed - assembleStart) / ASSEMBLE_DURATION);
      }
      const assembleEase = easeInOutCubic(assembleT);
      const warpProgress = Math.min(1, Math.max(0, elapsed - warpStart) / WARP_DURATION);
      
      const totalProgress = Math.min(1, elapsed / totalDuration);
      progressRef.current = totalProgress;
      setProgress(totalProgress * 100);

      // Draw particles - dark, muted
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const delayOffset = p.delay * 0.5;
        const adjustedAssemble = Math.max(0, Math.min(1, (assembleT - delayOffset) / (1 - delayOffset)));
        const finalEase = easeOutExpo(adjustedAssemble);

        p.z -= 0.01 * p.speed * (1 + warpProgress * 1.0);
        if (p.z < 0.05) p.z = 1 + Math.random() * 0.3;
        
        const persp = 1 / p.z;
        p.wobble += p.wobbleSpeed;
        const wobbleOffset = Math.sin(p.wobble) * 1.2 * persp;
        
        const wx = cx + Math.cos(p.angle + wobbleOffset * 0.1) * p.radius * persp;
        const wy = cy + Math.sin(p.angle + wobbleOffset * 0.1) * p.radius * persp;

        const target = targets[i];
        const x = finalEase > 0 ? wx + (target.x - wx) * finalEase : wx;
        const y = finalEase > 0 ? wy + (target.y - wy) * finalEase : wy;

        const sizeMultiplier = 1 - finalEase * 0.5;
        const size = finalEase > 0 ? (1.0 + finalEase * 1.0) * sizeMultiplier : Math.min(3.5, p.size * persp);
        const alpha = finalEase > 0 ? 0.15 + finalEase * 0.5 : Math.min(0.4, persp * 0.25);

        const [r, g, b] = p.color;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha * 0.05})`;
        ctx.shadowBlur = finalEase > 0.5 ? 3 + Math.random() * 2 : 1;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(finalEase > 0.3 ? Math.sin(p.wobble) * 0.03 : 0);
        ctx.fillRect(-size/2, -size/2, size, size);
        ctx.restore();
      }
      ctx.shadowBlur = 0;

      // Glitch - extremely subtle, cold
      if (elapsed > assembleStart && elapsed < holdStart + 600) {
        glitchTickRef.current += 1;
        if (glitchTickRef.current % 12 === 0) {
          const bandH = 1 + Math.random() * 4;
          const bandY = Math.random() * ch;
          const shift = (Math.random() - 0.5) * 8;
          try {
            const slice = ctx.getImageData(0, bandY, cw, bandH);
            ctx.putImageData(slice, shift, bandY);
          } catch (e) {}
        }
        
        if (Math.random() < 0.002) {
          ctx.fillStyle = `rgba(40, 50, 60, ${0.02 + Math.random() * 0.03})`;
          ctx.fillRect(0, Math.random() * ch, cw, 1 + Math.random() * 2);
        }
      }

      // Hold phase - very subtle pulse
      if (elapsed > holdStart) {
        const holdT = Math.min(1, (elapsed - holdStart) / HOLD_DURATION);
        const pulse = 0.5 + 0.5 * Math.sin(holdT * Math.PI * 2 * 0.15);
        
        const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 300);
        grad.addColorStop(0, `rgba(50, 70, 90, ${0.005 + pulse * 0.008})`);
        grad.addColorStop(1, "rgba(50, 70, 90, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);
      }

      // Draw sharp text overlay
      if (elapsed > textFadeStart && showSharpText) {
        drawSharpText();
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
            onFinish?.();
          }
        }
        rafRef.current = requestAnimationFrame(fade);
      }
    }

    rafRef.current = requestAnimationFrame(draw);

    function handleResize() {
      cancelAnimationFrame(rafRef.current);
      startRef.current = null;
      resizeCanvas();
      targetsRef.current = sampleTextPoints(displayName, cw, ch, PARTICLE_COUNT);
      matrixRef.current = generateMatrixChars(cw, ch, 60);
      rafRef.current = requestAnimationFrame(draw);
    }
    
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [displayName, displayRole, initParticles, onFinish, showSharpText, sharpTextOpacity]);

  return (
    <div className="particle-intro" style={{ opacity: overlayOpacity }}>
      <canvas ref={canvasRef} className="particle-intro-canvas" />
      <canvas ref={textCanvasRef} className="particle-intro-canvas" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      
      <div className="particle-intro-scanlines" />
      <div className="particle-intro-vignette" />
      <div className="particle-intro-glitch" />

      {/* Frame */}
      <div className={`particle-intro-frame phase-${uiPhase}`}>
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
        <span className="cross-h" />
        <span className="cross-v" />
      </div>

      {/* HUD Top Left */}
      <div className="particle-intro-hud hud-tl">
        <div><span className="hud-label">SYS // </span><span className="hud-value">{systemStatus}</span></div>
        <div><span className="hud-label">NODE // </span><span className="hud-value">{uiPhase.toUpperCase()}</span></div>
        <div><span className="hud-label">SEC // </span><span className="hud-value">{Math.floor(progress)}%</span></div>
      </div>

      {/* HUD Top Right */}
      <div className="particle-intro-hud hud-tr">
        <div><span className="hud-label">ENCRYPTION</span></div>
        <div><span className="hud-value">AES-256</span></div>
        <div><span className="hud-label">FIREWALL</span></div>
        <div><span className="hud-value">ACTIVE</span></div>
      </div>

      {/* HUD Bottom Left */}
      <div className="particle-intro-hud hud-bl">
        <div><span className="hud-label">UPLINK // </span><span className="hud-value">STABLE</span></div>
        <div><span className="hud-label">PING // </span><span className="hud-value">14ms</span></div>
      </div>

      {/* Progress Bar */}
      <div className="particle-intro-progress">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Status Indicators */}
      <div className="particle-intro-status">
        <div className={`status-dot ${uiPhase === 'scan' ? '' : 'off'}`} />
        <span className="status-label">SCAN</span>
        <div className={`status-dot ${uiPhase === 'warp' ? '' : 'off'}`} />
        <span className="status-label">WARP</span>
        <div className={`status-dot ${uiPhase === 'assemble' ? '' : 'off'}`} />
        <span className="status-label">ASSEMBLE</span>
        <div className={`status-dot ${uiPhase === 'hold' ? '' : 'off'}`} />
        <span className="status-label">HOLD</span>
      </div>

      {/* ===== Terminal - Dark & Cold ===== */}
      {(uiPhase === "hold" || uiPhase === "fade") && (
        <div className="particle-intro-terminal">
          <p className="term-line term-access">
            &gt; ACCESS GRANTED
            <span className="cursor" />
          </p>
          <p className="term-line term-info delay-1">
            &gt; SYSTEM READY
            <span className="cursor-blink" />
          </p>
          <p className="term-line term-info delay-2">
            &gt; USER: {profile.fullName.toUpperCase()}
          </p>
          <p className="term-line term-info delay-3">
            &gt; ROLE: {profile.role.toUpperCase()}
          </p>
          <p className="term-line term-info delay-4">
            &gt; UPLINK: SECURE // NODE: {Math.floor(Math.random() * 100)}
          </p>
          <p className="term-line term-info delay-5">
            &gt; SESSION: {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="term-line term-prompt delay-6">
            $ <span className="cursor" />
          </p>
        </div>
      )}
    </div>
  );
}

export default ParticleIntro;