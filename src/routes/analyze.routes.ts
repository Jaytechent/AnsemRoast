import { Router } from "express";
import { AnalyzeController } from "../controllers/analyze.controller";

const router = Router();

// POST /api/analyze
router.post("/analyze", AnalyzeController.analyzeWallet);

export default router;
