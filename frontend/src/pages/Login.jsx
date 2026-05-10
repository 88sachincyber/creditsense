import { useState } from "react";
import API from "../services/api";
import { useNavigate, } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400&display=swap');

  .login-root {
    background: #0a0a0a;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    overflow: hidden;
    position: relative;
  }

  .login-bg-grid {
    position: fixed; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .login-glow {
    position: fixed;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(232,196,104,0.07) 0%, transparent 70%);
    top: -100px; left: -100px;
    pointer-events: none;
    animation: loginDrift 8s ease-in-out infinite alternate;
  }

  @keyframes loginDrift {
    from { transform: translate(0,0); }
    to   { transform: translate(120px, 80px); }
  }

  .login-card {
    position: relative; z-index: 1;
    width: 420px;
    background: #111;
    border: 1px solid #222;
    padding: 52px 48px 44px;
    animation: loginFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes loginFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .login-corner {
    position: absolute;
    width: 16px; height: 16px;
    border-color: #e8c468;
    border-style: solid;
  }
  .login-corner.tl { top: -1px; left: -1px;  border-width: 2px 0 0 2px; }
  .login-corner.tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
  .login-corner.bl { bottom: -1px; left: -1px;  border-width: 0 0 2px 2px; }
  .login-corner.br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

  .login-eyebrow {
    font-size: 10px;
    letter-spacing: 0.2em;
    color: #e8c468;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .login-heading {
    font-family: 'Playfair Display', serif;
    font-size: 34px;
    font-weight: 700;
    color: #f5f0e8;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 36px;
  }

  .login-field { margin-bottom: 20px; }

  .login-label {
    display: block;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 8px;
  }

  .login-input {
    width: 100%;
    background: #0a0a0a;
    border: 1px solid #2a2a2a;
    color: #f5f0e8;
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    padding: 13px 16px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
    box-sizing: border-box;
  }

  .login-input::placeholder { color: #333; }

  .login-input:focus {
    border-color: #e8c468;
    box-shadow: 0 0 0 3px rgba(232,196,104,0.07);
  }

  .login-btn {
    margin-top: 32px;
    width: 100%;
    background: #e8c468;
    color: #0a0a0a;
    border: none;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 16px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
  }

  .login-btn:hover { background: #f0d080; }
  .login-btn:active { transform: scale(0.99); }

  .login-footer {
    margin-top: 28px;
    font-size: 11px;
    color: #333;
    letter-spacing: 0.04em;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .login-footer a { color: #555; text-decoration: none; transition: color 0.2s; }
  .login-footer a:hover { color: #e8c468; }
  .login-divider { width: 1px; height: 12px; background: #222; }
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="login-bg-grid" />
        <div className="login-glow" />

        <div className="login-card">
          <div className="login-corner tl" />
          <div className="login-corner tr" />
          <div className="login-corner bl" />
          <div className="login-corner br" />

          <p className="login-eyebrow">Secure Access</p>
          <h2 className="login-heading">Welcome<br />back.</h2>

          <div className="login-field">
            <label className="login-label">Email Address</label>
            <input
              className="login-input"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              className="login-input"
              type="password"
              placeholder="••••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn" onClick={handleLogin}>
            Sign In →
          </button>

          <div className="login-footer">
            <a href="#">Forgot password?</a>
            <div className="login-divider" />
            <a href="#">Create account</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;