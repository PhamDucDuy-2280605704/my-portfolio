import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

import "./Zone.css";

import usePageTitle from "../../hooks/usePageTitle";
import HudFrame from "../../components/common/HudFrame/HudFrame";

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

// Mốc thời gian lần cuối mở khoá thành công — dùng localStorage (KHÔNG xoá
// khi đóng tab như sessionStorage) vì đây chỉ là 1 dòng "nhật ký truy cập"
// mang tính khí quyển, không phải thông tin cần bảo mật.
const LAST_ACCESS_KEY = "zone-last-access";

// Sau bao nhiêu lần nhập sai liên tiếp thì tạm khoá bàn phím 1 lúc (giống
// PDA/máy ATM khoá tạm sau nhiều lần sai) + khoá bao nhiêu giây.
const LOCKOUT_THRESHOLD = 3;
const LOCKOUT_SECONDS = 12;

// Danh sách ghi chú lưu trong localStorage của TRÌNH DUYỆT NÀY (không gửi
// đi bất kỳ server nào) -> thêm/xoá ghi chú ngay trong lúc đang mở khoá,
// lần sau quay lại vẫn còn nguyên trên cùng máy/trình duyệt.
const ENTRIES_KEY = "zone-entries";

const DEFAULT_ENTRIES = [
  {
    id: "note-01",
    title: "GHI CHÚ // 01",
    body: 'Bấm "+ Thêm ghi chú" bên dưới để viết bí mật đầu tiên của bạn — mọi ghi chú lưu ngay trên trình duyệt này (localStorage), không gửi đi đâu cả.',
    decrypt: true,
  },
];

function loadEntries() {
  try {
    const raw = window.localStorage.getItem(ENTRIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // JSON hỏng hoặc localStorage bị chặn -> dùng mặc định
  }
  return DEFAULT_ENTRIES;
}

function saveEntries(entries) {
  try {
    window.localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch {
    // bỏ qua nếu không lưu được (VD: chế độ ẩn danh nghiêm ngặt)
  }
}

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

function playCopyTick(ctx) {
  if (!ctx) return;
  [880, 1180].forEach((freq, i) => {
    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t0 = ctx.currentTime;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.06, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.06);
    }, i * 40);
  });
}

function playLockAgain(ctx) {
  if (!ctx) return;
  [900, 500].forEach((freq, i) => {
    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t0 = ctx.currentTime;
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.07, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.12);
    }, i * 70);
  });
}

// "Giải mã" chữ kiểu terminal — hiện từng ký tự một thay vì hiện nguyên cả
// khối văn bản cùng lúc, giống cảm giác 1 tệp tin đang được giải mã. Luôn
// vẫn render nguyên văn bản đầy đủ trong DOM cho trình đọc màn hình (không
// phụ thuộc animation để đọc được nội dung).
function DecryptText({ text, startDelay = 0, onTick }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    let i = 0;
    let intervalId;

    const startTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (onTick && i % 3 === 0) onTick();
        if (i >= text.length) clearInterval(intervalId);
      }, 16);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, startDelay]);

  return (
    <>
      <span aria-hidden="true">{shown}</span>
      <span className="zone-sr-only">{text}</span>
    </>
  );
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
  const [cooldown, setCooldown] = useState(0);
  const [lastAccess, setLastAccess] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [muted, setMuted] = useState(false);
  const [entries, setEntries] = useState(() => loadEntries());
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const audioCtxRef = useRef(null);
  const inputRef = useRef(null);
  const mutedRef = useRef(false);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // Tất cả tiếng động trong trang đi qua hàm này thay vì gọi getAudioCtx
  // trực tiếp -> bấm tắt tiếng là im re toàn bộ, kể cả tiếng Geiger counter
  // chạy ngầm.
  function ctx() {
    return mutedRef.current ? null : getAudioCtx(audioCtxRef);
  }

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
        playTick(ctx(), 1200 + Math.random() * 800);
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

  // Đếm ngược lúc bị "tạm khoá" sau nhiều lần nhập sai liên tiếp.
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Phím tắt "khoá khẩn cấp": đang mở khoá mà bấm Esc -> khoá lại ngay lập
  // tức, kiểu phản xạ rời khỏi máy nhanh khi có người đi ngang qua.
  useEffect(() => {
    if (!unlocked) return undefined;
    function handleKeyDown(e) {
      if (e.key === "Escape") handleLockAgain();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
     
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
    if (cooldown > 0 || granting) return;

    const isCorrect = input.trim().toLowerCase() === ZONE_PASSWORD.toLowerCase();

    if (isCorrect) {
      playGranted(ctx());
      setGranting(true);
      setTimeout(() => {
        // Đọc mốc truy cập LẦN TRƯỚC (nếu có) trước khi ghi đè bằng mốc mới.
        let previous = null;
        try {
          previous = window.localStorage.getItem(LAST_ACCESS_KEY);
          window.localStorage.setItem(LAST_ACCESS_KEY, new Date().toISOString());
        } catch {
          // bỏ qua nếu không lưu được
        }
        setLastAccess(previous);
        setUnlocked(true);
        try {
          window.sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // bỏ qua nếu không lưu được
        }
      }, 900);
    } else {
      playDenied(ctx());
      setInput("");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 420);

      setAttempts((a) => {
        const next = a + 1;
        if (next % LOCKOUT_THRESHOLD === 0) setCooldown(LOCKOUT_SECONDS);
        return next;
      });
    }
  }

  function handleLockAgain() {
    playLockAgain(ctx());
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // bỏ qua
    }
    setUnlocked(false);
    setGranting(false);
    setInput("");
  }

  function handleCopy(entry) {
    playCopyTick(ctx());
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(entry.body).catch(() => {});
    }
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId((id) => (id === entry.id ? null : id)), 1600);
  }

  function handleAddEntry(e) {
    e.preventDefault();
    if (!newBody.trim()) return;

    const entry = {
      id: `note-${Date.now()}`,
      title: newTitle.trim() || `GHI CHÚ // ${entries.length + 1}`,
      body: newBody.trim(),
      // Ghi chú TỰ TAY người dùng vừa gõ -> hiện ngay, không cần hiệu ứng
      // "giải mã" (hiệu ứng đó dành cho nội dung như thể đã có sẵn từ trước).
      decrypt: false,
    };

    const next = [...entries, entry];
    setEntries(next);
    saveEntries(next);
    setNewTitle("");
    setNewBody("");
    setShowAddForm(false);
    playGranted(ctx());
  }

  function handleDeleteEntry(id) {
    const next = entries.filter((entry) => entry.id !== id);
    setEntries(next);
    saveEntries(next);
    playLockAgain(ctx());
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
        <HudFrame label="ZONE.TERMINAL">
          <div className="zone-pda-topbar">
            <span className="zone-pda-brand">P.D.A. // ZONE TERMINAL</span>
            <div className="zone-pda-topbar-right">
              <span
                className="zone-pda-signal"
                aria-hidden="true"
              >
                <i />
                <i />
                <i />
                <i />
              </span>
              <button
                type="button"
                className="zone-mute-btn"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Bật âm thanh" : "Tắt âm thanh"}
              >
                {muted ? <HiSpeakerXMark /> : <HiSpeakerWave />}
              </button>
            </div>
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
                  playKeypress(ctx());
                }}
                className="zone-input"
                placeholder="••••"
                autoComplete="off"
                spellCheck="false"
                disabled={granting || cooldown > 0}
              />
              <button
                type="submit"
                className="zone-submit"
                disabled={granting || cooldown > 0}
              >
                {granting ? "ĐANG XÁC MINH..." : cooldown > 0 ? `KHOÁ (${cooldown}s)` : "TRUY CẬP"}
              </button>
            </form>

            {cooldown > 0 && (
              <p className="zone-denied">HỆ THỐNG TẠM KHOÁ SAU NHIỀU LẦN SAI — CHỜ {cooldown}S</p>
            )}
            {attempts > 0 && !granting && cooldown === 0 && (
              <p className="zone-denied">TỪ CHỐI TRUY CẬP — SAI MẬT KHẨU ({attempts})</p>
            )}
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
            {lastAccess && (
              <p className="zone-last-access">
                LẦN TRUY CẬP TRƯỚC: {new Date(lastAccess).toLocaleString("vi-VN")}
              </p>
            )}
            <p className="zone-hotkey-hint">Mẹo: bấm Esc để khoá lại ngay lập tức.</p>

            {entries.map((entry, i) => (
              <article
                key={entry.id}
                className="zone-entry"
              >
                <div className="zone-entry-head">
                  <h2>{entry.title}</h2>
                  <div className="zone-entry-actions">
                    <button
                      type="button"
                      className="zone-copy-btn"
                      onClick={() => handleCopy(entry)}
                    >
                      {copiedId === entry.id ? "Đã copy ✓" : "Copy"}
                    </button>
                    <button
                      type="button"
                      className="zone-copy-btn zone-delete-btn"
                      onClick={() => handleDeleteEntry(entry.id)}
                      aria-label={`Xoá ${entry.title}`}
                    >
                      Xoá
                    </button>
                  </div>
                </div>
                <p>
                  {entry.decrypt ? (
                    <DecryptText
                      text={entry.body}
                      startDelay={i * 450}
                      onTick={() => playKeypress(ctx())}
                    />
                  ) : (
                    entry.body
                  )}
                </p>
              </article>
            ))}

            {entries.length === 0 && <p className="zone-empty">Chưa có ghi chú nào. Thêm cái đầu tiên bên dưới.</p>}

            {showAddForm ? (
              <form
                onSubmit={handleAddEntry}
                className="zone-add-form"
              >
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="zone-add-title"
                  placeholder={`GHI CHÚ // ${String(entries.length + 1).padStart(2, "0")}`}
                  maxLength={40}
                />
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="zone-add-body"
                  placeholder="Nội dung ghi chú..."
                  rows={3}
                  autoFocus
                />
                <div className="zone-add-actions">
                  <button
                    type="button"
                    className="zone-lock-again"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewTitle("");
                      setNewBody("");
                    }}
                  >
                    Huỷ
                  </button>
                  <button
                    type="submit"
                    className="zone-submit"
                    disabled={!newBody.trim()}
                  >
                    Lưu ghi chú
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                className="zone-add-toggle"
                onClick={() => setShowAddForm(true)}
              >
                + Thêm ghi chú
              </button>
            )}

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
        </HudFrame>
      </div>
    </div>
  );
}

export default Zone;
