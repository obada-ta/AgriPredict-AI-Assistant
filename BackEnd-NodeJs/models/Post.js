import mongoose from "mongoose";
import { BaseURL } from "../utils/tokenBlacklist.js";
const postSchema = new mongoose.Schema(
    {
        title: String,
        content: String,
        image: String, // الصورة الرئيسية
        images: [String],
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            default: null,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        isApproved: { type: Boolean, default: false },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

postSchema.virtual("imageUrl").get(function () {
    if (!this.image) return null;

    const imagePath = this.image.replace(/\\/g, '/');
    return `${BaseURL}${imagePath}`;
});
// const avatarPath = this.avatar.replace(/\\/g, '/');

postSchema.virtual("imagesUrls").get(function () {
    if (!this.images || !this.images.length) return [];
    return this.images.map(img =>
        `${BaseURL}/${img.replace(/\\/g, "/")}`
    );
});


export default mongoose.model("Post", postSchema);