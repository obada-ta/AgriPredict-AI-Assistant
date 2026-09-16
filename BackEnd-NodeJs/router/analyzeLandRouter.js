import express from "express";
import { analyzeLand, getMyLandAnalyses } from "../controllers/analyzeLandController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";




const router = express.Router();

router.post("/analyze-land", verifyToken, analyzeLand);
router.get("/analyze-land", verifyToken, getMyLandAnalyses);

export default router;
