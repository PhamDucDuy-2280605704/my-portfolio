// Toàn bộ link mạng xã hội/liên hệ — dùng ở trang Contact (pages/Contact/Contact.jsx).
// email dùng tiền tố "mailto:" để bấm vào mở sẵn ứng dụng gửi mail.
const social = {
  github: "https://github.com/PhamDucDuy-2280605704",
  facebook: "https://www.facebook.com/share/18ueSChaek/?mibextid=wwXIfr",
  zalo: "https://zalo.me/84924834155",
  email: "mailto:pduy14102004@gmail.com",
  discord: "https://discord.com/users/947168787378110524",
  tiktok: "https://www.tiktok.com/@phamduy1410?_r=1&_t=ZS-97ukgfP8cFU",

  // ⚠️ THAY ĐƯỜNG DẪN NÀY để form liên hệ hoạt động thật:
  // 1. Vào https://formspree.io -> đăng ký (miễn phí) bằng email của bạn.
  // 2. Tạo 1 "Form" mới -> Formspree cho 1 đường link dạng
  //    https://formspree.io/f/xxxxabcd
  // 3. Dán đường link đó thay cho giá trị bên dưới.
  // Trước khi thay, form vẫn hiển thị bình thường nhưng bấm "Gửi" sẽ báo lỗi
  // (vì "YOUR_FORM_ID" không phải endpoint thật).
  formspree: "https://formspree.io/f/YOUR_FORM_ID",
};

export default social;