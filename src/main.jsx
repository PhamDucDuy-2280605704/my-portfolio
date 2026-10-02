// Điểm vào (entry point) của toàn bộ ứng dụng.
// Render component <App /> vào thẻ <div id="root"> trong index.html.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Font tự host qua @fontsource (có subset tiếng Việt, không phụ thuộc Google Fonts):
//  - Bricolage Grotesque : tiêu đề / chữ lớn (display)
//  - Be Vietnam Pro      : nội dung & giao diện (body) — thiết kế riêng cho tiếng Việt
import "@fontsource/bricolage-grotesque/500.css";
import "@fontsource/bricolage-grotesque/600.css";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/share-tech-mono/400.css";
import "./styles/globals.css";
import "./styles/baseline.css";
import { initAdaptiveRem } from "./lib/adaptiveRem";
import App from "./App.jsx";

// Lưới rem thích ứng: phóng to font-size gốc khi viewport rộng hơn 1920px
initAdaptiveRem();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);