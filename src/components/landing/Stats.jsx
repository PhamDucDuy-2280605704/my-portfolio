import useLanguage from "../../hooks/useLanguage";
import landing from "../../data/landing";
import certificates from "../../data/certificates";
import education from "../../data/education";
import projects from "../../data/projects";
import skills from "../../data/skills";
import workExperience from "../../data/workExperience";
import Inview from "../motion/Inview";
import { StackedLines } from "../motion/Reveal";
import Eyebrow from "../ui/Eyebrow";
import "./Stats.css";

// "04/2026 – 07/2026" -> 3 (tháng). Trả null nếu không đọc được định dạng.
function monthsBetween(period) {
  const m = /(\d{1,2})\/(\d{4}).*?(\d{1,2})\/(\d{4})/.exec(period ?? "");
  if (!m) return null;
  const [, m1, y1, m2, y2] = m.map(Number);
  return (y2 - y1) * 12 + (m2 - m1);
}

// Section số liệu (navy): 4 con số tính từ chính data/*.js + khối "Hành trình"
// (thực tập, học vấn, chứng chỉ) để giữ đủ nội dung của mục Kinh nghiệm cũ.
function Stats() {
  const { tr, t } = useLanguage();
  const work = workExperience[0];
  const months = monthsBetween(work?.period);

  const stats = [
    {
      value: String(Object.values(skills).flat().length),
      label: landing.stats.labels.tech,
    },
    work?.score && { value: work.score, label: landing.stats.labels.score },
    months && { value: String(months), label: landing.stats.labels.months },
    {
      value: String(projects.completed.length),
      label: landing.stats.labels.projects,
    },
  ].filter(Boolean);

  return (
    <section id="experience" className="bl-stats hud-panel hud-panel--cyan hud-bracket">
      <Inview>
        <Eyebrow tone="light" code="SEC.05">
          {tr(landing.stats.eyebrow)}
        </Eyebrow>
      </Inview>
      <StackedLines
        as="h2"
        id="stats-title"
        className="section-title"
        lines={tr(landing.stats.title)}
      />

      <dl className="stats-grid">
        {stats.map((stat, i) => (
          <Inview key={stat.label.vi} className="stat-cell" delay={i * 110}>
            <dt className="sr-only">{tr(stat.label)}</dt>
            <dd className="stat-value">{stat.value}</dd>
            <dd className="stat-label" aria-hidden="true">
              {tr(stat.label)}
            </dd>
          </Inview>
        ))}
      </dl>

      <div className="journey">
        <Inview>
          <h3 className="journey-title">{tr(landing.stats.journey)}</h3>
        </Inview>

        <div className="journey-grid">
          {work && (
            <Inview as="article" className="journey-block">
              <p className="journey-period">{work.period}</p>
              <h4>{tr(work.role)}</h4>
              <p className="journey-org">{tr(work.company)}</p>

              <ul className="journey-list">
                {work.highlights.map((h, i) => (
                  <li key={i}>{tr(h)}</li>
                ))}
              </ul>

              <p className="journey-tech">{work.tech.join(" · ")}</p>

              {work.report && (
                <a
                  className="journey-link"
                  href={work.report}
                  target="_blank"
                  rel="noreferrer"
                >
                  {tr(landing.stats.report)} →
                </a>
              )}
            </Inview>
          )}

          <Inview as="article" className="journey-block" delay={110}>
            {education.map((e, i) => (
              <div key={i} className="journey-edu">
                <p className="journey-period">{tr(e.period)}</p>
                <h4>{tr(e.school)}</h4>
                <p className="journey-org">{tr(e.major)}</p>
              </div>
            ))}

            <ul className="journey-certs">
              {certificates.map((c, i) => (
                <li key={i}>
                  <span>{tr(c.name)}</span>
                  <em>
                    {c.status === "completed"
                      ? t("statusDone")
                      : t("statusInProgress")}
                  </em>
                </li>
              ))}
            </ul>
          </Inview>
        </div>
      </div>
    </section>
  );
}

export default Stats;
