import express from "express";
import {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
} from "../controller/donationController.js";

import { isDonorAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", isDonorAuthenticated, createDonation); // Create a new donation
router.get("/", isDonorAuthenticated, getAllDonations); // Get all donations (with optional filters)
router.get("/:id", isDonorAuthenticated, getDonationById); // Get a single donation by ID
router.put("/:id", isDonorAuthenticated, updateDonation); // Update a donation by ID
router.delete("/:id", isDonorAuthenticated, deleteDonation); // Delete a donation by ID

export default router;
