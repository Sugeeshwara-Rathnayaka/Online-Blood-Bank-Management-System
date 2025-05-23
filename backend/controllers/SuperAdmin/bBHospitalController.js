import { BloodBankHospital } from "../../models/BloodBank/BloodBankHospital.js";
import { BloodBankHospitalTelephone } from "../../models/BloodBank/BloodBankHospitalTelephone.js";
import { BloodBankAdmin } from "../../models/BloodBank/BloodBankAdmin.js";
import { District } from "../../models/Other/District.js";
import { catchAsyncErrors } from "../../middleware/catchAsyncErrors.js";
import ErrorHandler from "../../middleware/errorMiddleware.js";

// ✅ Create Hospital
export const createBBHospital = catchAsyncErrors(async (req, res, next) => {
  const { name, address, district, capacity, contactNumber } = req.body;

  if (!name || !address || !district || !contactNumber) {
    return next(
      new ErrorHandler(
        "Blood Bank Name, Address, District and Phone Number are required.",
        400
      )
    );
  }

  // Find the district by name
  const districtData = await District.findOne({ name: district });
  if (!districtData) {
    return next(new ErrorHandler("District not found.", 404));
  }
  // Check if a Blood Bank Hospital already exists with the same name, address, and district
  let bBHospital = await BloodBankHospital.findOne({
    name,
    address,
    district: districtData._id,
  });
  if (bBHospital) {
    return next(new ErrorHandler("Blood Bank Hospital Already Exist!", 400));
  }

  bBHospital = await BloodBankHospital.create({
    name,
    address,
    district: districtData._id,
    capacity,
  });

  const existingPhone = await BloodBankHospitalTelephone.findOne({
    telephoneNo: contactNumber,
    bloodBankId: bBHospital._id,
  });
  // Add phone number to separate collection
  if (!existingPhone) {
    await BloodBankHospitalTelephone.create({
      bloodBankId: bBHospital._id,
      telephoneNo: contactNumber,
      flag: 1, // Active
    });
  }

  res.status(201).json({
    success: true,
    message: "Blood Bank Hospital Added successfully!",
    bBHospital,
  });
});

// ✅ Get All Hospitals - Admin
export const getAllBBHospitals = catchAsyncErrors(async (req, res, next) => {
  const bBHospitals = await BloodBankHospital.aggregate([
    // Lookup phones
    {
      $lookup: {
        from: "blood_bank_hospital_telephone", // the collection to join from
        localField: "_id", // field from BloodBankHospital
        foreignField: "bloodBankId", // field in the telephone collection
        as: "phones", // output array field
      },
    },
    // Lookup district
    {
      $lookup: {
        from: "districts",
        localField: "district",
        foreignField: "_id",
        as: "districtDetails",
      },
    },
    // Flatten district
    {
      $addFields: {
        district: { $arrayElemAt: ["$districtDetails.name", 0] },
        phone: {
          $let: {
            vars: {
              activePhones: {
                $filter: {
                  input: "$phones",
                  as: "phone",
                  cond: { $eq: ["$$phone.flag", 1] }, // Only active phones
                },
              },
            },
            in: {
              $ifNull: [
                { $arrayElemAt: ["$$activePhones.telephoneNo", 0] },
                "N/A",
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        phones: 0, // optionally hide full phone array
        districtDetails: 0,
        __v: 0,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    bBHospitals,
  });
});

// ✅ Delete Hospital (Soft Delete)
export const deleteBBHospital = catchAsyncErrors(async (req, res, next) => {
  const bBHospital = await BloodBankHospital.findById(req.params.id);

  if (!bBHospital || bBHospital.isDeleted) {
    return next(new ErrorHandler("Blood Bank Hospital not found.", 404));
  }

  bBHospital.isDeleted = true;
  bBHospital.deletedAt = new Date();
  await bBHospital.save();

  res.status(200).json({
    success: true,
    message: "Blood Bank Hospital deleted successfully!",
  });
});

// ✅ Restore Hospital
export const restoreBBHospital = catchAsyncErrors(async (req, res, next) => {
  const bBHospital = await BloodBankHospital.findById(req.params.id);

  if (!bBHospital || !bBHospital.isDeleted) {
    return next(
      new ErrorHandler("Blood Bank Hospital not found or not deleted.", 404)
    );
  }

  bBHospital.isDeleted = false;
  bBHospital.deletedAt = null;

  await bBHospital.save();

  res.status(200).json({
    success: true,
    message: "Blood Bank Hospital restored successfully!",
  });
});

// ✅ Hard Delete BloodBank with Telephones and Admins.
export const HarddeleteBloodBank = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // 1. Delete the blood bank
  const bloodBank = await BloodBankHospital.findByIdAndDelete(id);

  if (!bloodBank) {
    return next(new ErrorHandler("Blood bank not found", 404));
  }

  // 2. Delete related telephone numbers
  await BloodBankHospitalTelephone.deleteMany({ bloodBankId: id });

  // 3. Delete related blood bank admins
  await BloodBankAdmin.deleteMany({ bloodBankId: id });

  res.status(200).json({
    success: true,
    message: "Blood bank and related data deleted successfully",
  });
});
