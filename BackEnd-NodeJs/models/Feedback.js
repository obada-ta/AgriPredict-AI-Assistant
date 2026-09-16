import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["query", "complaint"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
