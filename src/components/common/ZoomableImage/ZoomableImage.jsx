import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

import "./ZoomableImage.css";
import { playUiSound } from "../../../utils/uiSound";
import { stopLenis, startLenis } from "../../../lib/lenis";

// Ảnh bấm vào phóng to toàn màn hình — cùng 1 pattern overlay đã dùng cho
// logo ở Navbar (khoá cuộn nền + dừng Lenis lúc mở + Esc để đóng), tách ra
// đây thành component dùng chung để chỗ nào cần "bấm ảnh xem to" (avatar
// About, ảnh trong Journal/Projects sau này...) chỉ cần render thẳng
// <ZoomableImage>, không phải chép lại state + effect mỗi lần.
function ZoomableImage({ src, alt, className = "" }) {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!isZoomed) return undefined;

    document.body.style.overflow = "hidden";
    // Lenis tự bắt sự kiện wheel/touch để làm mượt cuộn, KHÔNG dựa vào
    // overflow của body -> phải dừng riêng thì nền mới thực sự hết cuộn
    // được trong lúc overlay đang mở (xem thêm ở Navbar.jsx).
    stopLenis();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      startLenis();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isZoomed]);

  return (
    <>
      <button
        type="button"
        className={`zoomable-image-trigger ${className}`.trim()}
        onClick={() => {
          playUiSound("card");
          setIsZoomed(true);
        }}
        aria-label={`Phóng to ảnh: ${alt}`}
      >
        <img
          src={src}
          alt={alt}
        />
      </button>

      {isZoomed && (
        <div
          className="zoomable-image-overlay"
          onClick={() => setIsZoomed(false)}
        >
          <button
            type="button"
            className="zoomable-image-close"
            onClick={(e) => {
              e.stopPropagation();
              playUiSound("card");
              setIsZoomed(false);
            }}
            aria-label="Đóng"
          >
            <IoClose />
          </button>

          <img
            src={src}
            alt={alt}
            className="zoomable-image-full"
          />
        </div>
      )}
    </>
  );
}

export default ZoomableImage;
