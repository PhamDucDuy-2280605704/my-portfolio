import { useState } from "react";

import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import Background from "./components/common/Background/Background";
import ParticleIntro from "./components/common/ParticleIntro/ParticleIntro";
import ErrorBoundary from "./components/common/ErrorBoundary/ErrorBoundary";
import IntroReplayContext from "./context/IntroReplayContext";

// Component gốc của toàn bộ ứng dụng.
// Cấu trúc (từ dưới lên trên):
//   1. ParticleIntro — hạt sáng bay kiểu "warp" rồi ráp thành tên, chỉ hiện
//      khi mở app lần đầu (hoặc khi bấm "Xem lại intro" ở trang chủ), tự ẩn
//      sau khi chạy xong.
//   2. Background     — nền động (gradient/blob/hạt sáng) cố định phía sau mọi trang.
//   3. .app-content    — toàn bộ nội dung thật (Navbar, các trang, Footer) qua
//      AppRoutes, bọc trong <ErrorBoundary>.
//
// Nút "Xem lại intro" KHÔNG render trực tiếp ở đây nữa — nó cần biết đang ở
// route nào (chỉ hiện ở "/") nên phải nằm bên trong <BrowserRouter>, được
// render từ AppRoutes.jsx. App.jsx chỉ cung cấp hàm "phát lại intro" qua
// IntroReplayContext để component đó gọi ngược lại.
function App() {
  // isLoading = true khi vừa mở app -> hiện ParticleIntro.
  // ParticleIntro tự gọi onFinish() sau khi chạy xong để tắt mình đi.
  const [isLoading, setIsLoading] = useState(true);

  // introKey tăng lên mỗi lần bấm "Xem lại intro" -> React remount lại
  // <ParticleIntro key={introKey} /> nên animation chạy lại từ đầu.
  const [introKey, setIntroKey] = useState(0);

  const handleReplayIntro = () => {
    setIntroKey((key) => key + 1);
    setIsLoading(true);
  };

  return (
    <IntroReplayContext.Provider value={handleReplayIntro}>
      {isLoading && (
        <ParticleIntro key={introKey} onFinish={() => setIsLoading(false)} />
      )}

      <Background />

      <div className="app-content">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </div>
    </IntroReplayContext.Provider>
  );
}

export default App;
