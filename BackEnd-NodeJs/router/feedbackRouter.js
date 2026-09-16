import express from "express";
import Feedback from "../models/Feedback.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; // ملف التوكن
import User from "../models/User.js"; // نموذج المستخدم (افترض موجود)

const router = express.Router();

// --- إنشاء استعلام أو شكوى ---
router.post("/", verifyToken, async (req, res) => {
    try {
        const { type, message } = req.body;

        // إنشاء الاستعلام/الشكوى مرتبط بالمستخدم الحالي
        const newFeedback = await Feedback.create({
            type,
            message,
            user: req.user.id, // قادم من التوكن
        });

        res.status(201).json(newFeedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- الحصول على كل الاستعلامات/الشكاوى ---
// إذا كان staff يمكنه رؤية كل الرسائل، إذا لا يرى المستخدم رسائلهم فقط
router.get("/", async (req, res) => {
    try {
        // عرض كل الرسائل للموظفين
        const feedbacks = await Feedback.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 });


        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- الحصول على استعلام/شكوى واحدة بواسطة ID ---
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id).populate(
            "user",
            "name email role"
        );

        if (!feedback) return res.status(404).json({ error: "Not found" });

        // تحقق من صلاحيات الوصول
        if (req.user.role !== "staff" && feedback.user._id.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        res.json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- تحديث الاستعلام/الشكوى ---
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) return res.status(404).json({ error: "Not found" });

        // فقط staff يمكنه تحديث أي رسالة، والمستخدم يمكنه تحديث رسالته
        if (req.user.role !== "staff" && feedback.user.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        const updatedFeedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedFeedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- حذف استعلام/شكوى ---
router.delete("/:id", async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) return res.status(404).json({ error: "Not found" });

        await Feedback.findByIdAndDelete(req.params.id);

        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
