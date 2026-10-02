import { useEffect, useState } from "react";
import { FaReact, FaNodeJs, FaMobileAlt } from "react-icons/fa";

import useLanguage from "../../hooks/useLanguage";
import useToggleSpring from "../../hooks/useToggleSpring";
import useUi from "../../hooks/useUi";
import landing from "../../data/landing";
import profile from "../../data/profile";
import skills from "../../data/skills";
import workExperience from "../../data/workExperience";
import { scrollToId } from "../../lib/lenis";
import Header from "../shell/Header";
import Inview from "../motion/Inview";
import { ClipWords, StackedLines } from "../motion/Reveal";
import CarouselDots from "../ui/CarouselDots";
import PillButton from "../ui/PillButton";
import "./Hero.css";

const AUTOPLAY_MS = 3800;
const FOCUS_ICONS = { frontend: FaReact, backend: FaNodeJs, mobile: FaMobileAlt };

// Một thẻ của slider: spring vào/ra mỗi lần đổi slide (cross-fade)
function FocusCard({ slide, visible }) {
  const { tr } = useLanguage();
  const Icon = FOCUS_ICONS[slide.id];
  const ref = useToggleSpring(
    visible,
    { opacity: 0, y: 16, scale: 0.96 },
    { opacity: 1, y: 0, scale: 1 },
    { tension: 210, friction: 24 }
  );

  return (
    <div
      ref={ref}
      className="focus-card"
      aria-hidden={!visible}
      style={{ position: visible ? "relative" : "absolute", inset: visible ? undefined : 0 }}
    >
      <span className="focus-thumb">
        <Icon />
      </span>
      <div className="focus-text">
        <p className="focus-brand">{tr(slide.brand)}</p>
        <p className="focus-title">{skills[slide.group].slice(0, 3).join(" · ")}</p>
        <a
          className="focus-cta"
          href={`#${slide.href}`}
          tabIndex={visible ? 0 : -1}
          onClick={(e) => {
            e.preventDefault();
            scrollToId(slide.href);
          }}
        >
          {tr(slide.cta)} →
        </a>
      </div>
    </div>
  );
}

// Hero (nền chung của site là <Background /> cố định phía sau, hero chỉ là khung kính trong suốt):
//  - hàng nhận diện: mã mục + vai trò + vị trí (logo và avatar nằm ở Header)
//  - tên khổng lồ reveal theo từ
//  - khối giới thiệu: nhãn Frontend/Backend/Mobile, mô tả ngắn, 2 nút (Liên hệ, Xem CV)
//  - đáy: tagline 2 dòng, slider 3 mảng chuyên môn (autoplay) và thẻ điểm thực tập
// Mọi thứ chờ loader xong (cờ `ready`) mới animate vào.
function Hero() {
  const { tr, t } = useLanguage();
  const { ready, openContact } = useUi();
  const [index, setIndex] = useState(0);
  const slides = landing.hero.focus;

  // Autoplay chỉ chạy sau khi loader xong, vòng lặp wrap-around
  useEffect(() => {
    if (!ready) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [ready, slides.length, index]);

  const score = workExperience[0]?.score;
  const scorePct = Math.max(0, Math.min(100, (parseFloat(score) || 0) * 10));

  return (
    <section
      id="home"
      className="bl-hero panel panel--clear bracket"
    >
      <Header />

      <div className="hero-title-wrap">
        <Inview
          className="hero-id"
          from={{ opacity: 0, y: 16 }}
          to={{ opacity: 1, y: 0 }}
          delay={150}
          config={{ tension: 200, friction: 26 }}
          enabled={ready}
        >
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

      <Inview
        className="hero-intro"
        from={{ opacity: 0, y: 24 }}
        to={{ opacity: 1, y: 0 }}
        delay={500}
        config={{ tension: 190, friction: 26 }}
        enabled={ready}
      >
        <ul className="hero-tags">
          {slides.map((s) => (
            <li key={s.id}>{tr(s.brand)}</li>
          ))}
        </ul>

        <p className="hero-desc">{tr(profile.description)}</p>

        <div className="hero-actions">
          <PillButton
            variant="light"
            onClick={openContact}
          >
            {tr(landing.shell.contactCta)}
          </PillButton>
          <PillButton
            variant="outline"
            as="a"
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
          >
            {tr(landing.footer.viewCv)}
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

        <div className="hero-cluster">
          <Inview
            className="focus-slider"
            from={{ opacity: 0, y: 28 }}
            to={{ opacity: 1, y: 0 }}
            delay={650}
            config={{ tension: 200, friction: 26 }}
            enabled={ready}
          >
            <div className="focus-stage">
              {slides.map((slide, i) => (
                <FocusCard
                  key={slide.id}
                  slide={slide}
                  visible={i === index}
                />
              ))}
            </div>
            <CarouselDots
              tone="light"
              count={slides.length}
              active={index}
              onSelect={setIndex}
              label={t("heroFocusLabel")}
            />
          </Inview>

          <Inview
            as="article"
            className="score-card"
            from={{ opacity: 0, y: 28 }}
            to={{ opacity: 1, y: 0 }}
            delay={780}
            config={{ tension: 200, friction: 26 }}
            enabled={ready}
          >
            <p className="score-value">{score}</p>
            <div
              className="score-bar"
              role="presentation"
            >
              <i style={{ width: `${scorePct}%` }} />
            </div>
            <p className="score-caption">{tr(landing.hero.scoreCaption)}</p>
          </Inview>
        </div>
      </div>
    </section>
  );
}

export default Hero;
