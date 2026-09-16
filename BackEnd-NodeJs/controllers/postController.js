import Post from "../models/Post.js";
import Company from "../models/Company.js";
import { Types } from 'mongoose';
import { io, getReceiverSocketId } from "../lib/socket.js";
import fs from 'fs';
import path from 'path';


export const createPostUser = async (req, res) => {
    try {
        const { title, content, image } = req.body;

        // تأكد أن المستخدم شركة
        if (req.user.role !== "company") {
            return res.status(403).json({ message: "Only companies can create posts" });
        }

        // تأكد أن الشركة نفسها موجودة وموافقة عليها
        const company = await Company.findOne({ owner: req.user.id, isApproved: true });
        if (!company) return res.status(403).json({ message: "Company not approved or not found" });

        const post = await Post.create({
            title,
            content,
            image,
            company: company._id,
            isApproved: false, // يحتاج موافقة staff
        });

        res.status(201).json({ message: "Post created and awaiting approval", post });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/** 🟡 عرض كل المنشورات (فقط الموافق عليها) */
// export const getAllApprovedPosts = async (req, res) => {
//     try {
//         const posts = await Post.find({ isApproved: true })
//             .populate("company", "name")
//             .populate('user', 'name avatar ')
//             .lean();
//         const formattedPosts = posts.map(post => ({
//             ...post,
//             likesCount: post.likes.length,
//             isLiked: userId ? post.likes.some(id => id.toString() === userId) : false,
//         }));

//         res.json(formattedPosts);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

export const getAllApprovedPosts = async (req, res) => {
    try {
        const userId = req.user?.id; // من verifyToken (اختياري)

        const posts = await Post.find({ isApproved: true })
            .populate({
                path: "company",
                select: "name owner", // تم الحفاظ على الحقول الأساسية
                populate: {
                    path: "owner",
                    select: "name avatar avatarUrl role" // جلب بيانات صاحب الشركة
                }
            })
            .populate("user", "name avatar avatarUrl role");

        const formattedPosts = posts.map(post => ({
            ...post.toObject({ virtuals: true }),
            likesCount: post.likes.length,
            isLiked: userId
                ? post.likes.some(id => id.toString() === userId)
                : false,
        }));

        res.json(formattedPosts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllNotApprovedPosts = async (req, res) => {
    try {
        const posts = await Post.find({ isApproved: false }).populate("user", "name avatar");
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const {
            status, // 'approved', 'pending', or 'all'
            companyId,
            userId,
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // بناء الاستعلام
        const query = {};

        // فلترة حسب حالة الموافقة
        if (status === 'approved') {
            query.isApproved = true;
        } else if (status === 'pending') {
            query.isApproved = false;
        }
        // إذا لم يتم تحديد status أو كان 'all'، يرجع كل المنشورات

        // فلترة حسب الشركة
        if (companyId && Types.ObjectId.isValid(companyId)) {
            query.company = companyId;
        }

        // فلترة حسب المستخدم
        if (userId && Types.ObjectId.isValid(userId)) {
            query.user = userId;
        }

        // الحساب للترقيم الصفحي
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // ترتيب النتائج
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // جلب البيانات مع التعداد
        const [posts, totalPosts] = await Promise.all([
            Post.find(query)
                .populate("company", "name logo")
                .populate("user", "name avatar")
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Post.countDocuments(query)
        ]);

        // حساب إحصائيات
        const approvedCount = await Post.countDocuments({ isApproved: true });
        const pendingCount = await Post.countDocuments({ isApproved: false });

        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalPosts / limitNum),
                totalItems: totalPosts,
                itemsPerPage: limitNum
            },
            statistics: {
                approved: approvedCount,
                pending: pendingCount,
                total: totalPosts
            }
        });

    } catch (err) {
        console.error('Error in getAllPosts:', err);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب المنشورات',
            error: err.message
        });
    }
};
/** 🔵 عرض منشورات شركة محددة */
export const getCompanyPosts = async (req, res) => {
    try {
        const { companyId } = req.params;
        const posts = await Post.find({ company: companyId }).populate("company", "name");
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const userRole = req.user.role;
        const userId = req.user.id;

        // العثور على المنشور الحالي
        const existingPost = await Post.findById(id)
            .populate('user', 'role')
            .populate('company', 'owner isApproved');

        if (!existingPost) {
            return res.status(404).json({
                success: false,
                message: "المنشور غير موجود"
            });
        }

        // التحقق من الصلاحيات: هل المستخدم مالك المنشور؟
        let hasPermission = false;

        if (existingPost.user && existingPost.user._id.toString() === userId) {
            hasPermission = true;
        } else if (existingPost.company) {
            // التحقق إذا كان المستخدم مالك الشركة
            if (
                existingPost.company.owner &&
                existingPost.company.owner.toString() === userId
            ) {
                hasPermission = true;
            }
        }

        // إذا كان المستخدم admin أو staff، يُسمح له بالتعديل (حتى لو ليس المالك)
        if (userRole === 'admin' || userRole === 'staff') {
            hasPermission = true;
        }

        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: "ليس لديك صلاحية تعديل هذا المنششور"
            });
        }

        // بناء بيانات التحديث
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;

        // التعامل مع الصورة الجديدة (اختياري)
        if (req.file) {
            const newImageUrl = `/uploads/posts/${req.file.filename}`;
            updateData.image = newImageUrl;

            // ⚠️ حذف الصورة القديمة (إذا كانت موجودة وليست افتراضية)
            if (existingPost.image && !existingPost.image.startsWith('http')) {
                const oldImagePath = path.join(process.cwd(), 'public', existingPost.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        // تحديد حالة الموافقة حسب الدور
        if (userRole === 'company') {
            // التحقق من أن الشركة لا تزال معتمدة
            const company = await Company.findOne({
                owner: userId,
                isApproved: true
            });

            if (!company) {
                // إذا كان هناك ملف جديد، احذفه
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(403).json({
                    success: false,
                    message: "الشركة غير معتمدة أو غير موجودة"
                });
            }

            updateData.company = company._id;
            updateData.user = undefined; // تأكد من عدم وجود user إذا كان شركة
            updateData.isApproved = true; // الشركات لا تحتاج موافقة

        } else {
            // مستخدم عادي
            updateData.user = userId;
            updateData.company = undefined;

            // admin/staff يوافقون تلقائيًا
            if (userRole === 'admin' || userRole === 'staff') {
                updateData.isApproved = true;
            } else {
                updateData.isApproved = false; // يحتاج موافقة
            }
        }

        // تطبيق التحديثات
        Object.assign(existingPost, updateData);
        await existingPost.save();

        // جلب المنشور المحدّث مع العلاقات
        const populatedPost = await Post.findById(existingPost._id)
            .populate('company', 'name description')
            .populate('user', 'name avatar role');

        // إرسال عبر Socket.IO
        if (populatedPost.isApproved) {
            io.emit("postUpdated", populatedPost); // أو "newPost" إذا أردت معاملته كجديد
        } else {
            io.emit("newPostPending", populatedPost); // للمراجعة من الأدمن
        }

        const message = populatedPost.isApproved
            ? "تم تحديث المنشور بنجاح"
            : "تم تحديث المنشور وجارٍ انتظار الموافقة";

        res.json({
            success: true,
            message,
            post: populatedPost
        });

    } catch (err) {
        // تنظيف الملف في حالة الخطأ
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                console.error("فشل حذف الملف المؤقت:", e);
            }
        }

        console.error("خطأ في تحديث المنشور:", err);
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء تحديث المنشور",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};


/** 🔴 حذف منشور */
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // فقط مالك الشركة أو admin يمكنه الحذف
        const company = await Company.findOne({ owner: req.user.id });
        if (
            req.user.role !== "admin" &&
            (!company || post.company.toString() !== company._id.toString())
        ) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        await post.deleteOne();
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deletePostUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate that the ID parameter exists
        if (!id) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        // Validate that user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Find the post and explicitly select the user field
        const post = await Post.findById(id).select('user');

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Normalize user ID from post (could be ObjectId or populated object)
        const postUserId = post.user._id ? post.user._id.toString() : post.user.toString();
        const reqUserId = req.user.id.toString();

        // Authorization check
        if (reqUserId !== postUserId) {
            return res.status(403).json({
                message: "Unauthorized: You can only delete your own posts"
            });
        }

        // Delete the post
        await post.deleteOne();

        // ✅ تصحيح هنا: استخدام req.params.id
        io.emit("postDeleted", { postId: id });

        res.json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (err) {
        console.error('Error deleting post:', err);

        if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid post ID format" });
        }

        res.status(500).json({
            message: "An error occurred while deleting the post",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

/** ✅ الموافقة على منشور */
export const approvePost = async (req, res) => {
    try {
        // if (req.user.role !== "staff") {
        //     return res.status(403).json({ message: "Only staff can approve posts" });
        // }

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        post.isApproved = true;
        await post.save();

        const approvedPost = await Post.findById(post._id)
            .populate("user", "name avatarUrl")
            .populate("company", "name");

        // 🔥 بث بعد الموافقة
        io.emit("postApproved", approvedPost);

        res.json({ message: "Post approved successfully", post });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const rejectPost = async (req, res) => {
    try {
        if (req.user.role !== "staff" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Only staff/admin can reject posts" });
        }

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // حذف الصورة من السيرفر (اختياري)
        if (post.image) {
            const imagePath = path.join(__dirname, '..', post.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({ message: "Post rejected and deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getPendingCompanies = async (req, res) => {
    try {
        // السماح فقط للموظف أو المشرف
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "غير مصرح لك بالوصول إلى هذه البيانات" });
        }

        const companies = await Company.find({ isApproved: false }).populate("owner", "name email");

        res.json(companies);
    } catch (err) {
        res.status(500).json({ message: "حدث خطأ أثناء جلب الشركات", error: err.message });
    }
};

/** 🔵 عرض منشورات مستخدم محدد */
// postController.js

export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id)
            .populate('user', 'name avatar')
            .populate('company', 'name');

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // التحقق من الصلاحية
        const userId = req.user?.id?.toString();
        const isOwner =
            (post.user && post.user._id.toString() === userId) ||
            (post.company && post.company.owner?.toString() === userId) ||
            ['admin', 'staff'].includes(req.user?.role);

        if (!post.isApproved && !isOwner) {
            return res.status(403).json({ message: "Post not approved" });
        }

        res.json(post); // ← كائن واحد
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid post ID" });
        }
        res.status(500).json({ message: "Server error" });
    }
};

export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userRole = req.user.role;
        const userId = req.user.id;

        // التحقق من وجود ملف مرفوع
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "يجب رفع صورة للمنشور"
            });
        }

        // الحصول على رابط الصورة
        const imageUrl = `/uploads/posts/${req.file.filename}`;

        let postData = {
            title,
            content,
            image: imageUrl // استخدام رابط الصورة المرفوعة
        };

        // تحديد إذا كان يحتاج موافقة أم لا
        if (userRole === "company") {
            // البحث عن الشركة الخاصة بهذا المستخدم
            const company = await Company.findOne({
                owner: userId,
                isApproved: true
            });

            if (!company) {
                // حذف الصورة المرفوعة إذا فشل الإنشاء
                fs.unlinkSync(req.file.path);
                return res.status(403).json({
                    success: false,
                    message: "الشركة غير معتمدة أو غير موجودة"
                });
            }

            postData.company = company._id;
            postData.isApproved = true; // الشركات لا تحتاج موافقة
        } else {
            // المستخدم العادي
            postData.user = userId;
            postData.isApproved = false; // يحتاج موافقة

            // إذا كان المستخدم staff أو admin يمكنهم الموافقة على أنفسهم
            if (userRole === "admin" || userRole === "staff") {
                postData.isApproved = true;
            }
        }

        const post = await Post.create(postData);

        // جلب المنشور مع البيانات المرتبطة
        const populatedPost = await Post.findById(post._id)
            .populate('company', 'name description')
            .populate('user', 'name avatar role');

        if (post.isApproved) {
            // بث لكل المستخدمين
            io.emit("newPost", populatedPost);
        } else {
            // إرسال للأدمن فقط
            io.emit("newPostPending", populatedPost);
        }

        const message = post.isApproved
            ? "تم إنشاء المنشور بنجاح"
            : "تم إنشاء المنشور وجارٍ انتظار الموافقة";

        res.status(201).json({
            success: true,
            message,
            post: populatedPost
        });
    } catch (err) {
        // حذف الصورة المرفوعة في حالة الخطأ
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                console.error("خطأ في حذف الملف:", e);
            }
        }

        console.error(err);
        res.status(500).json({
            success: false,
            message: "حدث خطأ في الخادم",
            error: err.message
        });
    }
};

// وظيفة إضافية لمعالجة صور متعددة
export const createPostWithMultipleImages = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userRole = req.user.role;
        const userId = req.user.id;

        let images = [];

        // إذا كانت هناك ملفات مرفوعة
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => `/uploads/posts/${file.filename}`);
        }

        let postData = {
            title,
            content,
            images: images, // مصفوفة الصور
            image: images.length > 0 ? images[0] : null // الصورة الرئيسية
        };

        // نفس منطق الموافقة...
        if (userRole === "company") {
            const company = await Company.findOne({
                owner: userId,
                isApproved: true
            });

            if (!company) {
                // حذف جميع الصور المرفوعة
                if (req.files) {
                    req.files.forEach(file => {
                        fs.unlinkSync(file.path);
                    });
                }
                return res.status(403).json({
                    success: false,
                    message: "الشركة غير معتمدة أو غير موجودة"
                });
            }

            postData.company = company._id;
            postData.isApproved = true;
        } else {
            postData.user = userId;
            postData.isApproved = false;

            if (userRole === "admin" || userRole === "staff") {
                postData.isApproved = true;
            }
        }

        const post = await Post.create(postData);

        const populatedPost = await Post.findById(post._id)
            .populate('company', 'name description')
            .populate('user', 'name avatar role');

        const message = post.isApproved
            ? "تم إنشاء المنشور بنجاح"
            : "تم إنشاء المنشور وجارٍ انتظار الموافقة";

        res.status(201).json({
            success: true,
            message,
            post: populatedPost
        });
    } catch (err) {
        // حذف الصور المرفوعة في حالة الخطأ
        if (req.files) {
            req.files.forEach(file => {
                try {
                    fs.unlinkSync(file.path);
                } catch (e) {
                    console.error("خطأ في حذف الملف:", e);
                }
            });
        }

        console.error(err);
        res.status(500).json({
            success: false,
            message: "حدث خطأ في الخادم",
            error: err.message
        });
    }
};




// 1. جلب جميع المنشورات (المعتمدة وغير المعتمدة) مع فلترة اختيارية
