// uiSound.js — tiếng "click" nhẹ khi tương tác với UI, mỗi khu vực trên site
// có 1 âm sắc riêng để phân biệt bằng tai (không cần nhìn cũng biết đang
// bấm vào đâu). Toàn bộ âm thanh TỰ TỔNG HỢP bằng Web Audio API ngay trong
// trình duyệt (oscillator), KHÔNG dùng file audio -> không thêm HTTP
// request/asset, cực nhẹ.
//
// Dùng 1 AudioContext DÙNG CHUNG cho cả site (thay vì tạo mới mỗi lần bấm)
// để tránh việc tạo hàng loạt AudioContext khi người dùng bấm liên tục.

let sharedCtx = null;
let userMuted = false;

const STORAGE_KEY = "ui-sound-muted";

// Đọc trạng thái tắt tiếng đã lưu (nếu có) ngay khi module được import lần đầu.
try {
  if (typeof window !== "undefined") {
    userMuted = window.localStorage.getItem(STORAGE_KEY) === "1";
  }
} catch {
  // localStorage có thể bị chặn (chế độ ẩn danh nghiêm ngặt...) -> bỏ qua, mặc định không tắt tiếng.
}

function getCtx() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;

  if (!sharedCtx) {
    try {
      sharedCtx = new Ctx();
    } catch {
      return null;
    }
  }

  if (sharedCtx.state === "suspended") {
    // Chỉ resume khi có cử chỉ người dùng (hàm này luôn được gọi từ 1 sự
    // kiện click/keydown thật, nên gọi ở đây là hợp lệ với chính sách trình duyệt).
    sharedCtx.resume().catch(() => {});
  }

  return sharedCtx;
}

function beep(ctx, { freq = 880, duration = 0.05, type = "sine", gain = 0.035, delay = 0 } = {}) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  gainNode.gain.setValueAtTime(gain, ctx.currentTime + delay);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

// Mỗi "khu vực" 1 âm sắc riêng biệt:
//  - nav      : menu điều hướng (Navbar desktop + mobile) — tiếng "tick" cao, gọn
//  - navActive: mục đang active trong menu — thêm 1 nốt cao hơn ngay sau
//  - action   : nút hành động chính (Button component: tải CV, gửi liên hệ...) — 2 nốt trầm hơn, chắc tay
//  - toggle   : chuyển đổi theme sáng/tối — 2 tick nhanh kiểu công tắc
//  - tab      : tab lọc (VD tab dự án) — 1 tiếng "cạch" trung tính
//  - card     : thẻ/link phụ (dự án, kinh nghiệm, nhật ký...) — tiếng rất nhỏ, tinh tế
const PRESETS = {
  nav: (ctx) => beep(ctx, { freq: 1180, duration: 0.045, gain: 0.03, type: "square" }),
  navActive: (ctx) => {
    beep(ctx, { freq: 1180, duration: 0.04, gain: 0.03, type: "square" });
    beep(ctx, { freq: 1480, duration: 0.05, gain: 0.03, delay: 0.045 });
  },
  action: (ctx) => {
    beep(ctx, { freq: 480, duration: 0.06, gain: 0.045 });
    beep(ctx, { freq: 700, duration: 0.09, gain: 0.05, delay: 0.05 });
  },
  toggle: (ctx) => {
    beep(ctx, { freq: 820, duration: 0.03, gain: 0.03, type: "triangle" });
    beep(ctx, { freq: 1100, duration: 0.03, gain: 0.03, type: "triangle", delay: 0.05 });
  },
  tab: (ctx) => beep(ctx, { freq: 640, duration: 0.05, gain: 0.035, type: "sine" }),
  card: (ctx) => beep(ctx, { freq: 980, duration: 0.025, gain: 0.02 }),
};

/**
 * Phát tiếng click cho 1 khu vực cụ thể. An toàn khi gọi ở môi trường không
 * có window (SSR) hoặc trình duyệt không hỗ trợ Web Audio — sẽ tự bỏ qua.
 * @param {keyof typeof PRESETS} preset
 */
export function playUiSound(preset) {
  if (userMuted) return;
  const fn = PRESETS[preset];
  if (!fn) return;
  const ctx = getCtx();
  if (!ctx) return;
  try {
    fn(ctx);
  } catch {
    // Không để lỗi âm thanh làm crash thao tác chính của người dùng (VD điều hướng, submit form...)
  }
}

export function isUiSoundMuted() {
  return userMuted;
}

export function setUiSoundMuted(value) {
  userMuted = value;
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    }
  } catch {
    // bỏ qua nếu không lưu được
  }
}
