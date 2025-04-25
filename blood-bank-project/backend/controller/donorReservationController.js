import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Reservation } from "../models/donorReservationSchema.js";
import { BloodBankHospital } from "../models/bloodBankHospitalSchema.js";

// ✅ Create Reservation
export const createReservation = catchAsyncErrors(async (req, res, next) => {
  const { hospitalName, campaignId, date, time } = req.body;

  // Get donorId from the logged-in Donor (from token/session)
  const donorId = req.donor?._id; // Get from the logged-in donor

  const generateReservationId = () => {
    return `RES-${Date.now().toString().slice(-6)}-${Math.floor(
      Math.random() * 100
    )}`;
  };
  const reservationId = generateReservationId();

  const trimmedTime = time?.toString().trim();

  // Returns donorId as a full Donor document
  if (
    !reservationId ||
    //!campaignId ||
    !hospitalName ||
    !date ||
    !time ||
    !donorId
  ) {
    console.log("Missing Fields", {
      reservationId,
      //campaignId,
      hospitalName,
      date,
      time,
      donorId,
    });
    return next(new ErrorHandler("Please provide all required fields!", 400));
  }

  // Add null/undefined check
  if (!trimmedTime) {
    return next(new ErrorHandler("Time is required", 400));
  }
  // Validate time format (e.g., "HH:MM")
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(trimmedTime)) {
    return next(new ErrorHandler("Invalid time format (use HH:MM)", 400));
  }
  // Ensure time is between 08:00 and 14:00
  const hour = parseInt(trimmedTime?.split(":")[0], 10);
  if (hour < 9 || hour >= 16) {
    return next(
      new ErrorHandler("Time must be between 9:00 AM and 4:00 PM", 400)
    );
  }

  // Check if another reservation already exists on the same date and time
  const isConflict = await Reservation.findOne({
    date,
    time: trimmedTime,
  });
  if (isConflict) {
    return next(
      new ErrorHandler(
        "Another reservation already exists on this date and the same time!",
        409
      )
    );
  }

  // Get hospital by name and store ID
  const hospitalExists = await BloodBankHospital.findOne({
    name: hospitalName,
    isDeleted: false,
  });
  if (!hospitalExists) {
    return next(new ErrorHandler("Blood Bank Hospital not found.", 404));
  }

  // Create reservation
  const reservation = await Reservation.create({
    reservationId,
    // campaignId,
    hospitalId: hospitalExists._id,
    date,
    time,
    donorId,
  });
  res.status(201).json({
    success: true,
    message: "Reservation Created Successfully!",
    reservation,
  });
});

export const getAllReservations = catchAsyncErrors(async (req, res, next) => {
  const reservations = await Reservation.find();
  res.status(200).json({
    success: true,
    reservations,
  });
});

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

export const deleteReservation = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let reservation = await Reservation.findById(id);
  if (!reservation) {
    return next(new ErrorHandler("Reservation Not Found!", 404));
  }
  await reservation.deleteOne();
  res.status(200).json({
    success: true,
    message: "Reservation Deleted!",
  });
});
