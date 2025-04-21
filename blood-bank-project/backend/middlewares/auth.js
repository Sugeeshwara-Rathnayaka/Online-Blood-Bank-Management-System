import { User } from "../models/userSchema.js";
import { Admin } from "../models/adminSchema.js";
import { BloodBankAdmin } from "../models/bloodBankAdminSchema.js";
import { SuperAdmin } from "../models/superAdminSchema.js";
import { Donor } from "../models/donorSchema.js";
import { Requester } from "../models/requesterSchema.js";
import { Hospital } from "../models/hospitalSchema.js";
import { Organization } from "../models/organizationSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";

// export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
//   const token = req.cookies.adminToken;
//   if (!token) {
//     return next(new ErrorHandler("Admin Not Authenticated!", 400));
//   }
//   const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//   req.user = await User.findById(decoded.id);
//   if (req.user.role !== "Admin") {
//     return next(
//       new ErrorHandler(
//         `${req.user.role} not authorized for this resouces!`,
//         403
//       )
//     );
//   }
//   next();
// });

export const isPatientAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
      return next(new ErrorHandler("Patient Not Authenticated!", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Patient") {
      return next(
        new ErrorHandler(
          `${req.user.role} not authorized for this resouces!`,
          403
        )
      );
    }
    next();
  }
);

export const isSuperAdminAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.superAdminToken;

    if (!token) {
      return next(new ErrorHandler("Super Admin Not Authenticated!", 400));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.superAdmin = await SuperAdmin.findById(decoded.id);

    if (!req.superAdmin) {
      return next(new ErrorHandler("Super Admin Not Found!", 404));
    }

    next();
  }
);

export const isBBAdminAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.bloodBankAdminToken;

    if (!token) {
      return next(new ErrorHandler("Blood Bank Admin Not Authenticated!", 400));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.bloodBankAdmin = await BloodBankAdmin.findById(decoded.id);

    if (!req.bloodBankAdmin) {
      return next(new ErrorHandler("Blood Bank Admin Not Found!", 404));
    }

    next();
  }
);

export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) {
    return next(new ErrorHandler("Admin Not Authenticated!", 400));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.admin = await Admin.findById(decoded.id);

  if (!req.admin) {
    return next(new ErrorHandler("Admin Not Found!", 404));
  }

  next();
});

export const isDonorAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.donorToken;

  if (!token) {
    return next(new ErrorHandler("Donor Not Authenticated!", 400));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.donor = await Donor.findById(decoded.id);

  if (!req.donor) {
    return next(new ErrorHandler("Donor Not Found!", 404));
  }

  next();
});

export const isRequesterAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.requesterToken;

    if (!token) {
      return next(new ErrorHandler("Requester Not Authenticated!", 400));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.requester = await Requester.findById(decoded.id);

    if (!req.requester) {
      return next(new ErrorHandler("Requester Not Found!", 404));
    }

    next();
  }
);

export const isHospitalAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.hospitalToken;

    if (!token) {
      return next(new ErrorHandler("Hospital Not Authenticated!", 400));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.hospital = await Hospital.findById(decoded.id);

    if (!req.hospital) {
      return next(new ErrorHandler("Hospital Not Found!", 404));
    }

    next();
  }
);

export const isOrganizationAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.organizationToken;

    if (!token) {
      return next(new ErrorHandler("Organization Not Authenticated!", 400));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.organization = await Organization.findById(decoded.id);

    if (!req.organization) {
      return next(new ErrorHandler("Organization Not Found!", 404));
    }

    next();
  }
);
