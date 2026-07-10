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

// Thứ tự hiển thị các nhóm kỹ năng + tiêu đề tiếng Việt cho từng nhóm.
// key phải khớp với tên field trong data/skills.js (frontend/backend/mobile/tools).
const groups = [
  { key: "frontend", title: "Giao Diện" },
  { key: "backend", title: "Hệ Thống" },
  { key: "mobile", title: "Di Động" },
  { key: "tools", title: "Công Cụ" },
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

      {/* Chỉ render nhóm nào có ít nhất 1 kỹ năng (tránh hiện tiêu đề nhóm trống) */}
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
