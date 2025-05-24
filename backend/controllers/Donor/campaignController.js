import { Campaign } from "../../models/Campaing.js";
import { catchAsyncErrors } from "../../middleware/catchAsyncErrors.js";

// Get All Campaigns
export const getAllCampaigns = catchAsyncErrors(async (req, res, next) => {
  const campaigns = await Campaign.find({ isdeleted: false, flag: 1 })
    .populate("bloodBankId", "name") // show only selected fields from blood bank
    .populate("organizationId", "organizationName"); // optional fields to display

  res.status(200).json({
    success: true,
    message: "All campaigns retrieved successfully",
    campaigns,
  });
});
