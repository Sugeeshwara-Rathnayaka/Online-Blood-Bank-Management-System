import { BloodBankHospital } from "../../models/BloodBank/BloodBankHospital.js";
import { BloodBankHospitalTelephone } from "../../models/BloodBank/BloodBankHospitalTelephone.js";
import { BloodBankAdmin } from "../../models/BloodBank/BloodBankAdmin.js";
import { District } from "../../models/Other/District.js";
import { catchAsyncErrors } from "../../middleware/catchAsyncErrors.js";
import ErrorHandler from "../../middleware/errorMiddleware.js";

// ✅ Get Hospital by ID with District and Telephones
export const getBBHospitalById = catchAsyncErrors(async (req, res, next) => {
  const bBHospital = await BloodBankHospital.findById(req.params.id).populate(
    "district"
  ); // populate district

  if (!bBHospital || bBHospital.isDeleted) {
    return next(new ErrorHandler("Blood Bank Hospital not found.", 404));
  }

  // Fetch related telephones (optional: filter by active)
  const telephones = await BloodBankHospitalTelephone.find({
    bloodBankId: req.params.id,
    flag: 1,
  });

  res.status(200).json({
    success: true,
    bBHospital,
    telephones,
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
