// Mỗi mục là 1 bài "nhật ký" ngắn — ghi lại quá trình học tập, dự án, hoặc suy nghĩ cá nhân.
// content: mảng đoạn văn, hiển thị dạng bài viết đầy đủ khi mở rộng (nếu làm trang chi tiết sau này).

const journal = [
  {
    id: "bat-dau-hanh-trinh-full-stack",
    date: "2026-07-10",
    title: "Bắt đầu hành trình Full Stack",
    excerpt:
      "Ghi lại lý do mình chọn con đường Full Stack thay vì chỉ tập trung Frontend, và những gì mình dự định học trong thời gian tới.",
    tags: ["Học tập", "Định hướng"],
    content: [
      "Trong quá trình học và tự tìm hiểu, mình nhận ra việc chỉ giỏi Frontend là chưa đủ để tự tay hoàn thiện một sản phẩm từ đầu đến cuối. Vì vậy mình quyết định đầu tư thêm thời gian cho Backend (Node.js, NestJS, PHP, Python) và cả Mobile (Flutter).",
      "Trang portfolio này cũng là nơi mình lưu lại quá trình đó — từ những dự án đầu tiên, các chứng chỉ đã đạt được, cho đến những bài học rút ra trên chặng đường trở thành một Full Stack Developer.",
      "Mục tiêu gần nhất: hoàn thiện thêm 1-2 dự án thực tế để đưa vào phần Dự Án, đồng thời tiếp tục trau dồi tiếng Anh và tìm hiểu thêm về tiếng Trung, tiếng Nga.",
    ],
  },
];

export default journal;
