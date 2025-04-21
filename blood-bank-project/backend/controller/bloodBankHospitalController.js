import { BloodBankHospital } from "../models/bloodBankHospitalSchema.js";
import { District } from "../models/districtSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

// ✅ Create Hospital
export const createBBHospital = catchAsyncErrors(async (req, res, next) => {
  const { hospitalId, name, address, district, capacity } = req.body;

  if (!hospitalId || !name || !district) {
    return next(
      new ErrorHandler("Blood Bank ID, Name and District are required.", 400)
    );
  }

  // Find the district by name
  const districtName = await District.findOne({ name: district });
  if (!districtName) {
    return next(new ErrorHandler("District not found.", 404));
  }

  let bBHospital = await BloodBankHospital.findOne({ name, address, district });
  if (bBHospital) {
    return next(new ErrorHandler("Blood Bank Hospital Already Exist!", 400));
  }

  bBHospital = await BloodBankHospital.create({
    hospitalId,
    name,
    address,
    district: district,
    capacity,
  });

  res.status(201).json({
    success: true,
    message: "Blood Bank Hospital Added successfully!",
    bBHospital,
  });
});

// ✅ Get All Hospitals - Admin
export const getAllBBHospitals = catchAsyncErrors(async (req, res, next) => {
  const bBHospitals = await BloodBankHospital.find({
    isDeleted: false,
  });

  res.status(200).json({
    success: true,
    bBHospitals,
  });
});

// ✅ Get Hospital by ID
export const getBBHospitalById = catchAsyncErrors(async (req, res, next) => {
  const bBHospital = await BloodBankHospital.findById(req.params.id);

  if (!bBHospital || bBHospital.isDeleted) {
    return next(new ErrorHandler("Blood Bank Hospital not found.", 404));
  }

  res.status(200).json({
    success: true,
    bBHospital,
  });
});

// ✅ Update Hospital
export const updateBBHospital = catchAsyncErrors(async (req, res, next) => {
  const { name, address, district, capacity } = req.body;
  const bBHospital = await BloodBankHospital.findById(req.params.id);

  if (!bBHospital || bBHospital.isDeleted) {
    return next(new ErrorHandler("Blood Bank Hospital not found.", 404));
  }

  // Optional: Verify district exists in District collection
  if (district) {
    const districtExists = await District.findOne({ name: district });
    if (!districtExists) {
      return next(new ErrorHandler("District not found.", 404));
    }
  }
  // Check for duplicates
  const bBHospitalExist = await BloodBankHospital.findOne({
    name,
    address,
    district,
  });
  if (bBHospitalExist) {
    return next(new ErrorHandler("Blood Bank Hospital Already Exist!", 400));
  }
  // Update fields
  bBHospital.name = name || bBHospital.name;
  bBHospital.address = address || bBHospital.address;
  bBHospital.district = district || bBHospital.district;
  bBHospital.capacity = capacity ?? bBHospital.capacity;

  await bBHospital.save();

  res.status(200).json({
    success: true,
    message: "Blood Bank Hospital updated successfully!",
    bBHospital,
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
