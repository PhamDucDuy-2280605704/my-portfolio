// Ảnh minh hoạ cho thẻ dự án — vẽ bằng SVG (không cần ảnh chụp màn hình thật).
//   variant "web"    : cửa sổ trình duyệt với giao diện trang web
//   variant "mobile" : điện thoại với giao diện ứng dụng
// Màu dùng độ trong suốt của trắng + 1 điểm nhấn xanh nhạt / vàng chanh nên
// hợp với mọi nền gradient navy/teal của thẻ.
const ACCENT = "#22d3ee"; // cyan chủ đạo
const LIME = "#ffa94d"; // cam hổ phách (điểm nhấn)

function WebArt() {
  return (
    <svg
      viewBox="0 0 320 240"
      role="presentation"
    >
      <defs>
        <linearGradient
          id="wa-glass"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#fff"
            stopOpacity="0.22"
          />
          <stop
            offset="1"
            stopColor="#fff"
            stopOpacity="0.08"
          />
        </linearGradient>
      </defs>

      {/* cửa sổ trình duyệt */}
      <rect
        x="20"
        y="26"
        width="280"
        height="188"
        rx="14"
        fill="url(#wa-glass)"
        stroke="#fff"
        strokeOpacity="0.28"
      />
      <path
        d="M20 54h280"
        stroke="#fff"
        strokeOpacity="0.2"
      />
      <circle
        cx="38"
        cy="40"
        r="4"
        fill="#fff"
        fillOpacity="0.55"
      />
      <circle
        cx="52"
        cy="40"
        r="4"
        fill="#fff"
        fillOpacity="0.35"
      />
      <circle
        cx="66"
        cy="40"
        r="4"
        fill="#fff"
        fillOpacity="0.2"
      />
      <rect
        x="92"
        y="34"
        width="120"
        height="12"
        rx="6"
        fill="#fff"
        fillOpacity="0.16"
      />

      {/* nội dung trang: tiêu đề + nút + ảnh đại diện */}
      <rect
        x="40"
        y="76"
        width="112"
        height="14"
        rx="7"
        fill="#fff"
        fillOpacity="0.85"
      />
      <rect
        x="40"
        y="98"
        width="84"
        height="14"
        rx="7"
        fill="#fff"
        fillOpacity="0.55"
      />
      <rect
        x="40"
        y="124"
        width="150"
        height="6"
        rx="3"
        fill="#fff"
        fillOpacity="0.28"
      />
      <rect
        x="40"
        y="136"
        width="120"
        height="6"
        rx="3"
        fill="#fff"
        fillOpacity="0.28"
      />
      <rect
        x="40"
        y="154"
        width="58"
        height="22"
        rx="11"
        fill={ACCENT}
      />
      <rect
        x="106"
        y="154"
        width="58"
        height="22"
        rx="11"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.4"
      />

      <circle
        cx="244"
        cy="108"
        r="40"
        fill="#fff"
        fillOpacity="0.14"
      />
      <circle
        cx="244"
        cy="108"
        r="28"
        fill={ACCENT}
        fillOpacity="0.55"
      />
      <circle
        cx="262"
        cy="86"
        r="7"
        fill={LIME}
      />

      {/* hàng thẻ nhỏ phía dưới */}
      {[40, 112, 184].map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y="186"
            width="62"
            height="20"
            rx="8"
            fill="#fff"
            fillOpacity={0.18 - i * 0.03}
          />
          <rect
            x={x + 8}
            y="193"
            width="28"
            height="5"
            rx="2.5"
            fill="#fff"
            fillOpacity="0.5"
          />
        </g>
      ))}
    </svg>
  );
}

function MobileArt() {
  return (
    <svg
      viewBox="0 0 320 240"
      role="presentation"
    >
      <defs>
        <linearGradient
          id="ma-glass"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#fff"
            stopOpacity="0.24"
          />
          <stop
            offset="1"
            stopColor="#fff"
            stopOpacity="0.08"
          />
        </linearGradient>
      </defs>

      {/* điện thoại phụ phía sau, nghiêng nhẹ */}
      <g transform="rotate(-8 90 130)">
        <rect
          x="46"
          y="52"
          width="92"
          height="168"
          rx="16"
          fill="#fff"
          fillOpacity="0.08"
          stroke="#fff"
          strokeOpacity="0.2"
        />
        <rect
          x="60"
          y="72"
          width="64"
          height="40"
          rx="8"
          fill="#fff"
          fillOpacity="0.14"
        />
        <rect
          x="60"
          y="122"
          width="40"
          height="6"
          rx="3"
          fill="#fff"
          fillOpacity="0.3"
        />
        <rect
          x="60"
          y="134"
          width="56"
          height="6"
          rx="3"
          fill="#fff"
          fillOpacity="0.2"
        />
      </g>

      {/* điện thoại chính */}
      <rect
        x="114"
        y="14"
        width="112"
        height="212"
        rx="20"
        fill="url(#ma-glass)"
        stroke="#fff"
        strokeOpacity="0.35"
      />
      <rect
        x="150"
        y="22"
        width="40"
        height="9"
        rx="4.5"
        fill="#fff"
        fillOpacity="0.28"
      />

      <rect
        x="128"
        y="46"
        width="84"
        height="10"
        rx="5"
        fill="#fff"
        fillOpacity="0.85"
      />
      <rect
        x="128"
        y="62"
        width="52"
        height="6"
        rx="3"
        fill="#fff"
        fillOpacity="0.35"
      />

      {/* biểu đồ cột */}
      <rect
        x="128"
        y="82"
        width="84"
        height="62"
        rx="10"
        fill="#fff"
        fillOpacity="0.12"
      />
      {[0, 1, 2, 3, 4].map((i) => {
        const h = [20, 34, 26, 42, 32][i];
        return (
          <rect
            key={i}
            x={138 + i * 15}
            y={134 - h}
            width="9"
            height={h}
            rx="4.5"
            fill={i === 3 ? LIME : ACCENT}
            fillOpacity={i === 3 ? 1 : 0.8}
          />
        );
      })}

      {/* danh sách */}
      {[156, 180, 204].map((y, i) => (
        <g key={y}>
          <circle
            cx="140"
            cy={y + 6}
            r="6"
            fill="#fff"
            fillOpacity={0.4 - i * 0.08}
          />
          <rect
            x="154"
            y={y}
            width="48"
            height="5"
            rx="2.5"
            fill="#fff"
            fillOpacity="0.55"
          />
          <rect
            x="154"
            y={y + 9}
            width="30"
            height="4"
            rx="2"
            fill="#fff"
            fillOpacity="0.25"
          />
        </g>
      ))}

      {/* thẻ nổi bên phải */}
      <rect
        x="214"
        y="76"
        width="78"
        height="46"
        rx="12"
        fill="#fff"
        fillOpacity="0.2"
        stroke="#fff"
        strokeOpacity="0.35"
      />
      <circle
        cx="232"
        cy="94"
        r="8"
        fill={LIME}
      />
      <rect
        x="246"
        y="88"
        width="36"
        height="5"
        rx="2.5"
        fill="#fff"
        fillOpacity="0.8"
      />
      <rect
        x="246"
        y="98"
        width="24"
        height="4"
        rx="2"
        fill="#fff"
        fillOpacity="0.4"
      />
      <rect
        x="224"
        y="110"
        width="58"
        height="4"
        rx="2"
        fill="#fff"
        fillOpacity="0.25"
      />
    </svg>
  );
}

function ProjectArt({ variant = "web" }) {
  return (
    <span
      className="project-art"
      aria-hidden="true"
    >
      {variant === "mobile" ? <MobileArt /> : <WebArt />}
    </span>
  );
}

export default ProjectArt;
