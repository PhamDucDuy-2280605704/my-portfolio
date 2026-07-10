import Hero from "../../components/sections/Hero/Hero";
import usePageTitle from "../../hooks/usePageTitle";

// Trang chủ ("/") — chỉ gồm section Hero (không có section About nữa,
// phần giới thiệu đầy đủ đã tách riêng sang trang /about).
function Home() {
  usePageTitle("Phạm Đức Duy | Full Stack Developer");

  return <Hero />;
}

export default Home;