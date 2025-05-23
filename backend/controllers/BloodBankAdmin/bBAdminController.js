import { catchAsyncErrors } from "../../middleware/catchAsyncErrors.js";
import ErrorHandler from "../../middleware/errorMiddleware.js";
import { BloodBankAdmin } from "../../models/BloodBank/BloodBankAdmin.js";
import { BloodBankHospital } from "../../models/BloodBank/BloodBankHospital.js";
import bcrypt from "bcryptjs";

// ✅ UPDATE
export const updateBBAdmin = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let bloodBankAdmin = await BloodBankAdmin.findById(id);
  if (!bloodBankAdmin) {
    return next(new ErrorHandler("Blood Bank Admin Not Found!", 404));
  }

  // Prevent updating sensitive fields like password directly here if needed
  const disallowedFields = ["password", "nic"];
  disallowedFields.forEach((field) => {
    if (req.body[field]) delete req.body[field];
  });

  // Check if the email is being updated, and ensure no duplicate exists
  if (req.body.email) {
    const existingAdmin = await BloodBankAdmin.findOne({
      email: req.body.email,
      _id: { $ne: id }, // exclude current admin from check
    });
    if (existingAdmin) {
      return next(
        new ErrorHandler("Email already in use by another admin.", 400)
      );
    }
  }

  // Update bbadmin fields from req.body
  bloodBankAdmin = await BloodBankAdmin.findByIdAndUpdate(id, req.body, {
    new: true, // return the updated doc
    runValidators: true, // enforce schema rules
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Blood Bank Admin Details Updated!",
    bloodBankAdmin,
  });
});

// ✅ GET DETAILS
export const getBBAdminDetails = catchAsyncErrors(async (req, res, next) => {
  const bloodBankAdmin = req.bloodBankAdmin;
  if (!bloodBankAdmin) {
    return next(new ErrorHandler("Blood Bank Admin Not Found!", 404));
  }

  res.status(200).json({
    success: true,
    bloodBankAdmin,
  });
});
