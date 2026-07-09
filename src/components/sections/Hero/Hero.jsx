import { Link } from "react-router-dom";

import Button from "../../common/Button/Button";
import "./Hero.css";

import profile from "../../../data/profile";

const highlights = ["Frontend", "Backend", "Mobile"];

function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <p className="hello">👋 Xin chào, mình là</p>

        <h1>{profile.fullName}</h1>

        <h2>{profile.role}</h2>

        <div className="hero-highlights">
          {highlights.map((item, index) => (
            <span key={item}>
              {item}
              {index < highlights.length - 1 && <i className="dot" />}
            </span>
          ))}
        </div>

        <p className="tagline">{profile.description}</p>

        <p className="quote">“{profile.quote}”</p>

        <div className="buttons">
          <Link to="/contact">
            <Button variant="primary">Liên Hệ Với Mình</Button>
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