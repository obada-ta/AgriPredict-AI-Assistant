import Story from "../models/Story.js";

/** 🟢 إنشاء قصة */
export const createStory = async (req, res) => {
    try {
        const { imageUrl, caption } = req.body;

        const story = await Story.create({
            user: req.user.id,
            imageUrl,
            caption,
        });

        res.status(201).json({ message: "Story created successfully", story });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/** 🟡 عرض قصص المستخدمين الذين أتابعهم */
export const getFollowedStories = async (req, res) => {
    try {
        const user = req.user;
        const followingIds = user.following;

        const stories = await Story.find({ user: { $in: followingIds } })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.json(stories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/** 🔵 عرض كل القصص لمستخدم محدد */
export const getUserStories = async (req, res) => {
    try {
        const { userId } = req.params;
        const stories = await Story.find({ user: userId })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.json(stories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


import Story from "../models/Story.js";

/** 👁️ إضافة مشاهدة للقصة */
export const viewStory = async (req, res) => {
    try {
        const { storyId } = req.params;
        const userId = req.user.id;

        const story = await Story.findById(storyId);
        if (!story) return res.status(404).json({ message: "Story not found" });

        // لا يمكن لصاحب القصة أن يسجل مشاهدة لنفسه
        if (story.user.toString() === userId) {
            return res.status(400).json({ message: "You cannot view your own story" });
        }

        // تحقق من أنه لم يشاهدها من قبل
        if (!story.viewers.includes(userId)) {
            story.viewers.push(userId);
            await story.save();
        }

        res.json({
            message: "Story viewed successfully",
            totalViews: story.viewers.length,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/** 📊 عرض عدد المشاهدات وأسماء من شاهد */
export const getStoryViews = async (req, res) => {
    try {
        const { storyId } = req.params;

        const story = await Story.findById(storyId).populate("viewers", "name email");
        if (!story) return res.status(404).json({ message: "Story not found" });

        // تأكد أن المستخدم هو صاحب القصة
        if (story.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json({
            storyId: story._id,
            totalViews: story.viewers.length,
            viewers: story.viewers,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

