import useLanguage from "../../hooks/useLanguage";
import useUi from "../../hooks/useUi";
import landing from "../../data/landing";
import profile from "../../data/profile";
import social from "../../data/social";
import Inview from "../motion/Inview";
import { StackedLines } from "../motion/Reveal";
import Eyebrow from "../ui/Eyebrow";
import { BrandMark } from "../ui/Icons";
import PillButton from "../ui/PillButton";
import "./Footer.css";

const SOCIALS = [
  { label: "GitHub", href: social.github },
  { label: "Facebook", href: social.facebook },
  { label: "Zalo", href: social.zalo },
  { label: "Discord", href: social.discord },
  { label: "TikTok", href: social.tiktok },
];

// Footer (neo #contact): dải CTA mở form liên hệ, giới thiệu ngắn + email, mạng xã hội, dòng bản quyền.
// Điều hướng nằm ở menu, CV ở hero — footer không lặp lại những thứ đó.
function Footer() {
  const { tr } = useLanguage();
  const { openContact } = useUi();
  const f = landing.footer;

  return (
    <footer id="contact" className="bl-footer hud-panel hud-bracket">
      <div className="footer-cta">
        <div>
          <Inview>
            <Eyebrow tone="light" code="SEC.07">
              {tr(f.ctaEyebrow)}
            </Eyebrow>
          </Inview>
          <StackedLines
            as="p"
            className="footer-cta-title"
            lines={tr(f.ctaTitle)}
            duration={950}
          />
        </div>

        <Inview delay={150}>
          <PillButton variant="light" onClick={openContact}>
            {tr(landing.shell.contactCta)}
          </PillButton>
        </Inview>
      </div>

      <Inview className="footer-grid">
        <div className="footer-brand">
          <span className="footer-logo">
            <BrandMark className="footer-logo-mark" />
            {profile.fullName}
          </span>
          <p className="footer-blurb">{tr(f.blurb)}</p>
          <a className="footer-mail" href={social.email}>
            {profile.email}
          </a>
        </div>

        <nav className="footer-col" aria-label={tr(f.elsewhere)}>
          <h3>{tr(f.elsewhere)}</h3>
          <ul>
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Inview>

      <div className="footer-bottom">
        <p>
          © 2026 {profile.fullName}. {tr(f.rights)}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
