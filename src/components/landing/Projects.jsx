import useLanguage from "../../hooks/useLanguage";
import landing from "../../data/landing";
import projects from "../../data/projects";
import Inview from "../motion/Inview";
import Hover from "../motion/Hover";
import { FadeWords, StackedLines } from "../motion/Reveal";
import { BrandMark } from "../ui/Icons";
import ProjectArt from "../ui/ProjectArt";
import "./Projects.css";

// Dự án hiển thị: dự án hoàn thành đầu tiên + dự án đang phát triển đầu tiên.
// tone "navy"/"teal" quyết định màu nền thẻ và màu kính của chú thích.
function pickProjects(t) {
  const done = projects.completed[0];
  const wip = projects.inProgress[0];
  return [
    done && { ...done, tone: "navy", status: t("projectsTabCompleted") },
    wip && { ...wip, tone: "teal", status: t("projectsTabInProgress") },
  ].filter(Boolean);
}

// Dự án có Flutter -> minh hoạ ứng dụng di động, còn lại -> trang web
const artFor = (project) => (project.tech.some((t) => /flutter|dart|android|ios/i.test(t)) ? "mobile" : "web");

function ProjectCard({ project, index }) {
  const { tr, t } = useLanguage();
  const href = project.demo || project.source;
  const Wrapper = href ? "a" : "div";
  const linkProps = href ? { href, target: "_blank", rel: "noreferrer" } : {};

  return (
    <Inview
      as="figure"
      className={`court-card${index === 1 ? " court-card--offset" : ""}`}
      from={{ opacity: 0, y: 48 }}
      to={{ opacity: 1, y: 0 }}
      delay={index * 140}
      config={{ tension: 180, friction: 26 }}
    >
      <Hover
        className="court-hover"
        from={{ scale: 1 }}
        to={{ scale: 1.03 }}
        config={{ tension: 300, friction: 22 }}
      >
        <Wrapper
          className={`court-tile court-tile--${project.tone}`}
          {...linkProps}
        >
          <span className="court-status">{project.status}</span>
          <ProjectArt variant={artFor(project)} />

          <span className={`court-caption court-caption--${project.tone}`}>
            <span className="court-name">{tr(project.name)}</span>
            <span className="court-desc">{tr(project.description)}</span>
            {href && (
              <span className="court-link">{project.demo ? t("projectViewLive") : t("projectSource")} →</span>
            )}
          </span>
        </Wrapper>
      </Hover>
    </Inview>
  );
}

// Section Dự án: cột giới thiệu (ảnh nhỏ + tiêu đề 3 dòng + đoạn mô tả từng từ) và
// 2 thẻ dự án so le nhau, thẻ thứ hai lệch xuống 2rem. Phần nền bo góc chồng nhẹ lên section trước.
function Projects() {
  const { tr, t } = useLanguage();
  const items = pickProjects(t);

  return (
    <section
      id="projects"
      className="bl-projects panel bracket"
    >
      <div className="projects-grid">
        <div className="projects-intro">
          <Inview
            className="projects-icon"
            from={{ opacity: 0, scale: 0.85 }}
            to={{ opacity: 1, scale: 1 }}
            config={{ tension: 240, friction: 20 }}
          >
            <BrandMark />
          </Inview>

          <StackedLines
            as="h2"
            id="facilities-title"
            className="section-title projects-title"
            lines={tr(landing.projects.title)}
            stagger={120}
          />

          <FadeWords
            className="projects-body"
            text={tr(landing.projects.body)}
            wordStagger={28}
            baseDelay={250}
            duration={700}
          />
        </div>

        <div className="projects-cards">
          {items.map((project, i) => (
            <ProjectCard
              key={project.tone}
              project={project}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
