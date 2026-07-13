import "./PageLoader.css";

// Hiện tạm trong lúc <Suspense> chờ file JS của 1 trang lazy-load tải xong
// (xem routes/AppRoutes.jsx). Thường chỉ thoáng qua vài chục-trăm ms.
function PageLoader() {
  return (
    <div
      className="page-loader"
      role="status"
      aria-label="Đang tải trang"
    >
      <span className="page-loader-spinner" />
    </div>
  );
}

export default PageLoader;
