// status: "completed" | "in-progress"
// image: để null nếu chưa có ảnh chứng chỉ, cập nhật sau bằng cách:
// import cert1 from "../assets/certificates/b1-english.jpg";  rồi gán vào field image
// name song ngữ hoá dạng { vi, en } — đọc qua tr() ở Experience.jsx.
const certificates = [
  {
    name: { vi: "Chứng chỉ B1 Tiếng Anh", en: "English B1 Certificate" },
    status: "completed",
    image: null,
  },
  {
    name: { vi: "Kỹ năng làm việc nhóm", en: "Teamwork Skills" },
    status: "completed",
    image: null,
  },
  {
    name: { vi: "Tiếng Trung", en: "Chinese" },
    status: "in-progress",
    image: null,
  },
  {
    name: { vi: "Tiếng Nga", en: "Russian" },
    status: "in-progress",
    image: null,
  },
];

export default certificates;
