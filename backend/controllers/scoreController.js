import axios from "axios";

import { getUserTransactions } from "../models/Transaction.js";
import { saveFinancialScore, getUserScore } from "../models/FinancialScore.js";
import { detectCategory } from "../utils/transactionParser.js";


const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000/predict";
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 15000);

const normalizeAmount = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return Math.abs(value);

  const text = String(value ?? "").trim();
  if (!text) return null;

  const parsed = Number(text.replace(/[, ]/g, ""));
  if (!Number.isFinite(parsed) || parsed === 0) return null;

  return Math.abs(parsed);
};

const normalizeType = (value, description = "") => {
  const normalized = String(value || "").toLowerCase().trim();

  if (["income", "credit", "cr"].includes(normalized) || normalized.includes("deposit")) {
    return "income";
  }

  if (
    ["expense", "debit", "dr"].includes(normalized) ||
    normalized.includes("withdraw") ||
    normalized.includes("payment")
  ) {
    return "expense";
  }

  const context = String(description || "").toLowerCase();
  if (/\b(salary|refund|credit|deposit|interest)\b/.test(context)) return "income";

  return "expense";
};

const normalizeCategory = (value, description = "") => {
  const category = String(value || "").toLowerCase().trim();
  if (category) return category;
  return detectCategory(description);
};

const toAITransaction = (transaction) => {
  const amount = normalizeAmount(transaction?.amount);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const description = String(transaction?.description || "").trim();
  const type = normalizeType(transaction?.type, description);
  const category = normalizeCategory(transaction?.category, description);

  return {
    amount,
    type,
    category,
  };
};

const formatTransactionsForAI = (transactions) => {
  return transactions
    .map((t) => toAITransaction(t))
    .filter(Boolean);
};

const callAIService = async (transactions) => {
  const response = await axios.post(
    AI_SERVICE_URL,
    { transactions },
    {
      timeout: AI_TIMEOUT_MS,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

const handleScoreError = (res, error, fallbackMessage) => {
  if (axios.isAxiosError(error)) {
    const aiStatus = error.response?.status;
    const aiBody = error.response?.data;

    console.error("AI Service Error:", aiStatus || error.code, aiBody || error.message);

    return res.status(502).json({
      error: "AI service request failed",
      details: aiBody || error.message,
    });
  }

  console.error(fallbackMessage, error.message);
  return res.status(500).json({ error: fallbackMessage });
};

/**
 * Generate Financial Score
 */
export const generateScore = async (req, res) => {
  try {
    const user_id = req.user.id;

    // 1. Get transactions
    const transactions = await getUserTransactions(user_id);

    if (!transactions || transactions.length === 0) {
      return res.status(400).json({
        message: "No transactions found",
      });
    }

    // 2. Clean transactions
    const cleanTransactions = formatTransactionsForAI(transactions);

    if (cleanTransactions.length === 0) {
      return res.status(400).json({
        message: "No valid transactions after parsing",
      });
    }

    // 3. Call AI service
    const aiResult = await callAIService(cleanTransactions);

    // 4. Save score
    const scoreData = await saveFinancialScore(
      user_id,
      aiResult.score,
      aiResult.risk_level,
      aiResult.income_stability,
      aiResult.savings_ratio,
      aiResult.debt_ratio
    );

    // 5. Send response
    res.json({
      ...scoreData,
      insights: aiResult.insights || [],
      anomalies: aiResult.anomalies || [],
    });

  } catch (error) {
    return handleScoreError(res, error, "Failed to generate financial score");
  }
};

/**
 * Fetch Financial Score + Insights
 */
export const fetchScore = async (req, res) => {
  try {
    const user_id = req.user.id;

    // 1. Get stored score
    const score = await getUserScore(user_id);

    if (!score) {
      return res.status(404).json({
        message: "Score not generated yet",
      });
    }

    // 2. Get transactions
    const transactions = await getUserTransactions(user_id);

    if (!transactions || transactions.length === 0) {
      return res.status(400).json({
        message: "No transactions found",
      });
    }

    // 3. Clean transactions
    const cleanTransactions = formatTransactionsForAI(transactions);

    if (cleanTransactions.length === 0) {
      return res.status(400).json({
        message: "No valid transactions after parsing",
      });
    }

    // 4. Call AI service again for insights + anomalies
    const aiResult = await callAIService(cleanTransactions);

    // 5. Return combined data
    res.json({
      ...score,
      insights: aiResult.insights || [],
      anomalies: aiResult.anomalies || [],
    });

  } catch (error) {
    return handleScoreError(res, error, "Failed to fetch financial score");
  }
};