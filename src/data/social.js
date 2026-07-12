// Toàn bộ link mạng xã hội/liên hệ — dùng ở trang Contact (pages/Contact/Contact.jsx).
// email dùng tiền tố "mailto:" để bấm vào mở sẵn ứng dụng gửi mail.
const social = {
  github: "https://github.com/PhamDucDuy-2280605704",
  facebook: "https://www.facebook.com/share/18ueSChaek/?mibextid=wwXIfr",
  zalo: "https://zalo.me/84924834155",
  email: "mailto:pduy14102004@gmail.com",
  discord: "https://discord.com/users/947168787378110524",
  tiktok: "https://www.tiktok.com/@phamduy1410?_r=1&_t=ZS-97ukgfP8cFU",

  // Endpoint form liên hệ thật (tạo tại https://formspree.io) — form ở trang
  // Contact gửi thẳng vào đây, submit qua fetch() nên KHÔNG chuyển trang khi
  // gửi (xem ContactForm.jsx: dùng Accept: application/json để Formspree trả
  // JSON thay vì redirect).
  formspree: "https://formspree.io/f/mpqvawwn",
};

export default social;