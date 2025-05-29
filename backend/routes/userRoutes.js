import express from "express";
import {
  checkAuth,
  login,
  signup,
  updateProfile,
} from "../controllers/userController.js";
import { protectRoute } from "../middlewares/auth.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/auth").post(login);
router.route("/update-profile").put(protectRoute, updateProfile);
router.route("/check").get(protectRoute, checkAuth);

export default router;
