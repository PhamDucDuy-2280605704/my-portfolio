import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const menus = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Skills", path: "/skills" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="navbar">
      <a href="/" className="logo">
        <span>PD.</span>
      </a>

      <ul className="menu">
        {menus.map((item) => (
          <li key={item.path}>
            <NavLink to={item.path}>
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;