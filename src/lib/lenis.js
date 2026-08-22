// Singleton nhỏ giữ tham chiếu tới instance Lenis (thư viện tạo hiệu ứng
// cuộn có "độ trễ" — xem SmoothScroll.jsx). Chỉ có ĐÚNG 1 instance cho toàn
// app nên dùng biến module-level thay vì Context là đủ, tránh phải bọc
// thêm 1 lớp Provider chỉ để chuyền 1 tham chiếu.
//
// Các nơi cần dùng:
//  - ScrollToTop.jsx / Home.jsx: cuộn có độ trễ thay vì window.scrollTo thô.
//  - Navbar.jsx / PdfViewerModal.jsx: tạm dừng Lenis khi mở overlay/modal —
//    nếu không, nền phía sau vẫn cuộn được qua wheel event dù đã khoá
//    document.body.style.overflow (Lenis tự bắt sự kiện wheel, không phụ
//    thuộc overflow của body).
let instance = null;

export function setLenisInstance(lenis) {
  instance = lenis;
}

export function getLenisInstance() {
  return instance;
}

export function stopLenis() {
  instance && instance.stop();
}

export function startLenis() {
  instance && instance.start();
}
