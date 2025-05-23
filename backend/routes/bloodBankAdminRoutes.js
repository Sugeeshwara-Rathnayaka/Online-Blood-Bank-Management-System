import express from "express";
import {
  getBBHospitalById,
  updateBBHospital,
} from "../controllers/BloodBankAdmin/bBHospitalController.js";
import {
  updateBBAdmin,
  getBBAdminDetails,
  // getLoggedInAdmin,
} from "../controllers/BloodBankAdmin/bBAdminController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.get("/get-bbhos/:id", getBBHospitalById);
router.put("/update-bbhos/:id", updateBBHospital);

router.put("/update-bbadmin/:id", updateBBAdmin);
router.get("/details-bbadmin/:id", getBBAdminDetails);
//router.get("/details-bbadmin/me", protect, getLoggedInAdmin);

export default router;
