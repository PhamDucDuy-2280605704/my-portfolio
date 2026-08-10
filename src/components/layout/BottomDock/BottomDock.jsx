import navSections from "../../../data/navSections";
import useActiveSection from "../../../hooks/useActiveSection";
import { playUiSound } from "../../../utils/uiSound";
import "./BottomDock.css";

const SECTION_IDS = navSections.map((s) => s.id);

// Dock điều hướng nổi dưới cùng màn hình, dạng "kính" (glassmorphism) —
// thay cho menu chữ nằm ở góc phải Navbar trước đây. Gọn, chỉ icon, căn
// giữa — lấy cảm hứng từ thanh điều hướng dưới của các app di động
// (Instagram, TikTok...): icon rỗng khi chưa chọn, icon đặc + khung nền nổi
// bật khi đang active.
//
// Dùng chung useActiveSection với Navbar để biết đang ở section nào (cả 2
// nơi tự đồng bộ theo vị trí cuộn, không cần truyền state qua lại).
function BottomDock() {
  const activeId = useActiveSection(SECTION_IDS);

  return (
    <nav
      className="bottom-dock"
      aria-label="Điều hướng nhanh"
    >
      <ul className="bottom-dock-list">
        {navSections.map((item) => {
          const isActive = activeId === item.id;
          const Icon = isActive ? item.iconActive : item.icon;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`bottom-dock-item ${isActive ? "active" : ""}`}
                aria-label={item.name}
                aria-current={isActive ? "true" : undefined}
                onClick={() => playUiSound(isActive ? "navActive" : "nav")}
              >
                <span className="bottom-dock-icon">
                  <Icon />
                </span>

                {/* Tooltip hiện khi di chuột/focus vào icon — tên mục + mô
                    tả ngắn dùng để làm gì, giúp icon dễ hiểu hơn dù dock chỉ
                    hiện icon (không có chữ) theo mặc định. aria-hidden vì
                    nội dung tương đương đã có sẵn trong aria-label ở thẻ
                    <a> cha, tránh trình đọc màn hình đọc lặp 2 lần. */}
                <span
                  className="bottom-dock-tooltip"
                  aria-hidden="true"
                >
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                </span>

                {/* Chữ tên mục vẫn có trong DOM cho trình đọc màn hình +
                    người dùng có thể phóng to chữ (zoom) mà không mất
                    thông tin, chỉ ẩn về mặt hình ảnh bằng CSS. */}
                <span className="bottom-dock-label">{item.name}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default BottomDock;
