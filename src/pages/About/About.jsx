import "./About.css";

import profile from "../../data/profile";
import aboutPhoto from "../../assets/images/avatar-about.jpg";
import useLanguage from "../../hooks/useLanguage";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";
import Button from "../../components/common/Button/Button";
import HudFrame from "../../components/common/HudFrame/HudFrame";

// Section "Giới thiệu" — giờ là 1 khối trong trang chủ dài (Home.jsx ghép
// tất cả section lại), không còn là route "/about" riêng. id="about" để
// Navbar cuộn thẳng tới đây khi bấm menu.
function About() {
  const { t, tr } = useLanguage();

  return (
    <section
      className="about-page"
      id="about"
    >

      <SectionTitle
        subtitle={t("aboutSubtitle")}
        title={t("aboutTitle")}
      />

      <div className="about-page-content">

        <div className="about-page-image">
          <HudFrame label="IDENT.01">
            <img
              src={aboutPhoto}
              alt={profile.fullName}
            />
          </HudFrame>
        </div>

        <div className="about-page-info">

          <h3>{profile.fullName}</h3>

          <p className="about-page-role">{tr(profile.role)}</p>

          {/* profile.bio là mảng nhiều đoạn văn song ngữ -> mỗi đoạn render thành 1 thẻ <p> */}
          {profile.bio.map((paragraph, index) => (
            <p key={index}>{tr(paragraph)}</p>
          ))}

          <ul className="about-page-details">

            <li>
              <span className="detail-code hud-readout">{t("aboutDob")}</span>
              <span>{profile.birthday}</span>
            </li>

            <li>
              <span className="detail-code hud-readout">{t("aboutMail")}</span>
              <span>{profile.email}</span>
            </li>

            <li>
              <span className="detail-code hud-readout">{t("aboutLoc")}</span>
              <span>{tr(profile.location)}</span>
            </li>

          </ul>

          {/* Tải CV trực tiếp (thuộc tính download) — nếu sau này chưa có file
              (profile.resume rỗng/null) thì hiện nút vô hiệu hoá thay vì link chết. */}
          {profile.resume ? (
            <a
              href={profile.resume}
              download
            >
              <Button variant="primary">{t("downloadCv")}</Button>
            </a>
          ) : (
            <Button
              variant="primary"
              disabled
            >
              {t("cvComingSoon")}
            </Button>
          )}

        </div>

      </div>

    </section>
  );
}

export default About;
