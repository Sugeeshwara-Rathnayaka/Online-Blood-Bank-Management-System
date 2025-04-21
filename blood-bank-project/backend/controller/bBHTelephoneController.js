import { BloodBankHospitalTelephone } from "../models/bBHTelephoneSchema.js";
import { BloodBankHospital } from "../models/bloodBankHospitalSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import mongoose from "mongoose";

// ✅ Add Telephone Number
export const addTelephone = catchAsyncErrors(async (req, res, next) => {
  const { BBID, telephoneNo } = req.body;

  if (!BBID || !telephoneNo) {
    return next(
      new ErrorHandler("Hospital ID and Telephone are required", 400)
    );
  }

  // Find the BB by name and Check if hospital exists
  const BBName = await BloodBankHospital.findOne({ hospitalId: BBID });
  if (!BBName || BBName.isDeleted) {
    return next(new ErrorHandler("Blod Bank Hospital not found.", 404));
  }

  // Check if the telephone already exists for this hospital
  const exists = await BloodBankHospitalTelephone.findOne({
    BBID: BBID,
    telephoneNo: telephoneNo,
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
    BBID: BBID,
    telephoneNo: telephoneNo,
  });

  res.status(201).json({
    success: true,
    message: "Telephone number added successfully",
    telephone: newTelephone,
  });
});

// ✅ Get Telephones for a Hospital
export const getTelephonesByHospital = catchAsyncErrors(
  async (req, res, next) => {
    const { hospitalId } = req.params;

    // Check if hospital ID is provided
    if (!hospitalId) {
      return next(new ErrorHandler("Hospital ID is required", 400));
    }

    // Optional: Check if the hospital exists (and not deleted)
    const hospitalExists = await BloodBankHospital.findOne({
      hospitalId,
      isDeleted: false,
    });
    if (!hospitalExists) {
      return next(new ErrorHandler("Blood Bank Hospital not found.", 404));
    }
    // Fetch telephone numbers for the hospital
    const telephones = await BloodBankHospitalTelephone.find({
      BBID: hospitalId,
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
    message: "Telephone number deleted successfully",
  });
});
