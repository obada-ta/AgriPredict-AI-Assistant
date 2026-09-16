import { getReceiverSocketId, io } from "../lib/socket.js";
import Notification from "../models/Notification.js";

/**
 * 📬 جلب جميع الإشعارات لمستخدم معين
 */
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ receiverId: req.user.id })
            .sort({ createdAt: -1 })
            .populate("senderId", "name role avatarUrl avatar");

        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // إرسال تحديث للمستخدم عبر socket
        const userSocketId = Object.keys(userSocketMap).find(
            key => userSocketMap[key] === req.socket?.id
        ) || userId;

        if (userSocketMap[userSocketId]) {
            io.to(userSocketMap[userSocketId]).emit('notificationRead', {
                notificationId: id,
                isRead: true
            });
        }

        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await Notification.updateMany(
            { receiverId: userId, isRead: false },
            { isRead: true }
        );

        // إرسال تحديث للمستخدم عبر socket
        // if (userSocketMap[userId]) {
        //     io.to(userSocketMap[userId]).emit('allNotificationsRead');
        // }

        const receiverSocketId = getReceiverSocketId(userId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('allNotificationsRead');
        }


        res.json({ success: true, message: "All notifications marked as read" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // التحقق من وجود المستخدم
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        // ✅ الحل: تمرير شرط واحد كـ object
        const notification = await Notification.findOneAndDelete({
            _id: id,
            receiverId: userId  // فقط المستلم يمكنه حذف إشعاره
        });

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found or unauthorized"
            });
        }

        // إرسال تحديث للمستخدم عبر socket
        const receiverSocketId = getReceiverSocketId(userId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('notificationDeleted', {
                notificationId: id
            });
        }

        res.json({
            success: true,
            message: "Notification deleted successfully",
            deletedNotification: notification
        });
    } catch (err) {
        // التحقق من خطأ في تنسيق ID
        if (err.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid notification ID format"
            });
        }

        res.status(500).json({
            message: err.message
        });
    }
};