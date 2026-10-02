import "./Backdrop.css";

// Nền trang trí dùng chung cho các section — thuần CSS/SVG, không ảnh nặng.
//   variant "hero"  : navy sâu + quầng sáng trôi + lưới + vòng tròn quỹ đạo + hạt nhiễu
//   variant "navy"  : như hero nhưng nhẹ hơn (Stats, Footer)
//   variant "light" : nền sáng với quầng pastel + lưới chấm mờ (Trust, Programs, Journal)
// Luôn nằm dưới nội dung (z-index -1) và không nhận chuột; section chứa nó cần
// position:relative + isolation:isolate (đã có trong CSS của từng section).
function Backdrop({ variant = "navy", className = "", style, backdropRef }) {
  return (
    <div
      ref={backdropRef}
      className={`bd bd--${variant} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <i className="bd-orb bd-orb--a" />
      <i className="bd-orb bd-orb--b" />
      <i className="bd-orb bd-orb--c" />
      <i className="bd-grid" />

      {variant === "hero" && (
        <svg
          className="bd-rings"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <g
            fill="none"
            stroke="#fff"
          >
            <circle
              cx="500"
              cy="560"
              r="250"
              strokeOpacity="0.10"
            />
            <circle
              className="bd-ring-spin"
              cx="500"
              cy="560"
              r="360"
              strokeOpacity="0.14"
              strokeDasharray="2 10"
              strokeLinecap="round"
            />
            <circle
              cx="500"
              cy="560"
              r="470"
              strokeOpacity="0.07"
            />
            <circle
              cx="500"
              cy="560"
              r="590"
              strokeOpacity="0.05"
            />
          </g>
        </svg>
      )}

      <i className="bd-grain" />
      {variant === "hero" && <i className="bd-vignette" />}
    </div>
  );
}

export default Backdrop;
