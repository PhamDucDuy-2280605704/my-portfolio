import { useEffect } from "react";

import "./ContactForm.css";

// Link nhúng form Tally (lấy từ dashboard Tally -> Share -> Embed).
// Đổi form khác: vào tally.so, tạo/mở form -> Share -> Embed -> copy link
// dạng "https://tally.so/embed/xxxxxx" rồi dán thay vào đây.
const TALLY_EMBED_SRC =
  "https://tally.so/embed/b5y9DZ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";

const TALLY_SCRIPT_URL = "https://tally.so/widgets/embed.js";

// Form liên hệ nhúng từ Tally (https://tally.so) — không cần tự viết form/backend,
// chỉnh câu hỏi/trường dữ liệu trực tiếp trên dashboard Tally, site tự cập nhật theo.
//
// Cách hoạt động (phỏng theo đúng snippet chính thức của Tally, chỉ chuyển sang
// useEffect cho hợp vòng đời component React):
//   1. Iframe bên dưới chỉ có `data-tally-src`, CHƯA có `src` thật.
//   2. Script "embed.js" của Tally quét trang, tìm các iframe dạng đó rồi gán
//      `src` thật vào (qua hàm `Tally.loadEmbeds()`).
//   3. Vì đây là SPA (chuyển trang không tải lại toàn bộ trang), nếu người
//      dùng rời trang Contact rồi quay lại, iframe sẽ được React tạo mới
//      hoàn toàn (mất `src` cũ) -> phải tự gọi lại `Tally.loadEmbeds()` mỗi
//      lần component mount, KHÔNG chỉ lúc script tải xong lần đầu.
function ContactForm() {
  useEffect(() => {
    function loadTallyEmbeds() {
      if (typeof window.Tally !== "undefined") {
        window.Tally.loadEmbeds();
        return;
      }

      // Phòng khi window.Tally chưa kịp gán (hiếm khi xảy ra) — tự gán src thủ công,
      // giống hệt cách snippet gốc của Tally làm.
      document.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((iframe) => {
        iframe.src = iframe.dataset.tallySrc;
      });
    }

    // Trường hợp 1: script Tally đã tải xong từ trước (VD: quay lại trang Contact
    // lần 2) -> chỉ cần gọi lại loadEmbeds() cho iframe mới.
    if (typeof window.Tally !== "undefined") {
      loadTallyEmbeds();
      return;
    }

    // Trường hợp 2: script đang tải dở (do 1 lần mount ContactForm trước đó đã
    // thêm thẻ <script> nhưng chưa load xong) -> chờ nó load xong rồi gọi loadEmbeds().
    const existingScript = document.querySelector(`script[src="${TALLY_SCRIPT_URL}"]`);

    if (existingScript) {
      existingScript.addEventListener("load", loadTallyEmbeds);
      return () => existingScript.removeEventListener("load", loadTallyEmbeds);
    }

    // Trường hợp 3: lần đầu tiên trên toàn site -> tự thêm script vào cuối <body>.
    const script = document.createElement("script");
    script.src = TALLY_SCRIPT_URL;
    script.async = true;
    script.onload = loadTallyEmbeds;
    script.onerror = loadTallyEmbeds;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="contact-form-embed">
      <div className="contact-form-embed-header">
        <h3>Gửi Tin Nhắn Trực Tiếp</h3>
        <p>Điền vài thông tin bên dưới, mình sẽ đọc và phản hồi sớm nhất có thể.</p>
      </div>

      <div className="contact-form-embed-frame">
        <iframe
          data-tally-src={TALLY_EMBED_SRC}
          loading="lazy"
          width="100%"
          height="493"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          title="Form Liên Hệ"
        />
      </div>
    </div>
  );
}

export default ContactForm;
