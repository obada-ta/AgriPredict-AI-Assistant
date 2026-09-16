// src/models/Company.js
import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: String,
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isApproved: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Company", companySchema);
