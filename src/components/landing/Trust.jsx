import { useRef, useState } from "react";

import useLanguage from "../../hooks/useLanguage";
import useScrollProgress from "../../hooks/useScrollProgress";
import useToggleSpring from "../../hooks/useToggleSpring";
import landing from "../../data/landing";
import profile from "../../data/profile";
import Inview from "../motion/Inview";
import { FadeWords, StackedLines } from "../motion/Reveal";
import ArrowButton from "../ui/ArrowButton";
import CarouselDots from "../ui/CarouselDots";
import Eyebrow from "../ui/Eyebrow";
import "./Trust.css";

// Parallax ngang ngược chiều của 4 từ khổng lồ: [từ %, tới %]
const WORD_PARALLAX = [
  [-3, 3],
  [3, -3],
  [-2, 4],
  [4, -3],
];

const lerp = (a, b, p) => a + (b - a) * p;

// 1 từ khổng lồ: reveal clip-mask (700ms easeOutExpo) + parallax ngang theo cuộn.
function BigWord({ word, range, sectionRef, align }) {
  const wrapRef = useRef(null);

  useScrollProgress(sectionRef, (p) => {
    if (wrapRef.current)
      wrapRef.current.style.transform = `translateX(${lerp(range[0], range[1], p).toFixed(3)}%)`;
  });

  return (
    <span ref={wrapRef} className={`big-word big-word--${align}`}>
      <StackedLines lines={[word]} duration={700} />
    </span>
  );
}

// Thẻ ở giữa của 1 slide (đặt thẳng, không nghiêng): số thứ tự, tên mảng, vai trò. 3 lớp xếp chồng, cross-fade khi đổi slide.
// (Không liệt kê công nghệ ở đây — danh sách kỹ năng chỉ nằm ở section Kỹ năng.)
function StackLayer({ slide, index, total, visible }) {
  const { tr } = useLanguage();
  const ref = useToggleSpring(
    visible,
    { opacity: 0 },
    { opacity: 1 },
    { tension: 260, friction: 26 },
  );

  return (
    <div
      ref={ref}
      className={`coach-layer coach-layer--${slide.tone}`}
      aria-hidden={!visible}
    >
      <span className="stack-code">{`0${index + 1} / 0${total}`}</span>
      <p className="stack-name">{tr(landing.programs.groups[slide.group])}</p>
      <p className="stack-role">{tr(slide.role)}</p>
    </div>
  );
}

// Section giới thiệu dạng carousel 3 slide: đổi slide sẽ phát lại reveal 4 từ khổng lồ,
// đổi đoạn bio và cross-fade thẻ giữa. Bố cục 3 cột đối xứng: từ trái — thẻ — từ phải.
function Trust() {
  const { tr } = useLanguage();
  const [index, setIndex] = useState(0);
  const sectionRef = useRef(null);
  const slides = landing.about.slides;
  const slide = slides[index];
  const words = tr(slide.headline);

  const go = (i) => setIndex((i + slides.length) % slides.length);

  return (
    <section ref={sectionRef} id="about" className="bl-trust">
      <div className="trust-top">
        <Inview>
          <Eyebrow code="SEC.02">{tr(landing.about.eyebrow)}</Eyebrow>
        </Inview>

        <Inview as="article" className="trust-card" delay={120}>
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

      <div className="trust-stage">
        <h2
          id="trust-title"
          className="trust-words"
          aria-label={words.join(" ")}
        >
          {/* key theo index -> mount lại các từ, phát lại reveal khi đổi slide */}
          <span className="words-row" key={`r1-${index}`}>
            <BigWord
              word={words[0]}
              align="left"
              range={WORD_PARALLAX[0]}
              sectionRef={sectionRef}
            />
            <BigWord
              word={words[1]}
              align="right"
              range={WORD_PARALLAX[1]}
              sectionRef={sectionRef}
            />
          </span>
          <span className="words-row" key={`r2-${index}`}>
            <BigWord
              word={words[2]}
              align="left"
              range={WORD_PARALLAX[2]}
              sectionRef={sectionRef}
            />
            <BigWord
              word={words[3]}
              align="right"
              range={WORD_PARALLAX[3]}
              sectionRef={sectionRef}
            />
          </span>
        </h2>

        <div className="trust-center">
          <Inview
            from={{ opacity: 0, y: 60, scale: 0.94 }}
            to={{ opacity: 1, y: 0, scale: 1 }}
            config={{ tension: 170, friction: 26 }}
          >
            <figure className="coach-card hud-bracket">
              {slides.map((s, i) => (
                <StackLayer
                  key={i}
                  slide={s}
                  index={i}
                  total={slides.length}
                  visible={i === index}
                />
              ))}
            </figure>
          </Inview>
        </div>
      </div>

      <Inview className="trust-controls">
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
      </Inview>
    </section>
  );
}

export default Trust;
