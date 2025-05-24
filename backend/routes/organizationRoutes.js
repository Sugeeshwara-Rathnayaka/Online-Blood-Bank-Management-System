import express from "express";
import {
  createCampaign,
  getAllCampaigns,
  hardDeleteCampaign,
  toggleCampaignDeleteStatus,
} from "../controllers/Organization/campaignController.js";
import {
  updateOrganization,
  deleteOrganization,
} from "../controllers/Organization/organizationController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply `protect` globally
router.use(protect);
router.use(authorizeRoles("organization"));

router.post("/create-camp", createCampaign);
router.get("/all-camp", getAllCampaigns);
router.delete("/delete-camp/:id", hardDeleteCampaign);
router.patch("/status-camp/:id", toggleCampaignDeleteStatus);

router.put("/update/:id", updateOrganization);
router.delete("/delete/:id", deleteOrganization);

export default router;
