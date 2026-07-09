// image: để null nếu chưa có ảnh, cập nhật sau bằng cách:
// import thumb1 from "../assets/projects/du-an-1.jpg";  rồi gán vào field image
// demo / source: để null nếu chưa có link, khi nào deploy/publish repo thì điền vào

const projects = {
  completed: [
    {
      name: "Portfolio Cá Nhân",
      description:
        "Trang portfolio cá nhân xây dựng bằng React + Vite, giới thiệu thông tin, kỹ năng, học vấn/chứng chỉ, dự án và các kênh liên hệ.",
      tech: ["React", "Vite", "React Router"],
      image: null,
      demo: "https://phamducduy-thien9029.vercel.app/",
      source: "https://github.com/PhamDucDuy-2280605704/my-portfolio",
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
