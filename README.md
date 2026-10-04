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
│   ├── Zone/                   # Trang ẩn /zone: khoá số 3D 4 bánh (ZoneLock) + ghi chú riêng tư
│   └── NotFound/
├── components/
│   ├── common/Background/      # Nền HUD cố định toàn trang
│   ├── landing/                # Hero · Trust(Giới thiệu) · Programs(Kỹ năng)
│   │                           # · Projects · Stats(+Hành trình) · Journal
│   ├── shell/                  # Loader · Header · Footer · MenuOverlay
│   │                           # · ContactModal · ImageLightbox · LangSwitch
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
└── styles/                     # variables.css (màu/font/thang chữ — nguồn duy nhất),
                                # globals.css (khung .hud-panel dùng chung), baseline.css (lưới rem + lớp của landing)
```

## Ghi chú thiết kế

- **Lưới rem thích ứng:** mọi kích thước tính bằng `rem`; `font-size` của `<html>` co theo
  viewport bằng media query (≤1920 / 1440 / 1024 / 640) và giãn ra bằng JS khi rộng hơn 1920px.
- **Chuyển động:** spring `{ tension, friction }` viết tay (`hooks/useSpring.js`), ghi thẳng vào
  style của phần tử nên không re-render mỗi khung hình. Hover tự tắt ở viewport ≤768px.
  Tôn trọng `prefers-reduced-motion`.
- **Loader:** vòng 12 dot xoay 3D (Uiverse) giữ tối thiểu 2s (1 vòng animation), tối đa 3.2s, rồi trượt lên và mở các reveal của hero.
- **Hiện khi cuộn:** mọi khối dưới màn hình ẩn sẵn và chỉ hiện (1 lần) khi cuộn tới — dùng chung `Inview` (mặc định "trồi lên") và `Reveal` (chữ).
- **Nội dung:** sửa trong `src/data/*.js` (dạng `{ vi, en }`); khung chữ riêng của landing nằm ở `data/landing.js`.

## Trang /zone — khoá số

- Mật khẩu là **4 chữ số**, nhập bằng khoá số 3D 4 bánh: bấm vào mặt số, lăn chuột, mũi tên ↑↓, hoặc gõ thẳng số (tự nhảy sang bánh kế; Backspace lùi lại; Enter để vào).
- Mật khẩu mặc định và dòng gợi ý nằm ở đầu `src/pages/Zone/Zone.jsx` (`ZONE_PASSWORD`, `ZONE_HINT`). Mật khẩu đổi trong trang (lưu localStorage) cũng phải đủ 4 chữ số; giá trị cũ không hợp lệ sẽ bị bỏ qua.
- Đây là "cánh cổng" mang tính trải nghiệm — mật khẩu nằm trong file JS build ra nên không phải bảo mật thật sự.
