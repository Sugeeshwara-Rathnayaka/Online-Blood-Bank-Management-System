import express from "express";
import {
  createBBHospital,
  getAllBBHospitals,
  getBBHospitalById,
  updateBBHospital,
  deleteBBHospital,
  restoreBBHospital,
} from "../controller/bloodBankHospitalController.js";
import { isSuperAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", isSuperAdminAuthenticated, createBBHospital);
router.get("/all", isSuperAdminAuthenticated, getAllBBHospitals);
router.get("/details/:id", isSuperAdminAuthenticated, getBBHospitalById);
router.put("/update/:id", isSuperAdminAuthenticated, updateBBHospital);
router.put("/softdelete/:id", isSuperAdminAuthenticated, deleteBBHospital);
router.put("/restore/:id", isSuperAdminAuthenticated, restoreBBHospital);

export default router;
