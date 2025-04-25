import express from "express";
import {
  getAllMessages,
  sendMessage,
} from "../controller/messageController.js";
import {
  isAdminAuthenticated,
  isSuperAdminAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/getall", isSuperAdminAuthenticated, getAllMessages);

export default router;
