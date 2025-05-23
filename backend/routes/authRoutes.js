import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { login, logout, signup, getMe } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/signup", signup);
router.get("/me", protect, getMe);

export default router;
