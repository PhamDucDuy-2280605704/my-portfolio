import { useEffect } from "react";

import Hero from "../../components/landing/Hero";
import Trust from "../../components/landing/Trust";
import Programs from "../../components/landing/Programs";
import Projects from "../../components/landing/Projects";
import Stats from "../../components/landing/Stats";
import Journal from "../../components/landing/Journal";
import usePageTitle from "../../hooks/usePageTitle";
import useLanguage from "../../hooks/useLanguage";
import useUi from "../../hooks/useUi";
import { scrollToId } from "../../lib/lenis";

// Trang chủ duy nhất của site — bố cục Baseline, thứ tự:
//   Hero (#home) → Trust/Giới thiệu (#about) → Programs/Kỹ năng (#skills) →
//   Projects (#projects) → Stats + Hành trình (#experience) → Journal (#journal)
// Footer (#contact) nằm ở MainLayout. Mỗi section tự mang id để menu/nav neo tới.
function Home() {
  const { t } = useLanguage();
  const { ready } = useUi();
  usePageTitle(t("homePageTitle"));

  // URL có sẵn hash lúc vào trang (VD link cũ "/about" -> "/#about" do
  // AppRoutes redirect): đợi loader xong (đã mở khoá cuộn) rồi cuộn tới đúng section.
  useEffect(() => {
    if (!ready) return undefined;
    const hash = window.location.hash;
    if (!hash) return undefined;
    const id = setTimeout(() => scrollToId(hash.slice(1)), 120);
    return () => clearTimeout(id);
  }, [ready]);

  return (
    <>
      <Hero />
      <Trust />
      <Programs />
      <Projects />
      <Stats />
      <Journal />
    </>
  );
}

export default Home;
