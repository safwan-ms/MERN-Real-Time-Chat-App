import express from "express";
import { login, signup } from "../controllers/userController.js";

const router = express.Router();

router.route("/").post(signup);
router.route("/auth").post(login);

export default router;
