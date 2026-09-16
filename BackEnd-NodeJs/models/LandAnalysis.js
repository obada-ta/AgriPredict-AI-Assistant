import mongoose from "mongoose";

const landAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    input: Object,
    result: Object,
    type: {
      type: String,
      enum: ["land", "crop", "soil"],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("LandAnalysis", landAnalysisSchema);
