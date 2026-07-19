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
const INTRO_SEEN_KEY = "introSeen";

function App() {
  // isLoading = true khi cần hiện ParticleIntro.
  // ParticleIntro tự gọi onFinish() sau khi chạy xong để tắt mình đi.
  //
  // Intro CHỈ tự động hiện đúng 1 LẦN DUY NHẤT trong suốt vòng đời trình
  // duyệt của người dùng (đánh dấu bằng localStorage), và chỉ khi đang ở
  // đúng trang chủ ("/"). Những lần load/reload sau đó (kể cả reload lại
  // trang chủ) sẽ KHÔNG tự hiện intro nữa — muốn xem lại phải bấm nút
  // "Xem lại intro" (xem handleReplayIntro bên dưới, nút này luôn bỏ qua
  // cờ đã xem vì là hành động chủ động của người dùng).
  //
  // Dùng window.location.pathname (không phải useLocation) vì App.jsx nằm
  // NGOÀI <BrowserRouter> — đây chỉ là giá trị khởi tạo 1 lần lúc mount.
  const [isLoading, setIsLoading] = useState(() => {
    const isHomePage = window.location.pathname === "/";
    const alreadySeen = window.localStorage.getItem(INTRO_SEEN_KEY) === "true";
    return isHomePage && !alreadySeen;
  });

  // introKey tăng lên mỗi lần bấm "Xem lại intro" -> React remount lại
  // <ParticleIntro key={introKey} /> nên animation chạy lại từ đầu.
  const [introKey, setIntroKey] = useState(0);

  const handleIntroFinish = () => {
    window.localStorage.setItem(INTRO_SEEN_KEY, "true");
    setIsLoading(false);
  };

  const handleReplayIntro = () => {
    setIntroKey((key) => key + 1);
    setIsLoading(true);
  };

  return (
    <IntroReplayContext.Provider value={handleReplayIntro}>
      {isLoading && <ParticleIntro key={introKey} onFinish={handleIntroFinish} />}

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
