// Mỗi mục là 1 bài "nhật ký" ngắn — ghi lại quá trình học tập, dự án, hoặc suy nghĩ cá nhân.
// content: mảng đoạn văn, hiển thị dạng bài viết đầy đủ khi mở rộng (nếu làm trang chi tiết sau này).

const journal = [
  {
    id: "ranh-gioi-bong-toi-va-phep-mau",
    date: "2026-07-11",
    title: "Ranh giới giữa bóng tối và phép màu",
    excerpt:
      "Vài dòng suy ngẫm về việc giữ vững bản thân giữa một thế giới khắc nghiệt — và vẫn tin vào những điều nhỏ bé, tử tế.",
    tags: ["Suy Ngẫm", "Cá Nhân"],
    content: [
      "Trong một thế giới khắc nghiệt, con người muốn tồn tại phải có sự pha trộn giữa lý trí sắc bén và trực giác nhạy bén, giữa điềm tĩnh và sẵn sàng bùng nổ, giữa trung thành và sự phòng bị tuyệt đối.",
      "Kẻ mạnh nhất không phải là người không biết sợ, mà là người dám đặt chân xuống vực thẳm tối tăm của lòng mình – để rồi từ đó bước lên tầm nhìn sáng suốt, biết mình cần gì và sẵn sàng làm điều đó, dù phải trả giá bằng sinh mệnh.",
      "Ân oán phân minh, thù trả rõ ràng, phản bội là đường đến cái chết – đó là quy luật sống còn của những kẻ đang bước giữa ranh giới địa ngục và thiên đường.",
      "“Ngay cả trong bóng tối, con người vẫn có thể lựa chọn.”",
      "Kính gửi cậu,",
      "Đôi khi thế giới Muggle thật sự rất mệt mỏi. Nhưng điều đó không có nghĩa phép màu đã biến mất. Có những phép màu không nằm ở cây đũa phép, mà ở việc cậu vẫn thức dậy mỗi ngày, vẫn tìm một câu chuyện khiến tim mình rung động, vẫn còn khả năng xúc động trước một từ như 'Always'.",
      "Có lẽ cậu chưa đến được Hogwarts. Nhưng điều đó không có nghĩa cậu không thể tìm thấy những con người và những khoảnh khắc khiến thế giới này đáng sống hơn một chút.",
    ],
  },
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
