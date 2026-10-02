import { useRef, useState } from "react";

import useLanguage from "../../hooks/useLanguage";
import useScrollProgress from "../../hooks/useScrollProgress";
import useToggleSpring from "../../hooks/useToggleSpring";
import landing from "../../data/landing";
import profile from "../../data/profile";
import skills from "../../data/skills";
import Inview from "../motion/Inview";
import { FadeWords, StackedLines } from "../motion/Reveal";
import ArrowButton from "../ui/ArrowButton";
import CarouselDots from "../ui/CarouselDots";
import "./Trust.css";

// Parallax ngang ngược chiều của 4 từ ghost: [từ %, tới %]
const GHOST_PARALLAX = [
  [-3, 3],
  [3, -3],
  [-2, 4],
  [4, -3],
];

const lerp = (a, b, p) => a + (b - a) * p;

// 1 từ khổng lồ: reveal clip-mask (700ms easeOutExpo) + parallax ngang theo cuộn.
function GhostWord({ word, ink, range, sectionRef }) {
  const wrapRef = useRef(null);

  useScrollProgress(sectionRef, (p) => {
    if (wrapRef.current) wrapRef.current.style.transform = `translateX(${lerp(range[0], range[1], p).toFixed(3)}%)`;
  });

  return (
    <span
      ref={wrapRef}
      className={`ghost-word${ink ? " ghost-word--ink" : ""}`}
    >
      <StackedLines
        lines={[word]}
        duration={700}
      />
    </span>
  );
}

// Thẻ "stack" của 1 slide (thay cho ảnh): mã mục, tên mảng, danh sách công nghệ và vai trò.
// 3 lớp xếp chồng và cross-fade khi đổi slide.
function StackLayer({ slide, index, visible }) {
  const { tr } = useLanguage();
  const ref = useToggleSpring(visible, { opacity: 0 }, { opacity: 1 }, { tension: 260, friction: 26 });
  const group = tr(landing.programs.groups[slide.group]);

  return (
    <div
      ref={ref}
      className={`coach-layer coach-layer--${slide.tone}`}
      aria-hidden={!visible}
    >
      <span className="stack-code">{`STACK.0${index + 1}`}</span>
      <p className="stack-name">{group}</p>

      <ul className="stack-chips">
        {skills[slide.group].map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <figcaption className="coach-caption">
        <span className="coach-name">{profile.fullName}</span>
        <span className="coach-role">{tr(slide.role)}</span>
      </figcaption>
    </div>
  );
}

// Section giới thiệu dạng carousel 3 slide (Frontend / Backend / Mobile): đổi
// slide sẽ phát lại reveal các từ ghost, đổi đoạn bio và cross-fade ảnh.
function Trust() {
  const { tr } = useLanguage();
  const [index, setIndex] = useState(0);
  const sectionRef = useRef(null);
  const slides = landing.about.slides;
  const slide = slides[index];
  const words = tr(slide.headline);

  const go = (i) => setIndex((i + slides.length) % slides.length);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bl-trust"
    >
      <div className="trust-badges">
        <Inview
          className="trust-percent"
          from={{ opacity: 0, scale: 0.9 }}
          to={{ opacity: 1, scale: 1 }}
          config={{ tension: 220, friction: 22 }}
        >
          <p className="trust-percent-value">{landing.about.badgeValue}</p>
          <p className="trust-percent-caption">{tr(landing.about.badgeCaption)}</p>
        </Inview>

        <Inview
          as="article"
          className="trust-card"
          from={{ opacity: 0, y: 24 }}
          to={{ opacity: 1, y: 0 }}
          delay={120}
          config={{ tension: 200, friction: 26 }}
        >
          <span className="trust-chip">{`#0${index + 1}`}</span>
          <div>
            <h3 className="trust-card-title">{tr(slide.title)}</h3>
            <FadeWords
              key={index}
              className="trust-card-body"
              text={tr(profile.bio[slide.bioIndex])}
              baseDelay={0}
              wordStagger={14}
              duration={600}
            />
          </div>
        </Inview>
      </div>

      <h2
        id="trust-title"
        className="trust-ghost"
        aria-label={words.join(" ")}
      >
        {/* key theo index -> mount lại các từ, phát lại reveal khi đổi slide */}
        <span
          className="ghost-row"
          key={`r1-${index}`}
        >
          <GhostWord
            word={words[0]}
            range={GHOST_PARALLAX[0]}
            sectionRef={sectionRef}
          />
          <GhostWord
            word={words[1]}
            range={GHOST_PARALLAX[1]}
            sectionRef={sectionRef}
          />
        </span>
        <span
          className="ghost-row"
          key={`r2-${index}`}
        >
          <GhostWord
            word={words[2]}
            ink
            range={GHOST_PARALLAX[2]}
            sectionRef={sectionRef}
          />
          <GhostWord
            word={words[3]}
            range={GHOST_PARALLAX[3]}
            sectionRef={sectionRef}
          />
        </span>
      </h2>

      <div className="trust-center">
        <Inview
          from={{ opacity: 0, y: 60, scale: 0.92 }}
          to={{ opacity: 1, y: 0, scale: 1 }}
          config={{ tension: 170, friction: 26 }}
        >
          <figure className="coach-card">
            {slides.map((s, i) => (
              <StackLayer
                key={i}
                slide={s}
                index={i}
                visible={i === index}
              />
            ))}
          </figure>
        </Inview>
      </div>

      <div className="trust-controls">
        <ArrowButton
          direction="prev"
          variant="outline"
          label="Previous"
          onClick={() => go(index - 1)}
        />
        <CarouselDots
          count={slides.length}
          active={index}
          onSelect={go}
          label="About slides"
        />
        <ArrowButton
          direction="next"
          variant="solid"
          label="Next"
          onClick={() => go(index + 1)}
        />
      </div>
    </section>
  );
}

export default Trust;
