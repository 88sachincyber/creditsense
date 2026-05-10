import { Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400&display=swap');

  .hiw-root {
    background: #0a0a0a;
    font-family: 'DM Mono', monospace;
    color: #f5f0e8;
    position: relative; overflow: hidden;
    min-height: 100vh;
  }

  .hiw-bg-grid {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .hiw-glow-a {
    position: fixed; width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(232,196,104,0.06) 0%, transparent 70%);
    top: -80px; left: -80px; pointer-events: none;
  }

  .hiw-glow-b {
    position: fixed; width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(232,196,104,0.05) 0%, transparent 70%);
    bottom: 100px; right: -60px; pointer-events: none;
  }

  .hiw-inner {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
    padding: 72px 32px 80px;
  }

  .hiw-eyebrow {
    font-size: 10px; letter-spacing: 0.22em;
    color: #e8c468; text-transform: uppercase; margin-bottom: 12px;
  }

  .hiw-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 42px; font-weight: 700; color: #f5f0e8;
    letter-spacing: -0.025em; line-height: 1.08; margin-bottom: 20px;
  }

  .hiw-hero-sub {
    font-size: 13px; color: #666;
    letter-spacing: 0.04em; line-height: 1.7;
    max-width: 540px; margin-bottom: 60px;
  }

  .hiw-divider {
    display: flex; align-items: center; gap: 14px; margin-bottom: 52px;
  }
  .hiw-divider-line { flex: 1; height: 1px; background: #1e1e1e; }
  .hiw-divider-label {
    font-size: 9px; letter-spacing: 0.22em;
    text-transform: uppercase; color: #e8c468; white-space: nowrap;
  }

  .hiw-steps { display: flex; flex-direction: column; }

  .hiw-step {
    display: grid; grid-template-columns: 72px 1fr;
    padding-bottom: 48px; position: relative;
  }

  .hiw-step-left {
    display: flex; flex-direction: column;
    align-items: center; padding-top: 2px; position: relative;
  }

  .hiw-step:not(:last-child) .hiw-step-left::after {
    content: '';
    position: absolute; top: 48px; left: 35px;
    width: 1px; bottom: 0;
    background: linear-gradient(180deg, #2a2a2a, transparent);
  }

  .hiw-step-num {
    width: 40px; height: 40px;
    border: 1px solid #2a2a2a;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; color: #e8c468; letter-spacing: 0.1em;
    flex-shrink: 0; position: relative; z-index: 1;
    background: #0a0a0a;
  }

  .hiw-step-right { padding-left: 8px; }

  .hiw-step-tag {
    font-size: 9px; letter-spacing: 0.2em;
    text-transform: uppercase; color: #444; margin-bottom: 8px;
  }

  .hiw-step-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: #f5f0e8;
    letter-spacing: -0.015em; margin-bottom: 14px; line-height: 1.2;
  }

  .hiw-step-body {
    font-size: 12px; color: #777;
    line-height: 1.8; letter-spacing: 0.03em; margin-bottom: 18px;
  }

  .hiw-pills { display: flex; flex-wrap: wrap; gap: 8px; }

  .hiw-pill {
    font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
    padding: 5px 12px; border: 1px solid #1e1e1e; color: #555;
  }

  .hiw-pill.gold {
    border-color: rgba(232,196,104,0.3); color: #c8a848;
    background: rgba(232,196,104,0.05);
  }

  /* Score card */
  .hiw-score-card {
    background: #111; border: 1px solid #1e1e1e;
    padding: 16px 20px; margin-top: 16px;
    position: relative; max-width: 380px;
  }

  .hiw-sc-corner { position: absolute; width: 8px; height: 8px; border-color: rgba(232,196,104,0.4); border-style: solid; }
  .hiw-sc-corner.tl { top:-1px; left:-1px; border-width: 1.5px 0 0 1.5px; }
  .hiw-sc-corner.tr { top:-1px; right:-1px; border-width: 1.5px 1.5px 0 0; }
  .hiw-sc-corner.bl { bottom:-1px; left:-1px; border-width: 0 0 1.5px 1.5px; }
  .hiw-sc-corner.br { bottom:-1px; right:-1px; border-width: 0 1.5px 1.5px 0; }

  .hiw-score-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: #444; margin-bottom: 10px; }
  .hiw-score-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .hiw-score-num { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; color: #f5f0e8; }
  .hiw-score-badge {
    font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase;
    padding: 5px 14px; border: 1px solid rgba(232,196,104,0.3); color: #e8c468;
  }
  .hiw-score-bar { height: 2px; background: #1a1a1a; margin-bottom: 14px; }
  .hiw-score-fill { height: 100%; width: 80%; background: linear-gradient(90deg, #a88030, #e8c468); }

  .hiw-reason {
    display: flex; align-items: center; gap: 8px;
    font-size: 10px; color: #666; letter-spacing: 0.04em; margin-top: 6px;
  }
  .hiw-reason-dot { width: 5px; height: 5px; background: #e8c468; flex-shrink: 0; }
  .hiw-reason-dot.red { background: #c45454; }
  .pos { color: #c8a848; }
  .neg { color: #c45454; }

  /* Alert card */
  .hiw-alert-card {
    background: #111; border: 1px solid #1e1e1e;
    border-left: 2px solid #c45454;
    padding: 14px 18px; margin-top: 16px; max-width: 380px;
  }

  .hiw-alert-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }

  .hiw-alert-dot {
    width: 6px; height: 6px; background: #c45454;
    border-radius: 50%; flex-shrink: 0;
    animation: hiwBlink 1.4s ease infinite;
  }

  @keyframes hiwBlink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .hiw-alert-title { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #c45454; }
  .hiw-alert-body { font-size: 11px; color: #666; line-height: 1.6; }
  .hiw-alert-body strong { color: #f5f0e8; font-weight: 400; }

  /* CTA */
  .hiw-cta {
    margin-top: 64px; padding: 40px;
    border: 1px solid #1e1e1e; position: relative;
    display: flex; align-items: center; justify-content: space-between;
    gap: 24px; flex-wrap: wrap; background: #111;
  }

  .hiw-cta-corner { position: absolute; width: 12px; height: 12px; border-color: #e8c468; border-style: solid; }
  .hiw-cta-corner.tl { top:-1px; left:-1px; border-width: 2px 0 0 2px; }
  .hiw-cta-corner.tr { top:-1px; right:-1px; border-width: 2px 2px 0 0; }
  .hiw-cta-corner.bl { bottom:-1px; left:-1px; border-width: 0 0 2px 2px; }
  .hiw-cta-corner.br { bottom:-1px; right:-1px; border-width: 0 2px 2px 0; }

  .hiw-cta-text {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: #f5f0e8;
    max-width: 380px; line-height: 1.2;
  }

  .hiw-cta-text span { color: #e8c468; }

  .hiw-cta-btn {
    background: #e8c468; color: #0a0a0a;
    border: none; font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 16px 32px; cursor: pointer;
    white-space: nowrap; transition: background 0.2s, transform 0.1s;
    text-decoration: none; display: inline-block;
  }

  .hiw-cta-btn:hover { background: #f0d080; }
  .hiw-cta-btn:active { transform: scale(0.99); }

  @media (max-width: 600px) {
    .hiw-hero-title { font-size: 30px; }
    .hiw-step { grid-template-columns: 52px 1fr; }
    .hiw-cta { flex-direction: column; align-items: flex-start; }
  }
`;

const steps = [
  {
    num: "01",
    tag: "Secure connection",
    title: <>Securely connect<br />your data.</>,
    body: "Log in and upload your bank statement or transaction history in seconds. We use bank-grade 256-bit encryption so your data never leaves our secure environment. No passwords, no third-party sharing — just you, your data, and CreditSense.",
    pills: [
      { label: "256-bit encryption", gold: true },
      { label: "PDF / CSV / XLSX" },
      { label: "No passwords shared" },
    ],
  },
  {
    num: "02",
    tag: "AI behavioural analysis",
    title: <>We read your habits,<br />not your history.</>,
    body: "Our machine learning engine goes beyond credit scores. It analyses three pillars of your financial life — income stability, savings ratios, and spending patterns. No judgement on old loans. No penalties for a difficult past. Just a clear-eyed look at the person you are right now.",
    pills: [
      { label: "Income stability", gold: true },
      { label: "Savings ratio", gold: true },
      { label: "Spending patterns", gold: true },
      { label: "No loan history needed" },
    ],
  },
  {
    num: "03",
    tag: "Transparent score",
    title: <>Your score — and<br />exactly why.</>,
    body: "Receive your Financial Health Score instantly. But unlike a black-box algorithm, our Explainable AI breaks down every point — so you know precisely what's working in your favour and what to improve. Transparency isn't a feature, it's our foundation.",
    extra: "score",
  },
  {
    num: "04",
    tag: "Monitor & protect",
    title: <>Your financial<br />guardrail, 24/7.</>,
    body: "CreditSense doesn't just score you once and walk away. Our anomaly detection engine watches for unusual spending spikes, duplicate charges, and irregular transactions — alerting you the moment something looks off. Think of it as a financial early-warning system, always on.",
    extra: "alert",
    pills: [
      { label: "Real-time alerts", gold: true },
      { label: "Duplicate detection" },
      { label: "Spending spike monitoring" },
    ],
  },
];

function HowItWorks() {
  return (
    <>
      <style>{styles}</style>
      <div className="hiw-root">
        <div className="hiw-bg-grid" />
        <div className="hiw-glow-a" />
        <div className="hiw-glow-b" />

        <div className="hiw-inner">
          <p className="hiw-eyebrow">How CreditSense Works</p>
          <h1 className="hiw-hero-title">Your money, finally<br />understood.</h1>
          <p className="hiw-hero-sub">
            Forget outdated loan histories. CreditSense reads your real financial behaviour — your savings, income, and spending — and turns it into a score that actually reflects who you are today.
          </p>

          <div className="hiw-divider">
            <div className="hiw-divider-line" />
            <span className="hiw-divider-label">Four simple steps</span>
            <div className="hiw-divider-line" />
          </div>

          <div className="hiw-steps">
            {steps.map((step, i) => (
              <div className="hiw-step" key={i}>
                <div className="hiw-step-left">
                  <div className="hiw-step-num">{step.num}</div>
                </div>
                <div className="hiw-step-right">
                  <p className="hiw-step-tag">{step.tag}</p>
                  <h2 className="hiw-step-title">{step.title}</h2>
                  <p className="hiw-step-body">{step.body}</p>

                  {step.extra === "score" && (
                    <div className="hiw-score-card">
                      <div className="hiw-sc-corner tl" /><div className="hiw-sc-corner tr" />
                      <div className="hiw-sc-corner bl" /><div className="hiw-sc-corner br" />
                      <p className="hiw-score-label">Financial Health Score</p>
                      <div className="hiw-score-row">
                        <span className="hiw-score-num">742</span>
                        <span className="hiw-score-badge">Low Risk</span>
                      </div>
                      <div className="hiw-score-bar"><div className="hiw-score-fill" /></div>
                      <div className="hiw-reason"><div className="hiw-reason-dot" /><span><span className="pos">+50 pts</span> — consistent monthly savings detected</span></div>
                      <div className="hiw-reason"><div className="hiw-reason-dot" /><span><span className="pos">+35 pts</span> — stable salary income for 8+ months</span></div>
                      <div className="hiw-reason"><div className="hiw-reason-dot red" /><span><span className="neg">−12 pts</span> — dining spend up 32% this month</span></div>
                    </div>
                  )}

                  {step.extra === "alert" && (
                    <div className="hiw-alert-card">
                      <div className="hiw-alert-top">
                        <div className="hiw-alert-dot" />
                        <span className="hiw-alert-title">Anomaly Detected</span>
                      </div>
                      <p className="hiw-alert-body">
                        An unusual transaction of <strong>₹12,400</strong> was recorded at 1:43 AM on 14 Mar — significantly above your average. Review this in your dashboard.
                      </p>
                    </div>
                  )}

                  {step.pills && (
                    <div className="hiw-pills" style={{ marginTop: step.extra ? "16px" : "0" }}>
                      {step.pills.map((p, j) => (
                        <span key={j} className={`hiw-pill${p.gold ? " gold" : ""}`}>{p.label}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="hiw-cta">
            <div className="hiw-cta-corner tl" /><div className="hiw-cta-corner tr" />
            <div className="hiw-cta-corner bl" /><div className="hiw-cta-corner br" />
            <p className="hiw-cta-text">
              Ready to understand your <span>true financial health?</span>
            </p>
            <Link to="/register" className="hiw-cta-btn">Get My Score →</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default HowItWorks;