import express from "express";
import {
  createBBHospital,
  getAllBBHospitals,
  deleteBBHospital,
  restoreBBHospital,
  HarddeleteBloodBank,
} from "../controllers/SuperAdmin/bBHospitalController.js";
import {
  addTelephone,
  getTelephonesByHospital,
  deleteTelephone,
  setTelephoneStatus,
} from "../controllers/SuperAdmin/bBHTelephoneController.js";
import {
  addBBAdmin,
  deleteBBAdmin,
  getAllBBAdmins,
} from "../controllers/SuperAdmin/bBAdminController.js";
import {
  getAllDonors,
  deleteDonor,
  updateValidationStatus,
} from "../controllers/SuperAdmin/donorController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply `protect` globally
router.use(protect);
router.use(authorizeRoles("superadmin"));

// Blood Bank Admin routes
router.post("/add-bbadmin", addBBAdmin);
router.delete("/delete-bbadmin/:id", deleteBBAdmin);
router.get("/all-bbadmin", getAllBBAdmins);

// Blood Bank Hospital routes
router.post("/add-bbhos", createBBHospital);
router.get("/get-bbhos", getAllBBHospitals);
router.put("/delete-bbhos/:id", deleteBBHospital);
router.put("/restore-bbhos/:id", restoreBBHospital);
router.delete("/hardDelete-bbhos/:id", HarddeleteBloodBank);

// Telephone routes
router.post("/add-bbhosTele", addTelephone);
router.get("/get-bbhosTele/:bloodBankId", getTelephonesByHospital);
router.delete("/delete-bbhosTele/:id", deleteTelephone);
router.patch("/set-bbhosTele/:id/:status", setTelephoneStatus);

// Donor routes
router.get("/all-donor", getAllDonors);
router.delete("/delete-donor/:id", deleteDonor);
router.put("/update-donor/:id", updateValidationStatus);

export default router;
