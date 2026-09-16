import express from "express";
import {
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";


const router = express.Router();

// 🟢 إضافة تعليق (client فقط)
router.post("/:postId", verifyToken, addComment);

// 🟡 عرض التعليقات لمنشور
router.get("/:postId", getCommentsByPost);

// 🟠 تعديل تعليق (المالك فقط)
router.put("/:id", verifyToken, updateComment);

// 🔴 حذف تعليق (المالك أو admin)
router.delete("/:id", verifyToken, deleteComment);

export default router;
