import { useState } from "react";

import useLanguage from "../../hooks/useLanguage";
import landing from "../../data/landing";
import journal from "../../data/journal";
import Inview from "../motion/Inview";
import Hover from "../motion/Hover";
import { StackedLines } from "../motion/Reveal";
import Eyebrow from "../ui/Eyebrow";
import "./Journal.css";

const MAX_CARDS = 3;

// 1 thẻ nhật ký: nhấc lên khi hover; bấm "Đọc tiếp" để xổ nội dung đầy đủ ngay trong thẻ.
function JournalCard({ entry, index }) {
  const { lang, tr, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const date = new Date(entry.date).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Inview
      as="li"
      className="journal-item"
      from={{ opacity: 0, y: 40 }}
      to={{ opacity: 1, y: 0 }}
      delay={index * 120}
      config={{ tension: 180, friction: 26 }}
    >
      <Hover
        as="article"
        className="journal-card"
        from={{ y: 0 }}
        to={{ y: -8 }}
        config={{ tension: 300, friction: 22 }}
      >
        <div>
          <span
            className="journal-quote"
            aria-hidden="true"
          >
            “
          </span>
          <blockquote className="journal-text">{tr(entry.excerpt)}</blockquote>

          {open && (
            <div className="journal-full">
              {entry.content.map((p, i) => (
                <p key={i}>{tr(p)}</p>
              ))}
            </div>
          )}

          <button
            type="button"
            className="journal-toggle"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t("journalCollapse") : t("journalReadMore")}
          </button>
        </div>

        <figcaption className="journal-by">
          <span className="journal-name">{tr(entry.title)}</span>
          <span className="journal-role">{date}</span>
        </figcaption>
      </Hover>
    </Inview>
  );
}

// Section Nhật ký: 3 bài mới nhất dưới dạng lưới thẻ.
function Journal() {
  const { tr } = useLanguage();
  const entries = [...journal].sort((a, b) => b.date.localeCompare(a.date)).slice(0, MAX_CARDS);

  return (
    <section
      id="journal"
      className="bl-journal"
    >
      <Eyebrow code="SEC.06">{tr(landing.journal.eyebrow)}</Eyebrow>
      <StackedLines
        as="h2"
        id="testimonials-title"
        className="section-title"
        lines={tr(landing.journal.title)}
      />

      <ul className="journal-grid">
        {entries.map((entry, i) => (
          <JournalCard
            key={entry.id}
            entry={entry}
            index={i}
          />
        ))}
      </ul>
    </section>
  );
}

export default Journal;
