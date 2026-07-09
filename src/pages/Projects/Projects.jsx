import { FaImage, FaGithub, FaExternalLinkAlt } from "react-icons/fa";

import "./Projects.css";

import projects from "../../data/projects";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";

function ProjectCard({ project, inProgress }) {
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
            <FaImage />
            <span>Sẽ cập nhật ảnh sau</span>
          </div>
        )}

        {inProgress && <span className="project-tag">Đang phát triển</span>}
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
              <FaExternalLinkAlt /> Demo
            </a>
          ) : (
            <span className="project-link-disabled">
              <FaExternalLinkAlt /> Demo (sắp có)
            </span>
          )}

          {project.source ? (
            <a
              href={project.source}
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub /> Source
            </a>
          ) : (
            <span className="project-link-disabled">
              <FaGithub /> Source (sắp có)
            </span>
          )}

        </div>

      </div>

    </div>
  );
}

function Projects() {
  return (
    <section className="projects-page">

      <SectionTitle
        subtitle="My Work"
        title="Dự Án"
      />

      <div className="projects-block">

        <h3 className="projects-block-title">Đã hoàn thành</h3>

        <div className="projects-grid">
          {projects.completed.map((project) => (
            <ProjectCard
              key={project.name}
              project={project}
            />
          ))}
        </div>

      </div>

      <div className="projects-block">

        <h3 className="projects-block-title">Đang phát triển</h3>

        <div className="projects-grid">
          {projects.inProgress.map((project) => (
            <ProjectCard
              key={project.name}
              project={project}
              inProgress
            />
          ))}
        </div>

      </div>

    </section>
  );
}

export default Projects;
