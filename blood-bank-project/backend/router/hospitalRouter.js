import express from "express";
import {
  hospitalRegister,
  hospitalLogin,
  updateHospital,
  deleteHospital,
  getHospitalDetails,
  logoutHospital,
  changeHospitalPassword,
  getHospitalById,
  getAllHospitals,
} from "../controller/hospitalController.js";
import {
  isAdminAuthenticated,
  isHospitalAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

//Hospital
router.post("/register", hospitalRegister);
router.post("/login", hospitalLogin);
router.get("/me", isHospitalAuthenticated, getHospitalDetails);
router.get("/logout", isHospitalAuthenticated, logoutHospital);
router.put("/update/:id", isHospitalAuthenticated, updateHospital);
router.delete("/delete/:id", isHospitalAuthenticated, deleteHospital);
router.put("/updatePW/", isHospitalAuthenticated, changeHospitalPassword);

//Admin
router.get("/all", isAdminAuthenticated, getAllHospitals);
router.get("/details/:id", isAdminAuthenticated, getHospitalById);

export default router;
