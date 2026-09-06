import { useState } from "react";
import {
  HomeIcon,
  UserIcon,
  CodeBracketIcon,
  FolderIcon,
  BriefcaseIcon,
  BookOpenIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
  CodeBracketIcon as CodeBracketIconSolid,
  FolderIcon as FolderIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
} from "@heroicons/react/24/solid";

import "./Sidebar.css";

import profile from "../../../data/profile";
import navSections from "../../../data/navSections";
import useActiveSection from "../../../hooks/useActiveSection";
import useLanguage from "../../../hooks/useLanguage";
import { playUiSound } from "../../../utils/uiSound";

const SECTION_IDS = navSections.map((s) => s.id);

// Bảng tra id section -> cặp icon (outline khi thường, solid khi active) —
// Navbar/BottomDock cũ giữ icon ngay trong data/navSections.js (react-icons),
// nhưng Sidebar dùng bộ Heroicons riêng theo đúng yêu cầu, nên tra riêng ở
// đây thay vì đổi lại toàn bộ data/navSections.js (chỗ đó vẫn dùng chung
// react-icons cho phần description/tooltip, không ảnh hưởng).
const ICONS = {
  home: [HomeIcon, HomeIconSolid],
  about: [UserIcon, UserIconSolid],
  skills: [CodeBracketIcon, CodeBracketIconSolid],
  projects: [FolderIcon, FolderIconSolid],
  experience: [BriefcaseIcon, BriefcaseIconSolid],
  journal: [BookOpenIcon, BookOpenIconSolid],
  contact: [EnvelopeIcon, EnvelopeIconSolid],
};

// Lấy 1-2 chữ cái đầu của tên để làm "monogram" góc trên sidebar (VD "Phạm
// Đức Duy" -> "PD"), giống ô chữ viết tắt góc trên-trái trong ảnh tham chiếu.
function getInitials(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Sidebar cố định bên trái, xuyên suốt mọi màn hình — thay cho Navbar (dải
// mã hiệu + logo) và BottomDock (dock nổi dưới cùng) trước đây. Gồm 3 khối
// xếp dọc: monogram trên cùng, icon điều hướng 7 section ở giữa (căn giữa
// theo chiều cao), và nhóm tiện ích (đổi ngôn ngữ, tải CV) dưới cùng. Trên
// mobile thu gọn thành thanh ngang cố định phía dưới màn hình (xem
// Sidebar.css) để không chiếm chỗ ngang vốn đã hẹp.
//
// Chỉ còn 1 giao diện DUY NHẤT (tông đen-trắng-xám) — không còn tính năng
// đổi sáng/tối (đã bỏ hẳn useTheme/ThemeToggle theo yêu cầu).
function Sidebar() {
  const { lang, setLang, t, tr } = useLanguage();
  const activeId = useActiveSection(SECTION_IDS);
  const isVi = lang === "vi";

  const [initials] = useState(() => getInitials(profile.fullName));

  return (
    <nav
      className="sidebar"
      aria-label={t("navAriaLabel")}
    >
      <a
        href="#home"
        className="sidebar-monogram"
        aria-label={profile.fullName}
      >
        {initials}
      </a>

      <ul className="sidebar-nav">
        {navSections.map((item) => {
          const isActive = activeId === item.id;
          const [Outline, Solid] = ICONS[item.id] || [HomeIcon, HomeIconSolid];
          const Icon = isActive ? Solid : Outline;
          const name = tr(item.name);

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`sidebar-item ${isActive ? "active" : ""}`}
                aria-label={name}
                aria-current={isActive ? "true" : undefined}
                onClick={() => playUiSound(isActive ? "navActive" : "nav")}
              >
                <Icon className="sidebar-icon" />

                <span
                  className="sidebar-tooltip"
                  aria-hidden="true"
                >
                  <strong>{name}</strong>
                  <span>{tr(item.description)}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-utility">
        <button
          type="button"
          className="sidebar-item sidebar-utility-btn"
          onClick={() => {
            playUiSound("toggle");
            setLang(isVi ? "en" : "vi");
          }}
          aria-label={t("languageToggleLabel")}
          title={t("languageToggleLabel")}
        >
          <span className="sidebar-lang-code">{isVi ? "EN" : "VI"}</span>
        </button>

        {profile.resume && (
          <a
            href={profile.resume}
            download
            className="sidebar-item sidebar-utility-btn sidebar-download"
            aria-label={t("downloadCv")}
            title={t("downloadCv")}
            onClick={() => playUiSound("card")}
          >
            <ArrowDownTrayIcon className="sidebar-icon" />
          </a>
        )}
      </div>
    </nav>
  );
}

export default Sidebar;
