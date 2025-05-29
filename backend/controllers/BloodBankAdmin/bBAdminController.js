import { catchAsyncErrors } from "../../middleware/catchAsyncErrors.js";
import ErrorHandler from "../../middleware/errorMiddleware.js";
import { BloodBankAdmin } from "../../models/BloodBank/BloodBankAdmin.js";
import { BloodBankHospital } from "../../models/BloodBank/BloodBankHospital.js";
import bcrypt from "bcryptjs";
import { Reservation } from "../../models/DonorReservation.js";
import { Campaign } from "../../models/Campaing.js";

// ✅ UPDATE
export const updateBBAdmin = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let bloodBankAdmin = await BloodBankAdmin.findById(id);
  if (!bloodBankAdmin) {
    return next(new ErrorHandler("Blood Bank Admin Not Found!", 404));
  }

  // Prevent updating sensitive fields like password directly here if needed
  const disallowedFields = ["password", "nic"];
  disallowedFields.forEach((field) => {
    if (req.body[field]) delete req.body[field];
  });

  // Check if the email is being updated, and ensure no duplicate exists
  if (req.body.email) {
    const existingAdmin = await BloodBankAdmin.findOne({
      email: req.body.email,
      _id: { $ne: id }, // exclude current admin from check
    });
    if (existingAdmin) {
      return next(
        new ErrorHandler("Email already in use by another admin.", 400)
      );
    }
  }

  // Update bbadmin fields from req.body
  bloodBankAdmin = await BloodBankAdmin.findByIdAndUpdate(id, req.body, {
    new: true, // return the updated doc
    runValidators: true, // enforce schema rules
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Blood Bank Admin Details Updated!",
    bloodBankAdmin,
  });
});

// ✅ GET DETAILS
export const getBBAdminDetails = catchAsyncErrors(async (req, res, next) => {
  const bloodBankAdmin = req.bloodBankAdmin;
  if (!bloodBankAdmin) {
    return next(new ErrorHandler("Blood Bank Admin Not Found!", 404));
  }

  res.status(200).json({
    success: true,
    bloodBankAdmin,
  });
});

export const getAllReservations = catchAsyncErrors(async (req, res, next) => {
  const bloodBank = req.userDetails?.bloodBankId;

  if (!bloodBank) {
    return next(
      new ErrorHandler("Unauthorized access: Blood Bank ID not found", 401)
    );
  }

  const reservations = await Reservation.find({
    bloodBankId: bloodBank,
  });

  res.status(200).json({
    success: true,
    message: "Reservations fetched successfully",
    reservations,
  });
});

// PUT /api/bbadmin/update-res-status/:id
export const updateReservationStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const { flag } = req.body;

    // Validate input
    if (![0, 1, 2].includes(flag)) {
      return next(new ErrorHandler("Invalid flag value", 400));
    }

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return next(new ErrorHandler("Reservation not found", 404));
    }

    reservation.flag = flag;
    await reservation.save();

    res.status(200).json({
      success: true,
      message: `Reservation status updated to ${flag}`,
      reservation,
    });
  }
);

export const getAllCampaignReservations = catchAsyncErrors(
  async (req, res, next) => {
    const bloodBank = req.userDetails?.bloodBankId;

    if (!bloodBank) {
      return next(
        new ErrorHandler("Unauthorized access: Blood Bank ID not found", 401)
      );
    }

    const reservations = await Campaign.find({
      bloodBankId: bloodBank,
    }).populate("organizationId");

    res.status(200).json({
      success: true,
      message: "Campaign reservations fetched successfully",
      reservations,
    });
  }
);

export const updateCampaignReservationStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const { flag } = req.body;

    if (![0, 1, 2].includes(flag)) {
      return next(new ErrorHandler("Invalid flag value", 400));
    }

    const reservation = await Campaign.findById(id);
    if (!reservation) {
      return next(new ErrorHandler("Campaign reservation not found", 404));
    }

    reservation.flag = flag;
    await reservation.save();

    res.status(200).json({
      success: true,
      message: `Campaign reservation status updated to ${flag}`,
      reservation,
    });
  }
);
