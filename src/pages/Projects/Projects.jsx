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
import usePageTitle from "../../hooks/usePageTitle";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";

const tabs = [
  { key: "completed", label: "Đã hoàn thành", icon: FaCheckCircle },
  { key: "inProgress", label: "Đang phát triển", icon: FaHourglassHalf },
];

function ProjectCard({ project }) {
  return (
    <div className="project-card">

      <div className="project-image">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
          />
        ) : (
          <div className="project-placeholder">
            <span className="project-placeholder-icon">
              <FaCode />
            </span>
            <span className="project-placeholder-text">Ảnh xem trước sẽ cập nhật sau</span>
          </div>
        )}
      </div>

      <div className="project-info">

        <h3>{project.name}</h3>

        <p>{project.description}</p>

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
            >
              <FaExternalLinkAlt /> Xem trực tiếp
            </a>
          ) : (
            <span className="project-link-disabled">
              <FaExternalLinkAlt /> Sắp ra mắt
            </span>
          )}

          {project.source ? (
            <a
              href={project.source}
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub /> Mã nguồn
            </a>
          ) : (
            <span className="project-link-disabled">
              <FaGithub /> Đang cập nhật
            </span>
          )}

        </div>

      </div>

    </div>
  );
}

function Projects() {
  usePageTitle("Dự Án | Phạm Đức Duy");

  const [activeTab, setActiveTab] = useState("completed");

  const activeList = projects[activeTab] ?? [];

  return (
    <section className="projects-page">

      <SectionTitle
        subtitle="Dự Án Của Mình"
        title="Dự Án"
      />

      <div className="projects-tabs">

        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            className={`projects-tab ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            <Icon />
            {label}
            <span className="projects-tab-count">{projects[key]?.length ?? 0}</span>
          </button>
        ))}

      </div>

      {activeList.length > 0 ? (
        <div className="projects-grid">
          {activeList.map((project) => (
            <ProjectCard
              key={project.name}
              project={project}
            />
          ))}
        </div>
      ) : (
        <div className="projects-empty">
          <FaFolderOpen />
          <p>Chưa có dự án nào ở mục này.</p>
        </div>
      )}

    </section>
  );
}

export default Projects;
