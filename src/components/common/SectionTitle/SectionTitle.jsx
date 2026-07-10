import "./SectionTitle.css";

// Tiêu đề đầu mỗi trang, dùng chung cho About/Skills/Projects/Experience/Journal/Contact
// để toàn site có 1 kiểu tiêu đề nhất quán: subtitle nhỏ in hoa màu xanh phía trên,
// tiêu đề chính to đậm ở giữa, và 1 vạch nhấn (accent) trang trí phía dưới.
function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-title">
      <p>{subtitle}</p>
      <h2>{title}</h2>
      <span className="section-title-accent" />
    </div>
  );
}

export default SectionTitle;