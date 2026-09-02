// Kinh nghiệm làm việc thực tế, hiển thị dạng timeline ở trang "/experience"
// (giống cấu trúc data/education.js). Nội dung tóm tắt từ báo cáo thực tập
// tốt nghiệp thật tại HUTECH (Phòng thí nghiệm/Công ty LOT Software,
// 20/04 – 19/07/2026), GVHD: Phan Đức Trí.
//
// company/role/highlights song ngữ hoá dạng { vi, en } — đọc qua tr() ở
// Experience.jsx. period/score/tech giữ nguyên (số liệu, không cần dịch).
import reportPdf from "../assets/documents/bao-cao-thuc-tap-lot-software.pdf";

const workExperience = [
  {
    company: { vi: "Công ty LOT Software", en: "LOT Software Company" },
    role: { vi: "Thực Tập Sinh Lập Trình Fullstack", en: "Fullstack Development Intern" },
    period: "04/2026 – 07/2026",
    highlights: [
      {
        vi: "Thiết lập môi trường Laravel, tích hợp đăng nhập Google OAuth 2.0, xây dựng Service Pattern và Middleware xác thực.",
        en: "Set up the Laravel environment, integrated Google OAuth 2.0 login, and built a Service Pattern with authentication Middleware.",
      },
      {
        vi: "Xây dựng Web Review cá nhân: CRUD, upload ảnh, validation, đánh giá 5 sao.",
        en: "Built a personal review website: CRUD, image upload, validation, and 5-star ratings.",
      },
      {
        vi: "Phát triển module chat real-time (Pusher, Laravel Echo) hỗ trợ private channel và trạng thái đã xem.",
        en: "Developed a real-time chat module (Pusher, Laravel Echo) supporting private channels and read status.",
      },
      {
        vi: "Xây dựng REST API với NestJS + PostgreSQL (CRUD, JWT, DTO, class-validator), kết nối Frontend React + Vite hoàn thiện ứng dụng Fullstack.",
        en: "Built a REST API with NestJS + PostgreSQL (CRUD, JWT, DTO, class-validator), connected to a React + Vite frontend to complete a fullstack app.",
      },
      {
        vi: "Triển khai sản phẩm lên production (Render, Vercel, Supabase), viết Unit Test (Jest, Vitest + React Testing Library), bổ sung phân quyền RolesGuard.",
        en: "Deployed the product to production (Render, Vercel, Supabase), wrote unit tests (Jest, Vitest + React Testing Library), and added role-based access with RolesGuard.",
      },
    ],
    tech: ["Laravel", "NestJS", "React", "PostgreSQL", "MySQL", "JWT"],
    score: "9.5/10",
    // Báo cáo thực tập tốt nghiệp đầy đủ (PDF) — xem trực tiếp, không ép tải về
    // (xem cách dùng ở Experience.jsx: không có thuộc tính download).
    report: reportPdf,
  },
];

export default workExperience;
