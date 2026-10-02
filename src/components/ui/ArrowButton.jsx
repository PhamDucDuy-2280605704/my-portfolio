import useHoverSpring from "../../hooks/useHoverSpring";
import { ArrowRight } from "./Icons";

// Nút mũi tên của carousel. direction "prev" lật ngang mũi tên (scaleX(-1)).
// Mũi tên phóng 1 -> 1.15 khi hover.
function ArrowButton({ direction = "next", variant = "outline", label, onClick }) {
  const { ref, bind } = useHoverSpring({ scale: 1 }, { scale: 1.15 }, { tension: 320, friction: 18 });

  return (
    <button
      type="button"
      className={`arrow-btn arrow-btn--${variant}`}
      aria-label={label}
      onClick={onClick}
      {...bind}
    >
      <span
        ref={ref}
        style={{ display: "inline-flex" }}
      >
        <ArrowRight style={direction === "prev" ? { transform: "scaleX(-1)" } : undefined} />
      </span>
    </button>
  );
}

export default ArrowButton;
