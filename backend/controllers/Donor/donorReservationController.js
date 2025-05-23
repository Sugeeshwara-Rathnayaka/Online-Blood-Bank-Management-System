import { catchAsyncErrors } from "../../middleware/catchAsyncErrors.js";
import ErrorHandler from "../../middleware/errorMiddleware.js";
import { Reservation } from "../../models/DonorReservation.js";
import { BloodBankHospital } from "../../models/BloodBank/BloodBankHospital.js";

// ✅ Create Reservation
export const createReservation = catchAsyncErrors(async (req, res, next) => {
  const { bloodBankName, date, time } = req.body;

  // Get donor ID and NIC from token/session
  const donorId = req.user?._id;
  const donorNic = req.userDetails?.nic;

  // Generate unique reservation ID
  const reservationId = `RES-${Date.now().toString().slice(-6)}-${Math.floor(
    Math.random() * 100
  )}`;
  const trimmedTime = time?.toString().trim();

  // 🔒 Validate required fields
  if (!reservationId || !bloodBankName || !date || !trimmedTime || !donorNic) {
    console.log("Missing Fields", {
      reservationId,
      bloodBankName,
      date,
      time: trimmedTime,
      donorNic,
    });
    return next(new ErrorHandler("Please provide all required fields!", 400));
  }

  // 📅 Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return next(new ErrorHandler("Invalid date format. Use YYYY-MM-DD", 400));
  }

  // ⏰ Validate time format (HH:MM)
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(trimmedTime)) {
    return next(
      new ErrorHandler("Invalid time format. Use HH:MM (24-hour)", 400)
    );
  }

  // ⏳ Ensure time is between 09:00 and 16:00
  const hour = parseInt(trimmedTime.split(":")[0], 10);
  if (hour < 9 || hour >= 16) {
    return next(new ErrorHandler("Time must be between 09:00 and 16:00", 400));
  }

  // 🏥 Verify blood bank hospital exists
  const hospital = await BloodBankHospital.findOne({
    name: bloodBankName,
    isDeleted: false,
  });
  if (!hospital) {
    return next(new ErrorHandler("Blood Bank Hospital not found.", 404));
  }

  // 🚫 Check for duplicate reservation
  const conflict = await Reservation.findOne({
    bloodBankId: hospital._id,
    date,
    time: trimmedTime,
  });

  if (conflict) {
    return next(
      new ErrorHandler(
        "You already have a reservation at this time and date in this hospital.",
        409
      )
    );
  }

  // ✅ Create reservation
  const reservation = await Reservation.create({
    reservationId,
    bloodBankId: hospital._id,
    date,
    time: trimmedTime,
    donorNic,
  });

  res.status(201).json({
    success: true,
    message: "Reservation Created Successfully!",
    reservation,
  });
});

// export const getAllReservations = catchAsyncErrors(async (req, res, next) => {
//   const reservations = await Reservation.find();
//   res.status(200).json({
//     success: true,
//     reservations,
//   });
// });

export const getAllReservations = catchAsyncErrors(async (req, res, next) => {
  const donorNic = req.userDetails?.nic;

  if (!donorNic) {
    return next(new ErrorHandler("Unauthorized access: NIC not found", 401));
  }

  const reservations = await Reservation.find({ donorNic }).populate(
    "bloodBankId",
    "name"
  );

  res.status(200).json({
    success: true,
    message: "Reservations fetched successfully",
    reservations,
  });
});

export const deleteReservation = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const reservation = await Reservation.findById(id);
  if (!reservation) {
    return next(new ErrorHandler("Reservation Not Found!", 404));
  }

  // Only allow delete if reservation is not approved
  if (reservation.flag === 1) {
    return next(
      new ErrorHandler("Cannot delete an approved reservation!", 403)
    );
  }

  await reservation.deleteOne();

  res.status(200).json({
    success: true,
    message: "Reservation Deleted!",
  });
});
//BloodBAnk Admin
export const updateReservationStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let reservation = await Reservation.findById(id);
    if (!reservation) {
      return next(new ErrorHandler("Reservation Not Found!", 404));
    }
    reservation = await Reservation.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Reservation Status Updated!",
      reservation,
    });
  }
);
