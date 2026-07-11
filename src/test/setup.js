// File setup chạy trước mọi test — nạp thêm các matcher như
// toBeInTheDocument(), toHaveClass()... từ @testing-library/jest-dom.
// Dùng entry "/vitest" vì project không bật `globals: true` trong vite.config.js
// (tránh xung đột với ESLint "no-undef" khi không import describe/it/expect).
import "@testing-library/jest-dom/vitest";

import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Vì không bật `globals: true`, React Testing Library không tự nhận ra
// afterEach của môi trường test để tự dọn DOM -> phải tự gọi cleanup() thủ công,
// nếu không DOM của test trước sẽ còn sót lại làm test sau bị lỗi
// "Found multiple elements".
afterEach(() => {
  cleanup();
});
