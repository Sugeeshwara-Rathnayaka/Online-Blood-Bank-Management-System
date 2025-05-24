import BloodBankRequest from "../../models/BloodBankRequest.js";
import ErrorHandler from "../../middleware/errorMiddleware.js";
import { catchAsyncErrors } from "../../middleware/catchAsyncErrors.js";
import { BloodBankHospital } from "../../models/BloodBank/BloodBankHospital.js";
import { BloodRequest } from "../../models/Hospital/BloodRequest.js";

// Create a new blood bank request
export const createRequest = catchAsyncErrors(async (req, res, next) => {
  const { bloodBankName, bloodType, amount, date, priority } = req.body;

  const loggedAdmin = req.user._id;
  const senderId = req.userDetails?.bloodBankId;

  console.log({
    senderId,
    bloodBankName,
    bloodType,
    amount,
    date,
    priority,
  });

  if (
    !senderId ||
    !bloodBankName ||
    !bloodType ||
    !amount ||
    !date ||
    !priority
  ) {
    return next(new ErrorHandler("All fields are required", 400));
  }
  const hospitalExists = await BloodBankHospital.findOne({
    name: bloodBankName,
  });
  if (!hospitalExists) {
    return next(
      new ErrorHandler("Selected blood bank hospital does not exist", 404)
    );
  }
  const receiverId = hospitalExists._id;

  if (String(senderId) === String(receiverId)) {
    return next(
      new ErrorHandler("Sender and receiver cannot be the same", 400)
    );
  }

  const newRequest = await BloodBankRequest.create({
    senderId,
    receiverId,
    bloodType,
    amount,
    date,
    priority,
  });

  res.status(201).json({
    success: true,
    message: "Request created successfully",
    request: newRequest,
  });
});

// Delete a request
export const deleteRequest = catchAsyncErrors(async (req, res, next) => {
  const request = await BloodBankRequest.findByIdAndDelete(req.params.id);

  if (!request) {
    return next(new ErrorHandler("Request not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Request deleted successfully",
  });
});

// Get all my sent request
export const getMySents = catchAsyncErrors(async (req, res, next) => {
  const myId = req.userDetails?.bloodBankId;
  if (!myId) {
    return next(new ErrorHandler("Unauthorized: Blood bank ID missing", 401));
  }
  const requests = await BloodBankRequest.find({ senderId: myId })
    .populate("senderId", "name")
    .populate("receiverId", "name")
    .sort({ date: -1 }); //newest first

  if (!requests) {
    return next(new ErrorHandler("Request not found", 404));
  }

  res.status(200).json({
    success: true,
    count: requests.length,
    requests,
  });
});

// Get all i recieved request
export const getMyReceived = catchAsyncErrors(async (req, res, next) => {
  const myId = req.userDetails?.bloodBankId;
  if (!myId) {
    return next(new ErrorHandler("Unauthorized: Blood bank ID missing", 401));
  }
  const requests = await BloodBankRequest.find({ receiverId: myId })
    .populate("senderId", "name")
    .populate("receiverId", "name")
    .sort({ date: -1 }); //newest first

  if (!requests) {
    return next(new ErrorHandler("Request not found", 404));
  }

  res.status(200).json({
    success: true,
    count: requests.length,
    requests,
  });
});

export const updatePriority = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { priority } = req.body;

  const request = await BloodBankRequest.findById(id);
  if (!request) return next(new ErrorHandler("Request not found", 404));

  request.priority = priority;
  await request.save();

  res.status(200).json({ success: true, message: "Priority updated" });
});

// Get logged BloodBank Received Blood Requests from Normal Hospitals
export const getAllBloodRequests = catchAsyncErrors(async (req, res, next) => {
  const myId = req.userDetails?.bloodBankId;
  if (!myId) {
    return next(new ErrorHandler("Unauthorized: Blood bank ID missing", 401));
  }

  const requests = await BloodRequest.find({ bloodBankId: myId })
    .populate("bloodId", "type")
    .populate("bloodBankId", "name")
    .populate("hospitalId", "hospitalName");

  res.status(200).json({
    success: true,
    message: "Your blood requests retrieved successfully",
    requests,
  });
});

// PATCH /bbadmin/update-status/:id
export const updateBloodRequestStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { status } = req.body;
    const { id } = req.params;

    // Validate input status
    if (![0, 1, 2, 3, 4].includes(status)) {
      return next(new ErrorHandler("Invalid status code", 400));
    }

    const request = await BloodRequest.findById(id);
    if (!request) {
      return next(new ErrorHandler("Blood request not found", 404));
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      request,
    });
  }
);
