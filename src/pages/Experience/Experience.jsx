import { FaImage, FaBriefcase, FaFileAlt } from "react-icons/fa";

import "./Experience.css";

import education from "../../data/education";
import workExperience from "../../data/workExperience";
import certificates from "../../data/certificates";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";
import HudFrame from "../../components/common/HudFrame/HudFrame";
import { playUiSound } from "../../utils/uiSound";

// Nhãn trạng thái nhỏ cho mỗi chứng chỉ: "Đã hoàn thành" (xanh lá) hoặc "Đang học" (xanh dương).
function StatusBadge({ status }) {
  const isDone = status === "completed";

  return (
    <span className={`status-badge ${isDone ? "done" : "progress"}`}>
      {isDone ? "Đã hoàn thành" : "Đang học"}
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
  return (
    <section className="experience-page" id="experience">

      <SectionTitle
        subtitle="Hành Trình Của Mình"
        title="Học Vấn & Kinh Nghiệm"
      />

      <div className="experience-block">

        <BlockTitle code="EDU">Học vấn</BlockTitle>

        <div className="timeline">

          {education.map((item) => (
            <div
              key={item.school}
              className="timeline-item"
            >
              <div className="timeline-dot" />

              <div className="timeline-content">
                <span className="timeline-period">{item.period}</span>
                <h4>{item.school}</h4>
                <p>{item.major}</p>
              </div>
            </div>
          ))}

        </div>

      </div>

      <div className="experience-block">

        <BlockTitle code="EXP">Kinh nghiệm làm việc</BlockTitle>

        <div className="work-list">

          {workExperience.map((job, index) => (
            <HudFrame
              key={job.company}
              label={`EXP.${String(index + 1).padStart(2, "0")}`}
              className="work-card"
            >

              <div className="work-card-header">
                <span className="work-card-icon">
                  <FaBriefcase />
                </span>

                <div>
                  <h4>{job.role}</h4>
                  <p className="work-card-company">{job.company}</p>
                </div>

                <span className="work-card-period">{job.period}</span>
              </div>

              <ul className="work-card-highlights">
                {job.highlights.map((point, i) => (
                  <li key={i}>{point}</li>
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
                      <FaFileAlt /> Tải Báo Cáo Thực Tập
                    </a>
                  ) : (
                    <span className="work-card-report work-card-report-disabled">
                      <FaFileAlt /> Báo cáo sẽ cập nhật sau
                    </span>
                  )}

                  {job.score && (
                    <span className="work-card-score">Đánh giá: {job.score}</span>
                  )}
                </div>
              </div>

            </HudFrame>
          ))}

        </div>

      </div>

      <div className="experience-block">

        <BlockTitle code="CERT">Chứng chỉ &amp; Kỹ năng</BlockTitle>

        <div className="certificate-grid">

          {certificates.map((cert, index) => (
            <HudFrame
              key={cert.name}
              label={`CERT.${String(index + 1).padStart(2, "0")}`}
              className="certificate-card"
            >

              {/* cert.image = null -> hiện khung chờ (placeholder), sau này chỉ cần
                  import ảnh thật rồi gán vào field image trong data/certificates.js */}
              <div className="certificate-image">
                {cert.image ? (
                  <img
                    src={cert.image}
                    alt={cert.name}
                  />
                ) : (
                  <div className="certificate-placeholder">
                    <FaImage />
                    <span>Sẽ cập nhật ảnh sau</span>
                  </div>
                )}
              </div>

              <div className="certificate-info">
                <h4>{cert.name}</h4>
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
