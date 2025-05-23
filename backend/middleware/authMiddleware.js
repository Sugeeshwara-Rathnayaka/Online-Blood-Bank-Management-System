import jwt from "jsonwebtoken";
import ErrorHandler from "./errorMiddleware.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";

// Import all role-based models
import { Donor } from "../models/Donor.js";
import { Organization } from "../models/Organization.js";
import { NormalHospital } from "../models/NormalHospital.js";
import { Requester } from "../models/Requester.js";
import { BloodBankAdmin } from "../models/BloodBank/BloodBankAdmin.js";
import { SuperAdmin } from "../models/SuperAdmin.js";

// Role-to-model map
const roleModelMap = {
  donor: Donor,
  organization: Organization,
  hospital: NormalHospital,
  requester: Requester,
  bloodbankadmin: BloodBankAdmin,
  superadmin: SuperAdmin,
};

export const protect = catchAsyncErrors(async (req, res, next) => {
  try {
    let token;

    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Fallback: get token from cookies (supports multiple roles)
    if (!token && req.cookies) {
      token =
        req.cookies.superAdminToken ||
        req.cookies.adminToken ||
        req.cookies.bloodBankAdminToken ||
        req.cookies.requesterToken ||
        req.cookies.donorToken ||
        req.cookies.hospitalToken ||
        req.cookies.organizationToken;
    }

    // 3. If no token found
    if (!token) {
      return next(new ErrorHandler("Not authorized, token not found", 401));
    }

    // 4. Decode and Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach user info to request
    req.user = {
      _id: decoded.id,
      role: decoded.role,
      // organizationId: decoded.organizationId || null,
      // bloodBankId: decoded.bloodBankId || null,
    };

    // 6. Dynamically fetch full user document based on role
    const normalizedRole = decoded.role?.toLowerCase();
    const Model = roleModelMap[normalizedRole];

    if (!Model) {
      return next(new ErrorHandler(`Invalid role: ${decoded.role}`, 400));
    }

    const userDetails = await Model.findById(decoded.id).select("-password");
    if (!userDetails) {
      return next(new ErrorHandler("User not found", 404));
    }
    req.userDetails = userDetails;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid token. Please log in again.", 401));
    }

    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Token expired. Please log in again.", 401));
    }

    return next(
      new ErrorHandler("Not authorized, token validation failed", 401)
    );
  }
});

// General role check
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role.toLowerCase())) {
      return next(
        new ErrorHandler(
          `Access denied. This route is only for: ${roles.join(", ")}`,
          403
        )
      );
    }
    next();
  };
};
