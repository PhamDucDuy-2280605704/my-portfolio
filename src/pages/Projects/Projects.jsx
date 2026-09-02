import { useState } from "react";
import {
  FaCode,
  FaGithub,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaFolderOpen,
} from "react-icons/fa";

import "./Projects.css";

import projects from "../../data/projects";
import useLanguage from "../../hooks/useLanguage";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";
import HudFrame from "../../components/common/HudFrame/HudFrame";
import { playUiSound } from "../../utils/uiSound";

// 2 tab lọc dự án: "Đã hoàn thành" và "Đang phát triển".
// key phải khớp với tên field trong data/projects.js (completed/inProgress).
const tabs = [
  { key: "completed", labelKey: "projectsTabCompleted", icon: FaCheckCircle },
  { key: "inProgress", labelKey: "projectsTabInProgress", icon: FaHourglassHalf },
];

// Card hiển thị 1 dự án: ảnh (hoặc placeholder gradient+icon nếu chưa có ảnh),
// tên, mô tả, danh sách công nghệ, và 2 link Demo/Mã nguồn (tự vô hiệu hoá
// hiển thị "sắp ra mắt"/"đang cập nhật" nếu project.demo hoặc project.source là null).
// code: mã hiệu HUD (VD "PRJ.01") hiện ở góc trên trái khung, giúp mỗi card
// trông như 1 hồ sơ được đánh số trên bảng điều khiển.
function ProjectCard({ project, code }) {
  const { t, tr } = useLanguage();
  const name = tr(project.name);

  return (
    <HudFrame
      label={code}
      className="project-card"
    >

      <div className="project-image">
        {project.image ? (
          <img
            src={project.image}
            alt={name}
          />
        ) : (
          <div className="project-placeholder">
            <span className="project-placeholder-icon">
              <FaCode />
            </span>
            <span className="project-placeholder-text">{t("projectImagePlaceholder")}</span>
          </div>
        )}
      </div>

      <div className="project-info">

        <h3>{name}</h3>

        <p>{tr(project.description)}</p>

        <div className="project-tech">
          {project.tech.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>

        <div className="project-links">

          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              onClick={() => playUiSound("card")}
            >
              <FaExternalLinkAlt /> {t("projectViewLive")}
            </a>
          ) : (
            <span className="project-link-disabled">
              <FaExternalLinkAlt /> {t("projectComingSoon")}
            </span>
          )}

          {project.source ? (
            <a
              href={project.source}
              target="_blank"
              rel="noreferrer"
              onClick={() => playUiSound("card")}
            >
              <FaGithub /> {t("projectSource")}
            </a>
          ) : (
            <span className="project-link-disabled">
              <FaGithub /> {t("projectUpdating")}
            </span>
          )}

        </div>

      </div>

    </HudFrame>
  );
}

// Trang "/projects" — dùng tab để chuyển qua lại giữa 2 danh sách dự án,
// chỉ 1 danh sách hiển thị tại 1 thời điểm (activeTab quyết định).
function Projects() {
  const { t, tr } = useLanguage();
  const [activeTab, setActiveTab] = useState("completed");

  // Danh sách dự án đang hiển thị, ứng với tab đang chọn.
  const activeList = projects[activeTab] ?? [];

  return (
    <section className="projects-page" id="projects">

      <SectionTitle
        subtitle={t("projectsSubtitle")}
        title={t("projectsTitle")}
      />

      <div className="projects-tabs">

        {tabs.map(({ key, labelKey, icon: Icon }) => (
          <button
            key={key}
            type="button"
            className={`projects-tab ${activeTab === key ? "active" : ""}`}
            onClick={() => {
              playUiSound("tab");
              setActiveTab(key);
            }}
          >
            <Icon />
            {t(labelKey)}
            {/* Số lượng dự án trong nhóm, hiện ngay trên nút tab */}
            <span className="projects-tab-count">{projects[key]?.length ?? 0}</span>
          </button>
        ))}

      </div>

      {/* Nếu nhóm đang chọn chưa có dự án nào -> hiện trạng thái rỗng thay vì để trống trơn */}
      {activeList.length > 0 ? (
        <div className="projects-grid">
          {activeList.map((project, index) => (
            <ProjectCard
              key={tr(project.name)}
              project={project}
              code={`PRJ.${String(index + 1).padStart(2, "0")}`}
            />
          ))}
        </div>
      ) : (
        <div className="projects-empty">
          <FaFolderOpen />
          <p>{t("projectsEmpty")}</p>
        </div>
      )}

    </section>
  );
}

export default Projects;
