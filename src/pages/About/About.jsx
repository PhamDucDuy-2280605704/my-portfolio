import "./About.css";

import profile from "../../data/profile";
import usePageTitle from "../../hooks/usePageTitle";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";
import Button from "../../components/common/Button/Button";

// Trang "/about" — bio đầy đủ (khác với Hero ở Home, vốn chỉ có mô tả ngắn).
// Toàn bộ nội dung (bio, ngày sinh, email, CV...) lấy từ data/profile.js.
function About() {
  usePageTitle("Giới Thiệu | Phạm Đức Duy");

  return (
    <section className="about-page">

      <SectionTitle
        subtitle="Tìm Hiểu Về Mình"
        title="Về Tôi"
      />

      <div className="about-page-content">

        <div className="about-page-image">

          <img
            src={profile.avatar}
            alt={profile.fullName}
          />

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
              <strong>Ngày sinh:</strong> {profile.birthday}
            </li>

            <li>
              <strong>Email:</strong> {profile.email}
            </li>

            <li>
              <strong>Địa chỉ:</strong> {profile.location}
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
