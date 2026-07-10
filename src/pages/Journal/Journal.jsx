import { useState } from "react";
import { FaRegCalendarAlt, FaTag, FaArrowRight } from "react-icons/fa";

import "./Journal.css";

import journal from "../../data/journal";
import usePageTitle from "../../hooks/usePageTitle";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";

function formatDate(dateStr) {
  const date = new Date(dateStr);

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function Journal() {
  usePageTitle("Nhật Ký | Phạm Đức Duy");

  const [openId, setOpenId] = useState(null);

  return (
    <section className="journal-page">

      <SectionTitle
        subtitle="Ghi Chép Của Mình"
        title="Nhật Ký"
      />

      <p className="journal-intro">
        Nơi mình ghi lại quá trình học tập, những dự án đã và đang làm, cùng vài suy nghĩ trên chặng đường trở thành Full Stack Developer.
      </p>

      <div className="journal-list">

        {journal.map((entry) => {
          const isOpen = openId === entry.id;

          return (
            <article
              key={entry.id}
              className={`journal-card ${isOpen ? "open" : ""}`}
            >

              <div className="journal-meta">
                <span>
                  <FaRegCalendarAlt /> {formatDate(entry.date)}
                </span>

                <div className="journal-tags">
                  {entry.tags.map((tag) => (
                    <span key={tag}>
                      <FaTag /> {tag}
                    </span>
                  ))}
                </div>
              </div>

              <h3>{entry.title}</h3>

              <p className="journal-excerpt">{entry.excerpt}</p>

              {isOpen && (
                <div className="journal-content">
                  {entry.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="journal-toggle"
                onClick={() => setOpenId(isOpen ? null : entry.id)}
              >
                {isOpen ? "Thu gọn" : "Đọc tiếp"} <FaArrowRight />
              </button>

            </article>
          );
        })}

      </div>

    </section>
  );
}

export default Journal;
