import Hero from "../../components/sections/Hero/Hero";
import usePageTitle from "../../hooks/usePageTitle";

function Home() {
  usePageTitle("Phạm Đức Duy | Full Stack Developer");

  return <Hero />;
}

export default Home;