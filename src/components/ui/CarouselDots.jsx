// Chấm điều hướng carousel — chấm đang chọn kéo dài thành thanh.
function CarouselDots({ count, active, onSelect, tone = "dark", label }) {
  return (
    <div
      className={`dots${tone === "light" ? " dots--light" : ""}`}
      role="group"
      aria-label={label}
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i + 1} / ${count}`}
          aria-current={i === active ? "true" : undefined}
          onClick={() => onSelect?.(i)}
        >
          <i />
        </button>
      ))}
    </div>
  );
}

export default CarouselDots;
