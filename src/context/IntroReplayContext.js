import { createContext } from "react";

// Context để các component NẰM BÊN TRONG <BrowserRouter> (ví dụ
// ReplayIntroButton, cần dùng useLocation để biết đang ở trang nào) có thể
// gọi ngược lại hàm "phát lại intro" đang giữ state ở App.jsx — vì App.jsx
// nằm NGOÀI <BrowserRouter> (BrowserRouter được khai báo bên trong AppRoutes)
// nên không thể dùng useLocation trực tiếp ở đó.
const IntroReplayContext = createContext(() => {});

export default IntroReplayContext;
