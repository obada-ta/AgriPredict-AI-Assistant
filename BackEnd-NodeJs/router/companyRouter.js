// import express from "express";
// import {
//     createCompany,
//     getAllCompanies,
//     getCompanyById,
//     updateCompany,
//     deleteCompany,
//     approveCompany,
//     convertUserToCompany
// } from "../controllers/companyController.js";

// import { verifyToken, verifyRole } from "../middlewares/authMiddleware.js";
// import { getPendingCompanies } from "../controllers/postController.js";

// const router = express.Router();

// // 🟢 إنشاء شركة (admin, staff)
// router.post("/", verifyToken, verifyRole(["admin", "staff"]), convertUserToCompany);

// // 🟡 جلب كل الشركات (admin, staff)
// router.get("/", verifyToken, verifyRole(["admin", "staff"]), getAllCompanies);

// // 🔵 جلب شركة واحدة (أي مستخدم)
// router.get("/:id", verifyToken, getCompanyById);

// // 🟠 تحديث شركة (admin, staff)
// router.put("/:id", verifyToken, verifyRole(["admin", "staff"]), updateCompany);

// // 🔴 حذف شركة (admin فقط)
// router.delete("/:id", verifyToken, verifyRole(["admin"]), deleteCompany);

// // ✅ الموافقة على شركة (admin فقط)
// router.patch("/:id/approve", verifyToken, verifyRole(["admin"]), approveCompany);

// router.get("/pending", verifyToken, verifyRole(["admin", "staff"]), getPendingCompanies);

// export default router;

// routes/companyRoutes.js
// routes/company.js
import express from "express";
import {
    getAllCompanies,
    getCompanyById,
    approveCompany,
    deleteCompany,
    createCompanyForUser,
    getEligibleUsers
} from "../controllers/companyController.js";
import { verifyRole, verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
// الـ routes الثابتة **يجب** أن تسبق :id
// 🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

// 1️⃣ route الثابتة أولاً (للإدمن فقط)
router.get("/eligible-users", verifyToken, verifyRole(["admin"]), getEligibleUsers);

// 2️⃣ routes الأساسية
router.get("/", verifyToken, verifyRole(["admin", "staff"]), getAllCompanies);
router.post("/for-user", verifyToken, verifyRole(["admin"]), createCompanyForUser);

// 3️⃣ routes مع :id (في النهاية)
router.get("/:id", verifyToken, getCompanyById);
router.patch("/:id/approve", verifyToken, verifyRole(["admin"]), approveCompany);
router.delete("/:id", verifyToken, verifyRole(["admin"]), deleteCompany);

export default router;