import "./CornerFlourish.css";

// Bracket góc kiểu HUD — 1 nét L vuông góc + 1 tick vuông nhỏ ở đầu mút,
// đồng bộ hẳn với .hud-frame-corner (HudFrame) và .corner (ParticleIntro)
// thay vì đường cong trang trí kiểu cổ điển trước đây. Vẽ 1 lần ở góc trên
// trái, 3 góc còn lại chỉ lật hướng bằng CSS transform (xem CornerFlourish.css).
function CornerFlourish() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="corner-flourish-svg"
      aria-hidden="true"
    >
      <path
        d="M6 42 L6 6 L42 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6 6 L30 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="1 8"
        strokeLinecap="round"
      />
      <rect
        x="2"
        y="2"
        width="6"
        height="6"
        fill="currentColor"
      />
    </svg>
  );
}

export default CornerFlourish;
