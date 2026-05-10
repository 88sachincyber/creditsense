import express from "express";
import multer from "multer";

import {
  addTransaction,
  fetchTransactions,
  uploadTransactions
} from "../controllers/transactionController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addTransaction);

router.get("/", authMiddleware, fetchTransactions);

const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadTransactions
);

export default router;