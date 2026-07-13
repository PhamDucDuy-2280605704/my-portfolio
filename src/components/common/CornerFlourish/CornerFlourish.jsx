import "./CornerFlourish.css";

// Hoạ tiết góc trang trí dùng chung — vẽ 1 lần, dùng ở 4 góc của 1 khung bằng
// cách đặt 4 instance liên tiếp trong 1 container có class truyền vào (containerClassName
// tự định nghĩa vị trí/lật hướng qua CSS :nth-of-type, xem CornerFlourish.css).
// Ban đầu chỉ dùng trong SplashScreen, tách ra để dùng lại được ở nơi khác (VD: Hero).
function CornerFlourish() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="corner-flourish-svg"
      aria-hidden="true"
    >
      <path
        d="M6 46 C6 22 22 6 46 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6 6 L52 52"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="1 9"
        strokeLinecap="round"
      />
      <circle
        cx="6"
        cy="6"
        r="3.5"
        fill="currentColor"
      />
      <circle
        cx="52"
        cy="52"
        r="2.5"
        fill="currentColor"
      />
    </svg>
  );
}

export default CornerFlourish;
