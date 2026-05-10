import { Link, useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400&display=swap');

  .navbar {
    position: sticky; top: 0; z-index: 100;
    background: #111;
    border-bottom: 1px solid #1e1e1e;
    padding: 0 40px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 'DM Mono', monospace;
  }

  .navbar::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(232,196,104,0.2), transparent);
    pointer-events: none;
  }

  .navbar-brand {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none;
  }

  .navbar-brand-icon {
    width: 28px; height: 28px;
    border: 1.5px solid #e8c468;
    display: flex; align-items: center; justify-content: center;
    color: #e8c468; font-size: 14px; line-height: 1;
    flex-shrink: 0;
  }

  .navbar-brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px; font-weight: 700;
    color: #f5f0e8; letter-spacing: -0.01em;
    text-decoration: none;
  }

  .navbar-brand-name span { color: #e8c468; }

  .navbar-links {
    display: flex; align-items: center; gap: 6px;
  }

  .navbar-link {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #666;
    text-decoration: none;
    padding: 8px 14px;
    transition: color 0.2s;
    position: relative;
  }

  .navbar-link::after {
    content: '';
    position: absolute;
    bottom: 4px; left: 14px; right: 14px;
    height: 1px;
    background: #e8c468;
    transform: scaleX(0);
    transition: transform 0.2s;
  }

  .navbar-link:hover { color: #f5f0e8; }
  .navbar-link:hover::after { transform: scaleX(1); }

  .navbar-divider {
    width: 1px; height: 16px;
    background: #222; margin: 0 4px;
  }

  .navbar-btn-logout {
    font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #0a0a0a; background: #e8c468;
    border: none; padding: 8px 18px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
  }

  .navbar-btn-logout:hover { background: #f0d080; }
  .navbar-btn-logout:active { transform: scale(0.98); }

  .navbar-btn-register {
    font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #e8c468; background: transparent;
    border: 1px solid rgba(232,196,104,0.35);
    padding: 7px 18px;
    text-decoration: none;
    display: inline-flex; align-items: center;
    transition: border-color 0.2s, color 0.2s;
  }

  .navbar-btn-register:hover {
    border-color: #e8c468; color: #f0d080;
  }
`;

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const token = localStorage.getItem("token");

  return (
    <>
      <style>{styles}</style>
      <nav className="navbar">

        {/* Brand */}
        <Link to={token ? "/dashboard" : "/"} className="navbar-brand">
          <div className="navbar-brand-icon">◈</div>
          <span className="navbar-brand-name">
            Credit<span>Sense</span>
          </span>
        </Link>

        {/* Links */}
        <div className="navbar-links">
          {token && (
            <>
              <Link className="navbar-link" to="/dashboard">Dashboard</Link>
              <Link className="navbar-link" to="/upload-statement">Upload Statement</Link>
              <div className="navbar-divider" />
              <button className="navbar-btn-logout" onClick={logout}>
                Logout →
              </button>
            </>
          )}

          {!token && (
            <>
              <Link className="navbar-link" to="/">Login</Link>
              <div className="navbar-divider" />
              <Link className="navbar-btn-register" to="/register">
                Register
              </Link>
            </>
          )}
        </div>

      </nav>
    </>
  );
}

export default Navbar;