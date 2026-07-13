import { useState } from "react";

import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import Background from "./components/common/Background/Background";
import SplashScreen from "./components/common/SplashScreen/SplashScreen";
import ErrorBoundary from "./components/common/ErrorBoundary/ErrorBoundary";

// Component gốc của toàn bộ ứng dụng.
// Cấu trúc (từ dưới lên trên):
//   1. SplashScreen — chỉ hiện 1 lần khi mở app (~5s), tự ẩn sau khi chạy xong.
//   2. Background   — nền động (gradient/blob/hạt sáng) cố định phía sau mọi trang.
//   3. .app-content  — toàn bộ nội dung thật (Navbar, các trang, Footer) qua AppRoutes,
//      có z-index riêng để luôn nổi lên trên Background, được bọc trong
//      <ErrorBoundary> để nếu 1 trang bị lỗi runtime, chỉ hiện màn hình lỗi
//      thân thiện thay vì cả app bị trắng trơn.
function App() {
  // isLoading = true khi vừa mở app -> hiện SplashScreen.
  // SplashScreen tự gọi onFinish() sau ~5.5s để tắt mình đi.
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <SplashScreen onFinish={() => setIsLoading(false)} />}

      <Background />

      <div className="app-content">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </div>
    </>
  );
}

export default App;