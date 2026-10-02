import { createContext } from "react";

// Trạng thái giao diện dùng chung cho các lớp phủ & loader:
//  - ready       : loader đã xong (các khối hero chờ cờ này để animate vào)
//  - menuOpen    : menu toàn màn hình
//  - contactOpen : modal liên hệ
const UiContext = createContext(null);

export default UiContext;
