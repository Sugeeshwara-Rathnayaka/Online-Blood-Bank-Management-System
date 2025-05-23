// controllers/donorController.js
import { Donor } from "../../models/Donor.js";
import { catchAsyncErrors } from "../../middleware/catchAsyncErrors.js";

// ✅ Get All Verified & Visible Donors (for requester access)
export const getAllVerifiedVisibleDonors = catchAsyncErrors(
  async (req, res, next) => {
    const donors = await Donor.find({
      validation: 0, // 0 = Verified
      privacy: 0, // 0 = Show/Visible
    }).populate("district", "name province");

    res.status(200).json({
      success: true,
      message: "Verified and visible donors fetched successfully",
      donors,
    });
  }
);
