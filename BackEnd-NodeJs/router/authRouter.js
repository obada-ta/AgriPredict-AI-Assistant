import express from 'express';
import { changePassword, deleteUser, deleteUser1, followUser, getAllUsers, getClientsAndCompanies, getUserConnections, getUserProfile, getUserProfile1, login, logout, register, updateUser, updateUserProfile } from '../controllers/authController.js';
import { verifyRole, verifyToken } from '../middlewares/authMiddleware.js';
import { uploadAvatar } from '../config/multer.js'
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", verifyToken, logout);

router.get('/userMe/:userid', getUserProfile);
// router.get('/getUserProfile/:userid', getUserProfile1);

router.get('/getUserProfile/:userid', getUserProfile1);


router.put('/userMe', verifyToken, uploadAvatar.single('avatar'), updateUserProfile);

// فقط للمسؤولين
router.put("/users/:userId", verifyToken, updateUser);

router.delete("/users/:userId", verifyToken, verifyRole(['admin', 'staff']), deleteUser);


router.post('/changePassword', verifyToken, changePassword);

router.get("/users/clients-companies", verifyToken, getClientsAndCompanies);

router.get("/users", verifyToken, getAllUsers);

router.post("/follower/:userId", verifyToken, followUser);

router.get("/followersMe/:userId", verifyToken, getUserConnections);


export default router;


// router.delete("/users/:userId", verifyToken, verifyRole(['admin','staff']), deleteUser);

