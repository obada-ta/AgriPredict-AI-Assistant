import Post from "../models/Post.js";
import { io, getReceiverSocketId } from "../lib/socket.js";
import Notification from "../models/Notification.js";


export const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId).populate("user", "_id");
        if (!post || !post.isApproved) {
            return res.status(404).json({ message: "Post not found" });
        }

        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        // 🔥 Realtime likes count
        io.to(`post_${postId}`).emit("postLiked", {
            postId,
            likesCount: post.likes.length,
        });

        // 🔔 Notification
        if (!alreadyLiked && post.user && post.user._id.toString() !== userId) {
            const notification = await Notification.create({
                senderId: userId,
                receiverId: post.user._id,
                type: "like",
                data: { postId },
            });

            await notification.populate("senderId", "name avatarUrl avatar");

            const receiverSocketId = getReceiverSocketId(post.user._id.toString());
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", notification);
            }
        }

        res.json({
            liked: !alreadyLiked,
            likesCount: post.likes.length,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/** 🔢 جلب عدد الإعجابات لمنشور */
export const getLikesCount = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId).populate("likes", " id name");
        if (!post) return res.status(404).json({ message: "Post not found" });

        res.json({
            postId: post._id,
            totalLikes: post.likes.length,
            likedBy: post.likes.map(u => u._id),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/** 🔍 التحقق مما إذا كان المستخدم قد أعجب بالمنشور */
export const checkUserLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id; // من التوكن

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // التحقق إذا كان المستخدم موجود في مصفوفة الإعجابات
        const hasLiked = post.likes.some(likeId =>
            likeId.toString() === userId.toString()
        );

        res.json({
            postId: post._id,
            hasLiked,
            totalLikes: post.likes.length
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};