import express from "express";
import {
  getAllBBHospitals,
  getAllDistricts,
  getAllBloodTypes,
} from "../controllers/Other/selectController.js";

const router = express.Router();

router.get("/get-allbbhos", getAllBBHospitals);
router.get("/get-districts", getAllDistricts);
router.get("/get-bloodtypes", getAllBloodTypes);

export default router;
