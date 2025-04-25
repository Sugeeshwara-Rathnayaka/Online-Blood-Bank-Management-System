import express from "express";
import {
  createReservation,
  deleteReservation,
  getAllReservations,
  updateReservationStatus,
} from "../controller/donorReservationController.js";
import {
  isDonorAuthenticated,
  isSuperAdminAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", isDonorAuthenticated, createReservation);
router.get("/all", isDonorAuthenticated, getAllReservations);
// router.get("/details/:id", isOrganizationAuthenticated, getCampaignById);
router.put("/update/:id", isSuperAdminAuthenticated, updateReservationStatus);
// router.put("/softDelete/:id", deleteCampaign);
// router.put("/restore/:id", restoreCampaign);
router.delete("/delete/:id", deleteReservation);

export default router;
