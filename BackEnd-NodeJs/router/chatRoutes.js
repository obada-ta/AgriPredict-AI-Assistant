

// routes/chatRoutes.js
// import express from "express";
// import { verifyToken } from "../middlewares/authMiddleware.js";
// import {
//   createOrGetConversation,
//   sendMessage,
//   getMessages,
//   getUserConversations
// } from "../controllers/chatController.js";

// const router = express.Router();

// // 🟢 إنشاء محادثة أو استرجاعها
// router.post("/conversation", verifyToken, createOrGetConversation);

// // 💬 إرسال رسالة
// router.post("/message", verifyToken, sendMessage);

// // 📜 عرض الرسائل
// router.get("/messages/:conversationId", verifyToken, getMessages);

// // 📋 جلب جميع محادثات المستخدم
// router.get("/conversations", verifyToken, getUserConversations);

// export default router;

// routes/chat.js
import {
  createOrGetConversation,
  sendMessage,
  getMessages,
  getUserConversations,
  getFollowingForChat, // أضف هذا
  getConversationById
} from "../controllers/chatController.js";
import express from 'express';
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();
// 🟢 إنشاء محادثة أو استرجاعها
router.post("/conversation", verifyToken, createOrGetConversation);

// 💬 إرسال رسالة
router.post("/message", verifyToken, sendMessage);

// 📜 عرض الرسائل
router.get("/messages/:conversationId", verifyToken, getMessages);

// 📋 جلب جميع محادثات المستخدم
router.get("/conversations", verifyToken, getUserConversations);

// 👥 جلب المتابعين للمحادثة (جديد)
router.get("/following", verifyToken, getFollowingForChat);

router.get("/conversation/:id", verifyToken, getConversationById);

export default router;