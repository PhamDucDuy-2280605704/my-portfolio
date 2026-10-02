// Bộ icon SVG dùng chung (stroke currentColor, đầu bo tròn — đồng bộ nét 1.8).

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

// Logo mark: vòng tròn + cặp ngoặc </> — tượng trưng cho lập trình viên.
export function BrandMark({ className }) {
  return (
    <svg
      {...base}
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />
      <path d="M9.6 9.2 6.8 12l2.8 2.8" />
      <path d="M14.4 9.2l2.8 2.8-2.8 2.8" />
    </svg>
  );
}

export function ArrowRight({ className, style }) {
  return (
    <svg
      {...base}
      className={className}
      style={style}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function CloseIcon({ className }) {
  return (
    <svg
      {...base}
      className={className}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function CheckIcon({ className }) {
  return (
    <svg
      {...base}
      className={className}
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
