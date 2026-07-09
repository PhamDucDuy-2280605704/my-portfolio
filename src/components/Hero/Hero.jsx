import "./Hero.css";

import profile from "../../data/profile";
import social from "../../data/social";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-left">

        <p className="hello">👋 Hello, I'm</p>

        <h1>{profile.fullName}</h1>

        <h2>{profile.role}</h2>

        <p className="quote">
          {profile.quote}
        </p>

        <div className="buttons">

          <button>Download CV</button>

          <button>Contact Me</button>

        </div>

        <div className="social">

          <a href={social.github}>GitHub</a>

          <a href={social.facebook}>Facebook</a>

          <a href={social.zalo}>Zalo</a>

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