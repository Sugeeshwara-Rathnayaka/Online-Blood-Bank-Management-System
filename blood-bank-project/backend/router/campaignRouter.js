import express from "express";
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  restoreCampaign,
  hardDeleteCampaign,
} from "../controller/campaignController.js";

import {
  isOrganizationAuthenticated,
  isSuperAdminAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", isOrganizationAuthenticated, createCampaign);
router.get("/all", isSuperAdminAuthenticated, getAllCampaigns);
router.get("/details/:id", isOrganizationAuthenticated, getCampaignById);
router.put("/update/:id", isOrganizationAuthenticated, updateCampaign);
router.put("/softDelete/:id", deleteCampaign);
router.put("/restore/:id", restoreCampaign);
router.delete("/hardDelete/:id", hardDeleteCampaign);

export default router;
