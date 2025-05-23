import express from "express";
import {
  createReservation,
  deleteReservation,
  getAllReservations,
  updateReservationStatus,
} from "../controllers/Donor/donorReservationController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);
router.use(authorizeRoles("donor"));

router.get("/all", getAllReservations);
router.put("/update/:id", updateReservationStatus);

// router.get("/details/:id", isOrganizationAuthenticated, getCampaignById);
// router.put("/softDelete/:id", deleteCampaign);
// router.put("/restore/:id", restoreCampaign);

export default router;
