import { catchAsyncErrors } from "../../middleware/catchAsyncErrors.js";
import { Donor } from "../../models/Donor.js";

export const getAllDonors = catchAsyncErrors(async (req, res, next) => {
  const donors = await Donor.aggregate([
    {
      $lookup: {
        from: "districts",
        localField: "district",
        foreignField: "_id",
        as: "district",
      },
    },
    {
      $unwind: {
        path: "$district",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        district: "$district.name", // Replace district object with just its name
      },
    },
    {
      $project: {
        password: 0,
        __v: 0,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    donors,
  });
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

// UPDATE VALIDATION STATUS
export const updateValidationStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body; // status = 0 or 1

    if (![0, 1].includes(status)) {
      return next(new ErrorHandler("Invalid validation status", 400));
    }

    const donor = await Donor.findById(id);
    if (!donor) {
      return next(new ErrorHandler("Donor not found", 404));
    }

    donor.validation = status;
    await donor.save();

    res.status(200).json({
      success: true,
      message: "Validation status updated",
      donor,
    });
  }
);
