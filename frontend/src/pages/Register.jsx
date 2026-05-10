import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400&display=swap');

  .register-root {
    background: #0a0a0a;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    overflow: hidden;
    position: relative;
  }

  .register-bg-grid {
    position: fixed; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .register-glow {
    position: fixed;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(232,196,104,0.07) 0%, transparent 70%);
    bottom: -100px; right: -100px;
    pointer-events: none;
    animation: registerDrift 8s ease-in-out infinite alternate;
  }

  @keyframes registerDrift {
    from { transform: translate(0, 0); }
    to   { transform: translate(-80px, -60px); }
  }

  .register-card {
    position: relative; z-index: 1;
    width: 420px;
    background: #111;
    border: 1px solid #222;
    padding: 52px 48px 44px;
    animation: registerFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes registerFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .register-corner {
    position: absolute;
    width: 16px; height: 16px;
    border-color: #e8c468;
    border-style: solid;
  }
  .register-corner.tl { top: -1px; left: -1px;   border-width: 2px 0 0 2px; }
  .register-corner.tr { top: -1px; right: -1px;  border-width: 2px 2px 0 0; }
  .register-corner.bl { bottom: -1px; left: -1px;  border-width: 0 0 2px 2px; }
  .register-corner.br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

  .register-eyebrow {
    font-size: 10px;
    letter-spacing: 0.2em;
    color: #e8c468;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .register-heading {
    font-family: 'Playfair Display', serif;
    font-size: 34px;
    font-weight: 700;
    color: #f5f0e8;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 36px;
  }

  .register-field { margin-bottom: 18px; }

  .register-label {
    display: block;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 8px;
  }

  .register-input {
    width: 100%;
    background: #0a0a0a;
    border: 1px solid #2a2a2a;
    color: #f5f0e8;
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    padding: 13px 16px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    -webkit-appearance: none;
  }

  .register-input::placeholder { color: #333; }

  .register-input:focus {
    border-color: #e8c468;
    box-shadow: 0 0 0 3px rgba(232,196,104,0.07);
  }

  .register-btn {
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

  .register-btn:hover { background: #f0d080; }
  .register-btn:active { transform: scale(0.99); }

  .register-footer {
    margin-top: 28px;
    font-size: 11px;
    color: #333;
    letter-spacing: 0.04em;
    display: flex;
    justify-content: center;
    gap: 6px;
  }

  .register-footer a {
    color: #555;
    text-decoration: none;
    transition: color 0.2s;
  }

  .register-footer a:hover { color: #e8c468; }
`;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", { name, email, password });
      alert("Registration successful");
      navigate("/");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="register-root">
        <div className="register-bg-grid" />
        <div className="register-glow" />

        <div className="register-card">
          <div className="register-corner tl" />
          <div className="register-corner tr" />
          <div className="register-corner bl" />
          <div className="register-corner br" />

          <p className="register-eyebrow">New Account</p>
          <h2 className="register-heading">Create your<br />profile.</h2>

          <div className="register-field">
            <label className="register-label">Full Name</label>
            <input
              className="register-input"
              placeholder="John Doe"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="register-field">
            <label className="register-label">Email Address</label>
            <input
              className="register-input"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="register-field">
            <label className="register-label">Password</label>
            <input
              className="register-input"
              type="password"
              placeholder="••••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="register-btn" onClick={handleRegister}>
            Create Account →
          </button>

          <div className="register-footer">
            <span>Already have an account?</span>
            <a href="/">Sign in</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;