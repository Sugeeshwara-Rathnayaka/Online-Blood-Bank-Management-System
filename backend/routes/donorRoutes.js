import express from "express";
import {
  updateDonor,
  deleteDonor,
  getDonorById,
  getDonorDetails,
  updateDonorPrivacy,
} from "../controllers/Donor/donorController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

import { getAllCampaigns } from "../controllers/Donor/campaignController.js";
import {
  createReservation,
  getAllReservations,
  deleteReservation,
} from "../controllers/Donor/donorReservationController.js";

const router = express.Router();

// Apply `protect` globally
router.use(protect);
router.use(authorizeRoles("donor"));

router.get("/me", getDonorDetails);
router.put("/update/:id", updateDonor);
router.delete("/delete/:id", deleteDonor);
router.get("/details/:id", getDonorById);
router.patch("/privacy", updateDonorPrivacy);

router.get("/allcampaign", getAllCampaigns);

router.post("/create-res", createReservation);
router.get("/all-res", getAllReservations);
router.delete("/delete-res/:id", deleteReservation);
export default router;
