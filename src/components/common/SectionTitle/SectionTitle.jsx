import "./SectionTitle.css";

function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-title">
      <p>{subtitle}</p>
      <h2>{title}</h2>
    </div>
  );
}

export default SectionTitle;