import "./Background.css";

// Nền động toàn site: các quầng sáng gradient mờ trôi chậm, đổi màu nhẹ theo thời gian,
// cùng vài hạt sáng lấp lánh kiểu "digital". Cố định, nằm dưới nội dung, không chặn click.
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
    </div>
  );
}

export default Background;
