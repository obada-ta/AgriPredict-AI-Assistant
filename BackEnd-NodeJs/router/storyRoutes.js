import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createStory, getFollowedStories, getUserStories } from "../controllers/storyController.js";

const router = express.Router();

// 🟢 إنشاء قصة
router.post("/", verifyToken, createStory);

// 🟡 عرض قصص المستخدمين الذين أتابعهم
router.get("/following", verifyToken, getFollowedStories);

// 🔵 عرض قصص مستخدم معين
router.get("/:userId", verifyToken, getUserStories);


// 👁️ تسجيل مشاهدة
router.post("/:storyId/view", verifyToken, viewStory);

// 📊 عرض المشاهدات (فقط لصاحب القصة)
router.get("/:storyId/views", verifyToken, getStoryViews);

export default router;
