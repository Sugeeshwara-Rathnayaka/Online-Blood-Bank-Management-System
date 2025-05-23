import express from "express";
import {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
} from "../controllers/donationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.post("/create", createDonation); // Create a new donation
router.get("/", getAllDonations); // Get all donations (with optional filters)
router.get("/:id", getDonationById); // Get a single donation by ID
router.put("/:id", updateDonation); // Update a donation by ID
router.delete("/:id", deleteDonation); // Delete a donation by ID

export default router;
