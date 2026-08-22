import "./About.css";

import profile from "../../data/profile";
import aboutPhoto from "../../assets/images/avatar-about.jpg";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";
import Button from "../../components/common/Button/Button";
import HudFrame from "../../components/common/HudFrame/HudFrame";
import ZoomableImage from "../../components/common/ZoomableImage/ZoomableImage";

// Section "Giới thiệu" — giờ là 1 khối trong trang chủ dài (Home.jsx ghép
// tất cả section lại), không còn là route "/about" riêng. id="about" để
// Navbar cuộn thẳng tới đây khi bấm menu.
function About() {
  return (
    <section
      className="about-page"
      id="about"
    >

      <SectionTitle
        subtitle="Tìm Hiểu Về Mình"
        title="Về Tôi"
      />

      <div className="about-page-content">

        <div className="about-page-image">
          <HudFrame label="IDENT.01">
            <ZoomableImage
              src={aboutPhoto}
              alt={profile.fullName}
            />
          </HudFrame>
        </div>

        <div className="about-page-info">

          <h3>{profile.fullName}</h3>

          <p className="about-page-role">{profile.role}</p>

          {/* profile.bio là mảng nhiều đoạn văn -> mỗi đoạn render thành 1 thẻ <p> */}
          {profile.bio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          <ul className="about-page-details">

            <li>
              <span className="detail-code hud-readout">DOB</span>
              <span>{profile.birthday}</span>
            </li>

            <li>
              <span className="detail-code hud-readout">MAIL</span>
              <span>{profile.email}</span>
            </li>

            <li>
              <span className="detail-code hud-readout">LOC</span>
              <span>{profile.location}</span>
            </li>

          </ul>

          {/* Tải CV trực tiếp (thuộc tính download) — nếu sau này chưa có file
              (profile.resume rỗng/null) thì hiện nút vô hiệu hoá thay vì link chết. */}
          {profile.resume ? (
            <a
              href={profile.resume}
              download
            >
              <Button variant="primary">Tải CV</Button>
            </a>
          ) : (
            <Button
              variant="primary"
              disabled
            >
              CV sẽ cập nhật sau
            </Button>
          )}

        </div>

      </div>

    </section>
  );
}

export default About;
