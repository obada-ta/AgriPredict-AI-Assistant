import express, { Router } from "express";
import {
    createPost,
    getAllApprovedPosts,
    getCompanyPosts,
    updatePost,
    deletePost,
    approvePost,
    createPostWithMultipleImages,
    getAllNotApprovedPosts,
    rejectPost,
    getAllPosts,

    deletePostUser,
    getPostById,
} from "../controllers/postController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { uploadPost } from "../config/multer.js";



const router = express.Router();

// 🟢 إنشاء منشور (company)


router.post("/",
    verifyToken,
    uploadPost.single('image'), // استخدام uploadPost للمنشورات
    createPost
);

// رفع صور متعددة للمنشورات
router.post("/multiple",
    verifyToken,
    uploadPost.array('images', 5), // حتى 5 صور
    createPostWithMultipleImages
);

// 🟡 عرض كل المنشورات الموافق عليها (عام)
router.get("/", getAllApprovedPosts);

router.get("/allPost", getAllPosts);

router.get("/getAllNotApprovedPosts", getAllNotApprovedPosts);

// 🔵 عرض منشورات شركة
router.get("/company/:companyId", verifyToken, getCompanyPosts);

// 🟠 تعديل منشور (company)
router.put("/:id",
    verifyToken,
    uploadPost.single('image'),
    updatePost);

// 🔴 حذف منشور (company, admin)
router.delete("/:id", verifyToken, deletePost);

router.delete('/userpost/:id', verifyToken, deletePostUser);

// ✅ الموافقة على منشور (staff)
router.patch("/:id/approve", verifyToken, approvePost);

router.delete("/:id/reject", verifyToken, rejectPost);

router.get('/:id',verifyToken, getPostById);


export default router;
