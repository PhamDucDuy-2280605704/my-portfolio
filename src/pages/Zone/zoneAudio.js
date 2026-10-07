// zoneAudio.js — âm thanh của trang /zone, TỰ TỔNG HỢP bằng Web Audio API
// (oscillator thuần, không dùng file audio). Mỗi hàm play* nhận 1 AudioContext
// (lấy từ getAudioCtx) và phát 1 hiệu ứng; nhận ctx = null thì im lặng, nên
// Zone.jsx có thể truyền thẳng ctx() kể cả khi người dùng đã tắt tiếng.

// Lấy AudioContext dùng chung, lưu trong `ref` (tạo lần đầu, các lần sau dùng lại).
// Trả null nếu trình duyệt không hỗ trợ / không cho tạo.
export function getAudioCtx(ref) {
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

// Phát 1 tiếng bíp: sóng `type` tần số `freq`, âm lượng khởi đầu `peak` rồi tắt dần
// về ~0 sau `fade` giây; oscillator dừng hẳn ở `stop` giây (trễ hơn `fade` một chút
// để đuôi tiếng không bị cắt cụt).
function beep(ctx, { type, freq, peak, fade, stop }) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t0 = ctx.currentTime;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(peak, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + fade);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + stop);
}

// Phát nhiều tiếng nối nhau: mỗi phần tử của `notes` là [tần số, độ trễ ms];
// `shape` là các thông số còn lại của beep (type/peak/fade/stop) dùng chung.
function sequence(ctx, notes, shape) {
  notes.forEach(([freq, delay]) => {
    setTimeout(() => beep(ctx, { ...shape, freq }), delay);
  });
}

// "Tách" ngắn khi chữ giải mã hiện ra
export function playTick(ctx, freq = 1400) {
  if (!ctx) return;
  beep(ctx, { type: "square", freq, peak: 0.05, fade: 0.03, stop: 0.04 });
}

// Tiếng gõ phím trên khoá số (tần số lệch ngẫu nhiên 320–380 để đỡ đơn điệu)
export function playKeypress(ctx) {
  if (!ctx) return;
  beep(ctx, { type: "triangle", freq: 320 + Math.random() * 60, peak: 0.06, fade: 0.05, stop: 0.06 });
}

// Sai mật khẩu: 2 tiếng trầm cách nhau 130ms
export function playDenied(ctx) {
  if (!ctx) return;
  sequence(ctx, [[160, 0], [160, 130]], { type: "sawtooth", peak: 0.09, fade: 0.18, stop: 0.2 });
}

// Đúng mật khẩu: 3 nốt đi lên
export function playGranted(ctx) {
  if (!ctx) return;
  sequence(ctx, [[520, 0], [780, 90], [1040, 180]], { type: "triangle", peak: 0.08, fade: 0.16, stop: 0.18 });
}

// Sao chép / thao tác nhỏ: 2 tiếng "tích" ngắn
export function playCopyTick(ctx) {
  if (!ctx) return;
  sequence(ctx, [[880, 0], [1180, 40]], { type: "triangle", peak: 0.06, fade: 0.05, stop: 0.06 });
}

// Khoá lại: 2 tiếng đi xuống
export function playLockAgain(ctx) {
  if (!ctx) return;
  sequence(ctx, [[900, 0], [500, 70]], { type: "sawtooth", peak: 0.07, fade: 0.1, stop: 0.12 });
}
