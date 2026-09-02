// Mỗi mục là 1 bài "nhật ký" ngắn — ghi lại quá trình học tập, dự án, hoặc suy nghĩ cá nhân.
// content: mảng đoạn văn, hiển thị dạng bài viết đầy đủ khi mở rộng (nếu làm trang chi tiết sau này).
//
// title/excerpt/tags/content song ngữ hoá dạng { vi, en } — đọc qua tr() ở
// Journal.jsx. id/date giữ nguyên (không đổi theo ngôn ngữ).

const journal = [
  {
    id: "5-dieu-minh-tu-nhac-minh",
    date: "2026-07-28",
    title: {
      vi: "5 điều mình muốn nhắc lại với chính mình",
      en: "5 things I want to remind myself of",
    },
    excerpt: {
      vi: "Vài điều ngắn mình hay tự nhắc lại với bản thân dạo gần đây — về sự đơn giản, ranh giới cảm xúc, ý nghĩa, khả năng thích nghi, và cách mình nhìn mọi thứ.",
      en: "A few short things I've been reminding myself of lately — about simplicity, emotional boundaries, meaning, adaptability, and how I choose to see things.",
    },
    tags: [
      { vi: "Suy Ngẫm", en: "Reflection" },
      { vi: "Cá Nhân", en: "Personal" },
    ],
    content: [
      {
        vi: "Dạo này mình hay dừng lại giữa ngày, viết vài câu ngắn để tự nhắc bản thân — không phải để đăng ở đâu, chỉ để đọc lại khi cần. Hôm nay mình gom chúng vào đây, một phần cũng để tập diễn đạt lại ý của mình cho rõ ràng, thay vì chỉ giữ nguyên câu chữ của người khác trong đầu.",
        en: "Lately I've been pausing in the middle of the day to jot down a few short lines to remind myself of things — not to post anywhere, just to read back when I need to. Today I'm gathering them here, partly to practice putting my own thoughts into clear words instead of just holding onto someone else's phrasing in my head.",
      },
      {
        vi: "Điều đầu tiên: càng học nhiều, mình càng thấy sự đơn giản mới là thứ khó đạt được nhất. Một đoạn code ngắn gọn, một lời giải thích dễ hiểu, một quyết định rõ ràng — tất cả đều đòi hỏi mình hiểu vấn đề sâu hơn là khi mình làm nó rối rắm. Rối rắm thường là dấu hiệu mình chưa hiểu hết, chứ không phải là mình giỏi.",
        en: "The first thing: the more I learn, the more I realize simplicity is the hardest thing to achieve. A short piece of code, an explanation that's easy to follow, a clear decision — all of it requires understanding the problem more deeply than when I make it complicated. Complexity is usually a sign I don't fully understand yet, not a sign that I'm skilled.",
      },
      {
        vi: "Điều thứ hai, mình học cách phân biệt giữa việc bị tổn thương và việc chọn để bị tổn thương. Người khác có thể nói những điều không hay, nhưng cảm giác tổn thương thật sự chỉ xảy ra khi mình cho phép lời nói đó có quyền lên tiếng trong đầu mình. Đó không phải là vô cảm, mà là biết giữ ranh giới cho chính mình.",
        en: "The second thing, I'm learning to tell the difference between being hurt and choosing to be hurt. Other people might say unkind things, but the actual feeling of being hurt only happens when I let those words have a say in my own head. That's not being cold — it's knowing how to hold a boundary for myself.",
      },
      {
        vi: "Điều thứ ba: mình không còn tự hỏi 'mình có đang sống không', mà là 'những gì mình đang làm có ý nghĩa với mình không'. Có những ngày trôi qua rất nhanh vì mình chỉ đang tồn tại theo quán tính — học vì phải học, làm vì phải làm. Mình muốn ít những ngày như vậy hơn.",
        en: "The third thing: I no longer ask myself \"am I living\", but rather \"does what I'm doing actually mean something to me\". Some days fly by because I'm just existing on autopilot — studying because I have to, working because I have to. I want fewer days like that.",
      },
      {
        vi: "Điều thứ tư, về việc không phải lúc nào mình cũng kiểm soát được hoàn cảnh — deadline gấp, dự án đổi hướng, kế hoạch học tập bị xáo trộn. Nhưng cách mình phản ứng lại với chuyện đó, mình luôn điều chỉnh được. Gió thổi hướng nào không phải việc của mình; chỉnh lại cánh buồm mới là việc của mình.",
        en: "The fourth thing, about not always being able to control circumstances — tight deadlines, a project changing direction, study plans getting thrown off. But how I react to it is always something I can adjust. Which way the wind blows isn't up to me; adjusting the sail is.",
      },
      {
        vi: "Và điều cuối cùng, có lẽ là điều mình phải nhắc đi nhắc lại nhiều nhất: phần lớn những gì làm mình khó chịu không đến từ chính sự việc, mà đến từ cách mình diễn giải nó. Một lời góp ý có thể là sự công kích, hoặc là một dữ liệu hữu ích để mình làm tốt hơn — tuỳ vào cách mình chọn nhìn nó.",
        en: "And the last thing, probably the one I have to remind myself of the most: most of what bothers me doesn't come from the event itself, but from how I interpret it. A piece of feedback can be an attack, or it can be useful information to help me do better — depending on how I choose to see it.",
      },
      {
        vi: "Ghi lại đây, không phải vì mình đã làm được hết, mà để sau này đọc lại còn biết mình đã từng nghĩ như vậy.",
        en: "Writing this down not because I've mastered all of it, but so that later I can look back and know this is what I once thought.",
      },
    ],
  },
  {
    id: "ranh-gioi-bong-toi-va-phep-mau",
    date: "2026-07-11",
    title: {
      vi: "Ranh giới giữa bóng tối và phép màu",
      en: "The line between darkness and magic",
    },
    excerpt: {
      vi: "Vài dòng suy ngẫm về việc giữ vững bản thân giữa một thế giới khắc nghiệt — và vẫn tin vào những điều nhỏ bé, tử tế.",
      en: "A few reflections on staying true to yourself in a harsh world — and still believing in small, kind things.",
    },
    tags: [
      { vi: "Suy Ngẫm", en: "Reflection" },
      { vi: "Cá Nhân", en: "Personal" },
    ],
    content: [
      {
        vi: "Trong một thế giới khắc nghiệt, con người muốn tồn tại phải có sự pha trộn giữa lý trí sắc bén và trực giác nhạy bén, giữa điềm tĩnh và sẵn sàng bùng nổ, giữa trung thành và sự phòng bị tuyệt đối.",
        en: "In a harsh world, surviving means being a mix of sharp reason and keen instinct, of calm and readiness to explode, of loyalty and absolute guardedness.",
      },
      {
        vi: "Kẻ mạnh nhất không phải là người không biết sợ, mà là người dám đặt chân xuống vực thẳm tối tăm của lòng mình – để rồi từ đó bước lên tầm nhìn sáng suốt, biết mình cần gì và sẵn sàng làm điều đó, dù phải trả giá bằng sinh mệnh.",
        en: "The strongest person isn't the one who feels no fear, but the one who dares to step into the dark depths of their own heart — and from there rises with a clear sense of what they need, and the will to do it, even at the cost of everything.",
      },
      {
        vi: "Ân oán phân minh, thù trả rõ ràng, phản bội là đường đến cái chết – đó là quy luật sống còn của những kẻ đang bước giữa ranh giới địa ngục và thiên đường.",
        en: "Debts of gratitude repaid, grudges settled clearly, betrayal leading straight to ruin — that's the law of survival for anyone walking the line between hell and heaven.",
      },
      {
        vi: "“Ngay cả trong bóng tối, con người vẫn có thể lựa chọn.”",
        en: "\"Even in darkness, a person can still choose.\"",
      },
      {
        vi: "Kính gửi cậu,",
        en: "Dear you,",
      },
      {
        vi: "Đôi khi thế giới Muggle thật sự rất mệt mỏi. Nhưng điều đó không có nghĩa phép màu đã biến mất. Có những phép màu không nằm ở cây đũa phép, mà ở việc cậu vẫn thức dậy mỗi ngày, vẫn tìm một câu chuyện khiến tim mình rung động, vẫn còn khả năng xúc động trước một từ như 'Always'.",
        en: "Sometimes the ordinary, non-magical world is genuinely exhausting. But that doesn't mean magic has disappeared. Some magic isn't found in a wand, but in the fact that you still get up every day, still look for a story that moves you, still feel something when you come across a single word like 'Always'.",
      },
      {
        vi: "Có lẽ cậu chưa đến được Hogwarts. Nhưng điều đó không có nghĩa cậu không thể tìm thấy những con người và những khoảnh khắc khiến thế giới này đáng sống hơn một chút.",
        en: "Maybe you never got your letter to a school of magic. But that doesn't mean you can't still find people and moments that make this ordinary world a little more worth living in.",
      },
    ],
  },
  {
    id: "bat-dau-hanh-trinh-full-stack",
    date: "2026-07-10",
    title: {
      vi: "Bắt đầu hành trình Full Stack",
      en: "Starting the Full Stack journey",
    },
    excerpt: {
      vi: "Ghi lại lý do mình chọn con đường Full Stack thay vì chỉ tập trung Frontend, và những gì mình dự định học trong thời gian tới.",
      en: "Writing down why I chose the Full Stack path instead of focusing only on Frontend, and what I plan to learn next.",
    },
    tags: [
      { vi: "Học tập", en: "Learning" },
      { vi: "Định hướng", en: "Direction" },
    ],
    content: [
      {
        vi: "Trong quá trình học và tự tìm hiểu, mình nhận ra việc chỉ giỏi Frontend là chưa đủ để tự tay hoàn thiện một sản phẩm từ đầu đến cuối. Vì vậy mình quyết định đầu tư thêm thời gian cho Backend (Node.js, NestJS, PHP, Python) và cả Mobile (Flutter).",
        en: "Through studying and exploring on my own, I realized that being good at Frontend alone isn't enough to build a complete product from start to finish. So I decided to invest more time into Backend (Node.js, NestJS, PHP, Python) as well as Mobile (Flutter).",
      },
      {
        vi: "Trang portfolio này cũng là nơi mình lưu lại quá trình đó — từ những dự án đầu tiên, các chứng chỉ đã đạt được, cho đến những bài học rút ra trên chặng đường trở thành một Full Stack Developer.",
        en: "This portfolio is also where I keep track of that journey — from my first projects and certificates earned, to the lessons learned along the way to becoming a Full Stack Developer.",
      },
      {
        vi: "Mục tiêu gần nhất: hoàn thiện thêm 1-2 dự án thực tế để đưa vào phần Dự Án, đồng thời tiếp tục trau dồi tiếng Anh và tìm hiểu thêm về tiếng Trung, tiếng Nga.",
        en: "My immediate goal: finish 1-2 more real-world projects to add to the Projects section, while continuing to improve my English and picking up some Chinese and Russian.",
      },
    ],
  },
];

export default journal;
