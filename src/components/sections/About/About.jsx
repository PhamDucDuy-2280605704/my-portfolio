import { Link } from "react-router-dom";

import "./About.css";

import profile from "../../../data/profile";

import SectionTitle from "../../common/SectionTitle/SectionTitle";
import Button from "../../common/Button/Button";

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

          <Link to="/about">
            <Button variant="outline">Tìm hiểu thêm</Button>
          </Link>

        </div>

      </div>

    </section>
  );
}

export default About;