import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

import "./PdfViewerModal.css";

// Modal xem PDF ngay trong trang (dùng <iframe>) — đảm bảo LUÔN xem trực tiếp,
// bất kể trình duyệt của người dùng có bật cài đặt "luôn tải PDF về máy" hay
// không (cài đặt đó chỉ áp dụng khi điều hướng top-level tới file PDF, còn
// nhúng qua iframe trong trang vẫn hiện trình xem PDF có sẵn của trình duyệt).
function PdfViewerModal({ src, title, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="pdf-modal"
      onClick={onClose}
    >
      <div
        className="pdf-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pdf-modal-header">
          <span>{title}</span>

          <button
            type="button"
            className="pdf-modal-close"
            onClick={onClose}
            aria-label="Đóng"
          >
            <IoClose />
          </button>
        </div>

        <iframe
          src={src}
          title={title}
          className="pdf-modal-frame"
        />
      </div>
    </div>
  );
}

export default PdfViewerModal;
