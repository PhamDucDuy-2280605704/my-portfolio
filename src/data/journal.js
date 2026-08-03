// Mỗi mục là 1 bài "nhật ký" ngắn — ghi lại quá trình học tập, dự án, hoặc suy nghĩ cá nhân.
// content: mảng đoạn văn, hiển thị dạng bài viết đầy đủ khi mở rộng (nếu làm trang chi tiết sau này).

const journal = [
  {
    id: "5-dieu-minh-tu-nhac-minh",
    date: "2026-07-28",
    title: "5 điều mình muốn nhắc lại với chính mình",
    excerpt:
      "Vài điều ngắn mình hay tự nhắc lại với bản thân dạo gần đây — về sự đơn giản, ranh giới cảm xúc, ý nghĩa, khả năng thích nghi, và cách mình nhìn mọi thứ.",
    tags: ["Suy Ngẫm", "Cá Nhân"],
    content: [
      "Dạo này mình hay dừng lại giữa ngày, viết vài câu ngắn để tự nhắc bản thân — không phải để đăng ở đâu, chỉ để đọc lại khi cần. Hôm nay mình gom chúng vào đây, một phần cũng để tập diễn đạt lại ý của mình cho rõ ràng, thay vì chỉ giữ nguyên câu chữ của người khác trong đầu.",
      "Điều đầu tiên: càng học nhiều, mình càng thấy sự đơn giản mới là thứ khó đạt được nhất. Một đoạn code ngắn gọn, một lời giải thích dễ hiểu, một quyết định rõ ràng — tất cả đều đòi hỏi mình hiểu vấn đề sâu hơn là khi mình làm nó rối rắm. Rối rắm thường là dấu hiệu mình chưa hiểu hết, chứ không phải là mình giỏi.",
      "Điều thứ hai, mình học cách phân biệt giữa việc bị tổn thương và việc chọn để bị tổn thương. Người khác có thể nói những điều không hay, nhưng cảm giác tổn thương thật sự chỉ xảy ra khi mình cho phép lời nói đó có quyền lên tiếng trong đầu mình. Đó không phải là vô cảm, mà là biết giữ ranh giới cho chính mình.",
      "Điều thứ ba: mình không còn tự hỏi 'mình có đang sống không', mà là 'những gì mình đang làm có ý nghĩa với mình không'. Có những ngày trôi qua rất nhanh vì mình chỉ đang tồn tại theo quán tính — học vì phải học, làm vì phải làm. Mình muốn ít những ngày như vậy hơn.",
      "Điều thứ tư, về việc không phải lúc nào mình cũng kiểm soát được hoàn cảnh — deadline gấp, dự án đổi hướng, kế hoạch học tập bị xáo trộn. Nhưng cách mình phản ứng lại với chuyện đó, mình luôn điều chỉnh được. Gió thổi hướng nào không phải việc của mình; chỉnh lại cánh buồm mới là việc của mình.",
      "Và điều cuối cùng, có lẽ là điều mình phải nhắc đi nhắc lại nhiều nhất: phần lớn những gì làm mình khó chịu không đến từ chính sự việc, mà đến từ cách mình diễn giải nó. Một lời góp ý có thể là sự công kích, hoặc là một dữ liệu hữu ích để mình làm tốt hơn — tuỳ vào cách mình chọn nhìn nó.",
      "Ghi lại đây, không phải vì mình đã làm được hết, mà để sau này đọc lại còn biết mình đã từng nghĩ như vậy.",
    ],
  },
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
