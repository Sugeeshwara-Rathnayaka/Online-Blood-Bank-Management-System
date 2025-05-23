import { District } from "../../models/Other/District.js";
import { catchAsyncErrors } from "../../middleware/catchAsyncErrors.js";
import ErrorHandler from "../../middleware/errorMiddleware.js";
import { BloodBankHospital } from "../../models/BloodBank/BloodBankHospital.js";
import Blood from "../../models/Other/Blood.js";

// ✅ Get All BloodBAnk Hospitals
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

// GET /select/get-districts
export const getAllDistricts = catchAsyncErrors(async (req, res, next) => {
  const districts = await District.find().sort({ name: 1 }); // alphabetically sorted
  if (!districts || districts.length === 0) {
    return next(new ErrorHandler("No districts found", 404));
  }

  res.status(200).json({
    success: true,
    districts,
  });
});

// controllers/selectController.js
export const getAllBloodTypes = catchAsyncErrors(async (req, res, next) => {
  const bloodTypes = await Blood.find().sort({ type: 1 }); // alphabetically sorted

  if (!bloodTypes || bloodTypes.length === 0) {
    return next(new ErrorHandler("No blood types found", 404));
  }

  res.status(200).json({
    success: true,
    bloodTypes,
  });
});
