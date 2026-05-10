import pool from "../config/db.js";

export const saveFinancialScore = async (
  user_id,
  score,
  risk_level,
  income_stability,
  savings_ratio,
  debt_ratio
) => {
  const query = `
  INSERT INTO financial_scores
  (user_id, score, risk_level, income_stability, savings_ratio, debt_ratio)
  VALUES ($1,$2,$3,$4,$5,$6)
  RETURNING *
  `;

  const values = [
    user_id,
    score,
    risk_level,
    income_stability,
    savings_ratio,
    debt_ratio,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const getUserScore = async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM financial_scores WHERE user_id=$1 ORDER BY id DESC LIMIT 1",
    [user_id]
  );

  return result.rows[0];
};