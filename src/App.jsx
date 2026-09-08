import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import Background from "./components/common/Background/Background";
import SmoothScroll from "./components/common/SmoothScroll/SmoothScroll";
import ErrorBoundary from "./components/common/ErrorBoundary/ErrorBoundary";
import LanguageProvider from "./context/LanguageProvider";

// Component gốc của toàn bộ ứng dụng.
// Cấu trúc (từ dưới lên trên):
//   1. Background     — nền động (gradient/blob/hạt sáng) cố định phía sau mọi trang.
//   2. .app-content    — toàn bộ nội dung thật (Navbar, các trang, Footer) qua
//      AppRoutes, bọc trong <ErrorBoundary>.
//
// Không còn màn hình intro (đã bỏ hẳn ParticleIntro/ReplayIntroButton/
// IntroReplayContext theo yêu cầu) — vào thẳng trang chủ ngay lập tức.
function App() {
  return (
    <LanguageProvider>
      <SmoothScroll />
      <Background />

      <div className="app-content">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </div>
    </LanguageProvider>
  );
}

export default App;
