import { FaImage, FaBriefcase, FaFileAlt } from "react-icons/fa";

import "./Experience.css";

import education from "../../data/education";
import workExperience from "../../data/workExperience";
import certificates from "../../data/certificates";
import usePageTitle from "../../hooks/usePageTitle";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";

// Nhãn trạng thái nhỏ cho mỗi chứng chỉ: "Đã hoàn thành" (xanh lá) hoặc "Đang học" (xanh dương).
function StatusBadge({ status }) {
  const isDone = status === "completed";

  return (
    <span className={`status-badge ${isDone ? "done" : "progress"}`}>
      {isDone ? "Đã hoàn thành" : "Đang học"}
    </span>
  );
}

// Trang "/experience" — gồm 2 khối: timeline Học vấn (data/education.js)
// và lưới Chứng chỉ & Kỹ năng (data/certificates.js).
function Experience() {
  usePageTitle("Kinh Nghiệm | Phạm Đức Duy");

  return (
    <section className="experience-page">

      <SectionTitle
        subtitle="Hành Trình Của Mình"
        title="Học Vấn & Kinh Nghiệm"
      />

      <div className="experience-block">

        <h3 className="experience-block-title">Học vấn</h3>

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

        <h3 className="experience-block-title">Kinh nghiệm làm việc</h3>

        <div className="work-list">

          {workExperience.map((job) => (
            <div
              key={job.company}
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
                {job.highlights.map((point, index) => (
                  <li key={index}>{point}</li>
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

            </div>
          ))}

        </div>

      </div>

      <div className="experience-block">

        <h3 className="experience-block-title">Chứng chỉ & Kỹ năng</h3>

        <div className="certificate-grid">

          {certificates.map((cert) => (
            <div
              key={cert.name}
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

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default Experience;
