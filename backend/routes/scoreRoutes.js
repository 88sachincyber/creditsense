import express from "express";

import {
  generateScore,
  fetchScore,
} from "../controllers/scoreController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateScore);

router.get("/", authMiddleware, fetchScore);

export default router;