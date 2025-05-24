import express from "express";
import {
  getBBHospitalById,
  updateBBHospital,
} from "../controllers/BloodBankAdmin/bBHospitalController.js";
import {
  updateBBAdmin,
  getBBAdminDetails,
  getAllReservations,
  updateReservationStatus,
  getAllCampaignReservations,
  updateCampaignReservationStatus,
} from "../controllers/BloodBankAdmin/bBAdminController.js";
import {
  createRequest,
  getMySents,
  getMyReceived,
  deleteRequest,
  getAllBloodRequests,
  updatePriority,
  updateBloodRequestStatus,
} from "../controllers/BloodBankAdmin/bloodBankRequestController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("bloodbankadmin"));

router.get("/get-bbhos/:id", getBBHospitalById);
router.put("/update-bbhos/:id", updateBBHospital);

router.put("/update-bbadmin/:id", updateBBAdmin);
router.get("/details-bbadmin/:id", getBBAdminDetails);

router.post("/create-req", createRequest);
router.get("/mySent-req", getMySents);
router.get("/myReceived-req", getMyReceived);
router.delete("/delete-req/:id", deleteRequest);

router.get("/normal-req", getAllBloodRequests);
router.patch("/update-priority/:id", updatePriority);
router.patch("/update-status/:id", updateBloodRequestStatus);

router.get("/getAll-res", getAllReservations);
router.put("/update-res-status/:id", updateReservationStatus);

router.get("/campaign-reservations", getAllCampaignReservations);
router.put("/update-campaign-res-status/:id", updateCampaignReservationStatus);
export default router;
