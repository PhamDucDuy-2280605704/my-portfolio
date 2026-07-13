// Kinh nghiệm làm việc thực tế, hiển thị dạng timeline ở trang "/experience"
// (giống cấu trúc data/education.js). Nội dung tóm tắt từ báo cáo thực tập
// tốt nghiệp thật tại HUTECH (Phòng thí nghiệm/Công ty LOT Software,
// 20/04 – 19/07/2026), GVHD: Phan Đức Trí.
import reportPdf from "../assets/documents/bao-cao-thuc-tap-lot-software.pdf";

const workExperience = [
  {
    company: "Công ty LOT Software",
    role: "Thực Tập Sinh Lập Trình Fullstack",
    period: "04/2026 – 07/2026",
    highlights: [
      "Thiết lập môi trường Laravel, tích hợp đăng nhập Google OAuth 2.0, xây dựng Service Pattern và Middleware xác thực.",
      "Xây dựng Web Review cá nhân: CRUD, upload ảnh, validation, đánh giá 5 sao.",
      "Phát triển module chat real-time (Pusher, Laravel Echo) hỗ trợ private channel và trạng thái đã xem.",
      "Xây dựng REST API với NestJS + PostgreSQL (CRUD, JWT, DTO, class-validator), kết nối Frontend React + Vite hoàn thiện ứng dụng Fullstack.",
      "Triển khai sản phẩm lên production (Render, Vercel, Supabase), viết Unit Test (Jest, Vitest + React Testing Library), bổ sung phân quyền RolesGuard.",
    ],
    tech: ["Laravel", "NestJS", "React", "PostgreSQL", "MySQL", "JWT"],
    score: "9.5/10",
    // Báo cáo thực tập tốt nghiệp đầy đủ (PDF) — xem trực tiếp, không ép tải về
    // (xem cách dùng ở Experience.jsx: không có thuộc tính download).
    report: reportPdf,
  },
];

export default workExperience;
