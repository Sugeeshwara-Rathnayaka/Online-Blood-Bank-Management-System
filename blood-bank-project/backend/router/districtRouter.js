import express from "express";
import { getAllDistricts } from "../controller/districtController.js";

const router = express.Router();

router.get("/getall", getAllDistricts);

export default router;
