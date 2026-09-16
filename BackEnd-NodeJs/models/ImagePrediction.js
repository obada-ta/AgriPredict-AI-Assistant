// models/ImagePrediction.js
import mongoose from "mongoose";

const imagePredictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: String, // اختياري لو خزنت الصورة
    result: {
      class: String,
      confidence: Number,
    },
    type: {
      type: String,
      default: "image",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ImagePrediction", imagePredictionSchema);
