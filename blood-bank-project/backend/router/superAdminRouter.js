import express from "express";
import {
  registerSuperAdmin,
  logoutSuperAdmin,
  superAdminLogin,
  getSuperAdminDetails,
} from "../controller/superAdminController copy.js";
import { isSuperAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
router.post("/login", superAdminLogin);
router.post("/register", registerSuperAdmin);
router.get("/logout", isSuperAdminAuthenticated, logoutSuperAdmin);
router.get("/me", isSuperAdminAuthenticated, getSuperAdminDetails);

export default router;
