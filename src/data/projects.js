// image: để null nếu chưa có ảnh, cập nhật sau bằng cách:
// import thumb1 from "../assets/projects/du-an-1.jpg";  rồi gán vào field image
// demo / source: để null nếu chưa có link, khi nào deploy/publish repo thì điền vào

const projects = {
  completed: [
    {
      name: "Dự án mẫu 1",
      description:
        "Mô tả ngắn gọn về dự án: bài toán giải quyết, vai trò của bạn trong dự án, và điểm nổi bật nhất.",
      tech: ["React", "Node.js"],
      image: null,
      demo: null,
      source: null,
    },
    {
      name: "Dự án mẫu 2",
      description:
        "Mô tả ngắn gọn về dự án: bài toán giải quyết, vai trò của bạn trong dự án, và điểm nổi bật nhất.",
      tech: ["Vue.js", "PHP"],
      image: null,
      demo: null,
      source: null,
    },
  ],

  inProgress: [
    {
      name: "Dự án mẫu 3",
      description:
        "Mô tả ngắn gọn về dự án đang xây dựng: mục tiêu, công nghệ dự kiến, tiến độ hiện tại.",
      tech: ["Flutter", "NestJS"],
      image: null,
      demo: null,
      source: null,
    },
  ],
};

export default projects;
