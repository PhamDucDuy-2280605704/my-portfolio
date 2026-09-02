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

// Sau bao nhiêu mili-giây KHÔNG có tương tác (chuột/bàn phím) thì tự khoá
// lại — phòng trường hợp mở khoá xong rồi quên đó, đi làm việc khác.
const AUTO_LOCK_MS = 3 * 60 * 1000; // 3 phút

// Tên file .txt xuất ra khi bấm "Xuất file".
const EXPORT_FILENAME = "zone-notes.txt";

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
    createdAt: null,
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
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const audioCtxRef = useRef(null);
  const inputRef = useRef(null);
  const mutedRef = useRef(false);
  const autoLockTimerRef = useRef(null);
  const undoTimerRef = useRef(null);

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

  // Tự khoá lại sau 1 khoảng thời gian KHÔNG có tương tác nào (chuột/bàn
  // phím/cảm ứng) — phòng trường hợp mở khoá xong rồi bỏ đi làm việc khác,
  // quên khoá lại bằng tay. Mỗi lần có tương tác -> huỷ hẹn giờ cũ, đặt lại
  // hẹn giờ mới từ đầu.
  useEffect(() => {
    if (!unlocked) return undefined;

    function resetTimer() {
      clearTimeout(autoLockTimerRef.current);
      autoLockTimerRef.current = setTimeout(() => {
        handleLockAgain();
      }, AUTO_LOCK_MS);
    }

    const events = ["mousemove", "keydown", "touchstart", "wheel"];
    events.forEach((evt) => window.addEventListener(evt, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(autoLockTimerRef.current);
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

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
      clearTimeout(undoTimerRef.current);
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
      createdAt: new Date().toISOString(),
      pinned: false,
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
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;

    // Xoá "mềm" — ẩn khỏi danh sách ngay lập tức nhưng chưa lưu xuống
    // localStorage, cho phép bấm "Hoàn tác" trong 5s trước khi xoá thật.
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    playLockAgain(ctx());

    clearTimeout(undoTimerRef.current);
    setPendingDelete({ entry, index: entries.indexOf(entry) });
    undoTimerRef.current = setTimeout(() => {
      saveEntries(next);
      setPendingDelete(null);
    }, 5000);
  }

  function handleUndoDelete() {
    if (!pendingDelete) return;
    clearTimeout(undoTimerRef.current);

    setEntries((current) => {
      const restored = [...current];
      restored.splice(pendingDelete.index, 0, pendingDelete.entry);
      saveEntries(restored);
      return restored;
    });
    setPendingDelete(null);
    playGranted(ctx());
  }

  function handleTogglePin(id) {
    const next = entries.map((entry) => (entry.id === id ? { ...entry, pinned: !entry.pinned } : entry));
    setEntries(next);
    saveEntries(next);
    playCopyTick(ctx());
  }

  function handleStartEdit(entry) {
    setEditingId(entry.id);
    setEditTitle(entry.title);
    setEditBody(entry.body);
    playCopyTick(ctx());
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditBody("");
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    if (!editBody.trim()) return;

    const next = entries.map((entry) =>
      entry.id === editingId
        ? {
            ...entry,
            title: editTitle.trim() || entry.title,
            body: editBody.trim(),
            // Đã sửa tay -> không cần hiệu ứng "giải mã" nữa lần sau hiện lại.
            decrypt: false,
            editedAt: new Date().toISOString(),
          }
        : entry
    );

    setEntries(next);
    saveEntries(next);
    playGranted(ctx());
    handleCancelEdit();
  }

  // Xuất toàn bộ ghi chú thành 1 file .txt tải về máy — bản sao lưu thủ
  // công, phòng trường hợp xoá cache trình duyệt/đổi máy sẽ mất hết
  // localStorage. Không gửi lên server nào, tạo file thẳng trong trình duyệt.
  function handleExport() {
    const lines = entries.map((entry) => {
      const date = entry.createdAt ? new Date(entry.createdAt).toLocaleString("vi-VN") : "";
      return `${entry.title}${date ? ` (${date})` : ""}\n${"-".repeat(40)}\n${entry.body}\n`;
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = EXPORT_FILENAME;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    playCopyTick(ctx());
  }

  // Danh sách hiện thực tế trên màn hình: ghim lên đầu trước, rồi lọc theo
  // ô tìm kiếm (khớp tiêu đề HOẶC nội dung, không phân biệt hoa/thường).
  const visibleEntries = entries
    .filter((entry) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return entry.title.toLowerCase().includes(q) || entry.body.toLowerCase().includes(q);
    })
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

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
            <p className="zone-hotkey-hint">Mẹo: bấm Esc để khoá lại ngay lập tức. Tự khoá sau 3 phút không thao tác.</p>

            {/* Chỉ hiện thanh tìm kiếm khi có từ 3 ghi chú trở lên — ít hơn
                thì tìm kiếm không thực sự cần thiết, chỉ chiếm chỗ. */}
            {entries.length >= 3 && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="zone-search"
                placeholder="Tìm trong ghi chú..."
              />
            )}

            {pendingDelete && (
              <div className="zone-undo-toast">
                <span>Đã xoá &ldquo;{pendingDelete.entry.title}&rdquo;</span>
                <button
                  type="button"
                  onClick={handleUndoDelete}
                >
                  Hoàn tác
                </button>
              </div>
            )}

            {visibleEntries.map((entry, i) => (
              <article
                key={entry.id}
                className="zone-entry"
              >
                {editingId === entry.id ? (
                  <form
                    onSubmit={handleSaveEdit}
                    className="zone-add-form"
                  >
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="zone-add-title"
                      maxLength={40}
                    />
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      className="zone-add-body"
                      rows={3}
                      maxLength={2000}
                      autoFocus
                    />
                    <span className="zone-char-count">{editBody.length}/2000</span>
                    <div className="zone-add-actions">
                      <button
                        type="button"
                        className="zone-lock-again"
                        onClick={handleCancelEdit}
                      >
                        Huỷ
                      </button>
                      <button
                        type="submit"
                        className="zone-submit"
                        disabled={!editBody.trim()}
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="zone-entry-head">
                      <h2>
                        {entry.pinned && <span className="zone-pin-badge">📌</span>}
                        {entry.title}
                      </h2>
                      <div className="zone-entry-actions">
                        <button
                          type="button"
                          className="zone-copy-btn"
                          onClick={() => handleTogglePin(entry.id)}
                        >
                          {entry.pinned ? "Bỏ ghim" : "Ghim"}
                        </button>
                        <button
                          type="button"
                          className="zone-copy-btn"
                          onClick={() => handleCopy(entry)}
                        >
                          {copiedId === entry.id ? "Đã copy ✓" : "Copy"}
                        </button>
                        <button
                          type="button"
                          className="zone-copy-btn"
                          onClick={() => handleStartEdit(entry)}
                        >
                          Sửa
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
                    {entry.createdAt && (
                      <p className="zone-entry-timestamp">
                        {entry.editedAt ? "Đã sửa" : "Tạo lúc"}:{" "}
                        {new Date(entry.editedAt || entry.createdAt).toLocaleString("vi-VN")}
                      </p>
                    )}
                  </>
                )}
              </article>
            ))}

            {entries.length === 0 && <p className="zone-empty">Chưa có ghi chú nào. Thêm cái đầu tiên bên dưới.</p>}
            {entries.length > 0 && visibleEntries.length === 0 && (
              <p className="zone-empty">Không tìm thấy ghi chú nào khớp với &ldquo;{searchQuery}&rdquo;.</p>
            )}

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
                  maxLength={2000}
                  autoFocus
                />
                <span className="zone-char-count">{newBody.length}/2000</span>
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
                onClick={handleExport}
                disabled={entries.length === 0}
              >
                Xuất file .txt
              </button>
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
