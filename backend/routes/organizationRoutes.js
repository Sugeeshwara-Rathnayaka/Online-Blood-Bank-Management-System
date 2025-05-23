import express from "express";
// import {
//   getDashboardStats,
//   getRecentDonations,
//   getBloodInventory,
// } from "../controllers/organizationController.js";
import { createCampaign } from "../controllers/campaignController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply `protect` globally
router.use(protect);
router.use(authorizeRoles("organization"));

// router.get("/dashboard/stats", getDashboardStats);
// router.get("/donations/recent", getRecentDonations);
// router.get("/blood-inventory", getBloodInventory);
//router.post("/campaigns", createCampaign);

router.post("/create", createCampaign);

export default router;
