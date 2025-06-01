import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {
  uploadToCloudinary,
  removeFromCloudinary,
} from "../helpers/cloudinaryHelper.js";

export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const checkUserExists = await User.findOne({ email });

    if (checkUserExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(res, newUser._id);

    res.status(201).json({
      success: true,
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log("Internal Server error", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "Email doesn't exists" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateToken(res, userData._id);

    res.status(200).json({
      success: true,
      _id: userData._id,
      fullName: userData.fullName,
      email: userData.email,
      token: token,
      message: "Login successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Controller to check if user is authenticated
export const checkAuth = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { bio, fullName } = req.body;
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!bio && !fullName && !req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing to update" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Ensure profilePic is always an object
    if (typeof user.profilePic !== "object" || user.profilePic === null) {
      user.profilePic = { url: "", publicId: "" };
    }
    //If a new image is uploaded
    if (req.file) {
      //Remove old image from clodinary
      if (user.profilePic && user.profilePic.publicId) {
        await removeFromCloudinary(user.profilePic.publicId);
      }

      //Upload new image
      const result = await uploadToCloudinary(req.file.buffer);

      const { secure_url: url, public_id: publicId } = result;

      user.profilePic = { url, publicId };
    }

    switch (true) {
      case !fullName:
        return res.status(400).json({ message: "Name is required" });
    }

    user.fullName = fullName;
    user.bio = bio;

    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);

    res.status(500).json({ success: false, message: error.message });
  }
};
