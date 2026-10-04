import useLanguage from "../../hooks/useLanguage";
import useUi from "../../hooks/useUi";
import landing from "../../data/landing";
import profile from "../../data/profile";
import Header from "../shell/Header";
import Inview from "../motion/Inview";
import { ClipWords, StackedLines } from "../motion/Reveal";
import PillButton from "../ui/PillButton";
import "./Hero.css";

// Hero (nền chung của site là <Background /> cố định phía sau, hero chỉ là khung kính trong suốt):
//  - hàng nhận diện: mã mục + vai trò + vị trí
//  - tên khổng lồ reveal theo từ
//  - mô tả ngắn + 2 nút (Liên hệ, Xem CV)
//  - đáy: tagline
// Mọi thứ chờ loader xong (cờ `ready`) mới animate vào. Kỹ năng / điểm thực tập / dự án
// KHÔNG lặp lại ở đây — mỗi thông tin chỉ xuất hiện ở đúng 1 section của nó.
function Hero() {
  const { tr } = useLanguage();
  const { ready, openContact } = useUi();

  return (
    <section id="home" className="bl-hero hud-panel hud-panel--clear hud-bracket">
      <Header />

      <div className="hero-title-wrap">
        <Inview className="hero-id" delay={150} enabled={ready}>
          <span className="hero-id-text">
            <span className="eyebrow-code">SEC.01 · HOME</span>
            <span>
              {tr(profile.role)} · {tr(profile.location)}
            </span>
          </span>
        </Inview>

        <ClipWords
          as="h1"
          id="hero-title"
          className="hero-title"
          text={profile.fullName}
          wordStagger={140}
          duration={1100}
          enabled={ready}
        />
      </div>

      <Inview className="hero-intro" delay={500} enabled={ready}>
        <p className="hero-desc">{tr(profile.description)}</p>

        <div className="hero-actions">
          <PillButton variant="light" onClick={openContact}>
            {tr(landing.shell.contactCta)}
          </PillButton>
          <PillButton
            variant="outline"
            as="a"
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
          >
            {tr(landing.shell.viewCv)}
          </PillButton>
        </div>
      </Inview>

      <div className="hero-bottom">
        <StackedLines
          as="p"
          className="hero-tagline"
          lines={tr(landing.hero.tagline)}
          baseDelay={350}
          stagger={110}
          duration={900}
          enabled={ready}
        />
      </div>
    </section>
  );
}

export default Hero;
