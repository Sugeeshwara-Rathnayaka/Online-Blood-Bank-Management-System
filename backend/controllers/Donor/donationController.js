import { Donation } from "../models/donationSchema.js";
// import { Donor } from "../models/donorSchema.js";
// import { Patient } from "../models/patientSchema.js";
// import { Hospital } from "../models/hospitalSchema.js";
// import { Campaign } from "../models/campaingSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

// CREATE Donation
export const createDonation = catchAsyncErrors(async (req, res, next) => {
  const {
    donationId,
    donor,
    patient,
    hospital,
    campaign,
    packetNumber,
    serialNumber,
    amount,
    email,
  } = req.body;

  if (!donationId || !donor || !packetNumber || !serialNumber || !amount) {
    return next(new ErrorHandler("Please provide all required fields!", 400));
  }
  const existingDonation = await Donation.findOne({ donationId });
  if (existingDonation) {
    return next(new ErrorHandler("Donation ID already exists!", 400));
  }

  const donation = await Donation.create({
    donationId,
    donor,
    patient,
    hospital,
    campaign,
    packetNumber,
    serialNumber,
    amount,
    email,
  });

  res.status(201).json({
    success: true,
    message: "Donation Created Successfully!",
    donation,
  });
});

// GET All Donations
export const getAllDonations = catchAsyncErrors(async (req, res, next) => {
  const { donorId, hospitalId, startDate, endDate } = req.query;

  const query = {};

  if (donorId) query.donor = donorId;
  if (hospitalId) query.hospital = hospitalId;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const donations = await Donation.find(query)
    .populate("donor", "firstName lastName nic")
    .populate("patient", "name nic")
    .populate("hospital", "hospitalName")
    .populate("campaign", "campaignName");

  res.status(200).json({
    success: true,
    donations,
  });
});

// GET Donation by ID
export const getDonationById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const donation = await Donation.findById(id)
    .populate("donor", "firstName lastName nic")
    .populate("patient", "name nic")
    .populate("hospital", "hospitalName")
    .populate("campaign", "campaignName");

  if (!donation) {
    return next(new ErrorHandler("Donation not found!", 404));
  }

  res.status(200).json({
    success: true,
    donation,
  });
});

// UPDATE Donation
export const updateDonation = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let donation = await Donation.findById(id);
  if (!donation) {
    return next(new ErrorHandler("Donation not found!", 404));
  }

  donation = await Donation.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Donation Updated Successfully!",
    donation,
  });
});

// DELETE Donation
export const deleteDonation = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const donation = await Donation.findById(id);
  if (!donation) {
    return next(new ErrorHandler("Donation not found!", 404));
  }

  await donation.deleteOne();

  res.status(200).json({
    success: true,
    message: "Donation Deleted Successfully!",
  });
});
