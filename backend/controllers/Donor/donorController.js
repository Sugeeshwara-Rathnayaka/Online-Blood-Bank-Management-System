import { catchAsyncErrors } from "../../middleware/catchAsyncErrors.js";
import ErrorHandler from "../../middleware/errorMiddleware.js";
import { Donor } from "../../models/Donor.js";
import { District } from "../../models/Other/District.js";

//UPDATE DONOR
export const updateDonor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let donor = await Donor.findById(id);
  if (!donor) {
    return next(new ErrorHandler("Donor Not Found!", 404));
  }
  // Disallow direct password updates here
  if (req.body.password) {
    return next(new ErrorHandler("Password updates not allowed here!", 400));
  }
  // Convert district name to ID if name is passed
  if (req.body.district && typeof req.body.district === "string") {
    const districtDoc = await District.findOne({ name: req.body.district });
    if (!districtDoc) {
      return next(new ErrorHandler("Invalid district name provided", 400));
    }
    req.body.district = districtDoc._id;
  }
  // If district is sent, validate it as ObjectId
  // if (req.body.district) {
  //   const districtDoc = await District.findById(req.body.district);
  //   if (!districtDoc) {
  //     return next(new ErrorHandler("Invalid district ID provided", 400));
  //   }
  // }
  // Update donor fields from req.body
  donor = await Donor.findByIdAndUpdate(id, req.body, {
    new: true, // return the updated doc
    runValidators: true, // enforce schema rules
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Donor Details Updated!",
    donor,
  });
});

//Update Privacy
export const updateDonorPrivacy = catchAsyncErrors(async (req, res, next) => {
  try {
    const donorId = req.user._id; // Make sure your auth middleware sets req.user
    const { privacy } = req.body;

    if (![0, 1].includes(privacy)) {
      return next(new ErrorHandler("Privacy must be 0 or 1", 400));
    }

    const updatedDonor = await Donor.findByIdAndUpdate(
      donorId,
      { privacy },
      { new: true, runValidators: true }
    );

    if (!updatedDonor) {
      return next(new ErrorHandler("Donor not found", 404));
    }

    res.status(200).json({
      message: "Privacy setting updated successfully",
      privacy: updatedDonor.privacy,
    });
  } catch (error) {
    console.error("Error updating donor privacy:", error);
    return next(new ErrorHandler("Server Error", 500));
  }
});

//DELETE DONOR
export const deleteDonor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const donor = await Donor.findById(id);
  if (!donor) {
    return next(new ErrorHandler("Donor Not Found!", 404));
  }
  await donor.deleteOne();
  res.status(200).json({
    success: true,
    message: "Donor Deleted Successfully!",
  });
});

export const getDonorDetails = catchAsyncErrors(async (req, res, next) => {
  const donor = req.donor;
  res.status(200).json({
    success: true,
    donor,
  });
});

export const getDonorById = catchAsyncErrors(async (req, res, next) => {
  //const { id } = req.params;
  const donor = await Donor.findById(req.user.id).select("-password");
  if (!donor) {
    return next(new ErrorHandler("Donor Not Found!", 404));
  }
  res.status(200).json({
    success: true,
    donor,
  });
});

// Password Change..
