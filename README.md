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
```

## Testing

Project dùng **Vitest** + **React Testing Library** để test component. Các file test nằm cạnh file component tương ứng, đặt tên `*.test.jsx` (VD: `Button.jsx` đi cùng `Button.test.jsx`).

Đã có test cho: `Button`, `SectionTitle`, hook `usePageTitle`, `Navbar` (logic ẩn/hiện logo theo route), trang `Projects` (chuyển tab), `Contact` (đủ kênh liên hệ, link đúng), `Journal` (mở/thu gọn bài viết), `NotFound`.

Test file không bị đóng gói vào bản build production (`npm run build`), chỉ chạy khi gọi `npm test`.

## Cập nhật nội dung

Không cần sửa component, chỉ cần sửa các file trong `src/data/`:

- `profile.js` — tên, vai trò, avatar, quote, mô tả, CV.
- `skills.js` — danh sách kỹ năng theo nhóm.
- `education.js` — học vấn.
- `certificates.js` — chứng chỉ (có thể gắn thêm ảnh khi có).
- `projects.js` — dự án, chia `completed` / `inProgress`.
- `social.js` — link Email/GitHub/Facebook/Zalo/Discord/TikTok + endpoint Formspree.

## Thiết lập form liên hệ (Formspree)

Trang `/contact` có form gửi tin nhắn thật qua [Formspree](https://formspree.io) (miễn phí, không cần tự viết backend):

1. Vào [formspree.io](https://formspree.io) → đăng ký bằng email của bạn.
2. Tạo 1 **Form** mới → Formspree cho 1 link dạng `https://formspree.io/f/xxxxabcd`.
3. Mở `src/data/social.js`, thay giá trị `formspree` bằng link vừa tạo.
4. Build/deploy lại — form sẽ gửi thẳng vào email bạn đã đăng ký.

Trước khi thay link thật, form vẫn hiển thị bình thường nhưng bấm "Gửi Tin Nhắn" sẽ báo lỗi (vì endpoint mặc định `YOUR_FORM_ID` không tồn tại).

## Việc còn dang dở

- Bổ sung dự án thật vào `projects.js` (hiện đang là dữ liệu mẫu).
- Bổ sung ảnh cho các chứng chỉ trong `certificates.js`.
