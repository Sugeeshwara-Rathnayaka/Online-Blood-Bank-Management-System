import { catchAsyncErrors } from "../../middleware/catchAsyncErrors.js";
import ErrorHandler from "../../middleware/errorMiddleware.js";
import { BloodBankHospital } from "../../models/BloodBank/BloodBankHospital.js";
import { BloodRequest } from "../../models/Hospital/BloodRequest.js";
import { NormalHospital } from "../../models/NormalHospital.js";
import Blood from "../../models/Other/Blood.js";
import { District } from "../../models/Other/District.js";

//UPDATE Hospital
export const updateHospital = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let hospital = await NormalHospital.findById(id);
  if (!hospital) {
    return next(new ErrorHandler("Hospital Not Found!", 404));
  }
  // Disallow direct password updates here
  if (req.body.password || req.body.role) {
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

  // Update hospital fields from req.body
  hospital = await NormalHospital.findByIdAndUpdate(id, req.body, {
    new: true, // return the updated doc
    runValidators: true, // enforce schema rules
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Hospital Details Updated!",
    hospital,
  });
});

//Update Status
export const updateHospitalStatus = catchAsyncErrors(async (req, res, next) => {
  try {
    const hospitalId = req.user._id; // Make sure your auth middleware sets req.user
    const { status } = req.body;

    if (!["Active", "Inactive"].includes(status)) {
      return next(new ErrorHandler("Syatus must be Active or Inactive", 400));
    }

    const updatedHospital = await NormalHospital.findByIdAndUpdate(
      hospitalId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedHospital) {
      return next(new ErrorHandler("Hospital not found", 404));
    }

    res.status(200).json({
      message: "Status updated successfully",
      status: updatedHospital.status,
    });
  } catch (error) {
    console.error("Error updating hospital status:", error);
    return next(new ErrorHandler("Server Error", 500));
  }
});

//DELETE Hospital
export const deleteHospital = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const hospital = await NormalHospital.findById(id);
  if (!hospital) {
    return next(new ErrorHandler("Hospital Not Found!", 404));
  }
  await hospital.deleteOne();
  res.status(200).json({
    success: true,
    message: "Hospital Deleted Successfully!",
  });
});

//changeHospitalPassword
export const changeHospitalPassword = catchAsyncErrors(
  async (req, res, next) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return next(new ErrorHandler("Please fill in all password fields!", 400));
    }

    if (newPassword !== confirmNewPassword) {
      return next(new ErrorHandler("New passwords do not match!", 400));
    }

    const hospital = await Hospital.findById(req.hospital._id).select(
      "+password"
    );

    const isMatch = await hospital.comparePassword(oldPassword);
    if (!isMatch) {
      return next(new ErrorHandler("Old password is incorrect!", 401));
    }

    hospital.password = newPassword;
    await hospital.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully!",
      hospital,
    });
  }
);

// Create a new blood request
// @access  Private (hospital only)
export const createBloodRequest = catchAsyncErrors(async (req, res, next) => {
  const { patientName, bloodType, units, bloodBankName, dateNeeded } = req.body;

  const hospitalId = req.user?._id;
  const hospitalName = req.userDetails?.hospitalName;

  const generateRequestId = () =>
    `REQ-H-${Date.now().toString().slice(-4)}${Math.floor(
      Math.random() * 90 + 10
    )}`;
  // Example: REQ-H-527845 (last 4 of timestamp + 2-digit random)
  const requestId = generateRequestId();

  console.log({
    requestId,
    patientName,
    bloodType,
    units,
    bloodBankName,
    dateNeeded,
    hospitalId,
  });

  // Basic field validation
  if (
    !requestId ||
    !patientName ||
    !bloodType ||
    !units ||
    !bloodBankName ||
    !dateNeeded ||
    !hospitalId
  ) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  // Date validation (within 1 days from today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  const requestedDate = new Date(dateNeeded);
  if (requestedDate < today || requestedDate > maxDate) {
    return next(
      new ErrorHandler("Date must be between today and the next 30 days", 400)
    );
  }

  const hospitalExists = await BloodBankHospital.findOne({
    name: bloodBankName,
  });
  if (!hospitalExists) {
    return next(
      new ErrorHandler("Selected blood bank hospital does not exist", 404)
    );
  }
  const bloodBankId = hospitalExists._id;

  const bloodTypeExists = await Blood.findOne({ type: bloodType });
  if (!bloodTypeExists) {
    return next(
      new ErrorHandler("Selected blood bank hospital does not exist", 404)
    );
  }
  const bloodId = bloodTypeExists._id;

  // Check for duplicate requestId
  const existingRequest = await BloodRequest.findOne({ requestId });
  if (existingRequest) {
    return next(new ErrorHandler("Request ID already exists", 409));
  }
  const newRequest = await BloodRequest.create({
    requestId,
    patientName,
    bloodId,
    amount: units,
    bloodBankId,
    dateNeeded: requestedDate,
    hospitalId,
    hospitalName,
    status: 0, // Default to Pending
  });

  res.status(201).json({
    success: true,
    message: "Blood request created successfully",
    request: newRequest,
  });
});

// Get logged Hospital Blood Requests
export const getAllBloodRequests = catchAsyncErrors(async (req, res, next) => {
  const hospitalId = req.user?._id;
  if (!hospitalId) {
    return next(
      new ErrorHandler("Unauthorized access: Hospital ID not found", 401)
    );
  }
  const requests = await BloodRequest.find({ hospitalId })
    .populate("bloodId", "type")
    .populate("bloodBankId", "name")
    .populate("hospitalId", "hospitalName");

  res.status(200).json({
    success: true,
    message: "Your blood requests retrieved successfully",
    requests,
  });
});

// Get Blood Request by ID
export const getBloodRequestById = catchAsyncErrors(async (req, res, next) => {
  const request = await BloodRequest.findById(req.params.id)
    .populate("bloodId", "type")
    .populate("bloodBankId", "name")
    .populate("hospitalId", "hospitalName");
  if (!request) {
    return next(new ErrorHandler("Blood request not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Blood request retrieved successfully",
    request,
  });
});

// PUT /api/hos/update-status/:id
export const updateBloodRequestStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { status } = req.body;

    // Validate input
    if (![0, 2, "0", "2"].includes(status)) {
      return next(
        new ErrorHandler(
          "Only Pending (0) and Critical (2) status updates are allowed",
          400
        )
      );
    }

    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return next(new ErrorHandler("Blood request not found", 404));
    }

    request.status = Number(status);
    await request.save();

    res.status(200).json({
      success: true,
      message: "Blood request status updated",
      request,
    });
  }
);

// Permanently Delete Blood Request
export const hardDeleteBloodRequest = catchAsyncErrors(
  async (req, res, next) => {
    const request = await BloodRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return next(new ErrorHandler("Blood request not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Blood request permanently deleted",
    });
  }
);
