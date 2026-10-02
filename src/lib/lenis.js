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

// ----- Khoá cuộn dùng chung (loader / menu / modal) -----
// Dùng bộ đếm để nhiều lớp phủ mở chồng nhau vẫn khoá đúng: chỉ mở khoá
// thật sự khi lớp cuối cùng đóng. Vừa dừng Lenis (chặn wheel/touch), vừa
// khoá cuộn native của <html> (class is-scroll-locked trong baseline.css).
let lockCount = 0;

export function lockScroll() {
  lockCount += 1;
  if (lockCount === 1) {
    stopLenis();
    document.documentElement.classList.add("is-scroll-locked");
  }
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.documentElement.classList.remove("is-scroll-locked");
    startLenis();
  }
}

// Cuộn mượt tới 1 phần tử theo id (qua Lenis nếu có, không thì scrollIntoView).
export function scrollToId(id) {
  const target = document.getElementById(id);
  if (!target) return;
  if (instance) instance.scrollTo(target, { offset: 0 });
  else target.scrollIntoView({ behavior: "smooth" });
}
