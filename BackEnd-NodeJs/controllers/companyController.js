// import Company from "../models/Company.js";
// import User from "../models/User.js";

/** 🟢 إنشاء شركة جديدة */
// export const createCompany = async (req, res) => {
//     try {
//         const { name, description, owner } = req.body;

//         const company = await Company.create({
//             name,
//             description,
//             owner,
//             isApproved: false,
//         });

//         res.status(201).json({ message: "✅ Company created", company });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// controllers/companyController.js

/** 🟢 Admin: تحويل مستخدم إلى شركة */
// export const convertUserToCompany = async (req, res) => {
//     try {
//         const { userId, name, description } = req.body;

//         // التحقق من وجود المستخدم
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // التحقق مما إذا كان هذا المستخدم لديه شركة بالفعل
//         const existingCompany = await Company.findOne({ owner: userId });
//         if (existingCompany) {
//             return res.status(400).json({ message: "This user already owns a company" });
//         }

//         // إنشاء الشركة باسم المالك المحدد
//         const company = await Company.create({
//             name: name || `${user.name}'s Company`,
//             description: description || '',
//             owner: userId,
//             isApproved: true, // نعتبرها معتمدة تلقائيًا لأنها من Admin
//         });

//         // (اختياري) تغيير دور المستخدم إلى "company"
//         user.role = "company";
//         await user.save();

//         res.status(201).json({
//             message: "✅ User converted to company successfully",
//             company
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: err.message });
//     }
// };
// /** 🟡 جلب كل الشركات */
// export const getAllCompanies = async (req, res) => {
//     try {
//         const companies = await Company.find().populate("owner", "name email role");
//         res.json(companies);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// /** 🔵 جلب شركة واحدة */
// export const getCompanyById = async (req, res) => {
//     try {
//         const company = await Company.findById(req.params.id).populate("owner", "name email role");
//         if (!company) return res.status(404).json({ message: "Company not found" });
//         res.json(company);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// /** 🟠 تحديث شركة */
// export const updateCompany = async (req, res) => {
//     try {
//         const updated = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updated) return res.status(404).json({ message: "Company not found" });
//         res.json({ message: "✅ Company updated", company: updated });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// /** 🔴 حذف شركة */
// export const deleteCompany = async (req, res) => {
//     try {
//         const deleted = await Company.findByIdAndDelete(req.params.id);
//         if (!deleted) return res.status(404).json({ message: "Company not found" });
//         res.json({ message: "❌ Company deleted" });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

/** ✅ الموافقة على شركة */
// export const approveCompany = async (req, res) => {
//     try {
//         const company = await Company.findById(req.params.id);
//         if (!company) return res.status(404).json({ message: "Company not found" });

//         company.isApproved = true;
//         await company.save();

//         res.json({ message: "✅ Company approved successfully", company });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// controllers/companyController.js
import Company from "../models/Company.js";
import User from "../models/User.js";

import mongoose from 'mongoose';

// 🔴 أضف هذه الدالة للتحقق من ObjectId
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};
/** 🟡 جلب كل الشركات */
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().populate("owner", "name email role");
        res.json(companies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// /** 🔵 جلب شركة واحدة */
// export const getCompanyById = async (req, res) => {
//     try {
//         const company = await Company.findById(req.params.id).populate("owner", "name email role");
//         if (!company) return res.status(404).json({ message: "Company not found" });
//         res.json(company);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// /** ✅ الموافقة على شركة (admin فقط) */
// export const approveCompany = async (req, res) => {
//     try {
//         const company = await Company.findById(req.params.id);
//         if (!company) return res.status(404).json({ message: "Company not found" });

//         company.isApproved = true;
//         await company.save();
//         res.json({ message: "✅ Company approved successfully", company });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// /** 🔴 حذف شركة (admin فقط) */
// export const deleteCompany = async (req, res) => {
//     try {
//         const deleted = await Company.findByIdAndDelete(req.params.id);
//         if (!deleted) return res.status(404).json({ message: "Company not found" });
//         res.json({ message: "❌ Company deleted" });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

/** 🟢 Admin: إنشاء شركة لمستخدم */
/** 🟢 Admin: إنشاء شركة لمستخدم */
export const createCompanyForUser = async (req, res) => {
    try {
        const { userId, name, description } = req.body;

        // 1. التحقق من وجود المستخدم
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // 2. التحقق من أن المستخدم عادي
        if (user.role !== "client") {
            return res.status(400).json({ message: "Only regular users can own a company" });
        }

        // 3. التحقق من عدم وجود شركة
        const existingCompany = await Company.findOne({ owner: userId });
        if (existingCompany) {
            return res.status(400).json({ message: "User already owns a company" });
        }

        // 4. إنشاء الشركة
        const company = await Company.create({
            name,
            description: description || "",
            owner: userId,
            isApproved: false,
        });

        // 5. تغيير دور المستخدم إلى "company"
        user.role = "company";
        await user.save();

        res.status(201).json({ message: "✅ Company created", company });
    } catch (err) {
        console.error("Create company error:", err); // ← أضف هذا للتسجيل
        res.status(500).json({ message: err.message });
    }
};

/** 📋 جلب المستخدمين المؤهلين (ليس لديهم شركة) */
// controllers/companyController.js
export const getEligibleUsers = async (req, res) => {
    try {
        const companyOwners = await Company.distinct("owner");
        const users = await User.find({
            _id: { $nin: companyOwners },
            role: "client"
        }).select("name email role");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// تحديث دالة getCompanyById
export const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;

        // 🔴 تحقق من أن الـ ID صالح
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid company ID format"
            });
        }

        const company = await Company.findById(id).populate("owner", "name email role");
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        res.json({
            success: true,
            data: company
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// نفس الشيء لـ approveCompany
export const approveCompany = async (req, res) => {
    try {
        const { id } = req.params;

        // 🔴 تحقق من أن الـ ID صالح
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid company ID format"
            });
        }

        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        company.isApproved = true;
        await company.save();

        res.json({
            success: true,
            message: "✅ Company approved successfully",
            data: company
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// ونفس الشيء لـ deleteCompany
export const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;

        // 🔴 تحقق من أن الـ ID صالح
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid company ID format"
            });
        }

        const deleted = await Company.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        res.json({
            success: true,
            message: "❌ Company deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};