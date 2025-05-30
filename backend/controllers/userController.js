import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import streamifier from "streamifier";

export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  try {
    if (!fullName || !email || !password || !bio) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    const checkUserExists = await User.findOne({ email });

    if (checkUserExists) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists!" });
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

    const user = await User.findById(userId); // needed to delete old image

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let profilePic = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    if (req.file) {
      // Delete old image from Cloudinary
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }

      // Upload new image
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "profile_pics" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const uploadResult = await streamUpload();

      profilePic = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }

    // Final DB update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName: fullName || user.fullName,
        bio: bio || user.bio,
        profilePic,
        profilePicPublicId,
      },
      { new: true }
    );

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
