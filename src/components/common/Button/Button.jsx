import "./Button.css";

import { playUiSound } from "../../../utils/uiSound";

// Nút bấm dùng chung toàn site.
// variant: "primary" (nền xanh đặc, dùng cho hành động chính)
//        | "outline" (viền, nền trong suốt, dùng cho hành động phụ)
// disabled: dùng khi hành động chưa khả dụng (VD: chưa có file để tải) —
// tự thêm class "btn-disabled" để style xám đi + không cho bấm.
// Thường được bọc trong <Link>/<a> ở nơi gọi để điều hướng, vì Button chỉ lo
// phần giao diện + onClick, không tự điều hướng.
// Mọi Button (CV, gửi liên hệ, "Về Trang Chủ"...) đều phát chung 1 tiếng
// "action" khi bấm — đại diện cho khu vực "hành động chính" trên toàn site.
function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
}) {
  const handleClick = (e) => {
    if (disabled) return;
    playUiSound("action");
    onClick && onClick(e);
  };

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${disabled ? "btn-disabled" : ""}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;