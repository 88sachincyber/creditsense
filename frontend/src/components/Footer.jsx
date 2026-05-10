import { Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400&display=swap');

  .footer {
    position: relative;
    background: #111;
    border-top: 1px solid #1e1e1e;
    padding: 48px 40px 32px;
    font-family: 'DM Mono', monospace;
    overflow: hidden;
  }

  .footer::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(232,196,104,0.25), transparent);
    pointer-events: none;
  }

  .footer-glow {
    position: absolute;
    width: 400px; height: 300px;
    background: radial-gradient(circle, rgba(232,196,104,0.04) 0%, transparent 70%);
    bottom: -80px; right: 0;
    pointer-events: none;
  }

  .footer-inner {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
  }

  .footer-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 36px;
    border-bottom: 1px solid #1a1a1a;
    gap: 40px;
    flex-wrap: wrap;
  }

  .footer-brand {
    display: flex; flex-direction: column; gap: 14px;
  }

  .footer-brand-mark {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none;
  }

  .footer-brand-icon {
    width: 28px; height: 28px;
    border: 1.5px solid #e8c468;
    display: flex; align-items: center; justify-content: center;
    color: #e8c468; font-size: 14px; flex-shrink: 0;
  }

  .footer-brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px; font-weight: 700;
    color: #f5f0e8; letter-spacing: -0.01em;
  }

  .footer-brand-name span { color: #e8c468; }

  .footer-tagline {
    font-size: 11px; color: #444;
    letter-spacing: 0.06em; line-height: 1.6;
    max-width: 220px;
  }

  .footer-cols {
    display: flex; gap: 60px; flex-wrap: wrap;
  }

  .footer-col-title {
    font-size: 9px; letter-spacing: 0.22em;
    text-transform: uppercase; color: #e8c468;
    margin-bottom: 16px;
  }

  .footer-col-links {
    display: flex; flex-direction: column; gap: 10px;
  }

  .footer-col-links a {
    font-size: 11px; color: #555;
    text-decoration: none; letter-spacing: 0.06em;
    transition: color 0.2s;
    position: relative; width: fit-content;
  }

  .footer-col-links a::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 1px; background: #e8c468;
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.2s;
  }

  .footer-col-links a:hover { color: #c8a848; }
  .footer-col-links a:hover::after { transform: scaleX(1); }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .footer-copyright {
    display: flex; align-items: center; gap: 8px;
    font-size: 10px; color: #333; letter-spacing: 0.1em;
  }

  .footer-copyright-icon {
    width: 20px; height: 20px;
    border: 1px solid #2a2a2a;
    display: flex; align-items: center; justify-content: center;
    color: #e8c468; font-size: 10px;
  }

  .footer-legal {
    display: flex; align-items: center; gap: 20px;
  }

  .footer-legal a {
    font-size: 10px; color: #333;
    text-decoration: none; letter-spacing: 0.1em;
    transition: color 0.2s;
  }

  .footer-legal a:hover { color: #e8c468; }

  .footer-legal-dot {
    width: 3px; height: 3px; border-radius: 50%;
    background: #2a2a2a;
  }
`;

function Footer() {
  return (
    <>
      <style>{styles}</style>
      <footer className="footer">
        <div className="footer-glow" />
        <div className="footer-inner">

          {/* Top Row */}
          <div className="footer-top">

            {/* Brand */}
            <div className="footer-brand">
              <Link to="/" className="footer-brand-mark">
                <div className="footer-brand-icon">◈</div>
                <span className="footer-brand-name">
                  Credit<span>Sense</span>
                </span>
              </Link>
              <p className="footer-tagline">
                Intelligent credit analysis for smarter financial decisions.
              </p>
            </div>

            {/* Link Columns */}
            <div className="footer-cols">
              <div className="footer-col">
                <p className="footer-col-title">Company</p>
                <div className="footer-col-links">
                  <Link to="/how-it-works">About Us</Link>
                  <Link to="/how-it-works">How It Works</Link>
                  <Link to="/how-it-works">Careers</Link>
                </div>
              </div>

              <div className="footer-col">
                <p className="footer-col-title">Product</p>
                <div className="footer-col-links">
                  <Link to="/dashboard">Dashboard</Link>
                  <Link to="/upload-statement">Upload Statement</Link>
                  <Link to="/how-it-works">Reports</Link>
                </div>
              </div>

              <div className="footer-col">
                <p className="footer-col-title">Support</p>
                <div className="footer-col-links">
                  <Link to="/how-it-works">Contact</Link>
                  <Link to="/how-it-works">FAQ</Link>
                  <Link to="/how-it-works">Privacy Policy</Link>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              <div className="footer-copyright-icon">◈</div>
              <span>© {new Date().getFullYear()} CreditSense. All rights reserved.</span>
            </div>

            <div className="footer-legal">
              <Link to="/how-it-works">Terms of Service</Link>
              <div className="footer-legal-dot" />
              <Link to="/how-it-works">Privacy Policy</Link>
              <div className="footer-legal-dot" />
              <Link to="/how-it-works">Cookie Policy</Link>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}

export default Footer;