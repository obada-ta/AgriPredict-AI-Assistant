// في React Native - إنشاء store جديد للـ Posts
// stores/postStore.ts
// import { create } from 'zustand';
// import { useSocketStore } from './socketStore';

// interface Post {
//     _id: string;
//     title: string;
//     content: string;
//     image: string;
//     likes: string[];
//     likesCount: number;
//     user?: any;
//     company?: any;
//     isApproved: boolean;
//     createdAt: string;
// }

// interface PostState {
//     posts: Post[];
//     addPost: (post: Post) => void;
//     updatePostLikes: (postId: string, likesCount: number, isLiked: boolean) => void;
//     removePost: (postId: string) => void;
//     setPosts: (posts: Post[]) => void;
//     listenToPostUpdates: () => void;
// }

// export const usePostStore = create<PostState>((set, get) => ({
//     posts: [],

//     addPost: (post) => {
//         set((state) => ({ posts: [post, ...state.posts] }));
//     },

//     updatePostLikes: (postId, likesCount, isLiked) => {
//         set((state) => ({
//             posts: state.posts.map(post =>
//                 post._id === postId
//                     ? {
//                         ...post,
//                         likesCount,
//                         isLiked: isLiked
//                     }
//                     : post
//             )
//         }));
//     },

//     removePost: (postId) => {
//         set((state) => ({
//             posts: state.posts.filter(post => post._id !== postId)
//         }));
//     },

//     setPosts: (posts) => set({ posts }),

//     listenToPostUpdates: () => {
//         const socket = useSocketStore.getState().socket;
//         if (!socket) return;

//         socket.on("newPost", (post: Post) => {
//             get().addPost(post);
//         });

//         socket.on("postApproved", (post: Post) => {
//             get().addPost(post);
//         });

//         socket.on("postDeleted", (postId: string) => {
//             get().removePost(postId);
//         });

//         return () => {
//             socket.off("newPost");
//             socket.off("postApproved");
//             socket.off("postDeleted");
//         };
//     }

// }));

// stores/postStore.ts
// import { create } from "zustand";
// import { useSocketStore } from "./socketStore";

// export interface Post {
//     _id: string;
//     title: string;
//     content: string;
//     image: string;
//     imageUrl?: string;
//     likes: string[];
//     likesCount?: number;
//     user?: {
//         _id: string;
//         name: string;
//         avatarUrl?: string;
//     };
//     company?: {
//         name: string;
//     };
//     createdAt: string;
// }

// interface PostState {
//     posts: Post[];
//     setPosts: (posts: Post[]) => void;
//     addPost: (post: Post) => void;
//     listenToPostUpdates: () => void;
// }

// export const usePostStore = create<PostState>((set) => ({
//     posts: [],

//     setPosts: (posts) => set({ posts }),

//     addPost: (post) =>
//         set((state) => ({ posts: [post, ...state.posts] })),

//     listenToPostUpdates: () => {
//         const socket = useSocketStore.getState().socket;
//         if (!socket) return;

//         socket.on("newPost", (post: Post) => {
//             set((state) => ({ posts: [post, ...state.posts] }));
//         });

//         socket.on("postLiked", ({ postId, likesCount }) => {
//             set((state) => ({
//                 posts: state.posts.map((post) =>
//                     post._id === postId
//                         ? { ...post, likesCount }
//                         : post
//                 ),
//             }));
//         });

//         // 💬 Comments
//         socket.on("newComment", ({ postId }) => {
//             set((state) => ({
//                 posts: state.posts.map((post) =>
//                     post._id === postId
//                         ? { ...post, commentsCount: (post.commentsCount || 0) + 1 }
//                         : post
//                 ),
//             }));
//         });
//     },


// }));
// import { create } from "zustand";
// import { useSocketStore } from "./socketStore";

// export interface Post {
//     _id: string;
//     title: string;
//     content: string;
//     image: string;
//     imageUrl?: string;
//     likes: string[];
//     likesCount?: number;
//     commentsCount?: number;
//     user?: { _id: string; name: string; avatarUrl?: string };
//     company?: { name: string };
//     createdAt: string;
// }

// interface PostState {
//     posts: Post[];
//     setPosts: (posts: Post[]) => void;
//     addPost: (post: Post) => void;
//     listenToPostUpdates: () => void;
// }

// export const usePostStore = create<PostState>((set) => ({
//     posts: [],

//     setPosts: (posts) => set({ posts }),

//     addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),

//     listenToPostUpdates: () => {
//         const socket = useSocketStore.getState().socket;
//         if (!socket) return;

//         socket.on("newPost", (post: Post) => {
//             set((state) => ({ posts: [post, ...state.posts] }));
//         });

//         socket.on("postLiked", ({ postId, likesCount }) => {
//             set((state) => ({
//                 posts: state.posts.map((post) =>
//                     post._id === postId ? { ...post, likesCount } : post
//                 ),
//             }));
//         });

//         socket.on("newComment", ({ postId }) => {
//             set((state) => ({
//                 posts: state.posts.map((post) =>
//                     post._id === postId
//                         ? { ...post, commentsCount: (post.commentsCount ?? 0) + 1 }
//                         : post
//                 ),
//             }));
//         });
//     },
// }));
// import { create } from "zustand";
// import { useSocketStore } from "./socketStore";

// export interface Post {
//     _id: string;
//     title: string;
//     content: string;
//     image: string;
//     imageUrl?: string;
//     likes: string[];
//     likesCount?: number;
//     commentsCount?: number;
//     user?: {
//         _id: string;
//         id?: string;
//         name: string;
//         avatarUrl?: string;
//     };
//     createdAt: string;
// }

// interface PostState {
//     posts: Post[];
//     setPosts: (posts: Post[]) => void;
//     addPost: (post: Post) => void;
//     updatePost: (id: string, updates: Partial<Post>) => void;
//     listenToPostUpdates: () => void;

// }

// export const usePostStore = create<PostState>((set) => ({
//     posts: [],
//     setPosts: (posts) => set({ posts }),
//     addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),


//     updatePost: (id, updates) =>
//         set((state) => ({
//             posts: state.posts.map((p) =>
//                 p._id === id ? { ...p, ...updates } : p
//             ),
//         })),

//     listenToPostUpdates: () => {
//         const socket = useSocketStore.getState().socket;
//         if (!socket) return;

//         socket.on("newPost", (post: Post) => {
//             set((state) => ({ posts: [post, ...state.posts] }));
//         });

//         socket.on("postLiked", ({ postId, likesCount }) => {
//             set((state) => ({
//                 posts: state.posts.map((p) => p._id === postId ? { ...p, likesCount } : p)
//             }));
//         });

//         socket.on("newComment", ({ postId }) => {
//             set((state) => ({
//                 posts: state.posts.map((p) =>
//                     p._id === postId ? { ...p, commentsCount: (p.commentsCount ?? 0) + 1 } : p
//                 ),
//             }));
//         });
//     },
// }));
import { create } from "zustand";
import { useSocketStore } from "./socketStore";

export interface Post {
    _id: string;
    title: string;
    content: string;
    image: string;
    imageUrl?: string;
    likes: string[];
    likesCount?: number;
    commentsCount?: number;
    user?: {
        _id: string;
        id?: string;
        name: string;
        avatarUrl?: string;
    };
    createdAt: string;
}

interface PostState {
    posts: Post[];
    setPosts: (posts: Post[]) => void;
    addPost: (post: Post) => void;
    updatePost: (id: string, updates: Partial<Post>) => void;
    deletePost: (id: string) => void; // <-- أضف هذا السطر
    listenToPostUpdates: () => void;
}

export const usePostStore = create<PostState>((set) => ({
    posts: [],
    setPosts: (posts) => set({ posts }),
    addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
    updatePost: (id, updates) =>
        set((state) => ({
            posts: state.posts.map((p) =>
                p._id === id ? { ...p, ...updates } : p
            ),
        })),

    // ✅ دالة حذف المنشور
    deletePost: (id) =>
        set((state) => ({
            posts: state.posts.filter((p) => p._id !== id),
        })),

    listenToPostUpdates: () => {
        const socket = useSocketStore.getState().socket;
        if (!socket) return;

        socket.on("newPost", (post: Post) => {
            set((state) => ({ posts: [post, ...state.posts] }));
        });

        socket.on("postLiked", ({ postId, likesCount }) => {
            set((state) => ({
                posts: state.posts.map((p) => p._id === postId ? { ...p, likesCount } : p)
            }));
        });

        socket.on("newComment", ({ postId }) => {
            set((state) => ({
                posts: state.posts.map((p) =>
                    p._id === postId ? { ...p, commentsCount: (p.commentsCount ?? 0) + 1 } : p
                ),
            }));
        });

        // ✅ استمع لحدث حذف المنشور من السيرفر
        socket.on("postDeleted", ({ postId }) => {
            set((state) => ({
                posts: state.posts.filter((p) => p._id !== postId),
            }));
        });
    },
}));