import { useContext } from "react";
import { useLocation } from "react-router-dom";

import "./ReplayIntroButton.css";

import IntroReplayContext from "../../../context/IntroReplayContext";

// Nút "Xem lại intro" — CHỈ hiện ở trang chủ ("/"), vì ParticleIntro là màn
// chào mừng, hiện lại ở các trang con (About, Projects...) sẽ không hợp ngữ
// cảnh. Dùng useLocation nên bắt buộc phải nằm bên trong <BrowserRouter>
// (đã được render trong AppRoutes.jsx, ngay dưới <ScrollToTop />).
function ReplayIntroButton() {
  const location = useLocation();
  const replayIntro = useContext(IntroReplayContext);

  if (location.pathname !== "/") return null;

  return (
    <button
      type="button"
      className="replay-intro-btn"
      onClick={replayIntro}
      aria-label="Xem lại intro"
    >
      <span className="replay-intro-icon" aria-hidden="true">
        ↻
      </span>
      Xem lại intro
    </button>
  );
}

export default ReplayIntroButton;
