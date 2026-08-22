import { useEffect } from "react";
import Lenis from "lenis";

import { setLenisInstance } from "../../../lib/lenis";

// Cuộn trang có "độ trễ" nhẹ (lerp) thay vì bám sát 1:1 theo con lăn chuột /
// ngón tay — cuộn xong, trang còn "trôi" thêm một nhịp rất ngắn trước khi
// dừng hẳn, tạo cảm giác nặng tay/mượt kiểu các trang HUD/cinematic cao cấp,
// thay vì cuộn "cứng" mặc định của trình duyệt.
//
// Lenis chạy TRÊN CHÍNH cơ chế cuộn gốc của trình duyệt (chỉ làm mượt giá
// trị scrollTop mỗi khung hình), không hijack bằng transform hay ẩn
// scrollbar, nên position:sticky (Navbar), neo #hash, và điều hướng bàn
// phím/trình đọc màn hình vẫn hoạt động bình thường.
//
// KHÔNG cần tự kiểm tra prefers-reduced-motion — Lenis mặc định
// (respectReducedMotion: true) đã tự tắt độ trễ khi hệ điều hành bật "giảm
// chuyển động", chỉ còn cuộn tức thời như bình thường.
//
// Component này không render gì cả — chỉ là 1 side-effect chạy 1 lần ở gốc
// app (xem App.jsx), tồn tại suốt vòng đời app nên không cần key/remount.
function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1, // 0..1 — càng nhỏ càng "trễ"/nặng tay, 0.1 là mức vừa phải
      wheelMultiplier: 1,
      // syncTouch: mô phỏng độ trễ tương tự cả trên cảm ứng (điện thoại/
      // tablet), không chỉ riêng cuộn chuột trên desktop.
      syncTouch: true,
      touchMultiplier: 1,
      // Tự bắt & làm mượt luôn các link neo kiểu <a href="#section">
      // (BottomDock đang dùng) — không cần sửa gì ở BottomDock.jsx.
      anchors: true,
      autoRaf: true,
    });

    setLenisInstance(lenis);

    return () => {
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return null;
}

export default SmoothScroll;
