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
- `social.js` — link Email/GitHub/Facebook/Zalo/Discord/TikTok + endpoint Formspree.

## Form liên hệ (Formspree)

Trang `/contact` có form gửi tin nhắn thật qua [Formspree](https://formspree.io) (miễn phí, không cần tự viết backend) — endpoint đã cấu hình sẵn ở `src/data/social.js` (`formspree: "https://formspree.io/f/mpqvawwn"`).

Form submit qua `fetch()` (không dùng `<form action="...">` mặc định của trình duyệt), kèm header `Accept: application/json` — nhờ vậy **Formspree trả JSON thay vì chuyển hướng (redirect) sang trang khác**. Kết quả: gửi thành công hay lỗi đều hiện ngay tại chỗ (`ContactForm.jsx`), người dùng không bị rời khỏi trang.

Muốn đổi sang endpoint Formspree khác (VD: dùng tài khoản riêng của bạn): vào [formspree.io](https://formspree.io) → tạo Form mới → copy link `https://formspree.io/f/xxxxabcd` → dán đè vào giá trị `formspree` trong `src/data/social.js`.

## Việc còn dang dở

- Bổ sung dự án thật vào `projects.js` (hiện đang là dữ liệu mẫu).
- Bổ sung ảnh cho các chứng chỉ trong `certificates.js`.
