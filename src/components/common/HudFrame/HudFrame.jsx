import "./HudFrame.css";

// Khung 4 góc kiểu bracket "[ ]" — tự thiết kế theo phong cách "phòng điều
// khiển kỹ thuật số" (cold, mono, viền góc) đã dùng ở ParticleIntro/Navbar,
// KHÔNG sao chép bố cục/logo của bất kỳ sản phẩm phim/game cụ thể nào.
//
// Dùng để bọc quanh 1 card/panel bất kỳ (skill card, project card, timeline
// item...) và có thêm 1 nhãn nhỏ góc trên trái kiểu "FEED 01".
//
// Cách dùng:
//   <HudFrame label="SKILL.01">
//     <SkillCard ... />
//   </HudFrame>
function HudFrame({ label, children, className = "" }) {
  return (
    <div className={`hud-frame ${className}`}>
      <span className="hud-frame-corner tl" />
      <span className="hud-frame-corner tr" />
      <span className="hud-frame-corner bl" />
      <span className="hud-frame-corner br" />

      {label && <span className="hud-frame-label">{label}</span>}

      <div className="hud-frame-content">{children}</div>
    </div>
  );
}

export default HudFrame;
