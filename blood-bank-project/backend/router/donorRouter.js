import express from "express";
import {
  donorRegister,
  donorLogin,
  updateDonor,
  deleteDonor,
  getDonorDetails,
  logoutDonor,
} from "../controller/donorController.js";
import { isDonorAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", donorRegister);
router.post("/login", donorLogin);
router.get("/me", isDonorAuthenticated, getDonorDetails);
router.get("/logout", isDonorAuthenticated, logoutDonor);
router.put("/update/:id", isDonorAuthenticated, updateDonor);
router.delete("/delete/:id", isDonorAuthenticated, deleteDonor);

export default router;
