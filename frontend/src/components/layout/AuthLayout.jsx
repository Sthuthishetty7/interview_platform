import { Link } from "react-router-dom";
import { PRODUCT_NAME } from "../../utils/constants";

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="container">
          <Link className="brand" to="/" aria-label={`${PRODUCT_NAME} home`}>
            <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
              <circle cx="11" cy="15" r="9" fill="#2850e8" />
              <circle cx="19" cy="15" r="9" fill="#16213e" fillOpacity="0.85" />
            </svg>
            <span>{PRODUCT_NAME}</span>
          </Link>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          <h1>{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
          <p className="auth-footer">{footer}</p>
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;