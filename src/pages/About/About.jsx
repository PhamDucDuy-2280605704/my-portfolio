import "./About.css";

import profile from "../../data/profile";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";
import Button from "../../components/common/Button/Button";

function About() {
  return (
    <section className="about-page">

      <SectionTitle
        subtitle="Get To Know Me"
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

          <a
            href={profile.resume}
            download
          >
            <Button variant="primary">Tải CV</Button>
          </a>

        </div>

      </div>

    </section>
  );
}

export default About;
