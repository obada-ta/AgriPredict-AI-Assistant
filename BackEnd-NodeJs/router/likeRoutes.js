import express from "express";
import { toggleLike, getLikesCount, checkUserLike } from "../controllers/likeController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ❤️ تفعيل/إلغاء الإعجاب
router.post("/:postId", verifyToken, toggleLike);

// 🔢 عرض عدد الإعجابات
router.get("/:postId", getLikesCount);
router.get('/:postId/check', verifyToken, checkUserLike);

export default router;
