# My Portfolio

Trang portfolio cá nhân của **Phạm Đức Duy** — giới thiệu bản thân, kỹ năng, học vấn/chứng chỉ, dự án và thông tin liên hệ.

🔗 Repo: [PhamDucDuy-2280605704/my-portfolio](https://github.com/PhamDucDuy-2280605704/my-portfolio)

## Dự án này là gì?

Đây là một **portfolio cá nhân** dạng Single Page Application (SPA), xây dựng bằng React, dùng để giới thiệu:

- Thông tin cá nhân, vai trò (Full Stack Developer) và CV tải về.
- Kỹ năng theo từng mảng: Frontend, Backend, Mobile, Tools.
- Học vấn và chứng chỉ đã có / đang học.
- Các dự án cá nhân, chia theo trạng thái **đã hoàn thành** và **đang phát triển**.
- Kênh liên hệ: Email, GitHub, Facebook, Zalo.

Toàn bộ nội dung được quản lý tập trung trong thư mục `src/data`, không phụ thuộc backend hay CMS — chỉ cần sửa file dữ liệu là nội dung trên trang cập nhật theo.

## Công nghệ sử dụng

Dự án này (frontend hiển thị) được xây dựng với:

| Công nghệ | Vai trò |
|---|---|
| **React 19** | Thư viện dựng giao diện, chia theo component |
| **Vite** | Build tool / dev server, HMR nhanh |
| **React Router 7** | Điều hướng nhiều trang (SPA routing) |
| **React Icons** | Bộ icon (kỹ năng, mạng xã hội, UI) |
| **Axios** | Gọi API (dự phòng cho các tính năng cần fetch dữ liệu về sau) |
| **ESLint + Prettier** | Kiểm tra & format code đồng nhất |

## Kỹ năng cá nhân (ghi chú thêm)

Ngoài công nghệ dùng để build chính trang portfolio này, các kỹ năng lập trình hiện có / đang phát triển gồm:

- **Frontend**: HTML, CSS, JavaScript, React.js, Vue.js
- **Backend**: Node.js, NestJS, PHP, Python
- **Mobile**: Flutter
- **Khác**: Git, GitHub

## Cấu trúc thư mục

Xem chi tiết đầy đủ tại [`CODE_STRUCTURE.md`](./CODE_STRUCTURE.md).

```
src/
├─ pages/         # Home, About, Skills, Projects, Experience, Contact, NotFound
├─ components/    # layout (Navbar, Footer), sections (Hero), common (Button, SectionTitle)
├─ data/          # profile, skills, education, certificates, projects, social
├─ layouts/        # MainLayout (Navbar + Outlet + Footer)
├─ routes/         # khai báo route
└─ styles/         # design tokens (biến màu, font, radius, shadow)
```

## Cài đặt & chạy dự án

```bash
# Cài dependencies
npm install

# Chạy dev server (mặc định http://localhost:5173)
npm run dev

# Build bản production
npm run build

# Xem thử bản build
npm run preview

# Kiểm tra lint
npm run lint

# Chạy toàn bộ test (Vitest + React Testing Library)
npm test

# Chạy test ở chế độ theo dõi (tự chạy lại khi sửa code)
npm run test:watch

# Chạy test kèm báo cáo độ phủ (coverage)
npm run test:coverage
```

## Testing

Project dùng **Vitest** + **React Testing Library** để test component. Các file test nằm cạnh file component tương ứng, đặt tên `*.test.jsx` (VD: `Button.jsx` đi cùng `Button.test.jsx`).

Đã có test cho: `Button`, `SectionTitle`, `Footer`, `MainLayout` (Navbar + Outlet + Footer + skip-link), hook `usePageTitle`, `Navbar` (ẩn/hiện logo theo route, overlay phóng to, menu mobile), `Hero`, trang `About`, `Skills`, `Projects` (chuyển tab, đếm số lượng, trạng thái rỗng), `Contact` (đủ kênh, link đúng), `ContactForm` (gửi thành công/lỗi, mock `fetch`), `Journal` (mở/thu gọn bài viết), `NotFound`. Tổng cộng 48 test case.

Test file không bị đóng gói vào bản build production (`npm run build`), chỉ chạy khi gọi `npm test`.

## CI/CD

Có sẵn GitHub Actions (`.github/workflows/ci.yml`) — tự động chạy **lint → test → build** mỗi khi push hoặc mở Pull Request vào nhánh `main`. Nếu bước nào fail, GitHub sẽ đánh dấu đỏ ngay trên commit/PR, giúp phát hiện lỗi sớm trước khi merge.

## Accessibility

- **Skip-to-content**: nhấn Tab lần đầu trên bất kỳ trang nào sẽ hiện link "Bỏ qua đến nội dung chính", cho phép người dùng bàn phím/trình đọc màn hình nhảy thẳng vào nội dung mà không phải Tab qua hết menu.
- Thông báo gửi form liên hệ dùng `role="status"` (thành công) / `role="alert"` (lỗi) để trình đọc màn hình tự đọc to khi trạng thái thay đổi.
- Tôn trọng `prefers-reduced-motion` — tắt các animation trang trí (background, splash screen) nếu người dùng bật chế độ giảm hiệu ứng chuyển động.

## Cập nhật nội dung

Không cần sửa component, chỉ cần sửa các file trong `src/data/`:

- `profile.js` — tên, vai trò, avatar, quote, mô tả, CV.
- `skills.js` — danh sách kỹ năng theo nhóm.
- `education.js` — học vấn.
- `certificates.js` — chứng chỉ (có thể gắn thêm ảnh khi có).
- `projects.js` — dự án, chia `completed` / `inProgress`.
- `social.js` — link Email/GitHub/Facebook/Zalo/Discord/TikTok.

## Form liên hệ (Tally)

Trang `/contact` có form nhúng từ [Tally](https://tally.so) (`ContactForm.jsx`) — không cần tự viết form/backend, chỉnh câu hỏi trực tiếp trên dashboard Tally là site tự cập nhật theo.

Cách hoạt động: iframe chỉ có `data-tally-src` (chưa có `src` thật) → script `embed.js` của Tally tự quét trang và gán `src` thật vào (`Tally.loadEmbeds()`). Vì đây là SPA nên `ContactForm.jsx` tự gọi lại `loadEmbeds()` mỗi lần component mount (kể cả khi rời trang Contact rồi quay lại), không chỉ đợi script tải xong lần đầu.

Muốn đổi sang form Tally khác: vào [tally.so](https://tally.so) → mở form → **Share → Embed** → copy link dạng `https://tally.so/embed/xxxxxx` → dán đè vào hằng số `TALLY_EMBED_SRC` đầu file `src/pages/Contact/ContactForm.jsx`.

### ⚠️ Giới hạn quan trọng: nội dung BÊN TRONG form không sửa được từ code

Tiêu đề, mô tả, nhãn từng câu hỏi, nút "Submit", và dòng "Được làm với Tally" đều nằm **bên trong iframe của tally.so** — vì là iframe khác domain (cross-origin), trình duyệt **chặn tuyệt đối** mọi CSS/JS từ site của bạn chạm vào nội dung bên trong đó (lý do bảo mật, áp dụng cho mọi iframe nhúng từ domain khác, không riêng Tally).

Muốn Việt hoá nội dung form / xoá branding, phải làm trực tiếp trên tally.so:

1. Đăng nhập [tally.so](https://tally.so) → mở form `b5y9DZ`.
2. Bấm vào từng tiêu đề/nhãn câu hỏi → gõ đè lại bằng tiếng Việt → **Publish** để áp dụng.
3. Xoá khối mô tả mặc định (đoạn "This Contact Form Template allows you to collect...") nếu không cần.
4. Dòng "Được làm với Tally" chỉ ẩn được nếu nâng cấp gói **Tally Pro** (mục Settings → Branding trong form editor) — gói miễn phí bắt buộc phải hiện.

Phần **khung bao quanh** form (tiêu đề "Gửi Tin Nhắn Trực Tiếp", mô tả, màu sắc, bo góc, đổ bóng...) đã Việt hoá và style sẵn trong `ContactForm.jsx`/`ContactForm.css` — chỉnh sửa bình thường như mọi component khác.

## Việc còn dang dở

- Bổ sung dự án thật vào `projects.js` (hiện đang là dữ liệu mẫu).
- Bổ sung ảnh cho các chứng chỉ trong `certificates.js`.
