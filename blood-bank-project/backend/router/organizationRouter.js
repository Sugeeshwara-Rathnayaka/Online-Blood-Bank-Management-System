import express from "express";
import {
  organizationRegister,
  organizationLogin,
  updateOrganization,
  deleteOrganization,
  getOrganizationDetails,
  logoutOrganization,
  getAllOrganizations,
  getOrganizationById,
} from "../controller/organizationController.js";
import {
  isAdminAuthenticated,
  isOrganizationAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

//Organization
router.post("/register", organizationRegister);
router.post("/login", organizationLogin);
router.get("/me", isOrganizationAuthenticated, getOrganizationDetails);
router.get("/logout", isOrganizationAuthenticated, logoutOrganization);
router.put("/update/:id", isOrganizationAuthenticated, updateOrganization);
router.delete("/delete/:id", isOrganizationAuthenticated, deleteOrganization);

//Admin
router.get("/details/:id", isAdminAuthenticated, getOrganizationById);
router.get("/all", isAdminAuthenticated, getAllOrganizations);

export default router;
