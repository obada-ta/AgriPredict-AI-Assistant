// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // إنشاء المجلدات بشكل متزامن
// const uploadsDir = 'uploads/avatars';
// const uploadsPost = 'uploads/post';

// // تأكد من إنشاء المجلدات بشكل متزامن
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }
// if (!fs.existsSync(uploadsPost)) {
//   fs.mkdirSync(uploadsPost, { recursive: true });
// }

// // إعداد multer لتخزين الصور
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadsDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// // تصفية الملفات لقبول الصور فقط
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'), false);
//   }
// };

// export const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB حد أقصى
//   },
//   fileFilter: fileFilter
// });

// export default upload;

// middlewares/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// إنشاء المجلدات
const createDirectories = () => {
    const directories = [
        'uploads/avatars',
        'uploads/posts',
        'uploads/ai',
    ];

    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

createDirectories();

// إعدادات التخزين
const storageConfig = {

    avatarStorage: multer.diskStorage({
        destination: 'uploads/avatars',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, 'avatar-' + uniqueSuffix + ext);
        }
    }),

    postStorage: multer.diskStorage({
        destination: 'uploads/posts',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, 'post-' + uniqueSuffix + ext);
        }
    }),

    aiStorage: multer.diskStorage({
        destination: 'uploads/ai',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, 'ai-' + uniqueSuffix + ext);
        }
    })
};

// تصفية الملفات
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// إنشاء uploads
export const uploadAvatar = multer({
    storage: storageConfig.avatarStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

export const uploadPost = multer({
    storage: storageConfig.postStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter
});

export const AiPost = multer({
    storage: storageConfig.aiStorage,   // 👈 diskStorage
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter
});

export default { uploadAvatar, uploadPost, AiPost };