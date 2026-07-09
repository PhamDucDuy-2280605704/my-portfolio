import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiVuedotjs,
  SiNodedotjs,
  SiNestjs,
  SiPhp,
  SiPython,
  SiFlutter,
  SiGit,
  SiGithub,
} from "react-icons/si";

import "./Skills.css";

import skills from "../../data/skills";
import usePageTitle from "../../hooks/usePageTitle";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";

const iconMap = {
  HTML: { icon: SiHtml5, color: "#e34f26" },
  CSS: { icon: SiCss, color: "#1572b6" },
  JavaScript: { icon: SiJavascript, color: "#f7df1e" },
  React: { icon: SiReact, color: "#61dafb" },
  "Vue.js": { icon: SiVuedotjs, color: "#42b883" },
  "Node.js": { icon: SiNodedotjs, color: "#5fa04e" },
  NestJS: { icon: SiNestjs, color: "#e0234e" },
  PHP: { icon: SiPhp, color: "#777bb4" },
  Python: { icon: SiPython, color: "#3776ab" },
  Flutter: { icon: SiFlutter, color: "#02569b" },
  Git: { icon: SiGit, color: "#f05032" },
  GitHub: { icon: SiGithub, color: "#f8fafc" },
};

const groups = [
  { key: "frontend", title: "Giao Diện" },
  { key: "backend", title: "Hệ Thống" },
  { key: "mobile", title: "Di Động" },
  { key: "tools", title: "Công Cụ" },
];

function SkillGrid({ items }) {
  return (
    <div className="skills-grid">

      {items.map((skill) => {
        const item = iconMap[skill];
        const Icon = item?.icon;

        return (
          <div
            key={skill}
            className="skill-card"
          >

            {Icon && (
              <Icon
                className="skill-icon"
                style={{ color: item.color }}
              />
            )}

            <p>{skill}</p>

          </div>
        );
      })}

    </div>
  );
}

function Skills() {
  usePageTitle("Kỹ Năng | Phạm Đức Duy");

  return (
    <section className="skills-page">

      <SectionTitle
        subtitle="Những Gì Mình Biết"
        title="Kỹ Năng"
      />

      <p className="skills-intro">
        Mình theo hướng Full Stack — làm việc được cả ở Frontend, Backend lẫn Mobile, tuỳ theo yêu cầu của dự án.
      </p>

      {groups.map(
        (group) =>
          skills[group.key]?.length > 0 && (
            <div
              key={group.key}
              className="skills-group"
            >
              <h3 className="skills-group-title">{group.title}</h3>

              <SkillGrid items={skills[group.key]} />
            </div>
          ),
      )}

    </section>
  );
}

export default Skills;
