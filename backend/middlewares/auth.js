import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized! Token failed",
      });
    }
  } catch (error) {
    console.log("Protect Route Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
