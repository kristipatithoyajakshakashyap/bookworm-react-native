import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No authentication token, access denied" });
        }

        const token = authHeader.replace("Bearer ", "").trim();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(400).json({ message: "Token is not valid" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(`Error in protectRoute middleware ${error.message}`.bgRed.white);
        res.status(500).json({})
    }
}