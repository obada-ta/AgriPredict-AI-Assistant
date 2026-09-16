import mongoose from "mongoose";
import { BaseURL } from "../utils/tokenBlacklist.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ["admin", "staff", "company", "client"],
    default: "client"
  },
  bio: {
    type: String,
    default: ""
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for avatar URL
userSchema.virtual('avatarUrl').get(function () {
  if (this.avatar) {
    // تأكد من أن المسار صحيح
    const avatarPath = this.avatar.replace(/\\/g, '/');
    
    return `${BaseURL}/${avatarPath}`;
  }
  return null;
});

// Virtual for counts
userSchema.virtual('postsCount').get(function () {
  return 0; // يمكنك ربطها بنموذج المنشورات لاحقاً
});

userSchema.virtual('followersCount').get(function () {
  return this.followers ? this.followers.length : 0;
});

userSchema.virtual('followingCount').get(function () {
  return this.following ? this.following.length : 0;
});

export default mongoose.model("User", userSchema);