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
import useLanguage from "../../hooks/useLanguage";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";

// Bảng tra: tên kỹ năng (phải khớp CHÍNH XÁC với chuỗi trong data/skills.js)
// -> icon (từ react-icons/si) + màu thương hiệu tương ứng.
// Thêm kỹ năng mới: nhớ import icon Si... rồi thêm 1 dòng vào đây,
// đồng thời thêm đúng tên đó vào nhóm tương ứng trong data/skills.js.
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

// Thứ tự hiển thị các nhóm kỹ năng + key chuỗi giao diện (uiText) cho tiêu
// đề từng nhóm. key phải khớp với tên field trong data/skills.js
// (frontend/backend/mobile/tools).
const groups = [
  { key: "frontend", titleKey: "skillsGroupFrontend" },
  { key: "backend", titleKey: "skillsGroupBackend" },
  { key: "mobile", titleKey: "skillsGroupMobile" },
  { key: "tools", titleKey: "skillsGroupTools" },
];

// Render 1 hàng các "viên" (pill) kỹ năng cho 1 nhóm.
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

            {/* Nếu skill chưa có trong iconMap thì chỉ hiện chữ, không lỗi */}
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

// Trang "/skills" — liệt kê kỹ năng theo 4 nhóm: Frontend, Backend, Mobile, Tools.
function Skills() {
  const { t } = useLanguage();

  return (
    <section
      className="skills-page"
      id="skills"
    >

      <SectionTitle
        subtitle={t("skillsSubtitle")}
        title={t("skillsTitle")}
      />

      <p className="skills-intro">{t("skillsIntro")}</p>

      {/* Chỉ render nhóm nào có ít nhất 1 kỹ năng (tránh hiện tiêu đề nhóm trống) */}
      {groups.map(
        (group, index) =>
          skills[group.key]?.length > 0 && (
            <div
              key={group.key}
              className="skills-group"
            >
              <h3 className="skills-group-title">
                <span className="skills-group-code hud-readout">
                  SKL.{String(index + 1).padStart(2, "0")}
                </span>
                {t(group.titleKey)}
              </h3>

              <SkillGrid items={skills[group.key]} />
            </div>
          ),
      )}

    </section>
  );
}

export default Skills;
