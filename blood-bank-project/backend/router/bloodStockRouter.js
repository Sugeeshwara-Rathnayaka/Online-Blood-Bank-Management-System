import express from "express";
import {
  createBloodStock,
  getAllBloodStock,
  getStockByStockId,
  updateBloodStock,
  deleteBloodStock,
} from "../controller/bloodStockController.js";
import { isSuperAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", isSuperAdminAuthenticated, createBloodStock);
router.get("/all", isSuperAdminAuthenticated, getAllBloodStock);
router.get("/hospital/:stockId", isSuperAdminAuthenticated, getStockByStockId);
router.put("/update/:id", isSuperAdminAuthenticated, updateBloodStock);
router.delete("/delete/:id", isSuperAdminAuthenticated, deleteBloodStock);

export default router;
