import { useEffect, useState } from "react";
import { HiSparkles } from "react-icons/hi2";

import "./SplashScreen.css";

import profile from "../../../data/profile";
import CornerFlourish from "../CornerFlourish/CornerFlourish";

// Tổng thời gian hiển thị splash (ms) trước khi bắt đầu mờ dần đi.
const DURATION = 5000;

// Màn hình loading dạng "thiệp chào mừng" trang trí cổ điển — hiển thị 1 lần
// khi mở trang lần đầu (~5s) rồi mờ dần vào nội dung chính.
// onFinish: callback gọi khi splash kết thúc hẳn (App.jsx dùng để set isLoading = false).
function SplashScreen({ onFinish }) {
  // true khi bắt đầu chạy animation mờ dần ra (thêm class "leaving").
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Sau đúng DURATION: bắt đầu hiệu ứng mờ dần (CSS animation "leaving").
    const leaveTimer = setTimeout(() => setIsLeaving(true), DURATION);
    // Sau DURATION + 500ms (đủ thời gian animation mờ dần chạy xong): báo cho
    // App.jsx biết đã xong để gỡ hẳn SplashScreen khỏi DOM.
    const finishTimer = setTimeout(() => onFinish(), DURATION + 500);

    // Dọn dẹp timer nếu component unmount sớm (tránh setState trên component đã gỡ).
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-screen ${isLeaving ? "leaving" : ""}`}>

      <div className="splash-frame">

        <CornerFlourish />
        <CornerFlourish />
        <CornerFlourish />
        <CornerFlourish />

        <div className="splash-content">

          <p className="splash-eyebrow">✦ Portfolio Cá Nhân ✦</p>

          <h1 className="splash-title">Chào Mừng</h1>

          <div className="splash-divider">
            <span />
            <i className="splash-divider-dot" />
            <span />
          </div>

          <p className="splash-subtitle">đến với thế giới của {profile.fullName}</p>
          <p className="splash-subtitle-en">Welcome to my portfolio</p>

          <HiSparkles className="splash-sparkle" />

        </div>

      </div>

      <div className="splash-progress">
        <div className="splash-progress-bar" />
      </div>

    </div>
  );
}

export default SplashScreen;
