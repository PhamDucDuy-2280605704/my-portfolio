import Button from "../../common/Button/Button";
import CornerFlourish from "../../common/CornerFlourish/CornerFlourish";
import HudFrame from "../../common/HudFrame/HudFrame";
import "./Hero.css";

import profile from "../../../data/profile";
import useLanguage from "../../../hooks/useLanguage";

// Section giới thiệu ở trang Home — toàn bộ nội dung lấy từ data/profile.js,
// nên muốn đổi tên/vai trò/câu quote... chỉ cần sửa file đó, không cần sửa ở đây.
function Hero() {
  const { t, tr } = useLanguage();

  // Nhãn nhấn mạnh 3 mảng kỹ năng chính, hiện dạng "FRONTEND • BACKEND • MOBILE"
  // ngay dưới vai trò, giúp người xem nắm phạm vi kỹ năng chỉ trong 1 giây.
  const highlights = [t("highlightFrontend"), t("highlightBackend"), t("highlightMobile")];

  return (
    <section
      className="hero"
      id="home"
    >

      {/* 4 góc hoa văn trang trí rất nhẹ, đồng bộ hoạ tiết với SplashScreen —
          chỉ mang tính trang trí (aria-hidden ở CornerFlourish), không ảnh
          hưởng nội dung/accessibility. */}
      <CornerFlourish />
      <CornerFlourish />
      <CornerFlourish />
      <CornerFlourish />

      <div className="hero-left">
        <p className="hello">
          <span className="hello-dot" />
          {t("helloGreeting")}
        </p>

        <h1>{profile.fullName}</h1>

        <h2>{tr(profile.role)}</h2>

        <div className="hero-highlights">
          {highlights.map((item, index) => (
            <span key={item}>
              {item}
              {/* Chấm phân cách "•" giữa các mục, trừ mục cuối cùng */}
              {index < highlights.length - 1 && <i className="dot" />}
            </span>
          ))}
        </div>

        <p className="tagline">{tr(profile.description)}</p>

        <p className="quote">“{tr(profile.quote)}”</p>

        <div className="buttons">
          <a href="#contact">
            <Button variant="primary">{t("heroCta")}</Button>
          </a>
        </div>
      </div>

      <div className="hero-right">
        <HudFrame
          label="PROFILE.01"
          className="hero-avatar-frame"
        >
          <img
            src={profile.avatar}
            alt={profile.fullName}
          />
        </HudFrame>
      </div>
    </section>
  );
}

export default Hero;
