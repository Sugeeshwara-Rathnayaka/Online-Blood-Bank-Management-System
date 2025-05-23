import { Donor } from "../models/Donor.js";
import { Organization } from "../models/Organization.js";
import { NormalHospital } from "../models/NormalHospital.js";
import { Requester } from "../models/Requester.js";
import { BloodBankAdmin } from "../models/BloodBank/BloodBankAdmin.js";
import { SuperAdmin } from "../models/SuperAdmin.js";
import { District } from "../models/Other/District.js";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { generateToken } from "../utils/jwtToken.js";

//SignUp
export const signup = catchAsyncErrors(async (req, res, next) => {
  const { role, confirmPassword, ...userData } = req.body;

  // Validate required fields
  if (!role || !userData.password || !confirmPassword) {
    return next(new ErrorHandler("Role and password are required", 400));
  }
  if (userData.password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match!", 400));
  }
  // Handle case sensitivity
  const normalizedRole = role.toLowerCase();

  // Get correct model
  const Model = getModelByRole(normalizedRole);
  if (!Model) {
    return next(new ErrorHandler("Invalid role specified", 400));
  }

  try {
    // Check if district exists
    if (!userData.district) {
      return next(new ErrorHandler("District is required", 400));
    }

    const districtExists = await District.findOne({
      name: userData.district.trim(),
    });
    if (!districtExists) {
      return next(new ErrorHandler("Invalid district specified", 400));
    }
    userData.district = districtExists._id;

    // Check if user already exists
    let existingUser;

    if (normalizedRole === "donor" || normalizedRole === "requester") {
      if (!userData.nic) {
        return next(new ErrorHandler("NIC is required for this role", 400));
      }

      existingUser = await (normalizedRole === "donor"
        ? Donor.findOne({ nic: userData.nic })
        : Requester.findOne({ nic: userData.nic }));
    } else {
      if (!userData.userName) {
        return next(
          new ErrorHandler("Username is required for this role", 400)
        );
      }

      existingUser = await Model.findOne({ userName: userData.userName });
    }

    if (existingUser) {
      return next(
        new ErrorHandler(`This ${existingUser.role} already exists`, 409)
      ); // 409 Conflict
    }

    // Hash password
    const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
    userData.password = await bcrypt.hash(userData.password, salt);

    userData.role = role; // Attach normalized role to user

    // Create new user
    const newUser = new Model(userData);
    await newUser.save();

    generateToken(
      newUser,
      `${newUser.role} Registered Successfully!`,
      201,
      res
    );
  } catch (error) {
    console.error("Signup error:", error);
    return next(error); // Let errorMiddleware handle it
  }
});

// Helper: get correct model based on role (shared across signup/login)
function getModelByRole(role) {
  const models = {
    donor: Donor,
    organization: Organization,
    hospital: NormalHospital,
    requester: Requester,
    bloodbankadmin: BloodBankAdmin,
    superadmin: SuperAdmin,
  };
  return models[role];
}

//LogIn
export const login = catchAsyncErrors(async (req, res, next) => {
  const { role, identifier, password } = req.body;
  if (!role || !identifier || !password) {
    return next(
      new ErrorHandler("Role, identifier, and password are required", 400)
    );
  }
  const normalizedRole = role.toLowerCase();
  const Model = getModelByRole(normalizedRole);
  if (!Model) {
    return next(new ErrorHandler("Invalid role specified", 400));
  }
  try {
    let queryField =
      normalizedRole === "donor" ||
      normalizedRole === "requester" ||
      normalizedRole === "bloodbankadmin"
        ? { nic: identifier }
        : { userName: identifier };
    const user = await Model.findOne(queryField).select("+password");

    if (!user) {
      return next(
        new ErrorHandler(
          `${normalizedRole} with identifier "${identifier}" not found`,
          404
        )
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid credentials", 400));
    }
    // Successful login
    generateToken(user, `${user.role} Login successful!`, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    return next(error); // Let errorMiddleware handle it
  }
});

//Logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  // No real server side action needed for JWT simple logout
  try {
    const { role } = req.user;
    const cookieName = getCookieNameByRole(role);
    res
      .status(200)
      .cookie(cookieName, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/", // MUST match login path
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: `${role} Logged out successfully!`,
      });
  } catch (error) {
    console.error("Logout error:", error);
    return next(error); // Let errorMiddleware handle it
  }
});
const getCookieNameByRole = (role) => {
  switch (role) {
    case "SuperAdmin":
      return "superAdminToken";
    case "Admin":
      return "adminToken";
    case "BloodBankAdmin":
      return "bloodBankAdminToken";
    case "Requester":
      return "requesterToken";
    case "Donor":
      return "donorToken";
    case "Hospital":
      return "hospitalToken";
    case "Organization":
      return "organizationToken";
    default:
      return "patientToken";
  }
};

// GET /me - Get current logged-in user's details
export const getMe = catchAsyncErrors(async (req, res, next) => {
  const { _id, role } = req.user;

  if (!_id || !role) {
    return next(new ErrorHandler("Unauthorized access", 401));
  }

  const normalizedRole = role.toLowerCase();
  const Model = getModelByRole(normalizedRole);

  if (!Model) {
    return next(new ErrorHandler("Invalid role", 400));
  }

  const user = await Model.findById(_id)
    .select("-password")
    .populate("district"); // ✅ fetches district doc

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user, // ✅ use populated version
  });
});
