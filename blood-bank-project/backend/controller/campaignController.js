import { Campaign } from "../models/campaingSchema.js";
//import { BloodBankHospital } from "../models/bloodBankHospitalSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

// Create Campaign
export const createCampaign = catchAsyncErrors(async (req, res, next) => {
  const { name, location, estimate, bhospitalId, date, time } = req.body;

  // Get organizationId from the logged-in user (from token/session)
  const organizationId = req.organization?._id; // ✅ Get from the logged-in user
  const organizationName = req.organization?.organizationName; // Optional: for extra info
  const trimmedTime = time?.toString().trim();
  const generateCampaignId = () => {
    return `CMP-${Date.now().toString().slice(-6)}-${Math.floor(
      Math.random() * 100
    )}`;
  };
  const campaignId = generateCampaignId();
  if (
    !campaignId ||
    !name ||
    !location ||
    !estimate == null || //allows 0
    !bhospitalId ||
    !date ||
    !time ||
    !organizationId
  ) {
    console.log("Missing Fields", {
      campaignId,
      name,
      location,
      estimate,
      bhospitalId,
      date,
      time,
      organizationId,
    });
    return next(new ErrorHandler("Please provide all required fields!", 400));
  }

  // Check for duplicate campaign ID
  //   const existingCampaign = await Campaign.findOne({ campaignId });
  //   if (existingCampaign) {
  //     return next(new ErrorHandler("Campaign ID already exists!", 400));
  //   }

  // Validate time format (e.g., "HH:MM")
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(trimmedTime)) {
    return next(new ErrorHandler("Invalid time format (use HH:MM)", 400));
  }

  // Ensure time is between 08:00 and 14:00
  const hour = parseInt(trimmedTime?.split(":")[0], 10);
  if (hour < 8 || hour >= 14) {
    return next(
      new ErrorHandler("Time must be between 8:00 AM and 2:00 PM", 400)
    );
  }
  // Add null/undefined check
  if (!trimmedTime) {
    return next(new ErrorHandler("Time is required", 400));
  }

  // Check if another campaign already exists at the same hospital, date and time
  const isConflict = await Campaign.findOne({
    bhospitalId,
    date,
    time: trimmedTime,
    isdeleted: false,
  });
  if (isConflict) {
    return next(
      new ErrorHandler(
        "Another campaign already exists at this hospital on the same date and time!",
        400
      )
    );
  }
  const campaign = await Campaign.create({
    campaignId,
    name,
    location,
    estimate,
    bhospitalId,
    date,
    time,
    organizationId,
    organizationName, // Optional
  });
  res.status(201).json({
    success: true,
    message: "Campaign Created Successfully!",
    campaign,
  });
});

// Get All Campaigns
export const getAllCampaigns = catchAsyncErrors(async (req, res, next) => {
  const campaigns = await Campaign.find({ isdeleted: false });
  // .populate("bhospitalId organizationId")

  res.status(200).json({
    success: true,
    message: "All campaigns retrieved successfully",
    campaigns,
  });
});

// Get Campaign by ID
export const getCampaignById = catchAsyncErrors(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id); //.populate("bhospitalId organizationId");
  if (!campaign) {
    return next(new ErrorHandler("Campaign not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Campaign retrieved successfully",
    campaign,
  });
});

// Update Campaign
export const updateCampaign = catchAsyncErrors(async (req, res, next) => {
  const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }); //.populate("bhospitalId organizationId");
  if (!updated) {
    return next(new ErrorHandler("Campaign not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Campaign updated successfully",
    campaign: updated,
  });
});

// Delete Campaign (Soft delete using `del` flag)
export const deleteCampaign = catchAsyncErrors(async (req, res, next) => {
  const campaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    { isdeleted: true },
    { new: true }
  );
  if (!campaign) {
    return next(new ErrorHandler("Campaign not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Campaign marked as deleted",
    campaign,
  });
});

// Restore Soft-Deleted Campaign
export const restoreCampaign = catchAsyncErrors(async (req, res, next) => {
  const campaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    { isdeleted: false },
    { new: true }
  );

  if (!campaign) {
    return next(new ErrorHandler("Campaign not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Campaign successfully restored",
    campaign,
  });
});

// Permanently Delete Campaign
export const hardDeleteCampaign = catchAsyncErrors(async (req, res, next) => {
  const campaign = await Campaign.findByIdAndDelete(req.params.id);

  if (!campaign) {
    return next(new ErrorHandler("Campaign not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Campaign permanently deleted",
  });
});
