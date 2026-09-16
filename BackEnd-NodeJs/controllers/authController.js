import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../models/User.js';
import { addToBlacklist } from '../utils/tokenBlacklist.js';
import { promises as fsPromises } from "fs"; // ← استخدام الـ promises للتعامل غير المتزامن مع الملفات
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { getReceiverSocketId, io } from '../lib/socket.js';
import Notification from "../models/Notification.js";
import Post from "../models/Post.js";
//yes 
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "name, email, and password are required" });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );
        res.status(201).json({ message: "User registered successfully", user, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//yes 
export const login = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "email and password required" });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        // إصلاح المسار واستبدال \\ بـ /
        let avatarUrl = null;
        if (user.avatar) {
            const correctedPath = user.avatar.replace(/\\/g, '/');
            avatarUrl = `${process.env.BASE_URL || 'http://192.168.105.130:3000'}/${correctedPath}`;
        }

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                avatarUrl: avatarUrl, // إضافة avatarUrl
                followersCount: user.followersCount, // إضافة followersCount
                followingCount: user.followingCount, // إضافة followingCount
                postsCount: user.postsCount
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
//yes 
export const logout = (req, res) => {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (token) {
        addToBlacklist(token);
    }

    res.json({ message: "Logged out successfully" });
};
//yes
export const updateUser = async (req, res) => {
    try {
        const { id } = req.user; // من التوكن (المستخدم الحالي)
        const { name, email, role } = req.body;

        // التحقق من أن البريد الإلكتروني غير مستخدم من قبل مستخدم آخر
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, role },
            { new: true, runValidators: true } // new: true → يُرجع المستخدم بعد التحديث
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * حذف حساب المستخدم (الحساب الشخصي فقط)
 */
//yes
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params; // <-- يجب أن يكون مطابق للـ Route


        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User account deleted successfully" });
    } catch (err) {
        console.error("Delete user error:", err);
        res.status(500).json({ message: err.message });
    }
};

export const deleteUser1 = async (req, res) => {
    try {
        const { id } = req.params;

        // منع حذف المستخدم نفسه إذا كان ID من التوكن
        if (id === req.user.id) {
            return res.status(400).json({ message: "You cannot delete your own account" });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//no
export const changePassword = async (req, res) => {
    try {
        const { id } = req.user; // المستخدم الحالي
        const { currentPassword, newPassword } = req.body;

        // التحقق من وجود الحقول
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new password are required" });
        }

        // جلب المستخدم مع كلمة المرور المشفرة
        const user = await User.findById(id).select('+password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // التحقق من صحة كلمة المرور الحالية
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // التحقق من أن كلمة المرور الجديدة مختلفة
        if (await bcrypt.compare(newPassword, user.password)) {
            return res.status(400).json({ message: "New password must be different" });
        }

        // تشفير كلمة المرور الجديدة
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // اختياري: تسجيل الخروج من جميع الأجهزة (أضف التوكن الحالي إلى القائمة السوداء)
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        if (token) {
            addToBlacklist(token);
        }

        res.json({ message: "Password changed successfully. Please log in again." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//no
export const getClientsAndCompanies = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        const users = await User.find({
            role: { $in: ["client", "company"] },
            _id: { $ne: currentUserId }
        }).select('-password');

        res.json(users); // دائمًا مصفوفة (حتى لو فارغة)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//no
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;

        // تحويل القيم إلى أرقام
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        // بناء شرط البحث
        const query = {};
        if (search) {
            const regex = new RegExp(search, 'i'); // 'i' = case insensitive
            query.$or = [
                { name: regex },
                { email: regex }
            ];
        }

        // إجمالي عدد المستخدمين المطابقين (لحساب عدد الصفحات)
        const total = await User.countDocuments(query);

        // جلب المستخدمين مع التقسيم
        const users = await User.find(query)
            .select('-password -__v') // استبعاد الحقول الحساسة
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum)
            .sort({ createdAt: -1 }); // الأحدث أولًا

        // حساب عدد الصفحات
        const totalPages = Math.ceil(total / limitNum);

        res.json({
            success: true,
            data: users,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalUsers: total,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//yes
// 🟢 متابعة مستخدم
// export const followUser = async (req, res) => {
//     try {
//         const { userId } = req.params; // الشخص المتابَع
//         const currentUserId = req.user.id;

//         if (userId === currentUserId) {
//             return res.status(400).json({ message: "You cannot follow yourself" });
//         }

//         const userToFollow = await User.findById(userId);
//         const currentUser = await User.findById(currentUserId);

//         if (!userToFollow || !currentUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // إلغاء المتابعة
//         if (currentUser.following.includes(userId)) {
//             currentUser.following.pull(userId);
//             userToFollow.followers.pull(currentUserId);

//             await currentUser.save();
//             await userToFollow.save();

//             return res.json({ message: "Unfollowed successfully" });
//         }

//         // متابعة جديدة
//         currentUser.following.push(userId);
//         userToFollow.followers.push(currentUserId);

//         await currentUser.save();
//         await userToFollow.save();

//         // ✅ إنشاء إشعار
//         const notification = await Notification.create({
//             receiverId: userId,
//             senderId: currentUserId,
//             type: "follow",
//             data: {
//                 message: `${currentUser.name} started following you`,
//             },
//         });

//         // ✅ إرسال Socket
//         io.to(userId.toString()).emit("notification:new", notification);
// console.log('successfully');

//         res.json({ message: "Followed successfully" });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
export const followUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        if (userId === currentUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const userToFollow = await User.findById(userId);
        const currentUser = await User.findById(currentUserId);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const wasFollowing = currentUser.following.includes(userId);

        if (wasFollowing) {
            currentUser.following.pull(userId);
            userToFollow.followers.pull(currentUserId);
            await currentUser.save();
            await userToFollow.save();
            return res.json({ message: "Unfollowed successfully" });
        }

        // 👇 متابعة جديدة
        currentUser.following.push(userId);
        userToFollow.followers.push(currentUserId);
        await currentUser.save();
        await userToFollow.save();

        // ✅ إنشاء إشعار
        const notification = await Notification.create({
            receiverId: userId,
            senderId: currentUserId,
            type: "follow",
            data: {
                message: `${currentUser.name} started following you`,
            },
        });

        // ✅ استخدام userSocketMap مباشرة من socket.js
        const receiverSocketId = getReceiverSocketId(userId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("notification:new", notification);
            console.log(`🔔 Follow notification sent to socket: ${receiverSocketId}`);
        } else {
            console.log(`🔕 User ${userId} is offline`);
        }

        res.json({ message: "Followed successfully" });

    } catch (err) {
        console.error("Follow error:", err);
        res.status(500).json({ message: err.message });
    }
};
//yes
export const getUserConnections = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId)
            .populate("followers", "_id name email avatar avatarUrl bio role")
            .populate("following", "_id name email avatar avatarUrl bio role");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            followers: user.followers,
            following: user.following
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//yes
// export const updateUserProfile1 = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { name, email, bio } = req.body;

//         console.log('=== UPDATE PROFILE START ===');
//         console.log('User ID:', userId);
//         console.log('Request body:', { name, email, bio });
//         console.log('Uploaded file:', req.file ? {
//             originalname: req.file.originalname,
//             filename: req.file.filename,
//             path: req.file.path,
//             size: req.file.size
//         } : 'No file');

//         // البحث عن المستخدم الحالي
//         const currentUser = await User.findById(userId);
//         if (!currentUser) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         const updateData = {};

//         // تحديث الاسم
//         if (name !== undefined && name.trim() !== "") {
//             updateData.name = name.trim();
//         }

//         // تحديث البريد الإلكتروني
//         if (email && email.trim() !== "") {
//             const normalizedEmail = email.toLowerCase().trim();

//             // التحقق إذا كان البريد الجديد مختلف عن الحالي
//             if (normalizedEmail !== currentUser.email.toLowerCase()) {
//                 const existingUser = await User.findOne({
//                     email: normalizedEmail,
//                     _id: { $ne: userId }
//                 });

//                 if (existingUser) {
//                     return res.status(400).json({
//                         success: false,
//                         message: "Email already in use"
//                     });
//                 }
//                 updateData.email = normalizedEmail;
//             }
//         }

//         // تحديث السيرة الذاتية
//         if (bio !== undefined) {
//             updateData.bio = bio.trim();
//         }

//         // معالجة الصورة المرفوعة
//         if (req.file) {
//             console.log('Processing new avatar...');

//             // حذف الصورة القديمة إذا كانت موجودة
//             if (currentUser.avatar) {
//                 const oldAvatarPath = path.join(process.cwd(), currentUser.avatar);
//                 try {
//                     if (fs.existsSync(oldAvatarPath)) {
//                         fs.unlinkSync(oldAvatarPath);
//                         console.log('✅ Old avatar deleted:', oldAvatarPath);
//                     }
//                 } catch (unlinkErr) {
//                     console.warn('⚠️ Could not delete old avatar:', unlinkErr.message);
//                 }
//             }

//             // حفظ المسار الجديد للصورة
//             updateData.avatar = req.file.path;
//             console.log('✅ New avatar path saved:', req.file.path);

//             // التحقق من أن الملف تم حفظه فعلياً
//             if (fs.existsSync(req.file.path)) {
//                 console.log('✅ Avatar file exists on disk');
//             } else {
//                 console.log('❌ Avatar file NOT found on disk');
//             }
//         }

//         // التحقق من وجود بيانات للتحديث
//         if (Object.keys(updateData).length === 0 && !req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No data provided for update"
//             });
//         }

//         console.log('Data to update:', updateData);

//         // تحديث المستخدم في قاعدة البيانات
//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             updateData,
//             { new: true, runValidators: true }
//         ).select('-password');

//         if (!updatedUser) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found after update"
//             });
//         }

//         console.log('✅ User updated in database');
//         console.log('Updated user avatar field:', updatedUser.avatar);
//         console.log('Virtual avatarUrl:', updatedUser.avatarUrl);

//         // إرجاع البيانات المحدثة
//         const responseUser = {
//             id: updatedUser._id,
//             name: updatedUser.name,
//             email: updatedUser.email,
//             bio: updatedUser.bio || "",
//             avatarUrl: updatedUser.avatarUrl, // استخدام virtual field
//             posts: updatedUser.postsCount || 0,
//             followers: updatedUser.followersCount || 0,
//             following: updatedUser.followingCount || 0
//         };

//         console.log('Final response user:', responseUser);

//         res.json({
//             success: true,
//             message: "Profile updated successfully",
//             user: responseUser
//         });

//         console.log('=== UPDATE PROFILE COMPLETED ===');

//     } catch (err) {
//         console.error('❌ Profile update error:', err);

//         // تنظيف الصورة الجديدة إذا حدث خطأ
//         if (req.file && req.file.path) {
//             try {
//                 if (fs.existsSync(req.file.path)) {
//                     fs.unlinkSync(req.file.path);
//                     console.log('✅ New avatar cleaned up due to error');
//                 }
//             } catch (cleanupErr) {
//                 console.warn('⚠️ Failed to clean up new avatar:', cleanupErr.message);
//             }
//         }

//         res.status(500).json({
//             success: false,
//             message: err.message || "Internal server error"
//         });
//     }
// };
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, bio } = req.body;

        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const updateData = {};

        if (name !== undefined && name.trim() !== "") {
            updateData.name = name.trim();
        }

        if (email && email.trim() !== "") {
            const normalizedEmail = email.toLowerCase().trim();
            if (normalizedEmail !== currentUser.email.toLowerCase()) {
                const existingUser = await User.findOne({
                    email: normalizedEmail,
                    _id: { $ne: userId }
                });
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: "Email already in use"
                    });
                }
                updateData.email = normalizedEmail;
            }
        }

        if (bio !== undefined) {
            updateData.bio = bio.trim();
        }

        // **التصحيح هنا: استخدام المسار النسبي**
        if (req.file) {
            // حفظ المسار النسبي الصحيح
            updateData.avatar = `uploads/avatars/${req.file.filename}`;

            // حذف الصورة القديمة
            if (currentUser.avatar && currentUser.avatar.includes('uploads/avatars/')) {
                const oldAvatarPath = path.join(process.cwd(), currentUser.avatar);
                if (fs.existsSync(oldAvatarPath)) {
                    fs.unlinkSync(oldAvatarPath);
                }
            }
        }

        if (Object.keys(updateData).length === 0 && !req.file) {
            return res.status(400).json({
                success: false,
                message: "No data provided for update"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (err) {
        // حذف الصورة الجديدة إذا حدث خطأ
        if (req.file && req.file.path) {
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }

        res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        });
    }
};

//yes
export const getUserProfile = async (req, res) => {
    try {
        const { userid } = req.params;

        const user = await User.findById(userid).select('-password ');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        });
    }
};



export const getUserProfile1 = async (req, res) => {
    try {
        const { userid } = req.params;
        const currentUserId = req.user?.id; // اختياري

        const user = await User.findById(userid)
            .select('-password')
            .populate('followers', '_id')
            .populate('following', '_id')
            .lean({ virtuals: true });

        user.followers = user.followers.map(u => u._id);
        user.following = user.following.map(u => u._id);
        
        // فلترة المعرفات المحذوفة
        user.followers = user.followers.map(u => u._id);
        user.following = user.following.map(u => u._id);


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const posts = await Post.find({
            user: userid,
            isApproved: true,
        })
            .sort({ createdAt: -1 })
            .lean({ virtuals: true });

        res.json({
            success: true,
            user: {
                ...user,
                postsCount: posts.length,
            },
            posts,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || "Internal server error",
        });
    }
};


// export const getClientsAndCompanies = async (req, res) => {
//     try {
//         const users = await User.find({
//             role: { $in: ["client", "company"] }
//         }).select('-password'); // استبعاد كلمة المرور لأمان

//         if (users.length > 0) {
//             res.json(users);
//         }
//         res.json({ message: "not found User" })

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
// 📜 عرض المتابعين أو الذين يتابعهم
// export const getUserConnections = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const user = await User.findById(userId)
//             .populate("followers", "name email")
//             .populate("following", "name email");

//         res.json({
//             followers: user.followers,
//             following: user.following
//         });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
// في getUserConnections

// export const updateUserProfile = async (req, res) => {
//     try {
//         const { id } = req.user;
//         const { name, email, bio } = req.body;

//         const currentUser = await User.findById(id);
//         if (!currentUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const updateData = {};

//         if (name !== undefined && name.trim() !== "") {
//             updateData.name = name.trim();
//         }

//         if (email && email.toLowerCase() !== currentUser.email.toLowerCase()) {
//             const existingUser = await User.findOne({
//                 email: email.toLowerCase(),
//                 _id: { $ne: id }
//             });

//             if (existingUser) {
//                 return res.status(400).json({ message: "Email already in use" });
//             }
//             updateData.email = email.toLowerCase().trim();
//         }

//         // إضافة تحديث الـ bio
//         if (bio !== undefined) {
//             updateData.bio = bio.trim();
//         }

//         if (req.file) {
//             // حذف الصورة القديمة إذا كانت موجودة
//             if (currentUser.avatar) {
//                 const oldAvatarPath = path.join(process.cwd(), currentUser.avatar);
//                 try {
//                     await fs.access(oldAvatarPath); // التحقق من وجود الملف
//                     await fs.unlink(oldAvatarPath);
//                     console.log('Old avatar deleted successfully');
//                 } catch (unlinkErr) {
//                     // إذا الملف غير موجود، لا تعتبر هذا خطأ
//                     if (unlinkErr.code !== 'ENOENT') {
//                         console.warn('Could not delete old avatar:', unlinkErr.message);
//                     }
//                 }
//             }

//             updateData.avatar = req.file.path;
//         }

//         if (Object.keys(updateData).length === 0 && !req.file) {
//             return res.status(400).json({ message: "No data provided for update" });
//         }

//         const updatedUser = await User.findByIdAndUpdate(
//             id,
//             updateData,
//             { new: true, runValidators: true }
//         ).select('-password');

//         // إصلاح المسار في الرد
//         let avatarUrl = null;
//         if (updatedUser.avatar) {
//             const correctedPath = updatedUser.avatar.replace(/\\/g, '/');
//             avatarUrl = `${process.env.BASE_URL || 'http://192.168.105.130:3000'}/${correctedPath}`;
//         }

//         res.json({
//             success: true,
//             message: "Profile updated successfully",
//             user: {
//                 ...updatedUser.toObject(),
//                 avatarUrl: avatarUrl
//             }
//         });

//     } catch (err) {
//         // تنظيف الصورة الجديدة إذا حدث خطأ
//         if (req.file) {
//             const newAvatarPath = path.join(process.cwd(), req.file.path);
//             try {
//                 await fs.unlink(newAvatarPath);
//                 console.log('New avatar cleaned up due to error');
//             } catch (cleanupErr) {
//                 console.warn('Failed to clean up new avatar:', cleanupErr.message);
//             }
//         }

//         console.error('Profile update error:', err);
//         res.status(500).json({
//             success: false,
//             message: err.message || "Internal server error"
//         });
//     }
// };