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
// icon: dùng khi KHÔNG active (viền rỗng, nhẹ)
// iconActive: dùng khi ĐANG active (tô đặc, nổi bật hơn) — giống cách
// Instagram đổi icon rỗng -> icon đặc khi chọn tab.
// description: câu ngắn giải thích mục này dùng để làm gì — hiện trong
// tooltip khi di chuột/focus vào icon ở BottomDock, giúp icon dễ hiểu hơn
// dù chỉ hiện icon (không có chữ) trên thanh dock.
const navSections = [
  {
    id: "home",
    name: "Trang Chủ",
    code: "SEC.01",
    description: "Về đầu trang, xem giới thiệu ngắn",
    icon: IoHomeOutline,
    iconActive: IoHome,
  },
  {
    id: "about",
    name: "Giới Thiệu",
    code: "SEC.02",
    description: "Tìm hiểu kỹ hơn về mình",
    icon: IoPersonOutline,
    iconActive: IoPerson,
  },
  {
    id: "skills",
    name: "Kỹ Năng",
    code: "SEC.03",
    description: "Công nghệ & kỹ năng mình biết",
    icon: IoCodeSlashOutline,
    iconActive: IoCodeSlash,
  },
  {
    id: "projects",
    name: "Dự Án",
    code: "SEC.04",
    description: "Các dự án mình đã thực hiện",
    icon: IoFolderOutline,
    iconActive: IoFolder,
  },
  {
    id: "experience",
    name: "Kinh Nghiệm",
    code: "SEC.05",
    description: "Học vấn & kinh nghiệm làm việc",
    icon: IoBriefcaseOutline,
    iconActive: IoBriefcase,
  },
  {
    id: "journal",
    name: "Nhật Ký",
    code: "SEC.06",
    description: "Ghi chép, suy nghĩ cá nhân",
    icon: IoBookOutline,
    iconActive: IoBook,
  },
  {
    id: "contact",
    name: "Liên Hệ",
    code: "SEC.07",
    description: "Kết nối, gửi tin nhắn cho mình",
    icon: IoMailOutline,
    iconActive: IoMail,
  },
];

export default navSections;
