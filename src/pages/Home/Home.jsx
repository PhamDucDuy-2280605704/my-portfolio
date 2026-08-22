import { useEffect } from "react";

import Hero from "../../components/sections/Hero/Hero";
import About from "../About/About";
import Skills from "../Skills/Skills";
import Projects from "../Projects/Projects";
import Experience from "../Experience/Experience";
import Journal from "../Journal/Journal";
import Contact from "../Contact/Contact";
import usePageTitle from "../../hooks/usePageTitle";
import { getLenisInstance } from "../../lib/lenis";

// Trang chủ duy nhất của site — thay vì mỗi mục (About, Skills, Projects...)
// là 1 route riêng như trước, giờ TẤT CẢ được ghép chung vào đây thành 1
// trang dài, cuộn từ trên xuống dưới (kiểu one-page portfolio). Navbar bấm
// vào mục nào sẽ cuộn thẳng tới section id tương ứng (xem Navbar.jsx), thay
// vì điều hướng sang route khác.
//
// Mỗi section tự có id riêng ngay trên thẻ <section> gốc của nó
// (home/about/skills/projects/experience/journal/contact) để neo (anchor)
// tới được từ menu.
function Home() {
  usePageTitle("Phạm Đức Duy | Full Stack Developer");

  // Nếu URL có sẵn hash lúc vào trang (VD ai đó bấm link cũ "/about" ->
  // AppRoutes.jsx redirect thành "/#about") thì cuộn thẳng tới đúng section
  // đó. Cần làm bằng tay vì <Navigate> của React Router chỉ đổi URL bằng
  // History API, KHÔNG tự cuộn tới hash như khi tải lại trang thật.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const target = document.getElementById(hash.slice(1));
    if (target) {
      // Đợi 1 nhịp để layout (đặc biệt là ảnh trong Hero) ổn định vị trí
      // trước khi cuộn, tránh cuộn tới sai chỗ do trang còn đang "nhảy" layout.
      requestAnimationFrame(() => {
        const lenis = getLenisInstance();
        if (lenis) {
          lenis.scrollTo(target, { immediate: false });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }, []);

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Journal />
      <Contact />
    </>
  );
}

export default Home;
