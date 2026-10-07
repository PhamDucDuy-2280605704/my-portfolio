# Portfolio — Phạm Đức Duy

Portfolio cá nhân một trang (single-page), song ngữ Việt/Anh.
Stack: **React 19 + Vite + React Router 7**, cuộn mượt bằng **Lenis**, deploy trên **Vercel**.

Live: https://phamducduy-thien9029.vercel.app/

## Chạy dự án

```bash
npm install
npm run dev        # chạy dev server
npm run build      # build production ra dist/
npm run preview    # xem thử bản build
npm run lint       # ESLint
npm test           # Vitest (chạy 1 lần)
npm run test:coverage
```

## Tính năng chính

- Trang chủ gồm các section: Hero, Giới thiệu, Kỹ năng, Dự án, Kinh nghiệm, Nhật ký, Liên hệ (footer).
- Song ngữ VI/EN: `t()` cho chuỗi giao diện (`src/i18n/uiText.js`), `tr()` cho dữ liệu dạng `{ vi, en }`.
- Form liên hệ gửi qua Formspree (có honeypot chống spam).
- Trang bí mật `/zone`: khoá số 3D, ghi chú lưu localStorage, âm thanh Web Audio.
- `vercel.json` rewrite mọi đường dẫn về `index.html` để link trực tiếp không bị 404.

## Cập nhật nội dung

Toàn bộ nội dung nằm trong `src/data/` — sửa ở đó, không cần đụng vào component.
Xem sơ đồ chi tiết ở [CODE_STRUCTURE.md](./CODE_STRUCTURE.md).

## CI

GitHub Actions (`.github/workflows/ci.yml`) chạy lint → test → build mỗi lần push/PR vào `main`.
