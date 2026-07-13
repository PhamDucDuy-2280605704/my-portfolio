// Nguồn thông tin cá nhân DUY NHẤT của toàn site — Hero, trang About, Navbar (alt logo)
// đều import từ đây. Muốn đổi tên/vai trò/mô tả/CV... chỉ cần sửa file này.
import avatar from "../assets/images/avatar.jpg";
import resume from "../assets/resume/cv.pdf";

const profile = {
  fullName: "Phạm Đức Duy",

  role: "Lập Trình Viên Full Stack",

  birthday: "14/10/2004",

  email: "pduy14102004@gmail.com",

  location: "Việt Nam",

  avatar,

  // Câu quote cá nhân, hiện ở Hero (trang Home) dưới dạng trích dẫn.
  quote: "Ngay cả trong bóng tối, con người vẫn có thể lựa chọn.",

  // Mô tả NGẮN — dùng ở Hero (trang Home).
  description:
    "Mình xây dựng sản phẩm hoàn chỉnh — từ giao diện mượt mà, trực quan đến hệ thống backend vững chắc phía sau, đảm bảo trải nghiệm liền mạch trên mọi nền tảng.",

  // Bio ĐẦY ĐỦ (nhiều đoạn) — chỉ dùng ở trang "/about", không hiện ở Home
  // để tránh trùng lặp nội dung giữa 2 nơi.
  bio: [
    "Mình là Phạm Đức Duy, lập trình viên theo hướng Full Stack — có thể đảm nhận cả phần giao diện người dùng lẫn hệ thống backend đứng sau một sản phẩm.",
    "Ở mảng Frontend, mình làm việc chính với React và Vue, đồng thời nắm vững nền tảng HTML/CSS/JavaScript để xây dựng giao diện chỉn chu, mượt mà. Ở mảng Backend, mình có kinh nghiệm với Node.js, NestJS, Python và PHP để thiết kế API, xử lý dữ liệu và logic nghiệp vụ. Ngoài ra mình cũng tìm hiểu Flutter để phát triển ứng dụng di động đa nền tảng.",
    "Mình thích tự tay hoàn thiện một sản phẩm từ đầu đến cuối, không ngại tìm hiểu công nghệ mới, và luôn đặt trải nghiệm người dùng lên hàng đầu trong mọi thứ mình xây dựng.",
  ],

  // File CV thật (src/assets/resume/cv.pdf) — dùng cho nút "Xem CV" ở trang About.
  resume,
};

export default profile;