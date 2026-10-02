import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import SmoothScroll from "./components/common/SmoothScroll/SmoothScroll";
import ErrorBoundary from "./components/common/ErrorBoundary/ErrorBoundary";
import LanguageProvider from "./context/LanguageProvider";

// Component gốc của toàn bộ ứng dụng.
//   - LanguageProvider : ngôn ngữ vi/en cho mọi component.
//   - SmoothScroll     : khởi tạo Lenis (cuộn mượt) 1 lần cho cả app.
//   - ErrorBoundary    : bắt lỗi render để không trắng trang.
//   - AppRoutes        : định tuyến; trang chủ dùng MainLayout (bố cục Baseline).
function App() {
  return (
    <LanguageProvider>
      <SmoothScroll />

      <div className="app-content">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </div>
    </LanguageProvider>
  );
}

export default App;
