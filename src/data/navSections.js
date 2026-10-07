// Danh sách section của trang chủ 1-trang — MenuOverlay đọc id (làm anchor
// #hash) và name (nhãn menu) từ đây. Thêm/bớt section thì sửa ở đây.
//
// name song ngữ hoá dạng { vi, en } — đọc qua tr() ở nơi dùng.
const navSections = [
  { id: "home", name: { vi: "Trang Chủ", en: "Home" } },
  { id: "about", name: { vi: "Giới Thiệu", en: "About" } },
  { id: "skills", name: { vi: "Kỹ Năng", en: "Skills" } },
  { id: "projects", name: { vi: "Dự Án", en: "Projects" } },
  { id: "experience", name: { vi: "Kinh Nghiệm", en: "Experience" } },
  { id: "journal", name: { vi: "Nhật Ký", en: "Journal" } },
  { id: "contact", name: { vi: "Liên Hệ", en: "Contact" } },
];

export default navSections;
