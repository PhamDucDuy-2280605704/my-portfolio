import { FaImage } from "react-icons/fa";

import "./Experience.css";

import education from "../../data/education";
import certificates from "../../data/certificates";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";

function StatusBadge({ status }) {
  const isDone = status === "completed";

  return (
    <span className={`status-badge ${isDone ? "done" : "progress"}`}>
      {isDone ? "Đã hoàn thành" : "Đang học"}
    </span>
  );
}

function Experience() {
  return (
    <section className="experience-page">

      <SectionTitle
        subtitle="My Journey"
        title="Học Vấn & Chứng Chỉ"
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

        <h3 className="experience-block-title">Chứng chỉ & Kỹ năng</h3>

        <div className="certificate-grid">

          {certificates.map((cert) => (
            <div
              key={cert.name}
              className="certificate-card"
            >

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
