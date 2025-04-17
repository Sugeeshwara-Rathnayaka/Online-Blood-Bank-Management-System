import express from "express";
import { getAllBloodTypes } from "../controller/bloodController.js";

const router = express.Router();

router.get("/getall", getAllBloodTypes);

export default router;
