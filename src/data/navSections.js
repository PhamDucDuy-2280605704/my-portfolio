import {
  IoHomeOutline,
  IoHome,
  IoPersonOutline,
  IoPerson,
  IoCodeSlashOutline,
  IoCodeSlash,
  IoFolderOutline,
  IoFolder,
  IoBriefcaseOutline,
  IoBriefcase,
  IoBookOutline,
  IoBook,
  IoMailOutline,
  IoMail,
} from "react-icons/io5";

// Danh sách 7 section của trang chủ 1-trang — dùng CHUNG cho cả Navbar (nhãn
// mã hiệu + label "SEC.0x") lẫn BottomDock (icon điều hướng nổi dưới cùng),
// để không phải khai 2 lần ở 2 nơi.
//
// name/description song ngữ hoá dạng { vi, en } — đọc qua tr() ở nơi dùng.
// id/code không đổi theo ngôn ngữ (id dùng làm anchor #hash, code là mã kỹ
// thuật kiểu HUD, giữ nguyên cho cả 2 ngôn ngữ).
//
// icon: dùng khi KHÔNG active (viền rỗng, nhẹ)
// iconActive: dùng khi ĐANG active (tô đặc, nổi bật hơn) — giống cách
// Instagram đổi icon rỗng -> icon đặc khi chọn tab.
// description: câu ngắn giải thích mục này dùng để làm gì — hiện trong
// tooltip khi di chuột/focus vào icon ở BottomDock, giúp icon dễ hiểu hơn
// dù chỉ hiện icon (không có chữ) trên thanh dock.
const navSections = [
  {
    id: "home",
    name: { vi: "Trang Chủ", en: "Home" },
    code: "SEC.01",
    description: { vi: "Về đầu trang, xem giới thiệu ngắn", en: "Back to top, quick intro" },
    icon: IoHomeOutline,
    iconActive: IoHome,
  },
  {
    id: "about",
    name: { vi: "Giới Thiệu", en: "About" },
    code: "SEC.02",
    description: { vi: "Tìm hiểu kỹ hơn về mình", en: "Get to know me better" },
    icon: IoPersonOutline,
    iconActive: IoPerson,
  },
  {
    id: "skills",
    name: { vi: "Kỹ Năng", en: "Skills" },
    code: "SEC.03",
    description: { vi: "Công nghệ & kỹ năng mình biết", en: "Tech & skills I know" },
    icon: IoCodeSlashOutline,
    iconActive: IoCodeSlash,
  },
  {
    id: "projects",
    name: { vi: "Dự Án", en: "Projects" },
    code: "SEC.04",
    description: { vi: "Các dự án mình đã thực hiện", en: "Projects I've built" },
    icon: IoFolderOutline,
    iconActive: IoFolder,
  },
  {
    id: "experience",
    name: { vi: "Kinh Nghiệm", en: "Experience" },
    code: "SEC.05",
    description: { vi: "Học vấn & kinh nghiệm làm việc", en: "Education & work experience" },
    icon: IoBriefcaseOutline,
    iconActive: IoBriefcase,
  },
  {
    id: "journal",
    name: { vi: "Nhật Ký", en: "Journal" },
    code: "SEC.06",
    description: { vi: "Ghi chép, suy nghĩ cá nhân", en: "Personal notes & thoughts" },
    icon: IoBookOutline,
    iconActive: IoBook,
  },
  {
    id: "contact",
    name: { vi: "Liên Hệ", en: "Contact" },
    code: "SEC.07",
    description: { vi: "Kết nối, gửi tin nhắn cho mình", en: "Connect, send me a message" },
    icon: IoMailOutline,
    iconActive: IoMail,
  },
];

export default navSections;
