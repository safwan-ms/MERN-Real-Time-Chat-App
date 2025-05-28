import express from "express";
import { checkAuth, login, signup } from "../controllers/userController.js";
import { protectRoute } from "../middlewares/auth.js";

const router = express.Router();

router.route("/").post(signup).get(protectRoute, checkAuth);
router.route("/auth").post(login);

export default router;
