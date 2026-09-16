import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String, // مثلاً: 'message', 'like', 'comment'
      default: "message", 
    },
    data: {
     type: mongoose.Schema.Types.Mixed, // نص الإشعار (مثلاً: "أرسل لك رسالة جديدة")
      required: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
