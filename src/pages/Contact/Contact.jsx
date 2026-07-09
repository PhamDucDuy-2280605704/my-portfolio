import { FaGithub, FaFacebook, FaEnvelope } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

import "./Contact.css";

import profile from "../../data/profile";
import social from "../../data/social";
import usePageTitle from "../../hooks/usePageTitle";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";

const contacts = [
  {
    name: "Email",
    value: profile.email,
    href: social.email,
    icon: FaEnvelope,
    color: "#3b82f6",
  },
  {
    name: "GitHub",
    value: "PhamDucDuy-2280605704",
    href: social.github,
    icon: FaGithub,
    color: "#f8fafc",
  },
  {
    name: "Facebook",
    value: "Phạm Đức Duy",
    href: social.facebook,
    icon: FaFacebook,
    color: "#1877f2",
  },
  {
    name: "Zalo",
    value: "0924 834 155",
    href: social.zalo,
    icon: SiZalo,
    color: "#0068ff",
  },
];

function Contact() {
  usePageTitle("Liên Hệ | Phạm Đức Duy");

  return (
    <section className="contact-page">

      <SectionTitle
        subtitle="Kết Nối Với Mình"
        title="Liên Hệ"
      />

      <p className="contact-intro">
        Mọi trao đổi về công việc hay ý tưởng hợp tác, đừng ngần ngại liên hệ với mình qua các kênh dưới đây.
      </p>

      <div className="contact-grid">

        {contacts.map(({ name, value, href, icon: Icon, color }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="contact-card"
          >

            <Icon
              className="contact-icon"
              style={{ color }}
            />

            <div className="contact-text">
              <h3>{name}</h3>
              <p>{value}</p>
            </div>

          </a>
        ))}

      </div>

    </section>
  );
}

export default Contact;
