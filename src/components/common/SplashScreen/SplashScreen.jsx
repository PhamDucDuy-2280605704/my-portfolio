import { useEffect, useState } from "react";

import "./SplashScreen.css";

import logo from "../../../assets/images/logo.jpg";

// Danh sách dòng "log" giả lập terminal, hiện tuần tự từng dòng một.
const BOOT_LINES = [
  "> Đang khởi tạo môi trường...",
  "> Nạp Frontend: React, Vue.js, HTML, CSS, JavaScript...",
  "> Nạp Backend: Node.js, NestJS, PHP, Python...",
  "> Nạp Mobile: Flutter...",
  "> Kết nối hệ thống hoàn tất. Sẵn sàng.",
];

// Tổng thời gian hiển thị splash (ms) trước khi bắt đầu mờ dần đi.
const DURATION = 5000;

// Màn hình loading kiểu terminal, hiển thị 1 lần khi mở trang lần đầu (~5s) rồi mờ dần vào nội dung chính.
// onFinish: callback gọi khi splash kết thúc hẳn (App.jsx dùng để set isLoading = false).
function SplashScreen({ onFinish }) {
  // Số dòng boot-log đang được hiện (tăng dần 0 -> BOOT_LINES.length theo thời gian).
  const [visibleLines, setVisibleLines] = useState(0);
  // true khi bắt đầu chạy animation mờ dần ra (thêm class "leaving").
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Chia đều DURATION cho (số dòng + 1) để dòng cuối hiện ra trước khi kết thúc,
    // không bị dồn cục vào cuối.
    const lineDelay = DURATION / (BOOT_LINES.length + 1);

    // Hẹn giờ hiện lần lượt từng dòng boot-log.
    const lineTimers = BOOT_LINES.map((_, index) =>
      setTimeout(() => setVisibleLines(index + 1), lineDelay * (index + 1)),
    );

    // Sau đúng DURATION: bắt đầu hiệu ứng mờ dần (CSS animation "leaving").
    const leaveTimer = setTimeout(() => setIsLeaving(true), DURATION);
    // Sau DURATION + 500ms (đủ thời gian animation mờ dần chạy xong): báo cho App.jsx
    // biết đã xong để gỡ hẳn SplashScreen khỏi DOM.
    const finishTimer = setTimeout(() => onFinish(), DURATION + 500);

    // Dọn dẹp timer nếu component unmount sớm (tránh setState trên component đã gỡ).
    return () => {
      lineTimers.forEach(clearTimeout);
      clearTimeout(leaveTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-screen ${isLeaving ? "leaving" : ""}`}>

      <div className="splash-logo">
        <img
          src={logo}
          alt="Fsociety"
        />
      </div>

      <div className="splash-terminal">
        {BOOT_LINES.slice(0, visibleLines).map((line, index) => (
          <p key={index}>{line}</p>
        ))}

        {visibleLines < BOOT_LINES.length && <p className="splash-cursor">_</p>}
      </div>

      <div className="splash-progress">
        <div className="splash-progress-bar" />
      </div>

    </div>
  );
}

export default SplashScreen;
