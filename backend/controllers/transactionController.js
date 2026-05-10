import { parseCSVTransactions, parseTransactions } from "../utils/transactionParser.js";
import { parseFile } from "../utils/fileHandler.js";
import {
  createTransaction,
  getUserTransactions,
} from "../models/Transaction.js";

/* ================================
   Add Transaction (Manual)
================================ */
export const addTransaction = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { date, description, amount, category, type } = req.body;

    console.log("➤ Adding Transaction:", req.body);

    const transaction = await createTransaction(
      user_id,
      date,
      description,
      amount,
      category,
      type
    );

    res.status(201).json(transaction);
  } catch (error) {
    console.error("❌ addTransaction ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================================
   Fetch Transactions
================================ */
export const fetchTransactions = async (req, res) => {
  try {
    const user_id = req.user.id;

    const transactions = await getUserTransactions(user_id);

    console.log("➤ Fetched Transactions:", transactions.length);

    res.json(transactions);
  } catch (error) {
    console.error("❌ fetchTransactions ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================================
   File Parser Router (PDF / CSV)
================================ */
const parseUploadedTransactions = async (file) => {
  try {
    const filePath = file?.path;
    const originalName = file?.originalname;
    const mimeType = file?.mimetype;

    console.log("📁 File Info:", { filePath, originalName, mimeType });

    const normalizedName = String(originalName || "").toLowerCase();
    const normalizedMime = String(mimeType || "").toLowerCase();

    // ===== PDF Handling =====
    if (normalizedMime.includes("pdf") || normalizedName.endsWith(".pdf")) {
      console.log("📄 Detected PDF file");

      const rawText = await parseFile(filePath, {
        fileName: originalName,
        mimeType,
      });

      console.log("📄 Raw Text Length:", rawText?.length);

      const parsed = parseTransactions(rawText);

      console.log("📄 Parsed Transactions Count:", parsed.length);

      return parsed;
    }

    // ===== CSV Handling =====
    if (
      normalizedMime.includes("csv") ||
      normalizedMime.includes("excel") ||
      normalizedName.endsWith(".csv")
    ) {
      console.log("📊 Detected CSV file");

      const parsed = await parseCSVTransactions(filePath);

      console.log("📊 Parsed CSV Count:", parsed.length);

      return parsed;
    }

    throw new Error("Unsupported file type. Please upload a PDF or CSV file.");

  } catch (error) {
    console.error("❌ parseUploadedTransactions ERROR:", error);
    throw error;
  }
};

const isUploadValidationError = (message = "") => {
  const normalized = String(message).toLowerCase();

  return (
    normalized.includes("unsupported file type") ||
    normalized.includes("no valid transactions") ||
    normalized.includes("empty content") ||
    normalized.includes("text-based pdf") ||
    normalized.includes("failed to parse pdf file")
  );
};

/* ================================
   Upload & Save Transactions
================================ */
export const uploadTransactions = async (req, res) => {
  try {
    console.log("🚀 UploadTransactions API HIT");

    const user_id = req.user.id;

    if (!req.file?.path) {
      console.log("❌ No file received");
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    console.log("✅ File received:", req.file.path);

    const transactions = await parseUploadedTransactions(req.file);

    if (!transactions || transactions.length === 0) {
      console.log("❌ No valid transactions parsed");
      return res.status(400).json({
        error: "No valid transactions found in the uploaded statement",
      });
    }

    const saved = [];

    for (const t of transactions) {
      try {
        if (!t.amount || isNaN(t.amount)) {
          console.log("⚠️ Skipping invalid transaction:", t);
          continue;
        }

        const transaction = await createTransaction(
          user_id,
          t.date || new Date(),
          t.description || "Unknown",
          t.amount,
          t.category || "Other",
          t.type || "expense"
        );

        saved.push(transaction);

      } catch (err) {
        console.log("⚠️ Failed to save transaction:", err.message);
      }
    }

    console.log("✅ Saved Transactions:", saved.length);

    res.json({
      message: "Transactions uploaded successfully",
      count: saved.length,
    });

  } catch (error) {
    console.error("❌ uploadTransactions ERROR:", error);

    const message = error.message || "Failed to upload transactions";
    const status = isUploadValidationError(message) ? 400 : 500;

    res.status(status).json({
      error: message,
    });
  }
};

/* ================================
   Upload & Preview Only (No Save)
================================ */
export const uploadStatement = async (req, res) => {
  try {
    console.log("🚀 UploadStatement API HIT");

    if (!req.file?.path) {
      console.log("❌ No file received");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("✅ File received:", req.file);

    const transactions = await parseUploadedTransactions(req.file);

    if (!transactions || transactions.length === 0) {
      console.log("❌ Parsing failed");
      return res.status(400).json({
        error: "No transactions parsed from file",
      });
    }

    console.log("✅ Preview Transactions:", transactions.slice(0, 5));

    res.json({
      message: "Parsed successfully",
      count: transactions.length,
      transactions,
    });

  } catch (err) {
    console.error("❌ uploadStatement ERROR:", err);

    const message = err.message || "Failed to parse statement";
    const status = isUploadValidationError(message) ? 400 : 500;

    res.status(status).json({
      error: message,
    });
  }
};