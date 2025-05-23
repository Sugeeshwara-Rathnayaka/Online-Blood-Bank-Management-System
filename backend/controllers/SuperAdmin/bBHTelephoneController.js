import { BloodBankHospital } from "../../models/BloodBank/BloodBankHospital.js";
import { BloodBankHospitalTelephone } from "../../models/BloodBank/BloodBankHospitalTelephone.js";
import { catchAsyncErrors } from "../../middleware/catchAsyncErrors.js";
import ErrorHandler from "../../middleware/errorMiddleware.js";
import mongoose from "mongoose";

// ✅ Add Telephone Number
export const addTelephone = catchAsyncErrors(async (req, res, next) => {
  const { bloodBankName, telephoneNo, flag } = req.body;

  if (!bloodBankName || !telephoneNo) {
    return next(
      new ErrorHandler(
        "Blood Bank Hospital Name and Telephone Number are required",
        400
      )
    );
  }

  // Find the BB by name and Check if hospital exists
  const hospital = await BloodBankHospital.findOne({ name: bloodBankName });
  if (!hospital || hospital.isDeleted) {
    return next(new ErrorHandler("Blod Bank Hospital not found.", 404));
  }

  // Check if the telephone already exists for this hospital
  const exists = await BloodBankHospitalTelephone.findOne({
    bloodBankId: hospital._id,
    telephoneNo,
  });
  if (exists) {
    return next(
      new ErrorHandler(
        "This telephone number already exists for the hospital",
        400
      )
    );
  }
  // Create new telephone entry
  const newTelephone = await BloodBankHospitalTelephone.create({
    bloodBankId: hospital._id,
    telephoneNo,
    flag,
  });

  res.status(201).json({
    success: true,
    message: "Telephone Number added successfully",
    newTelephone,
  });
});

// ✅ Get Telephones for a Hospital
export const getTelephonesByHospital = catchAsyncErrors(
  async (req, res, next) => {
    const { bloodBankId } = req.params;

    // Check if hospital ID is provided
    if (!bloodBankId) {
      return next(new ErrorHandler("Blood Bank ID is required", 400));
    }

    // Check if the hospital exists (and not deleted)
    const hospitalExists = await BloodBankHospital.findOne({
      _id: bloodBankId,
      isDeleted: false,
    });
    if (!hospitalExists) {
      return next(new ErrorHandler("Blood Bank Hospital not found.", 404));
    }
    // Fetch telephone numbers for the hospital
    const telephones = await BloodBankHospitalTelephone.find({
      bloodBankId,
    });

    res.status(200).json({
      success: true,
      hospital: hospitalExists.name,
      total: telephones.length,
      telephones,
    });
  }
);

// ✅ Delete a Telephone Number
export const deleteTelephone = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid telephone ID format", 400));
  }

  const telephone = await BloodBankHospitalTelephone.findById(id);
  if (!telephone) {
    return next(new ErrorHandler("Telephone record not found", 404));
  }

  await telephone.deleteOne();

  res.status(200).json({
    success: true,
    message: "Telephone Number deleted successfully",
  });
});

// ✅ Set Telephone as Active or Inactive
export const setTelephoneStatus = catchAsyncErrors(async (req, res, next) => {
  const { id, status } = req.params; // id = telephone document ID, status = 1 (active) or 0 (inactive)

  // Ensure status is either 0 (inactive) or 1 (active)
  if (![0, 1].includes(Number(status))) {
    return next(
      new ErrorHandler(
        "Invalid status. Use 0 for Inactive or 1 for Active.",
        400
      )
    );
  }

  // Find the telephone record by ID
  const telephone = await BloodBankHospitalTelephone.findById(id);

  if (!telephone) {
    return next(new ErrorHandler("Telephone not found.", 404));
  }

  // Update the flag to make the telephone Active or Inactive
  telephone.flag = Number(status); // Update to either 0 (Inactive) or 1 (Active)
  await telephone.save();

  res.status(200).json({
    success: true,
    message: `Telephone status updated successfully to ${
      status === "1" ? "Active" : "Inactive"
    }`,
    telephone,
  });
});
