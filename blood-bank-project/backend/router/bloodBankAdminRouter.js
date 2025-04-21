import express from "express";
import {
  addBBAdmin,
  loginBBAdmin,
  logoutBBAdmin,
  deleteBBAdmin,
  updateBBAdmin,
  getBBAdminDetails,
  getAllBBAdmins,
} from "../controller/bloodBankAdminController.js";
import {
  isSuperAdminAuthenticated,
  isAdminAuthenticated,
  isBBAdminAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();
router.post("/login", loginBBAdmin);
router.post("/add", isSuperAdminAuthenticated, addBBAdmin);
router.put("/update/:id", isBBAdminAuthenticated, updateBBAdmin);
router.get("/me", isBBAdminAuthenticated, getBBAdminDetails);
router.get("/all", isSuperAdminAuthenticated, getAllBBAdmins);
router.delete("/delete/:id", isSuperAdminAuthenticated, deleteBBAdmin);
router.get("/logout", isBBAdminAuthenticated, logoutBBAdmin);

export default router;
