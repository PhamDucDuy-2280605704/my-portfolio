# Portfolio — Phạm Đức Duy

Portfolio cá nhân dựng bằng **React 19 + Vite**, bố cục & chuyển động theo
design system "Baseline": tiêu đề khổng lồ reveal theo từ, loader màn che,
cuộn mượt bằng Lenis, spring animation viết tay — trên nền HUD tối (lưới toạ độ,
quầng sáng cyan/cam, hạt sáng, scanline, khung góc).
Song ngữ Việt / Anh, có trang ẩn `/zone`.

## Chạy dự án

```bash
npm install
npm run dev      # chạy local
npm run build    # build production (dist/)
npm test         # chạy Vitest
```

## Cấu trúc `src/`

```
src/
├── main.jsx / App.jsx          # Điểm vào, Provider ngôn ngữ, Lenis, routes
├── routes/AppRoutes.jsx        # "/" -> Home (trong MainLayout), "/zone", 404
├── layouts/MainLayout.jsx      # UiProvider + Loader + <main> + Footer + lớp phủ
├── pages/
│   ├── Home/                   # Ghép các section theo thứ tự
│   ├── Zone/                   # Trang ẩn (giữ nguyên giao diện riêng)
│   └── NotFound/
├── components/
│   ├── common/Background/      # Nền HUD cố định toàn trang
│   ├── landing/                # Hero · Trust(Giới thiệu) · Programs(Kỹ năng)
│   │                           # · Projects · Stats(+Hành trình) · Journal
│   ├── shell/                  # Loader · Header · Footer · MenuOverlay
│   │                           # · ContactModal · LangSwitch
│   ├── motion/                 # Inview · Hover · Reveal(StackedLines/ClipWords/FadeWords)
│   ├── ui/                     # PillButton · ArrowButton · CarouselDots · Eyebrow · Icons · ProjectArt
│   └── common/                 # ErrorBoundary, SmoothScroll, ... (dùng chung)
├── hooks/                      # useSpring · useHoverSpring · useToggleSpring
│                               # · useInViewOnce · useScrollProgress · useUi · ...
├── data/                       # profile, skills, projects, workExperience, education,
│                               # certificates, journal, social + landing.js (khung giao diện)
├── context/                    # LanguageProvider, UiProvider
├── i18n/uiText.js              # Chuỗi giao diện tĩnh vi/en
├── lib/                        # lenis.js (cuộn + khoá cuộn), adaptiveRem.js
└── styles/                     # globals.css, baseline.css (token + lưới rem thích ứng)
```

## Ghi chú thiết kế

- **Lưới rem thích ứng:** mọi kích thước tính bằng `rem`; `font-size` của `<html>` co theo
  viewport bằng media query (≤1920 / 1440 / 1024 / 640) và giãn ra bằng JS khi rộng hơn 1920px.
- **Chuyển động:** spring `{ tension, friction }` viết tay (`hooks/useSpring.js`), ghi thẳng vào
  style của phần tử nên không re-render mỗi khung hình. Hover tự tắt ở viewport ≤768px.
  Tôn trọng `prefers-reduced-motion`.
- **Loader:** màn navy giữ 1.4s (tối đa 2.6s), sau đó trượt lên và mở các reveal của hero.
- **Nội dung:** sửa trong `src/data/*.js` (dạng `{ vi, en }`); khung chữ riêng của landing nằm ở `data/landing.js`.
