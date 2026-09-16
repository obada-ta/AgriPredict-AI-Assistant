import axios from "axios";
import LandAnalysis from "../models/LandAnalysis.js";

export const analyzeLand = async (req, res) => {
    try {
        const userId = req.user.id;

        // إرسال البيانات إلى Flask
        const flaskResponse = await axios.post(
            "http://127.0.0.1:5000/analyze-land",
            req.body
        );

        // حفظ النتيجة
        const saved = await LandAnalysis.create({
            user: userId,
            input: req.body,
            result: flaskResponse.data,
            type: "land"
        });

        res.status(200).json({
            message: "Analysis saved successfully",
            data: saved
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getMyLandAnalyses = async (req, res) => {
    try {
        const userId = req.user.id;

        const analyses = await LandAnalysis.find({
            user: userId,
            type: "land",
        }).sort({ createdAt: -1 });

        res.status(200).json(analyses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
