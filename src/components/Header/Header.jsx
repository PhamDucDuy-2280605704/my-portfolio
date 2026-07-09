import "./Header.css";

import logo from "../../assets/images/logo.jpg";

function Header() {
  return (
    <header className="header">
      <img src={logo} alt="Logo" />

      <h2>My Portfolio</h2>
    </header>
  );
}

export default Header;