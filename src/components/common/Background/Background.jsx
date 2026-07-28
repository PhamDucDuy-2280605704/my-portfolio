import "./Background.css";

// Nền động toàn site, phong cách "màn hình điều khiển" (HUD console):
// lưới toạ độ, quầng sáng gradient trôi chậm, hạt sáng lấp lánh, 1 vệt quét
// (scanline) chạy dọc màn hình, và khung góc cố định theo viewport — mô
// phỏng viền bezel của màn hình điều khiển kỹ thuật, không sao chép bố cục
// của bất kỳ sản phẩm phim/game cụ thể nào.
// Cố định, nằm dưới nội dung, không chặn click (pointer-events: none).
function Background() {
  // Tạo 14 hạt sáng, mỗi hạt lấy vị trí/thời gian animation "giả ngẫu nhiên"
  // (dựa trên index nhân với số lẻ) để chúng không xếp thẳng hàng hay nhấp
  // nháy đồng loạt cùng lúc.
  const particles = Array.from({ length: 14 });

  return (
    <div
      className="app-background"
      aria-hidden="true"
    >
      <div className="app-blobs">
        <span className="app-blob app-blob-1" />
        <span className="app-blob app-blob-2" />
        <span className="app-blob app-blob-3" />
        <span className="app-blob app-blob-4" />
      </div>

      <div className="app-particles">
        {particles.map((_, index) => (
          <span
            key={index}
            className="app-particle"
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 53) % 100}%`,
              animationDelay: `${index * 0.7}s`,
              animationDuration: `${4 + (index % 5)}s`,
            }}
          />
        ))}
      </div>

      <div className="app-grid" />
      <div className="app-scanline" />
      <div className="app-vignette" />

      {/* Khung 4 góc cố định theo viewport, kiểu bezel màn hình điều khiển */}
      <span className="app-viewport-corner tl" />
      <span className="app-viewport-corner tr" />
      <span className="app-viewport-corner bl" />
      <span className="app-viewport-corner br" />
    </div>
  );
}

export default Background;
