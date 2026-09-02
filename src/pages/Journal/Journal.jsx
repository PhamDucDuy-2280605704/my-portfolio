import { useState } from "react";
import { FaRegCalendarAlt, FaTag, FaArrowRight } from "react-icons/fa";

import "./Journal.css";

import journal from "../../data/journal";
import useLanguage from "../../hooks/useLanguage";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";
import HudFrame from "../../components/common/HudFrame/HudFrame";
import { playUiSound } from "../../utils/uiSound";

// Định dạng chuỗi ngày "YYYY-MM-DD" (trong data/journal.js) thành dạng
// dễ đọc theo đúng ngôn ngữ hiện tại, VD: "11 tháng 7, 2026" / "July 11, 2026".
function formatDate(dateStr, lang) {
  const date = new Date(dateStr);
  const locale = lang === "en" ? "en-US" : "vi-VN";

  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Trang "/journal" — danh sách bài viết cá nhân (data/journal.js).
// Mỗi bài chỉ hiện đoạn tóm tắt (excerpt) trước; bấm "Đọc tiếp" mới render
// toàn bộ nội dung (entry.content) — dùng state openId để chỉ mở 1 bài tại 1 lúc.
function Journal() {
  const { lang, t, tr } = useLanguage();
  // id của bài đang được mở rộng (null = chưa mở bài nào).
  const [openId, setOpenId] = useState(null);

  return (
    <section className="journal-page" id="journal">

      <SectionTitle
        subtitle={t("journalSubtitle")}
        title={t("journalTitle")}
      />

      <p className="journal-intro">{t("journalIntro")}</p>

      <div className="journal-list">

        {journal.map((entry, index) => {
          const isOpen = openId === entry.id;

          return (
            <HudFrame
              key={entry.id}
              label={`LOG.${String(index + 1).padStart(2, "0")}`}
              className={`journal-card ${isOpen ? "open" : ""}`}
            >

              <div className="journal-meta">
                <span>
                  <FaRegCalendarAlt /> {formatDate(entry.date, lang)}
                </span>

                <div className="journal-tags">
                  {entry.tags.map((tag) => (
                    <span key={tr(tag)}>
                      <FaTag /> {tr(tag)}
                    </span>
                  ))}
                </div>
              </div>

              <h3>{tr(entry.title)}</h3>

              <p className="journal-excerpt">{tr(entry.excerpt)}</p>

              {/* Chỉ render phần nội dung đầy đủ khi bài này đang được mở */}
              {isOpen && (
                <div className="journal-content">
                  {entry.content.map((paragraph, i) => (
                    <p key={i}>{tr(paragraph)}</p>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="journal-toggle"
                onClick={() => {
                  playUiSound("card");
                  setOpenId(isOpen ? null : entry.id);
                }}
              >
                {isOpen ? t("journalCollapse") : t("journalReadMore")} <FaArrowRight />
              </button>

            </HudFrame>
          );
        })}

      </div>

    </section>
  );
}

export default Journal;
