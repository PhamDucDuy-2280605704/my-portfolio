import useLanguage from "../../hooks/useLanguage";
import useUi from "../../hooks/useUi";
import landing from "../../data/landing";
import navSections from "../../data/navSections";
import profile from "../../data/profile";
import social from "../../data/social";
import { scrollToId } from "../../lib/lenis";
import Inview from "../motion/Inview";
import { StackedLines } from "../motion/Reveal";
import Eyebrow from "../ui/Eyebrow";
import { BrandMark } from "../ui/Icons";
import PillButton from "../ui/PillButton";
import "./Footer.css";

const EXPLORE_IDS = ["about", "skills", "projects", "experience"];

// Footer navy: dải CTA, lưới cột (thương hiệu + liên hệ, khám phá, mạng xã hội, thêm), thanh dưới.
function Footer() {
  const { tr } = useLanguage();
  const { openContact } = useUi();
  const f = landing.footer;

  function go(e, id) {
    e.preventDefault();
    scrollToId(id);
  }

  const socials = [
    { label: "GitHub", href: social.github },
    { label: "Facebook", href: social.facebook },
    { label: "Zalo", href: social.zalo },
    { label: "Discord", href: social.discord },
    { label: "TikTok", href: social.tiktok },
  ];

  return (
    <footer
      id="contact"
      className="bl-footer panel bracket"
    >
      <div className="footer-cta">
        <div>
          <Eyebrow tone="light" code="SEC.07">{tr(f.ctaEyebrow)}</Eyebrow>
          <StackedLines
            as="p"
            className="footer-cta-title"
            lines={tr(f.ctaTitle)}
            duration={950}
          />
        </div>

        <Inview
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
          delay={150}
          config={{ tension: 200, friction: 24 }}
        >
          <PillButton
            variant="light"
            onClick={openContact}
          >
            {tr(landing.shell.contactCta)}
          </PillButton>
        </Inview>
      </div>

      <div className="footer-grid">
        <div className="footer-brand">
          <span className="footer-logo">
            <BrandMark className="footer-logo-mark" />
            {profile.fullName}
          </span>
          <p className="footer-blurb">{tr(f.blurb)}</p>

          <address className="footer-address">
            <a href={social.email}>{profile.email}</a>
            <span>{tr(profile.location)}</span>
          </address>
        </div>

        <nav
          className="footer-col"
          aria-label={tr(f.explore)}
        >
          <h3>{tr(f.explore)}</h3>
          <ul>
            {EXPLORE_IDS.map((id) => {
              const section = navSections.find((s) => s.id === id);
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => go(e, id)}
                  >
                    {tr(section.name)}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <nav
          className="footer-col"
          aria-label={tr(f.elsewhere)}
        >
          <h3>{tr(f.elsewhere)}</h3>
          <ul>
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav
          className="footer-col"
          aria-label={tr(f.more)}
        >
          <h3>{tr(f.more)}</h3>
          <ul>
            <li>
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
              >
                {tr(f.viewCv)}
              </a>
            </li>
            <li>
              <a
                href="#journal"
                onClick={(e) => go(e, "journal")}
              >
                {tr(navSections.find((s) => s.id === "journal").name)}
              </a>
            </li>
            <li>
              <a
                href="#home"
                onClick={(e) => go(e, "home")}
              >
                {tr(landing.shell.backToTop)}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>
          © 2026 {profile.fullName}. {tr(f.rights)}
        </p>
      </div>

      {/* Chữ khổng lồ mờ làm điểm nhấn cuối trang, bị cắt bởi mép footer */}
      <div
        className="footer-mark"
        aria-hidden="true"
      >
        {profile.fullName}
      </div>
    </footer>
  );
}

export default Footer;
