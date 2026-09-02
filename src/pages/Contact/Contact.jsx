import { FaGithub, FaFacebook, FaEnvelope, FaArrowRight, FaDiscord, FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

import "./Contact.css";

import profile from "../../data/profile";
import social from "../../data/social";
import useLanguage from "../../hooks/useLanguage";

import SectionTitle from "../../components/common/SectionTitle/SectionTitle";
import ContactForm from "./ContactForm";
import { playUiSound } from "../../utils/uiSound";

// Danh sách kênh liên hệ hiển thị dạng card. href lấy từ data/social.js,
// name cố định (tên thương hiệu), hintKey trỏ vào từ điển uiText — còn
// value/icon/color khai báo trực tiếp ở đây vì gắn liền với cách hiển thị
// (mỗi kênh 1 icon + màu thương hiệu riêng).
// Thêm kênh mới: thêm link vào data/social.js rồi thêm 1 object vào mảng này.
const contacts = [
  {
    name: "Email",
    hintKey: "contactEmailHint",
    value: profile.email,
    href: social.email,
    icon: FaEnvelope,
    color: "#3b82f6",
  },
  {
    name: "GitHub",
    hintKey: "contactGithubHint",
    value: "PhamDucDuy-2280605704",
    href: social.github,
    icon: FaGithub,
    // Icon GitHub gốc là trắng/đen, nhưng dùng màu tím đặc trưng (Octicons)
    // để nổi bật trên nền tối và đồng bộ với các icon màu khác — dùng trắng
    // sẽ bị "chìm" vào nền badge mờ, không nhìn rõ như Facebook/Zalo/Discord.
    color: "#a78bfa",
  },
  {
    name: "Facebook",
    hintKey: "contactFacebookHint",
    value: "Phạm Đức Duy",
    href: social.facebook,
    icon: FaFacebook,
    color: "#1877f2",
  },
  {
    name: "Zalo",
    hintKey: "contactZaloHint",
    value: "0924 834 155",
    href: social.zalo,
    icon: SiZalo,
    color: "#0068ff",
  },
  {
    name: "Discord",
    hintKey: "contactDiscordHint",
    value: "phamduy1410",
    href: social.discord,
    icon: FaDiscord,
    color: "#5865f2",
  },
  {
    name: "TikTok",
    hintKey: "contactTiktokHint",
    value: "@phamduy1410",
    href: social.tiktok,
    icon: FaTiktok,
    // Tương tự GitHub — dùng màu hồng đặc trưng của TikTok thay vì trắng.
    color: "#fe2c55",
  },
];

// Trang "/contact" — lưới card liên kết tới các kênh liên hệ.
function Contact() {
  const { t } = useLanguage();

  return (
    <section className="contact-page" id="contact">

      <SectionTitle
        subtitle={t("contactSubtitle")}
        title={t("contactTitle")}
      />

      <p className="contact-intro">{t("contactIntro")}</p>

      <div className="contact-grid">

        {contacts.map(({ name, hintKey, value, href, icon: Icon, color }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="contact-card"
            onClick={() => playUiSound("card")}
          >

            {/* --badge-color: CSS variable truyền màu động cho từng kênh
                (dùng trong Contact.css để tô icon + vạch accent khi hover) */}
            <span
              className="contact-icon-badge"
              style={{ "--badge-color": color }}
            >
              <Icon className="contact-icon" />
            </span>

            <div className="contact-text">
              <h3>{name}</h3>
              <p
                className="contact-value"
                title={value}
              >
                {value}
              </p>
              <span className="contact-hint">{t(hintKey)}</span>
            </div>

            <FaArrowRight className="contact-arrow" />

          </a>
        ))}

      </div>

      <ContactForm />

    </section>
  );
}

export default Contact;
