// image: để null nếu chưa có ảnh, cập nhật sau bằng cách:
// import thumb1 from "../assets/projects/du-an-1.jpg";  rồi gán vào field image
// demo / source: để null nếu chưa có link, khi nào deploy/publish repo thì điền vào
//
// name/description song ngữ hoá dạng { vi, en } — đọc qua tr() ở Projects.jsx.

const projects = {
  completed: [
    {
      name: { vi: "Portfolio Cá Nhân", en: "Personal Portfolio" },
      description: {
        vi: "Trang portfolio cá nhân xây dựng bằng React + Vite, giới thiệu thông tin, kỹ năng, học vấn/chứng chỉ, dự án và các kênh liên hệ.",
        en: "Personal portfolio site built with React + Vite, showcasing profile, skills, education/certificates, projects, and contact channels.",
      },
      tech: ["React", "Vite", "React Router"],
      image: null,
      demo: "https://phamducduy-thien9029.vercel.app/",
      source: "https://github.com/PhamDucDuy-2280605704/my-portfolio",
    },
  ],

  inProgress: [
    {
      name: { vi: "Dự án mẫu 3", en: "Sample Project 3" },
      description: {
        vi: "Mô tả ngắn gọn về dự án đang xây dựng: mục tiêu, công nghệ dự kiến, tiến độ hiện tại.",
        en: "A short description of a project currently in progress: goals, planned tech stack, current status.",
      },
      tech: ["Flutter", "NestJS"],
      image: null,
      demo: null,
      source: null,
    },
  ],
};

export default projects;
