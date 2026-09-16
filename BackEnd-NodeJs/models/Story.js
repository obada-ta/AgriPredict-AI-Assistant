import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    caption: { type: String },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) } // بعد 24 ساعة
}, { timestamps: true });

storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // حذف تلقائي بعد انتهاء المدة

export default mongoose.model("Story", storySchema);
