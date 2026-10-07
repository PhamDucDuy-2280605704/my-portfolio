import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getAudioCtx,
  playCopyTick,
  playDenied,
  playGranted,
  playKeypress,
  playLockAgain,
  playTick,
} from "./zoneAudio";

// AudioContext giả: ghi lại mọi oscillator được tạo ra cùng các lệnh đặt tham số,
// để test kiểm tra đúng kiểu sóng / tần số / âm lượng / thời lượng mà không cần phát tiếng thật.
function makeFakeCtx() {
  const oscillators = [];
  const gains = [];
  return {
    oscillators,
    gains,
    currentTime: 0,
    destination: {},
    createOscillator() {
      const osc = {
        type: "",
        frequency: { setValueAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
      oscillators.push(osc);
      return osc;
    },
    createGain() {
      const node = {
        gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn(),
      };
      gains.push(node);
      return node;
    },
  };
}

// Tóm tắt 1 oscillator: type, tần số, mốc dừng
const freqOf = (osc) => osc.frequency.setValueAtTime.mock.calls[0][0];
const stopOf = (osc) => osc.stop.mock.calls[0][0];
// Âm lượng khởi đầu và mốc tắt dần (giây) của gain đi kèm
const peakOf = (g) => g.gain.setValueAtTime.mock.calls[0][0];
const fadeOf = (g) => g.gain.exponentialRampToValueAtTime.mock.calls[0];

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("getAudioCtx", () => {
  it("trả null khi trình duyệt không có Web Audio", () => {
    expect(getAudioCtx({ current: null })).toBeNull();
  });

  it("tạo AudioContext 1 lần rồi dùng lại qua ref", () => {
    const created = vi.fn();
    class FakeAudioContext {
      constructor() {
        created();
        this.state = "running";
      }
    }
    vi.stubGlobal("AudioContext", FakeAudioContext);

    const ref = { current: null };
    const first = getAudioCtx(ref);
    const second = getAudioCtx(ref);

    expect(first).toBe(second);
    expect(ref.current).toBe(first);
    expect(created).toHaveBeenCalledTimes(1);
  });

  it("resume khi context đang bị trình duyệt tạm dừng (suspended)", () => {
    const resume = vi.fn(() => Promise.resolve());
    vi.stubGlobal(
      "AudioContext",
      class {
        state = "suspended";
        resume = resume;
      },
    );
    getAudioCtx({ current: null });
    expect(resume).toHaveBeenCalledTimes(1);
  });

  it("trả null thay vì ném lỗi khi khởi tạo AudioContext thất bại", () => {
    vi.stubGlobal(
      "AudioContext",
      class {
        constructor() {
          throw new Error("không cho phép");
        }
      },
    );
    expect(getAudioCtx({ current: null })).toBeNull();
  });
});

describe("hiệu ứng âm thanh", () => {
  it("im lặng (không lỗi) khi ctx = null — trường hợp người dùng đã tắt tiếng", () => {
    for (const play of [playTick, playKeypress, playDenied, playGranted, playCopyTick, playLockAgain]) {
      expect(() => play(null)).not.toThrow();
    }
  });

  it("playTick: sóng vuông, tần số mặc định 1400 và có thể truyền tần số riêng", () => {
    const ctx = makeFakeCtx();
    playTick(ctx);
    playTick(ctx, 2000);

    const [a, b] = ctx.oscillators;
    expect(a.type).toBe("square");
    expect(freqOf(a)).toBe(1400);
    expect(freqOf(b)).toBe(2000);
    expect(stopOf(a)).toBeCloseTo(0.04);
    expect(a.start).toHaveBeenCalledWith(0);
    expect(peakOf(ctx.gains[0])).toBe(0.05);
    expect(fadeOf(ctx.gains[0])[0]).toBe(0.0001); // tắt dần về ~0
    expect(fadeOf(ctx.gains[0])[1]).toBeCloseTo(0.03);
    // osc -> gain -> loa
    expect(a.connect).toHaveBeenCalledWith(ctx.gains[0]);
    expect(ctx.gains[0].connect).toHaveBeenCalledWith(ctx.destination);
  });

  it("playKeypress: sóng tam giác, tần số 320–380 (ngẫu nhiên)", () => {
    const ctx = makeFakeCtx();
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    playKeypress(ctx);

    const [osc] = ctx.oscillators;
    expect(osc.type).toBe("triangle");
    expect(freqOf(osc)).toBeCloseTo(350);
    expect(stopOf(osc)).toBeCloseTo(0.06);
    expect(peakOf(ctx.gains[0])).toBe(0.06);
    expect(fadeOf(ctx.gains[0])[1]).toBeCloseTo(0.05);
  });

  // [tên hàm, kiểu sóng, danh sách [tần số, độ trễ ms], mốc dừng, âm lượng, mốc tắt dần]
  const sequences = [
    ["playDenied", playDenied, "sawtooth", [[160, 0], [160, 130]], 0.2, 0.09, 0.18],
    ["playGranted", playGranted, "triangle", [[520, 0], [780, 90], [1040, 180]], 0.18, 0.08, 0.16],
    ["playCopyTick", playCopyTick, "triangle", [[880, 0], [1180, 40]], 0.06, 0.06, 0.05],
    ["playLockAgain", playLockAgain, "sawtooth", [[900, 0], [500, 70]], 0.12, 0.07, 0.1],
  ];

  it.each(sequences)("%s: đúng kiểu sóng, tần số và nhịp từng tiếng", (_name, play, type, notes, stopAt, peak, fade) => {
    const ctx = makeFakeCtx();
    play(ctx);

    // Chưa tiếng nào phát ngay lúc gọi (mỗi tiếng được hẹn giờ bằng setTimeout)
    expect(ctx.oscillators).toHaveLength(0);

    // Tới đúng mốc trễ của từng tiếng thì tiếng đó mới xuất hiện
    notes.forEach(([freq, delay], i) => {
      vi.advanceTimersByTime(i === 0 ? delay : delay - notes[i - 1][1]);
      expect(ctx.oscillators).toHaveLength(i + 1);
      const osc = ctx.oscillators[i];
      expect(osc.type).toBe(type);
      expect(freqOf(osc)).toBe(freq);
      expect(stopOf(osc)).toBeCloseTo(stopAt);
      expect(peakOf(ctx.gains[i])).toBe(peak);
      expect(fadeOf(ctx.gains[i])[1]).toBeCloseTo(fade);
    });
  });
});
