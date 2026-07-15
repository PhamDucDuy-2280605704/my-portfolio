# My Portfolio

Trang portfolio cá nhân của **Phạm Đức Duy** — giới thiệu bản thân, kỹ năng, học vấn/chứng chỉ, dự án và thông tin liên hệ.

🔗 Repo: [PhamDucDuy-2280605704/my-portfolio](https://github.com/PhamDucDuy-2280605704/my-portfolio)

## Dự án này là gì?

Đây là một **portfolio cá nhân** dạng Single Page Application (SPA), xây dựng bằng React, dùng để giới thiệu:

- Thông tin cá nhân, vai trò (Full Stack Developer) và CV tải về trực tiếp.
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

Đã có test cho: `Button`, `SectionTitle`, `Footer`, `MainLayout` (Navbar + Outlet + Footer + skip-link), hook `usePageTitle`, hook `useTheme`, `ThemeToggle`, `Navbar` (ẩn/hiện logo theo route, overlay phóng to, menu mobile), `Hero`, trang `About`, `Skills`, `Projects` (chuyển tab, đếm số lượng, trạng thái rỗng), `Experience` (học vấn, kinh nghiệm làm việc, tải báo cáo), `Contact` (đủ kênh, link đúng), `ContactForm` (gửi thành công/lỗi, honeypot chống spam, mock `fetch`), `Journal` (mở/thu gọn bài viết), `NotFound`, `PageLoader`, `ErrorBoundary`, `CornerFlourish`, `SplashScreen`. Tổng cộng 66 test case.

Test file không bị đóng gói vào bản build production (`npm run build`), chỉ chạy khi gọi `npm test`.

## Theme Sáng / Tối

Bấm icon ☀️/🌙 trên Navbar để chuyển theme — lựa chọn được lưu vào `localStorage` nên vẫn giữ nguyên ở lần ghé thăm sau. Nếu chưa từng chọn (lần đầu ghé site), tự nhận theme theo cài đặt hệ điều hành (`prefers-color-scheme`).

Cách hoạt động (`src/hooks/useTheme.js`): gán thuộc tính `data-theme="light"` lên thẻ `<html>`, các biến màu trong `src/styles/variables.css` tự đổi theo — **mọi component đã dùng `var(--color-*)` nên không cần sửa gì thêm** khi thêm trang/component mới, cứ dùng đúng biến màu là tự tương thích cả 2 theme.

## Performance & Độ ổn định

- **Code-splitting theo route**: mỗi trang (trừ Home) tự tách thành 1 file JS/CSS riêng (`React.lazy` + `Suspense`, xem `routes/AppRoutes.jsx`), chỉ tải khi người dùng thực sự vào trang đó. `<PageLoader />` hiện spinner ngắn trong lúc chờ tải (thường chỉ vài chục-trăm ms).
- **Error Boundary** (`ErrorBoundary.jsx`): nếu 1 trang bị lỗi runtime bất ngờ, hiện màn hình lỗi thân thiện + nút "Tải Lại Trang" thay vì cả site bị trắng trơn.
- **Tải CV/báo cáo trực tiếp**: nút "Tải CV" (trang About) và "Tải Báo Cáo Thực Tập" (trang Experience) dùng thuộc tính `download` — bấm là tải file PDF về máy ngay, không mở tab mới hay modal nào cả.

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
- `workExperience.js` — kinh nghiệm làm việc/thực tập (công ty, vai trò, việc đã làm, điểm đánh giá).
- `certificates.js` — chứng chỉ (có thể gắn thêm ảnh khi có).
- `projects.js` — dự án, chia `completed` / `inProgress`.
- `social.js` — link Email/GitHub/Facebook/Zalo/Discord/TikTok + endpoint Formspree.

## Form liên hệ (Formspree)

Trang `/contact` có form gửi tin nhắn thật qua [Formspree](https://formspree.io) (miễn phí, không cần tự viết backend) — endpoint đã cấu hình sẵn ở `src/data/social.js` (`formspree: "https://formspree.io/f/mpqvawwn"`).

Form submit qua `fetch()` (không dùng `<form action="...">` mặc định của trình duyệt), kèm header `Accept: application/json` — nhờ vậy **Formspree trả JSON thay vì chuyển hướng (redirect) sang trang khác**. Kết quả: gửi thành công hay lỗi đều hiện ngay tại chỗ (`ContactForm.jsx`), người dùng không bị rời khỏi trang.

**Chống spam & đảm bảo email gửi đúng nơi:**
- Trường ẩn `_gotcha` (honeypot) — bot điền form tự động thường điền vào mọi input nó thấy, kể cả trường ẩn này; nếu có giá trị, form tự huỷ gửi mà không tính vào lượt gửi miễn phí của Formspree.
- Trường ẩn `_subject` đặt sẵn tiêu đề email rõ ràng ("📬 Tin nhắn mới từ Portfolio") thay vì để Formspree tự đặt tiêu đề chung chung.
- Input `email` của người gửi được Formspree tự nhận làm địa chỉ Reply-To — bấm "Trả lời" trong Gmail sẽ gửi thẳng tới email của khách, không phải về Formspree.
- **Lần đầu tiên** nhận submit vào 1 form mới, Formspree gửi 1 email xác nhận về hộp thư bạn đăng ký — cần bấm xác nhận 1 lần thì các submit sau mới chắc chắn vào Inbox thay vì bị giữ lại/vào Spam. Nếu vẫn thấy vào mục Spam của Gmail, đánh dấu 1 email từ Formspree là "Không phải spam" — Gmail sẽ ghi nhớ cho các lần sau.

Muốn đổi sang endpoint Formspree khác (VD: dùng tài khoản riêng của bạn): vào [formspree.io](https://formspree.io) → tạo Form mới → copy link `https://formspree.io/f/xxxxabcd` → dán đè vào giá trị `formspree` trong `src/data/social.js`.

## Việc còn dang dở

- Bổ sung dự án thật vào `projects.js` (hiện đang là dữ liệu mẫu).
- Bổ sung ảnh cho các chứng chỉ trong `certificates.js`.
