import useLanguage from "../../hooks/useLanguage";
import landing from "../../data/landing";
import skills from "../../data/skills";
import { scrollToId } from "../../lib/lenis";
import Inview from "../motion/Inview";
import useHoverSpring from "../../hooks/useHoverSpring";
import { StackedLines } from "../motion/Reveal";
import Eyebrow from "../ui/Eyebrow";
import { ArrowRight } from "../ui/Icons";
import "./Programs.css";

const GROUPS = ["frontend", "backend", "mobile", "tools"];

// 1 hàng kỹ năng: hover cả hàng thì mũi tên bên phải dịch sang phải + sáng lên.
function ProgramRow({ group, index }) {
  const { tr } = useLanguage();
  const { ref, bind } = useHoverSpring({ x: 0, opacity: 0.55 }, { x: 8, opacity: 1 }, { tension: 300, friction: 20 });

  return (
    <li>
      <a
        className="program-link"
        href="#projects"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("projects");
        }}
        {...bind}
      >
        <Inview
          className="program-row"
          from={{ opacity: 0, y: 26 }}
          to={{ opacity: 1, y: 0 }}
          delay={index * 90}
          config={{ tension: 190, friction: 26 }}
        >
          <span className="program-index">{String(index + 1).padStart(2, "0")}</span>
          <span className="program-text">
            <span className="program-name">{tr(landing.programs.groups[group])}</span>
            <span className="program-desc">{skills[group].join(", ")}</span>
          </span>
          <span className="program-go">
            <span
              ref={ref}
              style={{ display: "inline-flex" }}
            >
              <ArrowRight />
            </span>
          </span>
        </Inview>
      </a>
    </li>
  );
}

// Section Kỹ năng: danh sách 4 nhóm, mỗi hàng trượt lên lần lượt.
function Programs() {
  const { tr } = useLanguage();

  return (
    <section
      id="skills"
      className="bl-programs panel bracket"
    >
      <Eyebrow code="SEC.03">{tr(landing.programs.eyebrow)}</Eyebrow>
      <StackedLines
        as="h2"
        id="programs-title"
        className="section-title"
        lines={tr(landing.programs.title)}
      />

      <ul className="program-list">
        {GROUPS.map((group, i) => (
          <ProgramRow
            key={group}
            group={group}
            index={i}
          />
        ))}
      </ul>
    </section>
  );
}

export default Programs;
