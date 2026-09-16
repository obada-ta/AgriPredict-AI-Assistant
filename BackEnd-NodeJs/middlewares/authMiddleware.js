import jwt from "jsonwebtoken";
import { isBlacklisted } from "../utils/tokenBlacklist.js";

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        // تحقق مما إذا كان التوكن في القائمة السوداء
        if (isBlacklisted(token)) {
            return res.status(401).json({ message: "Token has been revoked" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const verifyRole = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(403).json({ message: "Unauthorized" });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: "Rejected You do not have permission" });
            }

            next();
        } catch (err) {
            return res.status(500).json({ message: `${err.message} mohammad` });
        }
    };
};
