import "./Background.css";

// Nền động toàn site: các quầng sáng gradient mờ trôi chậm + lưới chấm nhẹ.
// Cố định (position: fixed), nằm dưới toàn bộ nội dung, không chặn click.
function Background() {
  return (
    <div
      className="app-background"
      aria-hidden="true"
    >
      <span className="app-blob app-blob-1" />
      <span className="app-blob app-blob-2" />
      <span className="app-blob app-blob-3" />
      <div className="app-grid" />
    </div>
  );
}

export default Background;
