import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "./Zone.css";

import usePageTitle from "../../hooks/usePageTitle";

// ============================================================================
// TRANG BÍ MẬT — /zone
// ============================================================================
// Phong cách lấy cảm hứng từ PDA (thiết bị cầm tay) trong game S.T.A.L.K.E.R.
// 2: màn hình thiết bị cũ kỹ, ám xanh phóng xạ, đồng hồ đo bức xạ (Geiger
// counter), phải nhập đúng mật khẩu mới "TRUY CẬP ĐƯỢC VÙNG ZONE".
//
// ĐỔI MẬT KHẨU: sửa hằng số ZONE_PASSWORD bên dưới. So khớp không phân biệt
// hoa/thường, tự bỏ khoảng trắng thừa 2 đầu.
//
// LƯU Ý QUAN TRỌNG: đây là site tĩnh (React thuần, không có server/backend)
// nên mật khẩu này SẼ nằm trong file JS build ra — ai rành kỹ thuật mở
// DevTools/"View Source" vẫn đọc được. Cơ chế này hợp để làm 1 "cánh cổng"
// mang tính trải nghiệm/easter egg (giống game), KHÔNG phải bảo mật thật sự
// -> đừng để trong trang bất kỳ thông tin thật sự nhạy cảm (số CCCD, mật
// khẩu ngân hàng, OTP...).
const ZONE_PASSWORD = "9029";

// Ghi nhớ trạng thái đã mở khoá bằng sessionStorage (KHÔNG dùng localStorage)
// -> refresh lại trang trong CÙNG 1 tab thì khỏi nhập lại, nhưng đóng hẳn
// tab/trình duyệt thì lại phải nhập lại từ đầu, giữ đúng cảm giác "phải có
// mật khẩu mới vào được" thay vì mở khoá vĩnh viễn trên máy.
const SESSION_KEY = "zone-unlocked";

// ===== Âm thanh tổng hợp bằng Web Audio API — cùng kỹ thuật với
// ParticleIntro.jsx (oscillator/noise buffer thuần, không dùng file audio). =====

function getAudioCtx(ref) {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!ref.current) {
    try {
      ref.current = new Ctx();
    } catch {
      return null;
    }
  }
  if (ref.current.state === "suspended") ref.current.resume().catch(() => {});
  return ref.current;
}

function playTick(ctx, freq = 1400) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t0 = ctx.currentTime;
  osc.type = "square";
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.05, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.03);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + 0.04);
}

function playKeypress(ctx) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t0 = ctx.currentTime;
  osc.type = "triangle";
  osc.frequency.setValueAtTime(320 + Math.random() * 60, t0);
  gain.gain.setValueAtTime(0.06, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + 0.06);
}

function playDenied(ctx) {
  if (!ctx) return;
  [0, 130].forEach((delay) => {
    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t0 = ctx.currentTime;
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, t0);
      gain.gain.setValueAtTime(0.09, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.2);
    }, delay);
  });
}

function playGranted(ctx) {
  if (!ctx) return;
  [520, 780, 1040].forEach((freq, i) => {
    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t0 = ctx.currentTime;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.08, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.18);
    }, i * 90);
  });
}

// "Log tín hiệu" — dòng chữ ngắn hiện ngẫu nhiên trên màn hình khoá, đổi
// mỗi vài giây, để không khí đỡ trống trải trong lúc gõ mật khẩu. ĐÂY LÀ
// VĂN BẢN TỰ VIẾT (không phải lời thoại thật trong bất kỳ game nào) — mang
// tinh thần u ám/phóng xạ/dò dẫm của "the Zone", KHÔNG chép nguyên văn câu
// thoại có bản quyền của studio nào. Muốn đổi/thêm dòng nào cứ sửa mảng này.
const ZONE_SIGNAL_LOGS = [
  "TÍN HIỆU YẾU DẦN... GIỮ NGUYÊN VỊ TRÍ.",
  "MÁY ĐO CÒN KÊU LÀ CÒN SỐNG.",
  "ĐỪNG TIN VÀO NHỮNG GÌ IM LẶNG QUÁ LÂU.",
  "DỊ THƯỜNG KHÔNG BÁO TRƯỚC KHI ĐẾN.",
  "CÒN THỞ LÀ CÒN ĐI TIẾP.",
  "GHI NHỚ ĐƯỜNG VÀO — CÓ THỂ KHÔNG CÓ ĐƯỜNG RA.",
];

// Placeholder nội dung bên trong Zone — SỬA/THAY THẾ mảng này bằng bí mật
// thật của bạn. Mỗi phần tử là 1 "tệp tin" hiện trong màn hình sau khi mở khoá.
const ZONE_ENTRIES = [
  {
    id: "note-01",
    title: "GHI CHÚ // 01",
    body: "Viết nội dung bí mật đầu tiên của bạn vào đây — sửa trong mảng ZONE_ENTRIES ở Zone.jsx.",
  },
  {
    id: "note-02",
    title: "GHI CHÚ // 02",
    body: "Có thể là 1 câu chuyện, 1 kế hoạch, 1 ghi chú riêng tư... tuỳ bạn.",
  },
  {
    id: "note-03",
    title: "TỌA ĐỘ ẨN GIẤU",
    body: "Hoặc xoá bớt/thêm entry tuỳ ý — chỉ là mảng dữ liệu JS bình thường.",
  },
];

function Zone() {
  usePageTitle("ЗОНА | Truy Cập Hạn Chế");

  const [unlocked, setUnlocked] = useState(() => {
    try {
      return window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // sessionStorage có thể bị chặn (chế độ ẩn danh nghiêm ngặt) -> mặc định khoá, bắt nhập lại.
      return false;
    }
  });
  const [input, setInput] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [radiation, setRadiation] = useState(0.18);
  const [granting, setGranting] = useState(false);
  const [logIndex, setLogIndex] = useState(0);

  const audioCtxRef = useRef(null);
  const inputRef = useRef(null);

  // Đã mở khoá trong tab này từ trước (sessionStorage) -> đọc ngay lúc khởi
  // tạo state ở trên (useState lazy initializer), khỏi cần effect riêng.

  // Đổi "log tín hiệu" mỗi vài giây — thuần trang trí khí quyển.
  useEffect(() => {
    if (unlocked) return undefined;
    const timer = setInterval(() => {
      setLogIndex((i) => (i + 1) % ZONE_SIGNAL_LOGS.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [unlocked]);

  // Đồng hồ đo bức xạ "sống" — số dao động ngẫu nhiên nhẹ + thỉnh thoảng có
  // tiếng "tick" Geiger counter, thuần hiệu ứng khí quyển, không có ý nghĩa gì.
  useEffect(() => {
    if (unlocked) return undefined;

    const radiationTimer = setInterval(() => {
      setRadiation(0.12 + Math.random() * 0.35);
    }, 700);

    const tickTimer = setInterval(
      () => {
        const ctx = getAudioCtx(audioCtxRef);
        playTick(ctx, 1200 + Math.random() * 800);
      },
      900 + Math.random() * 1400
    );

    return () => {
      clearInterval(radiationTimer);
      clearInterval(tickTimer);
    };
  }, [unlocked]);

  useEffect(() => {
    if (!unlocked) inputRef.current?.focus();
  }, [unlocked]);

  // Dọn dẹp: đóng AudioContext khi component unmount hẳn (rời khỏi /zone).
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const ctx = getAudioCtx(audioCtxRef);
    const isCorrect = input.trim().toLowerCase() === ZONE_PASSWORD.toLowerCase();

    if (isCorrect) {
      playGranted(ctx);
      setGranting(true);
      setTimeout(() => {
        setUnlocked(true);
        try {
          window.sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // bỏ qua nếu không lưu được
        }
      }, 900);
    } else {
      playDenied(ctx);
      setAttempts((a) => a + 1);
      setIsShaking(true);
      setInput("");
      setTimeout(() => setIsShaking(false), 420);
    }
  }

  function handleLockAgain() {
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // bỏ qua
    }
    setUnlocked(false);
    setGranting(false);
    setInput("");
  }

  return (
    <div className="zone-page">
      <div className="zone-noise" aria-hidden="true" />
      <div className="zone-scanlines" aria-hidden="true" />
      <div className="zone-fog" aria-hidden="true" />
      <div className="zone-vignette" aria-hidden="true" />

      <div className="zone-hazardbar top" aria-hidden="true" />
      <div className="zone-hazardbar bottom" aria-hidden="true" />

      <div className="zone-pda">
        <span className="zone-rivet tl" />
        <span className="zone-rivet tr" />
        <span className="zone-rivet bl" />
        <span className="zone-rivet br" />

        <div className="zone-pda-topbar">
          <span className="zone-pda-brand">P.D.A. // ZONE TERMINAL</span>
          <span className="zone-pda-signal" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>

        {!unlocked ? (
          <div className={`zone-lock ${isShaking ? "is-shaking" : ""} ${granting ? "is-granting" : ""}`}>
            <svg
              className="zone-radiation-icon"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle
                cx="16"
                cy="16"
                r="3"
                fill="currentColor"
              />
              {[0, 120, 240].map((deg) => (
                <path
                  key={deg}
                  d="M16 16 L16 4 A12 12 0 0 1 26.39 10 Z"
                  fill="currentColor"
                  opacity="0.9"
                  transform={`rotate(${deg} 16 16)`}
                />
              ))}
            </svg>

            <p className="zone-title-en">RESTRICTED ACCESS</p>
            <h1 className="zone-title">ВВЕДИТЕ ПАРОЛЬ</h1>
            <p className="zone-title-sub">Nhập mật khẩu để vào Zone</p>

            <div className="zone-readout">
              <span>BỨC XẠ</span>
              <strong>{radiation.toFixed(2)} μR/h</strong>
            </div>

            <p className="zone-signal-log">// {ZONE_SIGNAL_LOGS[logIndex]}</p>

            <form
              onSubmit={handleSubmit}
              className="zone-form"
            >
              <input
                ref={inputRef}
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  playKeypress(getAudioCtx(audioCtxRef));
                }}
                className="zone-input"
                placeholder="••••"
                autoComplete="off"
                spellCheck="false"
                disabled={granting}
              />
              <button
                type="submit"
                className="zone-submit"
                disabled={granting}
              >
                {granting ? "ĐANG XÁC MINH..." : "TRUY CẬP"}
              </button>
            </form>

            {attempts > 0 && !granting && <p className="zone-denied">TỪ CHỐI TRUY CẬP — SAI MẬT KHẨU ({attempts})</p>}
            {granting && <p className="zone-granted-msg">ACCESS GRANTED_</p>}

            <Link
              to="/"
              className="zone-leave-link"
            >
              ← Rời khỏi Zone
            </Link>
          </div>
        ) : (
          <div className="zone-content">
            <p className="zone-content-tag">TRUY CẬP: ĐÃ CẤP QUYỀN — CHÀO MỪNG TRỞ LẠI</p>

            {ZONE_ENTRIES.map((entry) => (
              <article
                key={entry.id}
                className="zone-entry"
              >
                <h2>{entry.title}</h2>
                <p>{entry.body}</p>
              </article>
            ))}

            <div className="zone-content-actions">
              <button
                type="button"
                className="zone-lock-again"
                onClick={handleLockAgain}
              >
                Khoá lại
              </button>
              <Link
                to="/"
                className="zone-leave-link"
              >
                ← Rời khỏi Zone
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Zone;
