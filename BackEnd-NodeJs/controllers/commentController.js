import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

/** 🟢 إضافة تعليق */
export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        if (req.user.role !== "client") {
            return res.status(403).json({ message: "Only clients can add comments" });
        }

        const post = await Post.findById(postId).populate("user", "_id name");
        if (!post || !post.isApproved) {
            return res.status(404).json({ message: "Post not found or not approved" });
        }

        const comment = await Comment.create({
            post: postId,
            user: req.user.id,
            content,
        });

        await comment.populate("user", "name avatarUrl");

        // 🔥 Realtime لمن في غرفة المنشور
        io.to(`post_${postId}`).emit("newComment", {
            postId,
            comment,
        });

        // 🔔 Notification لصاحب المنشور
        if (post.user && post.user._id.toString() !== req.user.id) {
            const notification = await Notification.create({
                senderId: req.user.id,
                receiverId: post.user._id,
                type: "comment",
                data: {
                    postId,
                    commentId: comment._id,
                    content: content.slice(0, 50),
                },
            });

            await notification.populate("senderId", "name avatarUrl");

            const receiverSocketId = getReceiverSocketId(post.user._id.toString());
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", notification);
            }
        }

        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/** 🟡 عرض التعليقات لمنشور معين */
export const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ post: postId })
            .populate("user", "name email avatar")
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/** 🟠 تعديل تعليق */
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // تحقق أن المستخدم هو مالك التعليق
        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to edit this comment" });
        }

        comment.content = content;
        
        await comment.save();

        res.json({ message: "Comment updated successfully", comment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (
            comment.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await comment.deleteOne();

        // 🔥 Realtime
        io.to(`post_${comment.post}`).emit("commentDeleted", {
            postId: comment.post,
            commentId: id,
        });

        res.json({ message: "Comment deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
