# Sơ đồ cấu trúc code — my-portfolio

Stack: **React 19 + Vite + React Router 7**. Không có state management ngoài, không gọi API — toàn bộ nội dung lấy từ các file tĩnh trong `src/data`.

## 1. Cây thư mục

```
my-portfolio/
├─ public/
│  └─ favicon.svg              # icon tab trình duyệt
│
├─ src/
│  ├─ main.jsx                 # điểm vào, render <App /> vào #root
│  ├─ App.jsx                  # chỉ render <AppRoutes />
│  │
│  ├─ routes/
│  │  └─ AppRoutes.jsx         # khai báo toàn bộ route (BrowserRouter)
│  │
│  ├─ layouts/
│  │  └─ MainLayout.jsx        # khung chung: Navbar + <Outlet/> + Footer
│  │
│  ├─ pages/                   # 1 thư mục = 1 trang, khớp với 1 route
│  │  ├─ Home/                 # "/"        → chỉ render <Hero/>
│  │  ├─ About/                # "/about"   → bio đầy đủ + nút tải CV
│  │  ├─ Skills/                # "/skills"  → kỹ năng theo nhóm Frontend/Backend/Mobile/Tools
│  │  ├─ Projects/              # "/projects" → dự án, chia Đã hoàn thành / Đang phát triển
│  │  ├─ Experience/            # "/experience" → học vấn (timeline) + chứng chỉ
│  │  ├─ Contact/               # "/contact" → card Email/GitHub/Facebook/Zalo
│  │  └─ NotFound/              # "*" → trang 404
│  │
│  ├─ components/
│  │  ├─ layout/
│  │  │  ├─ Navbar/            # menu + logo (bấm vào phóng to)
│  │  │  └─ Footer/
│  │  ├─ sections/
│  │  │  └─ Hero/               # khối giới thiệu ở trang Home
│  │  └─ common/
│  │     ├─ Button/             # nút dùng chung (variant: primary | outline)
│  │     └─ SectionTitle/       # tiêu đề + phụ đề cho mỗi section
│  │
│  ├─ data/                     # "nguồn dữ liệu" tĩnh, không có API
│  │  ├─ profile.js             # tên, vai trò, avatar, bio, quote, resume...
│  │  ├─ skills.js               # kỹ năng theo nhóm: frontend/backend/mobile/tools
│  │  ├─ education.js            # học vấn (trường, chuyên ngành, thời gian)
│  │  ├─ certificates.js         # chứng chỉ (tên, trạng thái, ảnh - có thể null)
│  │  ├─ projects.js             # dự án, chia completed / inProgress
│  │  └─ social.js               # link GitHub / Facebook / Zalo / email
│  │
│  ├─ assets/
│  │  ├─ images/                # avatar.jpg, logo.jpg
│  │  └─ resume/cv.pdf
│  │
│  └─ styles/
│     ├─ variables.css          # design tokens: màu, font-size, radius, shadow
│     ├─ reset.css
│     └─ globals.css            # import 2 file trên + style body/#root
│
├─ index.html
├─ vite.config.js
└─ package.json
```

## 2. Luồng khởi động

```
main.jsx
  └─ import "./styles/globals.css"   (load design tokens toàn cục)
  └─ <App />
       └─ <AppRoutes />
            └─ <BrowserRouter>
                 ├─ <Route element={<MainLayout />}>   ← layout dùng chung
                 │     ├─ "/"           → <Home />
                 │     ├─ "/about"      → <About />
                 │     ├─ "/skills"     → <Skills />
                 │     ├─ "/projects"   → <Projects />
                 │     ├─ "/experience" → <Experience />
                 │     └─ "/contact"    → <Contact />
                 └─ "*"                 → <NotFound />   ← nằm ngoài MainLayout
```

`MainLayout` bọc Navbar/Footer quanh `<Outlet/>`, nên mọi trang (trừ NotFound) đều tự động có Navbar + Footer mà không cần import lại.

## 3. Trang lấy dữ liệu từ đâu

```
data/profile.js ──┬──> components/sections/Hero      (tên, quote, avatar, CV, role Full Stack)
                   ├──> pages/About                    (bio, ngày sinh, email...)
                   └──> components/layout/Navbar        (alt text cho logo)

data/skills.js ────> pages/Skills                       (nhóm Frontend/Backend/Mobile/Tools → icon)

data/education.js ─> pages/Experience                    (timeline học vấn)
data/certificates.js ─> pages/Experience                 (grid chứng chỉ, có khung chờ ảnh)

data/projects.js ──> pages/Projects                      (2 nhóm: completed / inProgress)

data/social.js ────> pages/Contact                       (email/github/fb/zalo)
```

Nguyên tắc: **mọi thông tin cá nhân chỉ sửa 1 chỗ duy nhất trong `src/data/*`**, các trang/section chỉ import và hiển thị, không hard-code lại thông tin.

## 4. Quy ước đặt tên & style

- Mỗi component/page có **1 file `.jsx` + 1 file `.css` cùng tên**, import CSS ngay đầu file `.jsx`.
- Không dùng màu/khoảng cách "chay" (hardcode) — luôn ưu tiên biến trong `styles/variables.css`:
  `--color-primary`, `--color-surface`, `--color-text-secondary`, `--radius-md`, `--shadow`,...
- `components/common` = tái sử dụng nhiều nơi (Button, SectionTitle).
- `components/sections` = khối nội dung thuộc về 1 trang cụ thể (hiện chỉ có Hero, dùng trong Home).
- `components/layout` = khung sườn hiển thị ở mọi trang (Navbar, Footer). Navbar có menu hamburger riêng cho mobile (≤900px) và logo bấm vào phóng to được.
- Mỗi trang đều có breakpoint responsive riêng trong file `.css` của nó (thường ở `max-width: 640px` hoặc `900px`).

## 5. Việc còn dang dở

- `data/projects.js` đang là **dữ liệu mẫu** (3 dự án giả) — cần thay bằng dự án thật, kèm ảnh (`image`), link demo/source khi có.
- `data/certificates.js` đang thiếu ảnh chứng chỉ thật (`image: null`) — UI đã có sẵn khung chờ, chỉ cần import ảnh và gán vào field `image`.
- `data/education.js` — trường `period` đang để "Đang cập nhật", cần điền thời gian học chính xác.
