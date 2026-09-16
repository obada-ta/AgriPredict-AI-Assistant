import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { deleteNotification, getNotifications, markAllAsRead, markAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.patch("/:id/read", verifyToken, markAsRead);
router.patch("/read-all", verifyToken, markAllAsRead);
router.delete("/:id",verifyToken, deleteNotification);

export default router;
