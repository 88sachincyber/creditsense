import { useEffect, useState } from "react";
import API from "../services/api";
import TransactionTable from "../components/TransactionTable";
import SpendingChart from "../components/SpendingChart";

function Dashboard() {

  const [score, setScore] = useState(null);
  const [scoreLoading, setScoreLoading] = useState(true);
  const [scoreError, setScoreError] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    savings: 0
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setScoreLoading(true);
    setScoreError("");

    try {
      // fetch transactions first
      const txRes = await API.get("/transactions");
      const tx = txRes.data || [];

      setTransactions(tx);
      calculateSummary(tx);

      // avoid score generation errors until user uploads statement data
      if (tx.length === 0) {
        setScore(null);
        setInsights([]);
        setAnomalies([]);
        setScoreError("Upload a statement to generate your financial score.");
        return;
      }

      // generate + fetch score when transactions exist
      await API.post("/scores/generate");
      const scoreRes = await API.get("/scores");

      setScore(scoreRes.data);
      setInsights(scoreRes.data.insights || []);
      setAnomalies(scoreRes.data.anomalies || []);

    } catch (err) {
      const apiError = err?.response?.data?.error || err?.response?.data?.message;
      setScoreError(apiError || "Unable to generate score right now");
      console.log(err);
    } finally {
      setScoreLoading(false);
    }
  };

  const calculateSummary = (tx) => {

    let income = 0;
    let expense = 0;

    tx.forEach((t) => {
      if (t.type === "income") income += Number(t.amount);
      else expense += Number(t.amount);
    });

    setSummary({
      income,
      expense,
      savings: income - expense
    });

  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div style={{ padding: "30px" }}>

      <h1>Financial Dashboard</h1>
      <p>{today}</p>

      {/* Credit Score */}
      <div style={{ marginTop: "20px" }}>
        <h2>Financial Health Score</h2>

        {score ? (
          <>
            <h1>{score.score}</h1>
            <p>Risk Level: {score.risk_level}</p>
          </>
        ) : scoreLoading ? (
          <p>Generating score...</p>
        ) : scoreError ? (
          <p style={{ color: "#c0392b" }}>{scoreError}</p>
        ) : (
          <p>Score unavailable</p>
        )}
      </div>

      {/* Financial Summary */}
      <div style={{ marginTop: "30px" }}>
        <h2>Financial Summary</h2>

        <div style={{ display: "flex", gap: "20px" }}>

          <div style={{ border: "1px solid #ccc", padding: "15px", width: "200px" }}>
            <h4>Total Income</h4>
            <p>₹ {summary.income}</p>
          </div>

          <div style={{ border: "1px solid #ccc", padding: "15px", width: "200px" }}>
            <h4>Total Expenses</h4>
            <p>₹ {summary.expense}</p>
          </div>

          <div style={{ border: "1px solid #ccc", padding: "15px", width: "200px" }}>
            <h4>Net Savings</h4>
            <p>₹ {summary.savings}</p>
          </div>

        </div>
      </div>

      {/* AI Insights */}
      <div style={{ marginTop: "40px" }}>
        <h2>AI Financial Insights</h2>

        {insights.length === 0 ? (
          <p>No insights available</p>
        ) : (
          insights.map((insight, i) => (
            <p key={i}>• {insight}</p>
          ))
        )}
      </div>

      {/* Anomaly Alerts */}
      <div style={{ marginTop: "30px" }}>
        <h2>Anomaly Alerts</h2>

        {anomalies.length === 0 ? (
          <p>No anomalies detected</p>
        ) : (
          anomalies.map((a, i) => (
            <p key={i}>⚠ {a}</p>
          ))
        )}
      </div>

      {/* Transactions */}
      <div style={{ marginTop: "40px" }}>
        <h2>Recent Transactions</h2>
        <TransactionTable transactions={transactions} />
      </div>

      {/* Spending Chart */}
      <div style={{ marginTop: "40px" }}>
        <h2>Spending Analytics</h2>
        <SpendingChart transactions={transactions} />
      </div>

    </div>
  );
}

export default Dashboard;