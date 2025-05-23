import express from "express";
import {
  updateHospital,
  deleteHospital,
  updateHospitalStatus,
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  hardDeleteBloodRequest,
  updateBloodRequestStatus,
} from "../controllers/NormalHospital/hospitalController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();
// Apply `protect` globally
router.use(protect);
router.use(authorizeRoles("hospital"));

//Hospital
router.put("/update/:id", updateHospital);
router.delete("/delete/:id", deleteHospital);
router.patch("/status", updateHospitalStatus);

router.post("/blood-req", createBloodRequest);
router.get("/all-req", getAllBloodRequests);
router.get("/blood-req/:id", getBloodRequestById);
router.delete("/delete-req/:id", hardDeleteBloodRequest);
router.put("/update-status/:id", updateBloodRequestStatus);

export default router;
