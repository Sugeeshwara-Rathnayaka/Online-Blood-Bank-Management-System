import express from "express";
import {
  donorRegister,
  donorLogin,
  updateDonor,
  deleteDonor,
  getDonorDetails,
  logoutDonor,
  getAllDonors,
  getDonorById,
} from "../controller/donorController.js";
import {
  isAdminAuthenticated,
  isDonorAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

//Donor
router.post("/register", donorRegister);
router.post("/login", donorLogin);
router.get("/me", isDonorAuthenticated, getDonorDetails);
router.get("/logout", isDonorAuthenticated, logoutDonor);
router.put("/update/:id", isDonorAuthenticated, updateDonor);
router.delete("/delete/:id", isDonorAuthenticated, deleteDonor);

//Admin
router.get("/all", isAdminAuthenticated, getAllDonors);
router.get("/details/:id", isAdminAuthenticated, getDonorById);

export default router;
