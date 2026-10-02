// Lưới rem thích ứng — phần PHÓNG TO khi viewport rộng hơn 1920px.
// (Phần thu nhỏ do media query trong styles/baseline.css đảm nhiệm.)
// Trên 1920px: `reduction` âm nên size > 16 -> gán font-size inline cho <html>.
// Từ 1920px trở xuống: xoá font-size inline để media query tiếp quản.
const FONT_BASE = 16;
const BASE_WIDTH = 1920;
const COEF = 0.6666;

function apply() {
  const html = document.documentElement;
  const reduction = ((BASE_WIDTH - window.innerWidth) / BASE_WIDTH) * 100 * COEF;
  const size = FONT_BASE - (FONT_BASE * reduction) / 100;

  if (size > FONT_BASE) html.style.fontSize = `${size}px`;
  else html.style.removeProperty("font-size");
}

export function initAdaptiveRem() {
  apply();
  window.addEventListener("resize", apply);
  return () => window.removeEventListener("resize", apply);
}
