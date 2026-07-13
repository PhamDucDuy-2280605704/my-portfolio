import "./SectionTitle.css";

// Tiêu đề đầu mỗi trang, dùng chung cho About/Skills/Projects/Experience/Journal/Contact
// để toàn site có 1 kiểu tiêu đề nhất quán: subtitle nhỏ in hoa màu xanh phía trên,
// tiêu đề chính to đậm ở giữa, và vạch chia trang trí kiểu "line–dot–line"
// (đồng bộ hoạ tiết với SplashScreen) phía dưới.
function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-title">
      <p>{subtitle}</p>
      <h2>{title}</h2>

      <div
        className="section-title-divider"
        aria-hidden="true"
      >
        <span />
        <i className="section-title-divider-dot" />
        <span />
      </div>
    </div>
  );
}

export default SectionTitle;