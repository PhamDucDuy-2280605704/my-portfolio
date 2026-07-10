import { useState } from "react";
import { FaRegCalendarAlt, FaTag, FaArrowRight } from "react-icons/fa";

import "./Journal.css";

import journal from "../../data/journal";
import usePageTitle from "../../hooks/usePageTitle";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";

// Định dạng chuỗi ngày "YYYY-MM-DD" (trong data/journal.js) thành dạng
// tiếng Việt dễ đọc, VD: "11 tháng 7, 2026".
function formatDate(dateStr) {
  const date = new Date(dateStr);

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Trang "/journal" — danh sách bài viết cá nhân (data/journal.js).
// Mỗi bài chỉ hiện đoạn tóm tắt (excerpt) trước; bấm "Đọc tiếp" mới render
// toàn bộ nội dung (entry.content) — dùng state openId để chỉ mở 1 bài tại 1 lúc.
function Journal() {
  usePageTitle("Nhật Ký | Phạm Đức Duy");

  // id của bài đang được mở rộng (null = chưa mở bài nào).
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

              {/* Chỉ render phần nội dung đầy đủ khi bài này đang được mở */}
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
