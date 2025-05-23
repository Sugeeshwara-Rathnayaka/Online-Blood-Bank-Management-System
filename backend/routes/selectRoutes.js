import express from "express";
import {
  getAllBBHospitals,
  getAllDistricts,
  getAllBloodTypes,
} from "../controllers/Other/selectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
// Apply `protect` globally
router.use(protect);

router.get("/get-allbbhos", getAllBBHospitals);
router.get("/get-districts", getAllDistricts);
router.get("/get-bloodtypes", getAllBloodTypes);

export default router;
