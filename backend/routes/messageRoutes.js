import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import {
  getAllUsersForSidebar,
  getMessages,
  markMessageAsSeen,
} from "../controllers/messageController.js";

const router = express.Router();

router.route("/users").get(protectRoute, getAllUsersForSidebar);
router.route("/:id").get(protectRoute, getMessages);
router.route("/mark/:id").put(protectRoute, markMessageAsSeen);

export default router;
