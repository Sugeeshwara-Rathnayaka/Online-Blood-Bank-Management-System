import express from "express";
import {
  addTelephone,
  getTelephonesByHospital,
  deleteTelephone,
} from "../controller/bBHTelephoneController.js";
import { isSuperAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", isSuperAdminAuthenticated, addTelephone);
router.get(
  "/details/:hospitalId",
  isSuperAdminAuthenticated,
  getTelephonesByHospital
);
router.delete("/delete/:id", isSuperAdminAuthenticated, deleteTelephone);

export default router;
