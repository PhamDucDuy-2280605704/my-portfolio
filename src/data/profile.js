// Nguồn thông tin cá nhân DUY NHẤT của toàn site — Hero, Trust, Header,
// Footer, MenuOverlay đều import từ đây. Muốn đổi tên/vai trò/mô tả/CV... chỉ cần sửa file này.
//
// Các field văn bản có thể hiện cả 2 ngôn ngữ dùng dạng { vi: "...", en: "..." }
// và đọc qua tr() (xem hooks/useLanguage.js) ở component. Field không đổi
// theo ngôn ngữ (email, ảnh, CV...) vẫn để nguyên dạng chuỗi/giá
// trị đơn như cũ.
import avatar from "../assets/images/avatar.jpg";
import resume from "../assets/resume/cv.pdf";

const profile = {
  fullName: "Phạm Đức Duy",

  role: { vi: "Lập Trình Viên Full Stack", en: "Full Stack Developer" },

  email: "pduy14102004@gmail.com",

  location: { vi: "Việt Nam", en: "Vietnam" },

  avatar,

  // Mô tả NGẮN — dùng ở Hero (trang Home).
  description: {
    vi: "Mình xây dựng sản phẩm hoàn chỉnh — từ giao diện mượt mà, trực quan đến hệ thống backend vững chắc phía sau, đảm bảo trải nghiệm liền mạch trên mọi nền tảng.",
    en: "I build complete products — from smooth, intuitive interfaces to solid backend systems underneath, ensuring a seamless experience across every platform.",
  },

  // Bio ĐẦY ĐỦ (nhiều đoạn) — dùng ở section Giới thiệu (Trust), mỗi slide
  // lấy 1 đoạn theo bioIndex trong data/landing.js. Mỗi đoạn là 1 cặp { vi, en }.
  bio: [
    {
      vi: "Mình là Phạm Đức Duy, lập trình viên theo hướng Full Stack — có thể đảm nhận cả phần giao diện người dùng lẫn hệ thống backend đứng sau một sản phẩm.",
      en: "I'm Pham Duc Duy, a Full Stack developer — comfortable handling both the user-facing interface and the backend system behind a product.",
    },
    {
      vi: "Ở mảng Frontend, mình làm việc chính với React và Vue, đồng thời nắm vững nền tảng HTML/CSS/JavaScript để xây dựng giao diện chỉn chu, mượt mà. Ở mảng Backend, mình có kinh nghiệm với Node.js, NestJS, Python và PHP để thiết kế API, xử lý dữ liệu và logic nghiệp vụ. Ngoài ra mình cũng tìm hiểu Flutter để phát triển ứng dụng di động đa nền tảng.",
      en: "On the Frontend side, I mainly work with React and Vue, on a solid foundation of HTML/CSS/JavaScript for building polished, smooth interfaces. On the Backend side, I have experience with Node.js, NestJS, Python, and PHP for designing APIs and handling data and business logic. I've also been learning Flutter for cross-platform mobile development.",
    },
    {
      vi: "Mình thích tự tay hoàn thiện một sản phẩm từ đầu đến cuối, không ngại tìm hiểu công nghệ mới, và luôn đặt trải nghiệm người dùng lên hàng đầu trong mọi thứ mình xây dựng.",
      en: "I enjoy building a product from start to finish myself, I'm not afraid to pick up new technology, and I always put user experience first in everything I build.",
    },
  ],

  // File CV thật (src/assets/resume/cv.pdf) — dùng cho nút "Xem CV".
  resume,
};

export default profile;
