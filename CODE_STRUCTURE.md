# Sơ đồ cấu trúc code — my-portfolio

Stack: **React 19 + Vite + React Router 7**. Không có backend, không gọi API
(trừ form liên hệ gửi tới Formspree) — nội dung lấy từ các file tĩnh trong `src/data`.

## 1. Cây thư mục

```
my-portfolio/
├─ public/                     # favicon, manifest, robots, sitemap, og-image.png
├─ vercel.json                 # rewrite SPA về index.html
├─ src/
│  ├─ main.jsx                 # điểm vào: nạp font, CSS toàn cục, render <App />
│  ├─ App.jsx                  # LanguageProvider + SmoothScroll + ErrorBoundary + AppRoutes
│  ├─ routes/AppRoutes.jsx     # "/" (Home), "/zone", redirect route cũ -> "/#section", 404
│  ├─ layouts/MainLayout.jsx   # khung chung: Background, Header, Loader, MenuOverlay, Footer, ContactModal
│  │
│  ├─ pages/
│  │  ├─ Home/                 # ghép các section landing theo thứ tự
│  │  ├─ Zone/                 # trang bí mật /zone: Zone.jsx, ZoneLock.jsx (khoá số 3D), zoneAudio.js (âm thanh Web Audio)
│  │  └─ NotFound/             # 404
│  │
│  ├─ components/
│  │  ├─ landing/              # Hero, Trust (giới thiệu), Programs (kỹ năng), Projects, Stats (kinh nghiệm), Journal
│  │  ├─ shell/                # Header, MenuOverlay, Footer, ContactModal, Loader, LangSwitch, ImageLightbox
│  │  ├─ motion/               # Inview (hiện khi cuộn), Reveal (hiệu ứng chữ), Hover
│  │  ├─ ui/                   # Eyebrow, PillButton, ArrowButton, CarouselDots, Icons, ProjectArt
│  │  └─ common/               # Background, Button, ErrorBoundary, PageLoader, ScrollToTop, SmoothScroll
│  │
│  ├─ data/                    # nguồn nội dung (song ngữ { vi, en })
│  │  ├─ profile.js            # tên, vai trò, email, avatar, mô tả, bio, CV
│  │  ├─ landing.js            # chuỗi riêng của giao diện landing
│  │  ├─ navSections.js        # id + tên các section cho menu
│  │  ├─ skills.js, projects.js, education.js, workExperience.js, certificates.js, journal.js
│  │  └─ social.js             # link liên hệ + endpoint Formspree
│  │
│  ├─ i18n/uiText.js           # từ điển chuỗi giao diện, đọc bằng t("key")
│  ├─ context/                 # LanguageContext/Provider, UiContext/Provider
│  ├─ hooks/                   # useLanguage, useUi, useSpring, useHoverSpring, useToggleSpring,
│  │                           # useInViewOnce, useScrollProgress, useMedia, usePageTitle
│  ├─ lib/                     # lenis.js (cuộn mượt, khoá cuộn), adaptiveRem.js
│  ├─ utils/uiSound.js         # âm thanh UI
│  ├─ styles/                  # variables, reset, globals, baseline
│  ├─ assets/                  # images, resume/cv.pdf, documents/báo cáo thực tập
│  └─ test/                    # setup + renderWithLanguage cho Vitest
```

## 2. Luồng chính

1. `main.jsx` render `App` -> `LanguageProvider` bọc toàn app (mặc định `vi`, nhớ lựa chọn bằng localStorage).
2. `AppRoutes` đưa `/` vào `MainLayout` -> `Home`; menu chỉ cuộn neo `#id`, không đổi route.
3. Nội dung đọc từ `src/data/*` qua `tr()`; chuỗi giao diện đọc qua `t()` từ `uiText.js`.
4. `/zone` đứng riêng (lazy-load, không bọc `MainLayout`).

## 3. Thêm / sửa nội dung

- Dự án: `data/projects.js` (`completed` / `inProgress`).
- Chứng chỉ, học vấn, kinh nghiệm: file tương ứng trong `data/`.
- Chuỗi giao diện mới: thêm key `{ vi, en }` vào `i18n/uiText.js`.
