import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

export const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) return res.status(400).json({ message: "All fields are required" })
        if (password.length < 6) return res.status(400).json({ message: "Password should be at least 6 characters long" });
        if (username.length < 3) return res.status(400).json({ message: "Username should be at least 3 characters long" });
        // const existingUser = await User.findOne({$or:[{email:email, username:username}]})
        const existingEmail = await User.findOne({ email })
        if (existingEmail) return res.status(400).json({ message: "Email already exists" });
        const existingUsername = await User.findOne({ username })
        if (existingUsername) return res.status(400).json({ message: "Username already exists" });
        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        const user = new User({
            email, username, password, profileImage
        })
        await user.save()
        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            }
        })
    } catch (error) {
        console.log(`Error in register route ${error.message}`.bgRed.white)
        res.status(500).json({ message: "Internal server error" });
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields are required" })
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "Uer does not exist" });
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            }
        })
    } catch (error) {
        console.log(`Error in login route ${error.message}`.bgRed.white)
        res.status(500).json({ message: "Internal server error" });
    }
}