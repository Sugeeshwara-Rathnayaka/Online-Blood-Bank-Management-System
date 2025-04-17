import express from "express";
import {
  addNewAdmin,
  adminLogin,
  logoutAdmin,
  deleteAdmin,
  updateAdmin,
} from "../controller/adminController.js";
import {
  isSuperAdminAuthenticated,
  isAdminAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();
router.post("/login", adminLogin);
router.post("/addnew", isSuperAdminAuthenticated, addNewAdmin);
router.put("/update/:id", isSuperAdminAuthenticated, updateAdmin);
//router.get("/admin", isSuperAdminAuthenticated, addNewAdmin);
router.delete("/delete/:id", isSuperAdminAuthenticated, deleteAdmin);
router.get("/logout", isAdminAuthenticated, logoutAdmin);

export default router;
