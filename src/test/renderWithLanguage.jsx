import { render } from "@testing-library/react";

import LanguageProvider from "../context/LanguageProvider";

// Kể từ khi có tính năng đa ngôn ngữ, hầu hết component đều gọi useLanguage()
// (qua t()/tr()) nên phải render bên trong <LanguageProvider> mới không lỗi
// "useLanguage phải được dùng bên trong <LanguageProvider>". Dùng hàm này
// thay cho render() thẳng của Testing Library ở mọi test có component dùng
// useLanguage (trực tiếp hoặc gián tiếp qua component con).
function renderWithLanguage(ui, options) {
  return render(ui, { wrapper: LanguageProvider, ...options });
}

export default renderWithLanguage;
