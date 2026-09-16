import { create } from "zustand";
import { BASE_URL } from "@/constants/Api";
import { useSocketStore } from "./socketStore";
import { useAuthStore } from "./authstore";

export type Comment = {
    _id: string;
    content: string;
    createdAt: string;
    post: string;
    user: {
        _id: string;
        id?: string;
        name: string;
        avatarUrl?: string;
    };
};

interface CommentState {
    comments: Comment[];
    fetchComments: (postId: string) => Promise<void>;
    addComment: (postId: string, content: string) => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
    listenToComments: (postId: string) => void;
}

export const useCommentStore = create<CommentState>((set) => ({
    comments: [],

    fetchComments: async (postId) => {
        try {
            const res = await fetch(`${BASE_URL}/api/comments/${postId}`);
            const data = await res.json();
            const formatted = Array.isArray(data)
                ? data.map((c: Comment) => ({ ...c, user: { ...c.user, id: c.user._id } }))
                : [];
            set({ comments: formatted });
        } catch (err) {
            console.error("fetchComments error:", err);
            set({ comments: [] });
        }
    },
    addComment: async (postId, content) => {
        const { user, token } = useAuthStore.getState();
        if (!token || !user) {
            console.warn("User not logged in or token missing");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/api/comments/${postId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content }),
            });

            const data = await res.json();
            if (!data.comment) return;

            // إصلاح الـ id
            const commentWithId = { ...data.comment, user: { ...data.comment.user, id: data.comment.user._id } };

            set((state) => ({
                comments: [commentWithId, ...state.comments],
            }));

        } catch (err) {
            console.error("addComment error:", err);
        }
    }
    ,
    deleteComment: async (commentId) => {
        const token = useAuthStore.getState().token;
        if (!token) return;

        try {
            await fetch(`${BASE_URL}/api/comments/${commentId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
            set((state) => ({ comments: state.comments.filter(c => c && c._id !== commentId) }));
        } catch (err) {
            console.error("deleteComment error:", err);
        }
    },

    listenToComments: (postId) => {
        const socket = useSocketStore.getState().socket;
        if (!socket) return;

        socket.emit("joinPost", postId);

        socket.on("newComment", (comment: Comment) => {
            if (!comment || !comment.user) return;
            if (comment.post === postId) {
                set((state) => ({
                    comments: [{ ...comment, user: { ...comment.user, id: comment.user._id } }, ...state.comments],
                }));
            }
        });

        socket.on("deleteComment", ({ commentId }) => {
            set((state) => ({ comments: state.comments.filter(c => c && c._id !== commentId) }));
        });
    },
}));
