import "./About.css";

import profile from "../../../data/profile";

import SectionTitle from "../../common/SectionTitle/SectionTitle";

function About() {
  return (
    <section className="about">

      <SectionTitle
        subtitle="Get To Know"
        title="About Me"
      />

      <div className="about-content">

        <div className="about-image">

          <img
            src={profile.avatar}
            alt={profile.fullName}
          />

        </div>

        <div className="about-info">

          <h3>{profile.fullName}</h3>

          <p>{profile.description}</p>

          <ul>

            <li>
              <strong>Birthday:</strong> {profile.birthday}
            </li>

            <li>
              <strong>Email:</strong> {profile.email}
            </li>

            <li>
              <strong>Location:</strong> {profile.location}
            </li>

          </ul>

        </div>

      </div>

    </section>
  );
}

export default About;