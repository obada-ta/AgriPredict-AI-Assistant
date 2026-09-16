// controllers/imagePredictController.js
import axios from "axios";
import FormData from "form-data";
import ImagePrediction from "../models/ImagePrediction.js";
import AiLog from "../models/AiLog.js";
import fs from "fs";


export const predictImage = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const formData = new FormData();
        formData.append("image", req.file.buffer, {
            filename: req.file.originalname,
        });

        // إرسال إلى Flask
        const flaskRes = await axios.post(
            "http://127.0.0.1:5000/predict",
            formData,
            { headers: formData.getHeaders() }
        );

        // حفظ في DB
        const saved = await ImagePrediction.create({
            user: userId,
            result: flaskRes.data,
            type: "image",
        });

        res.status(200).json({
            message: "Prediction saved successfully",
            data: saved,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getPredictions = async (req, res) => {
    try {
        const userId = req.user.id;

        const predictions = await AiLog.find({ user: userId }).populate('user', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(predictions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const api = 'http://192.168.1.108:5000/'
const FLASK_ENDPOINTS = {
    soil: `${api}/api/predict`,
    "analyze-land": `${api}/api/analyze-land`,
    crop: `${api}/api/recommend-crop`,
    plant: `${api}/api/plant-type`,
    "crop-yield": `${api}/api/crop-yield`,
    "plant-disease": `${api}/api/plant-disease`  // ✅ added
};


export const handleAiRequest = async (req, res) => {
    try {
        const { type } = req.params;
        const flaskUrl = FLASK_ENDPOINTS[type];

        if (!flaskUrl) {
            return res.status(400).json({ message: "Invalid AI type" });
        }

        let flaskResponse;
        let savedImagePath = null;

        // ========== IMAGE REQUEST ==========
        if (req.file) {
            const formData = new FormData();

            // Handle both file stream and buffer
            if (req.file.path) {
                formData.append("image", fs.createReadStream(req.file.path));
                savedImagePath = `/uploads/ai/${req.file.filename}`;
            } else if (req.file.buffer) {
                // Handle buffer from React Native/mobile
                const tempFilePath = path.join(__dirname, `../temp/${Date.now()}-${req.file.originalname}`);
                await fs.writeFile(tempFilePath, req.file.buffer);
                formData.append("image", fs.createReadStream(tempFilePath));
                savedImagePath = `/uploads/ai/${req.file.originalname}`;

                // Clean up temp file after sending
                setTimeout(() => fs.unlink(tempFilePath, () => { }), 5000);
            }

            // Add other fields if present
            if (req.body && typeof req.body === 'object') {
                Object.keys(req.body).forEach(key => {
                    if (req.body[key] !== undefined) {
                        formData.append(key, req.body[key]);
                    }
                });
            }

            flaskResponse = await axios.post(flaskUrl, formData, {
                headers: formData.getHeaders ? formData.getHeaders() : {},
            });
        } else {
            // ========== JSON REQUEST ==========
            flaskResponse = await axios.post(flaskUrl, req.body, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        // ========== SAVE LOG ==========
        const log = await AiLog.create({
            type: type.toUpperCase(),
            flaskUrl,
            input: req.body || {},
            output: flaskResponse.data,
            confidence:
                flaskResponse.data.confidence ||
                flaskResponse.data.suitabilityPercentage ||
                flaskResponse.data.probability ||
                null,
            image: savedImagePath,
            user: req.user?.id || null,
        });

        res.status(200).json({
            // message: "AI request processed successfully",
            // logId: log._id,
            result: flaskResponse.data,
        });

    } catch (error) {
        console.error("AI ERROR:", error?.response?.data || error.message);
        res.status(500).json({
            error: error.message,
            details: error?.response?.data || null
        });
    }
};


export const saveAiLog = async (req, res) => {
    try {
        const { type, input, output, confidence } = req.body;

        if (!type || !input || !output) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const log = await AiLog.create({
            type,
            input: JSON.parse(input),
            output: JSON.parse(output),
            confidence,
            image: req.file ? `/uploads/ai/${req.file.filename}` : null,
            user: req.user?.id,
        });

        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


