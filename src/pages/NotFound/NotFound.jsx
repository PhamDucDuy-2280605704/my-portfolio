import { Link } from "react-router-dom";

import "./NotFound.css";

import Button from "../../components/common/Button/Button";
import usePageTitle from "../../hooks/usePageTitle";
import useLanguage from "../../hooks/useLanguage";

// Trang 404 — khớp với route "*" trong AppRoutes.jsx.
// Cố ý KHÔNG dùng MainLayout (không có Navbar/Footer) để có toàn quyền tự thiết kế trang.
function NotFound() {
  const { t } = useLanguage();
  usePageTitle(t("notFoundPageTitle"));

  return (
    <section className="notfound-page">

      <p className="notfound-tag hud-readout">{t("notFoundTag")}</p>

      <h1 className="notfound-code">404</h1>

      <h2>{t("notFoundTitle")}</h2>

      <p>{t("notFoundBody")}</p>

      <Link to="/">
        <Button variant="primary">{t("notFoundCta")}</Button>
      </Link>

    </section>
  );
}

export default NotFound;
