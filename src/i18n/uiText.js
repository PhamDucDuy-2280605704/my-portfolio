// Từ điển giao diện tĩnh dùng chung toàn site (KHÔNG chứa nội dung dữ liệu
// như bio/mô tả dự án — những cái đó song ngữ hoá ngay trong src/data/*.js
// và đọc qua tr() thay vì key ở đây, xem hooks/useLanguage.js).
//
// Thêm chuỗi mới: thêm 1 key vào object bên dưới với đủ 2 field vi/en, rồi
// dùng t("tenKey") ở component.
const uiText = {
  // Header / MenuOverlay / Lightbox
  closeLabel: { vi: "Đóng", en: "Close" },
  logoZoom: { vi: "Phóng to logo", en: "Enlarge logo" },
  avatarZoom: { vi: "Phóng to ảnh đại diện", en: "Enlarge profile photo" },
  skipToContent: { vi: "Bỏ qua đến nội dung chính", en: "Skip to main content" },


  // Projects
  projectsTabCompleted: { vi: "Đã hoàn thành", en: "Completed" },
  projectsTabInProgress: { vi: "Đang phát triển", en: "In Progress" },
  projectViewLive: { vi: "Xem trực tiếp", en: "View Live" },
  projectSource: { vi: "Mã nguồn", en: "Source Code" },

  // Experience
  statusDone: { vi: "Đã hoàn thành", en: "Completed" },
  statusInProgress: { vi: "Đang học", en: "In Progress" },

  // Journal
  journalReadMore: { vi: "Đọc tiếp", en: "Read more" },
  journalCollapse: { vi: "Thu gọn", en: "Collapse" },


  // ContactModal
  contactFormName: { vi: "Họ tên", en: "Full name" },
  contactFormNamePlaceholder: { vi: "Tên của bạn", en: "Your name" },
  contactFormEmail: { vi: "Email", en: "Email" },
  contactFormMessage: { vi: "Lời nhắn", en: "Message" },
  contactFormMessagePlaceholder: { vi: "Bạn muốn trao đổi điều gì?", en: "What would you like to talk about?" },
  contactFormSending: { vi: "Đang gửi...", en: "Sending..." },
  contactFormSubmit: { vi: "Gửi Tin Nhắn", en: "Send Message" },
  contactFormError: {
    vi: "Gửi thất bại — có thể do mất kết nối mạng. Bạn thử lại hoặc liên hệ qua các kênh phía trên nhé.",
    en: "Failed to send — possibly a network issue. Please try again or reach out via the channels above.",
  },
  contactFormSuccessTitle: { vi: "Đã gửi thành công!", en: "Sent successfully!" },
  contactFormSuccessBody: {
    vi: "Cảm ơn bạn đã nhắn tin, mình sẽ phản hồi sớm nhất có thể.",
    en: "Thanks for reaching out, I'll reply as soon as I can.",
  },
  contactFormSubjectValue: { vi: "📬 Tin nhắn mới từ Portfolio", en: "📬 New message from Portfolio" },

  // NotFound
  notFoundTag: { vi: "ERR_404 // NODE_NOT_FOUND", en: "ERR_404 // NODE_NOT_FOUND" },
  notFoundTitle: { vi: "Không tìm thấy trang", en: "Page not found" },
  notFoundBody: {
    vi: "Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.",
    en: "The page you're looking for doesn't exist or has been moved.",
  },
  notFoundCta: { vi: "Về Trang Chủ", en: "Back To Home" },
  notFoundPageTitle: { vi: "Không Tìm Thấy Trang | Phạm Đức Duy", en: "Page Not Found | Pham Duc Duy" },
  homePageTitle: { vi: "Phạm Đức Duy | Lập Trình Viên Full Stack", en: "Pham Duc Duy | Full Stack Developer" },
};

export default uiText;
