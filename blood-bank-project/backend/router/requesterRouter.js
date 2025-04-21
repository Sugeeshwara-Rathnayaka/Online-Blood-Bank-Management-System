import express from "express";
import {
  requesterRegister,
  requesterLogin,
  updateRequester,
  deleteRequester,
  getRequesterDetails,
  logoutRequester,
  getAllRequesters,
  getRequesterById,
} from "../controller/requesterController.js";
import {
  isAdminAuthenticated,
  isRequesterAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

//Requester
router.post("/register", requesterRegister);
router.post("/login", requesterLogin);
router.get("/me", isRequesterAuthenticated, getRequesterDetails);
router.get("/logout", isRequesterAuthenticated, logoutRequester);
router.put("/update/:id", isRequesterAuthenticated, updateRequester);
router.delete("/delete/:id", isRequesterAuthenticated, deleteRequester);

//Admin
router.get("/all", isAdminAuthenticated, getAllRequesters);
router.get("/details/:id", isAdminAuthenticated, getRequesterById);

export default router;
