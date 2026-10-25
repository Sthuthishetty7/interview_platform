import { Link, NavLink } from "react-router-dom";
import { PRODUCT_NAME } from "../../utils/constants";

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/" aria-label={`${PRODUCT_NAME} home`}>
            <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
              <circle cx="11" cy="15" r="9" fill="#2850e8" />
              <circle cx="19" cy="15" r="9" fill="#16213e" fillOpacity="0.85" />
            </svg>
            <span>{PRODUCT_NAME}</span>
          </Link>
          <nav className="nav-links" aria-label="Main">
            <NavLink to="/dashboard">Dashboard</NavLink>
            {/* For now this just goes to the login page. Real log out comes with the API. */}
            <Link className="btn btn-ghost" to="/login">
              Log out
            </Link>
          </nav>
        </div>
      </header>
      <main className="container app-main">{children}</main>
    </div>
  );
}

export default AppLayout;