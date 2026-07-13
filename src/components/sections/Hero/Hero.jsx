import { Link } from "react-router-dom";

import Button from "../../common/Button/Button";
import CornerFlourish from "../../common/CornerFlourish/CornerFlourish";
import "./Hero.css";

import profile from "../../../data/profile";

// Nhãn nhấn mạnh 3 mảng kỹ năng chính, hiện dạng "FRONTEND • BACKEND • MOBILE"
// ngay dưới vai trò, giúp người xem nắm phạm vi kỹ năng chỉ trong 1 giây.
const highlights = ["Frontend", "Backend", "Mobile"];

// Section giới thiệu ở trang Home — toàn bộ nội dung lấy từ data/profile.js,
// nên muốn đổi tên/vai trò/câu quote... chỉ cần sửa file đó, không cần sửa ở đây.
function Hero() {
  return (
    <section className="hero">

      {/* 4 góc hoa văn trang trí rất nhẹ, đồng bộ hoạ tiết với SplashScreen —
          chỉ mang tính trang trí (aria-hidden ở CornerFlourish), không ảnh
          hưởng nội dung/accessibility. */}
      <CornerFlourish />
      <CornerFlourish />
      <CornerFlourish />
      <CornerFlourish />

      <div className="hero-left">
        <p className="hello">👋 Xin chào, mình là</p>

        <h1>{profile.fullName}</h1>

        <h2>{profile.role}</h2>

        <div className="hero-highlights">
          {highlights.map((item, index) => (
            <span key={item}>
              {item}
              {/* Chấm phân cách "•" giữa các mục, trừ mục cuối cùng */}
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