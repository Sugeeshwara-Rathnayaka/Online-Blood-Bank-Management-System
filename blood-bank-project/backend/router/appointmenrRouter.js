import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
} from "../controller/appointmentController.js";
import {
  isAdminAuthenticated,
  isDonorAuthenticated,
  isPatientAuthenticated,
  isSuperAdminAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isDonorAuthenticated, postAppointment);
router.get("/getall", isSuperAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isSuperAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isSuperAdminAuthenticated, deleteAppointment);

export default router;
