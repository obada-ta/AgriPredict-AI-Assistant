import mongoose from "mongoose";
const aiLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },

    flaskUrl: {
      type: String, // مثال: http://127.0.0.1:5000/predict
      required: true,
    },

    input: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    output: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    image: {
      type: String,
      default: null,
    },

    confidence: {
      type: Number,
      default: null,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AiLog", aiLogSchema);
