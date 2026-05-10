import fs from "fs";
import csv from "csv-parser";

const DEFAULT_DESCRIPTION = "Bank transaction";
const DEFAULT_CATEGORY = "other";
const DEFAULT_TYPE = "expense";

const DATE_TOKEN_PATTERN = "(?:\\d{1,2}[\\/.-]\\d{1,2}(?:[\\/.-]\\d{2,4})?|\\d{1,2}(?:\\s+|[-\\/])[A-Za-z]{3,9}(?:(?:\\s+|[-\\/])\\d{2,4})?)";
const DATE_AT_START_REGEX = new RegExp(`^(${DATE_TOKEN_PATTERN})(?:\\s+|$)`, "i");
const DATE_ANY_REGEX = new RegExp(`(?:^|\\s)(${DATE_TOKEN_PATTERN})(?:\\s|$)`, "i");
const AMOUNT_REGEX = /(?<![\d/.-])-?\(?\d[\d,]*(?:\.\d{1,2})?\)?-?(?![\d/.-])/g;

const MONTH_MAP = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

const CATEGORY_RULES = [
  {
    category: "food",
    keywords: ["swiggy", "zomato", "restaurant", "cafe", "food", "dining", "hotel"],
  },
  {
    category: "shopping",
    keywords: ["amazon", "flipkart", "myntra", "ajio", "shopping", "store", "mart"],
  },
  {
    category: "cash",
    keywords: ["atm", "cash withdrawal", "cash wdl", "self-switch", "cash"],
  },
  {
    category: "upi",
    keywords: ["upi", "paytm", "gpay", "phonepe", "bharatpe", "qr"],
  },
  {
    category: "salary",
    keywords: ["salary", "payroll", "wages", "stipend"],
  },
  {
    category: "transfer",
    keywords: ["neft", "rtgs", "imps", "fund transfer", "bank transfer", "remittance"],
  },
  {
    category: "transport",
    keywords: ["uber", "ola", "metro", "fuel", "petrol", "diesel", "toll", "travel"],
  },
  {
    category: "utilities",
    keywords: ["electricity", "water", "gas", "broadband", "internet", "bill", "recharge"],
  },
  {
    category: "entertainment",
    keywords: ["netflix", "prime", "spotify", "movie", "bookmyshow", "entertainment"],
  },
  {
    category: "health",
    keywords: ["hospital", "pharmacy", "clinic", "medic", "health", "doctor"],
  },
  {
    category: "emi",
    keywords: ["emi", "loan", "credit card", "installment"],
  },
];

const CSV_FIELD_CANDIDATES = {
  date: ["date", "txn date", "transaction date", "value date", "posted date"],
  description: ["description", "narration", "particulars", "remarks", "details", "merchant"],
  type: ["type", "transaction type", "dr/cr", "txn type"],
  amount: ["amount", "txn amount", "transaction amount"],
  debit: ["debit", "withdrawal", "withdraw", "dr", "debit amount"],
  credit: ["credit", "deposit", "cr", "credit amount"],
  category: ["category"],
};

const normalizeWhitespace = (value) => String(value || "").replace(/\s+/g, " ").trim();

const parseAmount = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const text = normalizeWhitespace(value);
  if (!text) return null;

  const isNegative = text.includes("(") || text.startsWith("-") || text.endsWith("-");
  const normalized = text.replace(/[(),]/g, "").replace(/[^0-9.-]/g, "");
  if (!normalized || normalized === "-" || normalized === ".") return null;

  const amount = Number(normalized);
  if (!Number.isFinite(amount)) return null;

  return isNegative ? -Math.abs(amount) : amount;
};

const formatDate = (day, month, year) => {
  const dd = String(day).padStart(2, "0");
  const mm = String(month).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
};

const normalizeDate = (value) => {
  const text = normalizeWhitespace(value);
  if (!text) return null;

  const isoDate = text.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);
  if (isoDate) {
    const year = Number(isoDate[1]);
    const month = Number(isoDate[2]);
    const day = Number(isoDate[3]);

    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
      return null;
    }

    if (day < 1 || day > 31 || month < 1 || month > 12) return null;

    return formatDate(day, month, year);
  }

  const slashDate = text.replace(/[.-]/g, "/").match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (slashDate) {
    const day = Number(slashDate[1]);
    const month = Number(slashDate[2]);
    let year = slashDate[3] ? Number(slashDate[3]) : new Date().getFullYear();

    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
      return null;
    }

    if (year < 100) year += 2000;
    if (day < 1 || day > 31 || month < 1 || month > 12) return null;

    return formatDate(day, month, year);
  }

  const monthDate = text.match(/^(\d{1,2})(?:\s+|[-\/])([A-Za-z]{3,9})(?:(?:\s+|[-\/])(\d{2,4}))?$/);
  if (!monthDate) return null;

  const day = Number(monthDate[1]);
  const monthKey = String(monthDate[2] || "").toLowerCase();
  const month = MONTH_MAP[monthKey];
  let year = monthDate[3] ? Number(monthDate[3]) : new Date().getFullYear();

  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
    return null;
  }

  if (year < 100) year += 2000;
  if (day < 1 || day > 31 || month < 1 || month > 12) return null;

  return formatDate(day, month, year);
};

const normalizeType = (value) => {
  const text = normalizeWhitespace(value).toLowerCase();
  if (!text) return null;

  if (
    text.includes("income") ||
    text.includes("credit") ||
    text === "cr" ||
    text.includes("deposit") ||
    text.includes("salary")
  ) {
    return "income";
  }

  if (
    text.includes("expense") ||
    text.includes("debit") ||
    text === "dr" ||
    text.includes("withdraw") ||
    text.includes("purchase") ||
    text.includes("payment")
  ) {
    return "expense";
  }

  return null;
};

const inferTypeFromText = (value) => {
  const text = normalizeWhitespace(value).toLowerCase();
  if (!text) return DEFAULT_TYPE;

  if (
    /\b(cr|credit|salary|refund|deposit|interest)\b/.test(text) ||
    /\b(neft|imps|rtgs)\b/.test(text) && /\b(cr|credit)\b/.test(text)
  ) {
    return "income";
  }

  if (
    /\b(dr|debit|withdrawal|atm|purchase|upi|bill|emi|charge)\b/.test(text) ||
    /\b(neft|imps|rtgs)\b/.test(text) && /\b(dr|debit)\b/.test(text)
  ) {
    return "expense";
  }

  return DEFAULT_TYPE;
};

const normalizeCategory = (value) => {
  const text = normalizeWhitespace(value).toLowerCase();
  if (!text) return null;

  for (const rule of CATEGORY_RULES) {
    if (rule.category === text) return rule.category;
  }

  return null;
};

const isHeaderOrNoiseLine = (line) => {
  const text = normalizeWhitespace(line);
  if (!text) return true;

  const lower = text.toLowerCase();

  if (/^page\s+\d+/.test(lower)) return true;
  if (/^[\-_=*]{3,}$/.test(lower)) return true;

  if (
    lower.includes("date") &&
    lower.includes("description") &&
    (lower.includes("balance") || lower.includes("withdrawal") || lower.includes("credit") || lower.includes("debit"))
  ) {
    return true;
  }

  return (
    lower.startsWith("opening balance") ||
    lower.startsWith("closing balance") ||
    lower.includes("balance forward") ||
    lower.startsWith("statement period") ||
    lower.includes("ifsc") ||
    lower.includes("micr") ||
    lower.includes("customer id") ||
    lower.includes("account number") ||
    lower.startsWith("account statement") ||
    lower.startsWith("branch")
  );
};

const isMostlyNumericLine = (line) => {
  const text = normalizeWhitespace(line);
  if (!text) return false;
  return /^[-()\d.,\s]+$/.test(text);
};

const extractAmounts = (text) => {
  const normalized = normalizeWhitespace(text);
  const rawMatches = Array.from(normalized.matchAll(AMOUNT_REGEX)).map((match) => String(match[0] || ""));

  const candidates = rawMatches
    .map((raw) => ({
      raw,
      parsed: parseAmount(raw),
      digitsOnly: raw.replace(/\D/g, ""),
    }))
    .filter((item) => Number.isFinite(item.parsed));

  if (candidates.length === 0) return [];

  const withDecimalsOrCommas = candidates.filter((item) => /[.,]/.test(item.raw));
  if (withDecimalsOrCommas.length > 0) {
    return withDecimalsOrCommas.map((item) => item.parsed);
  }

  const withCurrencyHint = candidates.filter((item) => /(inr|rs|\u20B9)/i.test(item.raw));
  if (withCurrencyHint.length > 0) {
    return withCurrencyHint.map((item) => item.parsed);
  }

  const largeNumberCandidates = candidates.filter((item) => {
    const value = Math.abs(item.parsed);
    if (item.digitsOnly.length < 4) return false;
    if (value >= 1900 && value <= 2100) return false;
    return true;
  });

  if (largeNumberCandidates.length > 0) {
    return largeNumberCandidates.map((item) => item.parsed);
  }

  return candidates.map((item) => item.parsed);
};

const extractDateToken = (line) => {
  const text = normalizeWhitespace(line);
  if (!text) return null;

  const startMatch = text.match(DATE_AT_START_REGEX);
  if (startMatch) return startMatch[1];

  const anywhereMatch = text.match(DATE_ANY_REGEX);
  if (anywhereMatch) return anywhereMatch[1];

  return null;
};

const pickTransactionAmount = (amounts, context = "") => {
  const values = (amounts || []).map((value) => Math.abs(Number(value))).filter((value) => Number.isFinite(value) && value > 0);
  if (values.length === 0) return null;
  if (values.length === 1) return values[0];

  const lower = normalizeWhitespace(context).toLowerCase();
  const hasDebitCreditMarker = /\b(dr|cr|debit|credit)\b/.test(lower);

  if (hasDebitCreditMarker && values.length === 2) {
    return values[0];
  }

  if (values.length >= 3) {
    const firstTwo = values.slice(0, 2).filter((value) => value > 0);
    if (firstTwo.length > 0) return Math.min(...firstTwo);
  }

  if (values[1] > values[0] * 3) {
    return values[0];
  }

  return values[0];
};

const buildTransactionKey = (transaction) => {
  return `${transaction.date}|${transaction.amount}|${String(transaction.description || "").toLowerCase()}`;
};

const parseLineTransaction = (line) => {
  if (isHeaderOrNoiseLine(line)) return null;

  const dateToken = extractDateToken(line);
  if (!dateToken) return null;

  const normalizedDate = normalizeDate(dateToken);
  if (!normalizedDate) return null;

  const amounts = extractAmounts(line);
  const amount = pickTransactionAmount(amounts, line);
  if (!Number.isFinite(amount)) return null;

  const description = normalizeWhitespace(
    line
      .replace(dateToken, " ")
      .replace(AMOUNT_REGEX, " ")
      .replace(/\b(dr|cr|debit|credit|balance)\b/gi, " ")
  );

  return sanitizeTransaction({
    date: normalizedDate,
    description: description || DEFAULT_DESCRIPTION,
    amount,
    category: detectCategory(description),
    type: inferTypeFromText(line),
  });
};

const getRowValue = (normalizedRow, candidates) => {
  for (const key of candidates) {
    const value = normalizedRow[key];
    if (value !== undefined && normalizeWhitespace(value) !== "") {
      return value;
    }
  }

  return "";
};

const normalizeRowKeys = (row) => {
  const normalized = {};

  for (const [key, value] of Object.entries(row || {})) {
    normalized[normalizeWhitespace(key).toLowerCase()] = value;
  }

  return normalized;
};

const sanitizeTransaction = (transaction) => {
  const amountRaw = parseAmount(transaction.amount);
  if (!Number.isFinite(amountRaw) || amountRaw === 0) return null;

  const description = normalizeWhitespace(transaction.description) || DEFAULT_DESCRIPTION;
  const normalizedCategory = normalizeCategory(transaction.category) || detectCategory(description);
  const typeFromData = normalizeType(transaction.type);
  const inferredType = inferTypeFromText(`${description} ${transaction.type || ""}`);
  const type = typeFromData || inferredType || DEFAULT_TYPE;

  const date = normalizeDate(transaction.date) || new Date().toISOString().slice(0, 10);

  return {
    date,
    description,
    amount: Number(Math.abs(amountRaw).toFixed(2)),
    category: normalizedCategory || DEFAULT_CATEGORY,
    type,
  };
};

export const parseCSVTransactions = (filePath) => {
  return new Promise((resolve, reject) => {
    const transactions = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {

        const normalizedRow = normalizeRowKeys(row);

        const date = getRowValue(normalizedRow, CSV_FIELD_CANDIDATES.date);
        const description =
          getRowValue(normalizedRow, CSV_FIELD_CANDIDATES.description) || DEFAULT_DESCRIPTION;

        const amountField = getRowValue(normalizedRow, CSV_FIELD_CANDIDATES.amount);
        const debitField = getRowValue(normalizedRow, CSV_FIELD_CANDIDATES.debit);
        const creditField = getRowValue(normalizedRow, CSV_FIELD_CANDIDATES.credit);

        let amount = parseAmount(amountField);
        let type = normalizeType(getRowValue(normalizedRow, CSV_FIELD_CANDIDATES.type));

        const debitAmount = parseAmount(debitField);
        const creditAmount = parseAmount(creditField);

        if (!Number.isFinite(amount)) {
          if (Number.isFinite(debitAmount) && Math.abs(debitAmount) > 0) {
            amount = Math.abs(debitAmount);
            type = "expense";
          } else if (Number.isFinite(creditAmount) && Math.abs(creditAmount) > 0) {
            amount = Math.abs(creditAmount);
            type = "income";
          }
        }

        if (!type) {
          if (Number.isFinite(creditAmount) && Math.abs(creditAmount) > 0) {
            type = "income";
          } else if (Number.isFinite(debitAmount) && Math.abs(debitAmount) > 0) {
            type = "expense";
          } else {
            type = inferTypeFromText(description);
          }
        }

        const category =
          getRowValue(normalizedRow, CSV_FIELD_CANDIDATES.category) || detectCategory(description);

        const cleaned = sanitizeTransaction({
          date,
          description,
          amount,
          category,
          type,
        });

        if (cleaned) {
          transactions.push(cleaned);
        }
      })
      .on("end", () => {
        resolve(transactions);
      })
      .on("error", (error) => {
        reject(error);
      });

  });
};

export const parseTransactions = (text) => {
  const lines = String(text || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);

  if (lines.length === 0) return [];

  const transactions = [];
  const blocks = [];

  const hasDateRows = lines.some((line) => {
    const dateMatch = line.match(DATE_AT_START_REGEX);
    return Boolean(dateMatch && normalizeDate(dateMatch[1]));
  });

  if (hasDateRows) {
    let current = null;

    for (const line of lines) {
      if (isHeaderOrNoiseLine(line)) continue;

      const dateMatch = line.match(DATE_AT_START_REGEX);

      if (dateMatch) {
        const normalizedDate = normalizeDate(dateMatch[1]);
        if (!normalizedDate) continue;

        if (current) {
          blocks.push(current);
        }

        current = {
          date: normalizedDate,
          lines: [],
        };

        const remainder = normalizeWhitespace(line.slice(dateMatch[0].length));
        if (remainder) {
          current.lines.push(remainder);
        }

        continue;
      }

      if (!current) continue;
      current.lines.push(line);
    }

    if (current) {
      blocks.push(current);
    }
  } else {
    // Fallback when dates are not parsed line-first: close a block when amount line appears.
    let currentLines = [];

    for (const line of lines) {
      if (isHeaderOrNoiseLine(line)) continue;

      currentLines.push(line);

      if (extractAmounts(line).length > 0 && isMostlyNumericLine(line)) {
        blocks.push({ date: null, lines: currentLines });
        currentLines = [];
      }
    }
  }

  for (const block of blocks) {
    const merged = normalizeWhitespace((block.lines || []).join(" "));
    if (!merged) continue;

    if (
      !block.date &&
      !/\b(balance|debit|credit|withdrawal|purchase|upi|neft|imps|rtgs|salary|atm|cash|payment|transfer|deposit|interest)\b/i.test(merged)
    ) {
      continue;
    }

    const amountsFromNumericLine = (block.lines || [])
      .filter((line) => isMostlyNumericLine(line))
      .flatMap((line) => extractAmounts(line));

    const amounts = amountsFromNumericLine.length > 0 ? amountsFromNumericLine : extractAmounts(merged);
    if (amounts.length === 0) continue;

    const amount = pickTransactionAmount(amounts, merged);
    if (!Number.isFinite(amount)) continue;

    const descriptionLines = (block.lines || []).filter(
      (line) => !isMostlyNumericLine(line) && !isHeaderOrNoiseLine(line)
    );

    const description =
      normalizeWhitespace(descriptionLines.join(" ")) ||
      normalizeWhitespace(merged.replace(AMOUNT_REGEX, " ")) ||
      DEFAULT_DESCRIPTION;

    const cleaned = sanitizeTransaction({
      date: block.date,
      description,
      amount,
      category: detectCategory(description),
      type: inferTypeFromText(`${description} ${merged}`),
    });

    if (cleaned) {
      transactions.push(cleaned);
    }
  }

  const seen = new Set(transactions.map((transaction) => buildTransactionKey(transaction)));

  for (const line of lines) {
    const candidate = parseLineTransaction(line);
    if (!candidate) continue;

    const key = buildTransactionKey(candidate);
    if (seen.has(key)) continue;

    seen.add(key);
    transactions.push(candidate);
  }

  return transactions;
};

export const detectCategory = (text) => {
  const normalized = normalizeWhitespace(text).toLowerCase();
  if (!normalized) return DEFAULT_CATEGORY;

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.category;
    }
  }

  return DEFAULT_CATEGORY;
};