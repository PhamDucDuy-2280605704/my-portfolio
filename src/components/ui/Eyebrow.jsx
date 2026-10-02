// Nhãn nhỏ phía trên tiêu đề section. `code` (VD "SEC.03") là mã hiệu kiểu HUD,
// hiện bằng font mono màu cam — chỉ nên chứa chữ/số không dấu (Share Tech Mono không có dấu tiếng Việt).
function Eyebrow({ children, tone = "dark", code }) {
  return (
    <span className={`eyebrow${tone === "light" ? " eyebrow--light" : ""}`}>
      {code && <b className="eyebrow-code">{code}</b>}
      {children}
    </span>
  );
}

export default Eyebrow;
