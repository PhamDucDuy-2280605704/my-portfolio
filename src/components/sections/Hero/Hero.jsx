import { Link } from "react-router-dom";

import Button from "../../common/Button/Button";
import "./Hero.css";

import profile from "../../../data/profile";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <p className="hello">👋 Hello, I'm</p>

        <h1>{profile.fullName}</h1>

        <h2>{profile.role}</h2>

        <p className="quote">{profile.quote}</p>

        <div className="buttons">
          <a
            href={profile.resume}
            download
          >
            <Button>Download CV</Button>
          </a>

          <Link to="/contact">
            <Button variant="outline">Contact Me</Button>
          </Link>
        </div>
      </div>

      <div className="hero-right">
        <img
          src={profile.avatar}
          alt={profile.fullName}
        />
      </div>
    </section>
  );
}

export default Hero;