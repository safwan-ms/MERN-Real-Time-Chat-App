import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/userController.js";
import { protectRoute } from "../middlewares/auth.js";
import uploadSingleImage from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router
  .route("/update-profile")
  .put(protectRoute, uploadSingleImage, updateProfile);
router.route("/check").get(protectRoute, checkAuth);

export default router;
