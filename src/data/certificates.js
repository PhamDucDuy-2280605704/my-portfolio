// status: "completed" | "in-progress"
// image: để null nếu chưa có ảnh chứng chỉ, cập nhật sau bằng cách:
// import cert1 from "../assets/certificates/b1-english.jpg";  rồi gán vào field image

const certificates = [
  {
    name: "Chứng chỉ B1 Tiếng Anh",
    status: "completed",
    image: null,
  },
  {
    name: "Kỹ năng làm việc nhóm",
    status: "completed",
    image: null,
  },
  {
    name: "Tiếng Trung",
    status: "in-progress",
    image: null,
  },
  {
    name: "Tiếng Nga",
    status: "in-progress",
    image: null,
  },
];

export default certificates;
