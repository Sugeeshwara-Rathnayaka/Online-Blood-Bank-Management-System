import { Campaign } from "../models/Campaing.js";
import { BloodBankHospital } from "../models/BloodBank/BloodBankHospital.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";

export const createCampaign = catchAsyncErrors(async (req, res, next) => {
  const { name, location, estimate, bloodBank, date, time } = req.body;

  const organizationId = req.user?._id;
  const organizationName = req.userDetails?.organizationName;
  const trimmedTime = time?.toString().trim();

  const generateCampaignId = () =>
    `CMP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`;
  const campaignId = generateCampaignId();

  console.log({
    campaignId,
    name,
    location,
    estimate,
    bloodBank,
    date,
    time: trimmedTime,
    organizationId,
  });

  if (
    !campaignId ||
    !name?.trim() ||
    !location?.trim() ||
    estimate == null ||
    !bloodBank ||
    !date ||
    !trimmedTime ||
    !organizationId
  ) {
    return next(new ErrorHandler("Please provide all required fields!", 400));
  }

  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(trimmedTime)) {
    return next(new ErrorHandler("Invalid time format (use HH:MM)", 400));
  }

  const hour = parseInt(trimmedTime.split(":")[0], 10);
  if (hour < 8 || hour >= 14) {
    return next(new ErrorHandler("Time must be between 08:00 and 14:00", 400));
  }
  const hospitalExists = await BloodBankHospital.findOne({ name: bloodBank });
  if (!hospitalExists) {
    return next(
      new ErrorHandler("Selected blood bank hospital does not exist", 404)
    );
  }
  const bloodBankId = hospitalExists._id;

  const isConflict = await Campaign.findOne({
    bloodBankId,
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
    bloodBankId,
    date,
    time: trimmedTime,
    organizationId,
    organizationName,
  });

  res.status(201).json({
    success: true,
    message: "Campaign Created Successfully!",
    campaign,
  });
});

// Get All Campaigns
export const getAllCampaigns = catchAsyncErrors(async (req, res, next) => {
  const campaigns = await Campaign.find({ isdeleted: false })
    .populate("bloodBankId", "name") // show only selected fields from blood bank
    .populate("organizationId", "organizationName"); // optional fields to display

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
  });
  if (!updated) {
    return next(new ErrorHandler("Campaign not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Campaign updated successfully",
    campaign: updated,
  });
});

// Update only the flag field of a campaign
export const updateCampaignFlag = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { flag } = req.body;

  if (![0, 1, 2].includes(flag)) {
    return next(
      new ErrorHandler("Invalid flag value. Must be 0, 1, or 2", 400)
    );
  }

  const updated = await Campaign.findByIdAndUpdate(
    id,
    { flag },
    { new: true, runValidators: true }
  )
    .populate("bloodBankId", "name")
    .populate("organizationId", "organizationName");

  if (!updated) {
    return next(new ErrorHandler("Campaign not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Campaign flag updated successfully",
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
