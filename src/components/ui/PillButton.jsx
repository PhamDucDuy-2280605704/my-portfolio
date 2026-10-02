import useHoverSpring from "../../hooks/useHoverSpring";
import { ArrowRight } from "./Icons";

// Nút viên thuốc: variant light | solid | outline. Mũi tên bên phải spring
// x 0 -> 5 khi hover (hover cả nút, nên bind gắn ở <button>/<a>).
function PillButton({ variant = "solid", as: Tag = "button", children, className = "", ...rest }) {
  const { ref, bind } = useHoverSpring({ x: 0 }, { x: 5 }, { tension: 320, friction: 20 });
  const extra = Tag === "button" ? { type: rest.type ?? "button" } : {};

  return (
    <Tag
      className={`pill pill--${variant} ${className}`.trim()}
      {...bind}
      {...extra}
      {...rest}
    >
      {children}
      <span
        ref={ref}
        style={{ display: "inline-flex" }}
      >
        <ArrowRight className="pill-arrow" />
      </span>
    </Tag>
  );
}

export default PillButton;
