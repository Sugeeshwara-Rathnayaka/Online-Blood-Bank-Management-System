import express from "express";
import {
  updateRequester,
  deleteRequester,
} from "../controllers/Requester/requesterController.js";
import { getAllVerifiedVisibleDonors } from "../controllers/Requester/donorController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply `protect` globally
router.use(protect);
router.use(authorizeRoles("requester"));

//Requester

router.put("/update/:id", updateRequester);
router.delete("/delete/:id", deleteRequester);

router.get("/all-donors", getAllVerifiedVisibleDonors);

export default router;
