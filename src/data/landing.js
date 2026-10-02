// Nội dung riêng của giao diện landing (bố cục Baseline) — những chuỗi không
// nằm sẵn trong profile/projects/skills/... Tất cả song ngữ dạng { vi, en }
// (đọc qua tr()), riêng mảng dòng/từ là { vi: [...], en: [...] } (đọc qua tr()
// rồi dùng như mảng).
//
// Nội dung gốc (bio, kỹ năng, dự án, kinh nghiệm, nhật ký...) vẫn lấy từ
// các file data/*.js cũ — file này chỉ bổ sung phần "khung" của landing.

const landing = {
  hero: {
    // 2 dòng tagline dưới tên
    tagline: {
      vi: ["Cần một mục đích / để bắt đầu"],
      en: ["You need a purpose / to begin"],
    },
    // Slider 3 mảng chuyên môn (góc phải hero). Tên công nghệ lấy từ data/skills.js.
    focus: [
      {
        id: "frontend",
        brand: { vi: "Frontend", en: "Frontend" },
        group: "frontend",
        cta: { vi: "Xem kỹ năng", en: "See skills" },
        href: "skills",
      },
      {
        id: "backend",
        brand: { vi: "Backend", en: "Backend" },
        group: "backend",
        cta: { vi: "Xem kỹ năng", en: "See skills" },
        href: "skills",
      },
      {
        id: "mobile",
        brand: { vi: "Mobile", en: "Mobile" },
        group: "mobile",
        cta: { vi: "Xem dự án", en: "See projects" },
        href: "projects",
      },
    ],
    // Thẻ nhỏ góc phải: điểm thực tập (lấy từ data/workExperience.js)
    scoreCaption: { vi: "Điểm thực tập", en: "Internship score" },
  },

  // Section "Giới thiệu" (carousel 3 slide). body = đoạn bio thứ index trong profile.bio
  about: {
    badgeValue: "3",
    badgeCaption: { vi: "mảng: web, hệ thống, di động", en: "areas: web, systems, mobile" },
    slides: [
      {
        title: { vi: "Mình là Duy", en: "Hi, I'm Duy" },
        bioIndex: 0,
        headline: { vi: ["Giao", "Diện", "Chỉn", "Chu"], en: ["Smooth", "Polished", "Frontend", "Craft"] },
        role: { vi: "Frontend · React, Vue", en: "Frontend · React, Vue" },
        group: "frontend",
        tone: "navy",
      },
      {
        title: { vi: "Hai mảng, một sản phẩm", en: "Two sides, one product" },
        bioIndex: 1,
        headline: { vi: ["Hệ", "Thống", "Vững", "Chắc"], en: ["Solid", "Backend", "API", "Logic"] },
        role: { vi: "Backend · NestJS, Node.js", en: "Backend · NestJS, Node.js" },
        group: "backend",
        tone: "teal",
      },
      {
        title: { vi: "Làm từ đầu đến cuối", en: "Start to finish" },
        bioIndex: 2,
        headline: { vi: ["Ứng", "Dụng", "Đa", "Nền"], en: ["Cross", "Platform", "Mobile", "Apps"] },
        role: { vi: "Mobile · Flutter", en: "Mobile · Flutter" },
        group: "mobile",
        tone: "blue",
      },
    ],
  },
  loader: { label: { vi: "Đang tải trang", en: "Loading page" } },

  shell: {
    menu: { vi: "Mở menu", en: "Open menu" },
    contactCta: { vi: "Liên hệ", en: "Get in touch" },
    backToTop: { vi: "Lên đầu trang", en: "Back to top" },
    langLabel: { vi: "Ngôn ngữ", en: "Language" },
  },

  programs: {
    eyebrow: { vi: "Kỹ năng", en: "Skills" },
    title: { vi: ["Kỹ năng", "đủ mọi lớp"], en: ["Skills for", "every layer"] },
    groups: {
      frontend: { vi: "Frontend", en: "Frontend" },
      backend: { vi: "Backend", en: "Backend" },
      mobile: { vi: "Mobile", en: "Mobile" },
      tools: { vi: "Công cụ", en: "Tools" },
    },
  },

  projects: {
    eyebrow: { vi: "Dự án", en: "Projects" },
    title: { vi: ["Dự án", "mình đã", "xây dựng"], en: ["Things", "I've been", "building"] },
    body: {
      vi: "Những sản phẩm mình đã và đang làm, từ giao diện đến hệ thống phía sau. Bấm vào thẻ để xem bản chạy thật hoặc mã nguồn.",
      en: "The products I've built and am building, from the interface to the systems behind it. Open a card to see the live version or the source.",
    },
  },

  stats: {
    eyebrow: { vi: "Con số", en: "By the numbers" },
    title: { vi: ["Vài con số", "về mình"], en: ["A few numbers", "about me"] },
    labels: {
      tech: { vi: "Công nghệ đã dùng", en: "Technologies used" },
      score: { vi: "Điểm thực tập", en: "Internship score" },
      months: { vi: "Tháng thực tập Fullstack", en: "Months as a Fullstack intern" },
      projects: { vi: "Dự án đã hoàn thành", en: "Projects completed" },
    },
    journey: { vi: "Hành trình", en: "Journey" },
    report: { vi: "Xem báo cáo thực tập", en: "Read internship report" },
    scoreLabel: { vi: "Đánh giá", en: "Score" },
  },

  journal: {
    eyebrow: { vi: "Nhật ký", en: "Journal" },
    title: { vi: ["Ghi chép", "của mình"], en: ["Notes from", "my journal"] },
  },

  footer: {
    ctaEyebrow: { vi: "Bắt đầu", en: "Get started" },
    ctaTitle: { vi: ["Cùng làm", "việc nhé?"], en: ["Let's work", "together?"] },
    blurb: {
      vi: "Lập trình viên Full Stack — xây sản phẩm từ giao diện đến hệ thống, trên web lẫn di động.",
      en: "Full Stack developer — building products from interface to system, on web and mobile.",
    },
    explore: { vi: "Khám phá", en: "Explore" },
    elsewhere: { vi: "Tìm mình ở", en: "Find me on" },
    more: { vi: "Thêm", en: "More" },
    viewCv: { vi: "Xem CV", en: "View CV" },
    rights: { vi: "Mọi quyền được bảo lưu.", en: "All rights reserved." },
  },

  modal: {
    eyebrow: { vi: "Gửi tin nhắn", en: "Send a message" },
    title: { vi: ["Cùng trò", "chuyện nhé"], en: ["Let's", "talk"] },
    done: { vi: "Xong", en: "Done" },
  },
};

export default landing;
