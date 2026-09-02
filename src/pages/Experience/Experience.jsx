import { FaImage, FaBriefcase, FaFileAlt } from "react-icons/fa";

import "./Experience.css";

import education from "../../data/education";
import workExperience from "../../data/workExperience";
import certificates from "../../data/certificates";
import useLanguage from "../../hooks/useLanguage";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";
import HudFrame from "../../components/common/HudFrame/HudFrame";
import { playUiSound } from "../../utils/uiSound";

// Nhãn trạng thái nhỏ cho mỗi chứng chỉ: "Đã hoàn thành" (xanh lá) hoặc "Đang học" (xanh dương).
function StatusBadge({ status }) {
  const { t } = useLanguage();
  const isDone = status === "completed";

  return (
    <span className={`status-badge ${isDone ? "done" : "progress"}`}>
      {isDone ? t("statusDone") : t("statusInProgress")}
    </span>
  );
}

// Tiêu đề khối kèm mã hiệu HUD nhỏ phía trước (VD "EDU // Học vấn"),
// dùng chung cho cả 3 khối trong trang để đồng bộ với các trang khác
// (Skills đã dùng cùng kiểu mã hiệu SKL.0x).
function BlockTitle({ code, children }) {
  return (
    <h3 className="experience-block-title">
      <span className="experience-block-code hud-readout">{code}</span>
      {children}
    </h3>
  );
}

// Trang "/experience" — gồm 2 khối: timeline Học vấn (data/education.js)
// và lưới Chứng chỉ & Kỹ năng (data/certificates.js).
function Experience() {
  const { t, tr } = useLanguage();

  return (
    <section className="experience-page" id="experience">

      <SectionTitle
        subtitle={t("experienceSubtitle")}
        title={t("experienceTitle")}
      />

      <div className="experience-block">

        <BlockTitle code="EDU">{t("educationBlockTitle")}</BlockTitle>

        <div className="timeline">

          {education.map((item) => (
            <div
              key={tr(item.school)}
              className="timeline-item"
            >
              <div className="timeline-dot" />

              <div className="timeline-content">
                <span className="timeline-period">{tr(item.period)}</span>
                <h4>{tr(item.school)}</h4>
                <p>{tr(item.major)}</p>
              </div>
            </div>
          ))}

        </div>

      </div>

      <div className="experience-block">

        <BlockTitle code="EXP">{t("workBlockTitle")}</BlockTitle>

        <div className="work-list">

          {workExperience.map((job, index) => (
            <HudFrame
              key={tr(job.company)}
              label={`EXP.${String(index + 1).padStart(2, "0")}`}
              className="work-card"
            >

              <div className="work-card-header">
                <span className="work-card-icon">
                  <FaBriefcase />
                </span>

                <div>
                  <h4>{tr(job.role)}</h4>
                  <p className="work-card-company">{tr(job.company)}</p>
                </div>

                <span className="work-card-period">{job.period}</span>
              </div>

              <ul className="work-card-highlights">
                {job.highlights.map((point, i) => (
                  <li key={i}>{tr(point)}</li>
                ))}
              </ul>

              <div className="work-card-footer">
                <div className="work-card-tech">
                  {job.tech.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <div className="work-card-footer-right">
                  {job.report ? (
                    <a
                      href={job.report}
                      download
                      className="work-card-report"
                      onClick={() => playUiSound("card")}
                    >
                      <FaFileAlt /> {t("downloadReport")}
                    </a>
                  ) : (
                    <span className="work-card-report work-card-report-disabled">
                      <FaFileAlt /> {t("reportComingSoon")}
                    </span>
                  )}

                  {job.score && (
                    <span className="work-card-score">{t("scoreLabel")}: {job.score}</span>
                  )}
                </div>
              </div>

            </HudFrame>
          ))}

        </div>

      </div>

      <div className="experience-block">

        <BlockTitle code="CERT">{t("certBlockTitle")}</BlockTitle>

        <div className="certificate-grid">

          {certificates.map((cert, index) => (
            <HudFrame
              key={tr(cert.name)}
              label={`CERT.${String(index + 1).padStart(2, "0")}`}
              className="certificate-card"
            >

              {/* cert.image = null -> hiện khung chờ (placeholder), sau này chỉ cần
                  import ảnh thật rồi gán vào field image trong data/certificates.js */}
              <div className="certificate-image">
                {cert.image ? (
                  <img
                    src={cert.image}
                    alt={tr(cert.name)}
                  />
                ) : (
                  <div className="certificate-placeholder">
                    <FaImage />
                    <span>{t("certImageComingSoon")}</span>
                  </div>
                )}
              </div>

              <div className="certificate-info">
                <h4>{tr(cert.name)}</h4>
                <StatusBadge status={cert.status} />
              </div>

            </HudFrame>
          ))}

        </div>

      </div>

    </section>
  );
}

export default Experience;
