// src/models/Reaction.js
import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["like", "dislike"] },
}, { timestamps: true });

export default mongoose.model("Reaction", reactionSchema);
