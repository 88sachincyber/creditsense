import pool from "../config/db.js";

export const createTransaction = async (
  user_id,
  date,
  description,
  amount,
  category,
  type
) => {
  const query = `
    INSERT INTO transactions
    (user_id, date, description, amount, category, type)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *
  `;

  const values = [user_id, date, description, amount, category, type];

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const getUserTransactions = async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM transactions WHERE user_id=$1 ORDER BY date DESC",
    [user_id]
  );

  return result.rows;
};