import fs from "fs";
import csv from "csv-parser";
import { PDFParse } from "pdf-parse";

const PDF_MIN_TEXT_LENGTH = Number(process.env.PDF_MIN_TEXT_LENGTH || 120);
const PDF_OCR_MAX_PAGES = Number(process.env.PDF_OCR_MAX_PAGES || 6);
const PDF_OCR_SCALE = Number(process.env.PDF_OCR_SCALE || 2);

const detectFileType = (filePath, options = {}) => {
  const normalizedPath = String(filePath || "").toLowerCase();
  const normalizedName = String(options.fileName || "").toLowerCase();
  const mimeType = String(options.mimeType || "").toLowerCase();

  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.includes("csv") || mimeType.includes("excel")) return "csv";

  if (normalizedName.endsWith(".pdf") || normalizedPath.endsWith(".pdf")) return "pdf";
  if (normalizedName.endsWith(".csv") || normalizedPath.endsWith(".csv")) return "csv";

  return null;
};

const stripPageMarkers = (text) => {
  return String(text || "")
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const hasStatementSignals = (text) => {
  const normalized = String(text || "").toLowerCase();
  if (!normalized) return false;

  const hasDate =
    /(?:\d{1,2}[\/.-]\d{1,2}(?:[\/.-]\d{2,4})?)/i.test(normalized) ||
    /(?:\d{1,2}(?:\s+|[-\/])[a-z]{3,9}(?:(?:\s+|[-\/])\d{2,4})?)/i.test(normalized);

  const hasAmount = /\d{1,3}(?:,\d{3})*(?:\.\d{2})/.test(normalized);
  const hasKeyword =
    /\b(date|description|debit|credit|withdrawal|deposit|balance|upi|atm|imps|neft|rtgs)\b/i.test(
      normalized
    );

  return hasAmount && (hasDate || hasKeyword);
};

const isUsableStatementText = (text) => {
  const normalized = stripPageMarkers(text);
  if (normalized.length < PDF_MIN_TEXT_LENGTH) return false;
  return hasStatementSignals(normalized);
};

const extractTextWithOcr = async (parser) => {
  const screenshotResult = await parser.getScreenshot({
    first: PDF_OCR_MAX_PAGES,
    scale: PDF_OCR_SCALE,
    imageDataUrl: false,
    imageBuffer: true,
  });

  const pages = screenshotResult?.pages || [];
  if (pages.length === 0) return "";

  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");

  const textParts = [];

  try {
    for (const page of pages) {
      const imageBuffer = page?.data;
      if (!imageBuffer) continue;

      const result = await worker.recognize(imageBuffer);
      const pageText = String(result?.data?.text || "").trim();

      if (pageText) {
        textParts.push(pageText);
      }
    }
  } finally {
    await worker.terminate();
  }

  return textParts.join("\n").trim();
};

export const parseFile = async (filePath, options = {}) => {
  const fileType = detectFileType(filePath, options);

  // ✅ PDF
  if (fileType === "pdf") {
    let parser;

    try {
      const buffer = fs.readFileSync(filePath);
      parser = new PDFParse({ data: buffer });
      const data = await parser.getText();

      const extractedText = String(data?.text || "").trim();
      let finalText = extractedText;

      if (!isUsableStatementText(extractedText)) {
        console.log("PDF text extraction is limited. Attempting OCR fallback...");

        const ocrText = await extractTextWithOcr(parser);
        if (ocrText) {
          finalText = `${extractedText}\n${ocrText}`.trim();
        }
      }

      if (!isUsableStatementText(finalText)) {
        throw new Error(
          "Could not extract readable transactions from this PDF. Upload a clear statement PDF or CSV."
        );
      }

      return finalText;
    } catch (err) {
      console.error("PDF Parse Error:", err);
      throw new Error(`Failed to parse PDF file: ${err.message}`);
    } finally {
      if (parser && typeof parser.destroy === "function") {
        try {
          await parser.destroy();
        } catch (destroyError) {
          console.error("PDF parser cleanup warning:", destroyError.message);
        }
      }
    }
  }

  // ✅ CSV
  if (fileType === "csv") {
    const results = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => results.push(row))
        .on("end", () => resolve(results))
        .on("error", reject);
    });
  }

  throw new Error("Unsupported file type");
};