import "./Button.css";

// Nút bấm dùng chung toàn site.
// variant: "primary" (nền xanh đặc, dùng cho hành động chính)
//        | "outline" (viền, nền trong suốt, dùng cho hành động phụ)
// Thường được bọc trong <Link>/<a> ở nơi gọi để điều hướng, vì Button chỉ lo
// phần giao diện + onClick, không tự điều hướng.
function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;