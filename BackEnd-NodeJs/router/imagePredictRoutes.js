// routes/imagePredictRoutes.js
import express from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { predictImage, getPredictions, saveAiLog, handleAiRequest } from "../controllers/imagePredictController.js";
import { AiPost } from "../config/multer.js";

const router = express.Router();


router.post("/predict-image", verifyToken, AiPost.single("image"), predictImage);

router.get("/predictions", verifyToken, getPredictions); // <-- GET للعرض

router.post("/ai-log", AiPost.single("image"), saveAiLog);

router.post(
    "/:type",
    verifyToken,
    AiPost.single("image"),
    handleAiRequest
);


export default router;