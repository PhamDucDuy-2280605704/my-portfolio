import { Outlet } from "react-router-dom";

import Background from "../components/common/Background/Background";
import ContactModal from "../components/shell/ContactModal";
import Footer from "../components/shell/Footer";
import UiverseLoader from "../components/shell/UiverseLoader"; 
import MenuOverlay from "../components/shell/MenuOverlay";
import UiProvider from "../context/UiProvider";
import useLanguage from "../hooks/useLanguage";

// Layout chung của trang chủ (design system Baseline). Mọi thứ nằm trong
// <div class="bl"> — token màu/typography của Baseline chỉ áp dụng trong đó,
// nên các route khác (/zone, 404) giữ nguyên giao diện riêng.
//
//  - UiverseLoader : màn intro với 12 dot xoay 3D, mở khoá cuộn khi xong.
//  - <main>        : padding quanh để các section hiện như thẻ bo góc; chứa
//                    trang hiện tại (<Outlet />) và Footer.
//  - MenuOverlay / ContactModal : lớp phủ, render qua portal ở cấp body.
function MainLayout() {
  const { t } = useLanguage();

  return (
    <UiProvider>
      <div className="bl">
        {/* Nền HUD cố định toàn trang (lưới, quầng sáng, hạt sáng, scanline, góc khung) */}
        <Background />

        <UiverseLoader />  

        <a
          href="#main-content"
          className="skip-to-content"
        >
          {t("skipToContent")}
        </a>

        <main
          id="main-content"
          className="bl-main"
        >
          <Outlet />
          <Footer />
        </main>

        <MenuOverlay />
        <ContactModal />
      </div>
    </UiProvider>
  );
}

export default MainLayout;